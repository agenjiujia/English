import React from "react";

export type StudyCelebrationState = {
  id: number;
  moduleName: string;
  masteryPercentText: string;
  deltaPercentText: string;
  deltaCount: number;
  message: string;
};

function formatPercent(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function getProgressMessage(masteredCount: number, percent: number) {
  if (percent >= 100)
    return "全部完成！这套知识已经被你拿下了，接下来进入复盘巩固。";
  if (percent >= 95) return "只差最后一点点，收尾阶段最能拉开差距。";
  if (percent >= 90) return "已经接近完整掌握，坚持把最后薄弱点补齐。";
  if (percent >= 85) return "体系已经很稳了，接下来重点清理易错点。";
  if (percent >= 80) return "进入冲刺段，保持节奏就能看到完整成果。";
  if (percent >= 75) return "大部分内容已经拿下，开始向熟练度推进。";
  if (percent >= 70) return "主干知识已经成形，继续补齐细节。";
  if (percent >= 65) return "进度很扎实，别停在半山腰。";
  if (percent >= 60) return "你已经越过多数难点，继续稳步推进。";
  if (percent >= 55) return "知识点正在连成网，复习会越来越轻松。";
  if (percent >= 50) return "进度已经过半，后面会越学越有底气。";
  if (percent >= 45) return "离过半只差一点，继续把节奏稳住。";
  if (percent >= 40) return "基础正在变厚，很多内容开始串起来了。";
  if (percent >= 35) return "已经不是刚开始了，继续积累会明显提速。";
  if (percent >= 30) return "学习状态已经稳定，下一步冲向过半。";
  if (percent >= 25) return "已经打下明显基础，继续保持这个节奏。";
  if (percent >= 20) return "前期积累已经看得见，继续扩大掌握面。";
  if (percent >= 15) return "你已经完成启动阶段，开始进入稳定推进。";
  if (percent >= 10) return "学习状态已经启动，稳稳推进会越来越轻松。";
  if (masteredCount > 1)
    return `已掌握 ${masteredCount} 个知识点，低百分比只是因为总量大，继续积累就会很明显。`;
  return "完成第 1 个知识点，好的开始就是进步。";
}

export function useStudyCelebration() {
  const [celebration, setCelebration] =
    React.useState<StudyCelebrationState | null>(null);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const celebrate = React.useCallback(
    (
      moduleName: string,
      masteredCount: number,
      totalCount: number,
      deltaCount = 1,
    ) => {
      const masteryPercent =
        totalCount > 0 ? Math.round((masteredCount / totalCount) * 100) : 0;
      const deltaPercent = totalCount > 0 ? (deltaCount / totalCount) * 100 : 0;

      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }

      setCelebration({
        id: Date.now(),
        moduleName,
        masteryPercentText: formatPercent(masteryPercent),
        deltaPercentText: formatPercent(deltaPercent),
        deltaCount,
        message: getProgressMessage(masteredCount, masteryPercent),
      });

      timerRef.current = window.setTimeout(() => {
        setCelebration(null);
        timerRef.current = null;
      }, 2200);
    },
    [],
  );

  return {
    celebration,
    celebrate,
  };
}

export function StudyCelebration({
  celebration,
}: {
  celebration: StudyCelebrationState | null;
}) {
  if (!celebration) return null;

  return (
    <div key={celebration.id} className="studyCelebration" aria-live="polite">
      <div className="studyCelebrationGlow" aria-hidden="true" />
      <div className="studyCelebrationRing" aria-hidden="true" />
      <div className="studyCelebrationConfetti" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, index) => (
          <span
            key={index}
            style={
              {
                "--piece-index": index,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="studyCelebrationCard">
        <div className="studyCelebrationKicker">
          掌握 +{celebration.deltaCount}
        </div>
        <div className="studyCelebrationTitle">太棒了，拿下一个模块！</div>
        <strong>{celebration.moduleName}</strong>
        <p>{celebration.message}</p>
        <span>
          本次进度 +{celebration.deltaPercentText}% · 当前掌握{" "}
          {celebration.masteryPercentText}%
        </span>
      </div>
    </div>
  );
}
