import React from "react";
import { Sparkles, X } from "lucide-react";

export type WordUnitProgress = {
  id: string;
  title: string;
  total: number;
  mastered: number;
};

export function WordMasteryProgress({
  units,
  totalCount,
  masteredCount,
  onJump,
}: {
  units: WordUnitProgress[];
  totalCount: number;
  masteredCount: number;
  onJump: (id: string) => void;
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);
  const percent = totalCount > 0 ? (masteredCount / totalCount) * 100 : 0;
  const percentText = percent.toFixed(percent > 0 && percent < 1 ? 1 : 0);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const widgetClassName = [
    "wordMasteryWidget",
    open ? "wordMasteryWidgetOpen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={widgetClassName}>
      <button
        type="button"
        className="wordMasteryTrigger"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="wordMasteryTriggerIcon">
          <Sparkles size={16} />
        </span>
        <span className="wordMasteryTriggerLabel">单词进度</span>
        <span className="wordMasteryTriggerCount">{percentText}%</span>
      </button>

      {open ? (
        <div
          className="wordMasteryCard"
          role="dialog"
          aria-label="单词掌握进度"
        >
          <div className="wordMasteryHeader">
            <div className="wordMasteryHeaderMain">
              <strong className="wordMasteryTitle">3500 词掌握进度</strong>
              <span className="wordMasterySubtitle">
                已掌握 {masteredCount} / {totalCount} 词
              </span>
            </div>
            <button
              type="button"
              className="wordMasteryClose"
              onClick={() => setOpen(false)}
              aria-label="关闭"
            >
              <X size={14} />
            </button>
          </div>

          <div className="wordMasteryGauge">
            <div className="wordMasteryGaugePercent">
              {percentText}
              <span className="wordMasteryGaugePercentSign">%</span>
            </div>
            <div className="wordMasteryGaugeTrack">
              <div
                className="wordMasteryGaugeFill"
                style={{
                  width: `${Math.max(percent, masteredCount > 0 ? 1.5 : 0)}%`,
                }}
              />
            </div>
            <div className="wordMasteryGaugeMeta">
              还剩 {Math.max(totalCount - masteredCount, 0)} 词未掌握
            </div>
          </div>

          <div className="wordMasteryUnits">
            <div className="wordMasteryUnitsHead">
              <span>各 Unit 掌握情况</span>
              <span className="wordMasteryUnitsHint">点击跳转</span>
            </div>
            <ul className="wordMasteryUnitList">
              {units.map((unit) => {
                const unitPercent =
                  unit.total > 0 ? (unit.mastered / unit.total) * 100 : 0;
                const done = unit.total > 0 && unit.mastered >= unit.total;
                return (
                  <li key={unit.id}>
                    <button
                      type="button"
                      className={
                        done
                          ? "wordMasteryUnit wordMasteryUnitDone"
                          : "wordMasteryUnit"
                      }
                      onClick={() => {
                        onJump(unit.id);
                        setOpen(false);
                      }}
                    >
                      <span className="wordMasteryUnitTop">
                        <span className="wordMasteryUnitTitle">
                          {unit.title}
                        </span>
                        <span className="wordMasteryUnitCount">
                          {unit.mastered}/{unit.total}
                        </span>
                      </span>
                      <span className="wordMasteryUnitTrack">
                        <span
                          className="wordMasteryUnitFill"
                          style={{ width: `${unitPercent}%` }}
                        />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
