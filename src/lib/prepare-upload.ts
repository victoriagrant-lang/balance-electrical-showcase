export const UPLOAD_LIMITS = {
  files: 6,
  fileBytes: 10 * 1024 * 1024,
  totalBytes: 20 * 1024 * 1024,
};

export const UPLOAD_ACCEPT =
  "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif,application/pdf";

const MAX_EDGE = 2400;

// Some browsers report HEIC photos with no type at all.
function withType(file: File): File {
  if (file.type) return file;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const type =
    ext === "heic" || ext === "heif"
      ? `image/${ext}`
      : ext === "pdf"
        ? "application/pdf"
        : ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : "";
  return type ? new File([file], file.name, { type }) : file;
}

/**
 * Phone photos are shrunk to 2400px JPEGs before upload: quicker to send, well
 * within the limits, and re-encoding drops EXIF (including GPS). Anything the
 * browser can't decode (e.g. HEIC outside Safari) or a PDF is sent as-is.
 */
export async function prepareUpload(input: File): Promise<File> {
  const file = withType(input);
  if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(file.type)) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) return file;
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export const formatBytes = (n: number) =>
  n >= 1024 * 1024 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
