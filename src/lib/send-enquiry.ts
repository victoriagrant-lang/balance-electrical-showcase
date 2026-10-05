/*
  Sends the contact form to the send-balance-enquiry edge function.

  It calls the function directly rather than through supabase.functions.invoke: the form
  needs no login, and invoke first reads the auth session, which waits on a browser-wide
  lock that another tab of the site can hold indefinitely (Android freezes background
  tabs). XMLHttpRequest also reports upload progress, which fetch can't, so people on a
  slow connection can see their photos going. And it gives up rather than waiting forever
  when the server doesn't answer, so the form can say so and offer the phone number.
*/

export type SendResult =
  | { ok: true; confirmation: boolean }
  | { ok: false; reason: SendFailure; message?: string };

/**
 * unreachable: nothing was sent (the server never answered at all);
 * stalled: everything was sent but no reply came, so it may still have arrived;
 * offline: the connection failed; rejected: the server answered with an error.
 */
export type SendFailure = "unreachable" | "stalled" | "offline" | "rejected";

// Give up if the upload makes no progress for this long, or if the reply doesn't come
// this long after the upload finishes (the function normally answers in a few seconds).
const STALL_MS = 30_000;
const REPLY_MS = 60_000;

export function sendEnquiry(
  body: FormData,
  onProgress?: (sent: number) => void,
): Promise<SendResult> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-balance-enquiry`;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    let uploaded = false;
    const settle = (r: SendResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(r);
    };
    const giveUpAfter = (ms: number) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const reason = uploaded ? "stalled" : "unreachable";
        settle({ ok: false, reason });
        xhr.abort();
      }, ms);
    };

    xhr.open("POST", url);
    xhr.setRequestHeader("apikey", key);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
      giveUpAfter(STALL_MS);
    };
    xhr.upload.onload = () => {
      uploaded = true;
      onProgress?.(1);
      giveUpAfter(REPLY_MS);
    };
    xhr.onload = () => {
      let data: { success?: boolean; confirmation?: boolean; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // not JSON: treated by status below
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.success !== false) {
        settle({ ok: true, confirmation: data.confirmation !== false });
      } else {
        settle({ ok: false, reason: "rejected", message: data.error });
      }
    };
    xhr.onerror = () => settle({ ok: false, reason: "offline" });
    xhr.onabort = () => settle({ ok: false, reason: uploaded ? "stalled" : "unreachable" });

    giveUpAfter(STALL_MS);
    xhr.send(body);
  });
}
