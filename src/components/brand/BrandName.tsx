import { Fragment } from "react";
import { Logo } from "@/components/brand/Logo";

/**
 * The BALANCE wordmark set in running text: as tall as the text's capitals, sitting on its
 * baseline, in the text's own colour (dark on stone, cream at night). Read as "Balance".
 * Its letters are widely spaced, so it needs about one letter-gap of room either side to read
 * as its own word: this carries the room after it; text before it adds <GapBefore />.
 */
export function BalanceWordmark() {
  return (
    <Logo title="Balance" className="mr-[0.4em] inline-block h-[0.7em] w-auto align-baseline" />
  );
}

/**
 * The room before the wordmark, as padding on the end of the preceding text, so if the line
 * wraps there it stays at the end of the line above instead of indenting the next one.
 */
export function GapBefore() {
  return <span aria-hidden className="pr-[0.4em]" />;
}

const NAME = "Balance Electrical";

/** Copy with every "Balance Electrical" shown as the wordmark followed by "Electrical". */
export function BrandText({ text }: { text: string }) {
  const parts = text.split(NAME);
  return (
    <>
      {parts.map((part, i) => {
        const beforeName = i < parts.length - 1;
        const words = beforeName ? part.replace(/\s+$/, "") : part;
        return (
          <Fragment key={i}>
            {words}
            {beforeName && (
              <>
                {words && <GapBefore />}
                {words !== part && " "}
                <BalanceWordmark /> Electrical
              </>
            )}
          </Fragment>
        );
      })}
    </>
  );
}
