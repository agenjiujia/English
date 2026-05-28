import React from "react";

type AnchorLink = {
  href: string;
};

export function useStableAnchorScroll() {
  return React.useCallback(
    (event: React.MouseEvent<HTMLElement>, link: AnchorLink) => {
      event.preventDefault();

      const targetId = link.href.replace(/^#/, "");
      const target = document.getElementById(targetId);
      if (!target) return;

      const scroll = () =>
        target.scrollIntoView({ behavior: "smooth", block: "start" });

      scroll();
      window.setTimeout(scroll, 120);
      window.setTimeout(scroll, 360);
    },
    [],
  );
}
