import React from "react";

type AnchorLink = {
  href: string;
};

export function useStableAnchorScroll() {
  return React.useCallback(
    (event: React.MouseEvent<HTMLElement>, link: AnchorLink) => {
      event.preventDefault();

      const targetId = link.href.replace(/^#/, "");
      let attempts = 0;
      const maxAttempts = 12;
      const settleThreshold = 3;
      const topOffset = 24;

      const run = () => {
        const target = document.getElementById(targetId);
        if (!target) {
          if (attempts < maxAttempts) {
            attempts += 1;
            window.setTimeout(run, 80);
          }
          return;
        }

        const top =
          window.scrollY + target.getBoundingClientRect().top - topOffset;
        window.scrollTo({
          top: Math.max(top, 0),
          behavior: attempts === 0 ? "smooth" : "auto",
        });

        const remain = Math.abs(
          target.getBoundingClientRect().top - topOffset,
        );
        if (remain <= settleThreshold || attempts >= maxAttempts) return;

        attempts += 1;
        window.setTimeout(run, 90);
      };

      run();
    },
    [],
  );
}
