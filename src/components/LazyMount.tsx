import React, { useEffect, useRef, useState } from "react";

export function LazyMount({
  children,
  placeholderHeight = 360,
}: {
  children: React.ReactNode;
  placeholderHeight?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || mounted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "900px 0px",
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <div
      ref={ref}
      className="lazyMount"
      style={mounted ? undefined : { minHeight: placeholderHeight }}
    >
      {mounted ? children : <div className="lazyPlaceholder">继续下滑加载</div>}
    </div>
  );
}
