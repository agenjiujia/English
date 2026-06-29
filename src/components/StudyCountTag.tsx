import React, { useState } from "react";
import { Button, Popover, Tag, Typography } from "antd";

const { Text } = Typography;

type StudyCountTagProps = {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (count: number) => void;
};

function getStudyCountTheme(count: number): React.CSSProperties {
  const progress = Math.min(Math.max(count, 0), 20) / 20;
  const hue = 165 - progress * 18;
  const saturation = 42 + progress * 16;
  const lightness = 90 - progress * 12;
  const accentLightness = 48 - progress * 10;
  const accentStrongLightness = 40 - progress * 8;

  return {
    ["--study-count-border" as string]: `hsla(${hue}, ${saturation}%, ${
      72 - progress * 18
    }%, ${0.2 + progress * 0.14})`,
    ["--study-count-bg" as string]: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.92)`,
    ["--study-count-bg-hover" as string]: `hsla(${hue}, ${saturation + 2}%, ${
      lightness - 2
    }%, 0.96)`,
    ["--study-count-text" as string]: `hsl(${hue}, ${saturation + 10}%, ${accentStrongLightness}%)`,
    ["--study-count-label" as string]: `hsla(${hue}, ${Math.max(
      18,
      saturation - 10,
    )}%, 20%, ${0.52 + progress * 0.18})`,
    ["--study-count-dot" as string]: `hsl(${hue}, ${saturation + 12}%, ${accentLightness}%)`,
    ["--study-count-dot-ring" as string]: `hsla(${hue}, ${saturation + 4}%, ${
      56 - progress * 8
    }%, ${0.12 + progress * 0.08})`,
    ["--study-count-shadow" as string]: `rgba(23, 32, 51, ${0.04 + progress * 0.02})`,
    ["--study-count-glow" as string]: `hsla(${hue}, ${saturation}%, ${
      58 - progress * 8
    }%, ${0.08 + progress * 0.08})`,
    ["--study-count-metric-border" as string]: `hsla(${hue}, ${saturation}%, ${
      68 - progress * 14
    }%, ${0.14 + progress * 0.08})`,
    ["--study-count-metric-bg" as string]: `hsla(${hue}, ${saturation + 6}%, ${
      96 - progress * 8
    }%, 0.82)`,
  };
}

export function StudyCountTag({
  count,
  onIncrement,
  onDecrement,
  onChange,
}: StudyCountTagProps) {
  const [open, setOpen] = useState(false);
  const canDecrement = count > 0;
  const themeStyle = getStudyCountTheme(count);

  const handleIncrement = () => {
    onIncrement();
  };

  const handleDecrement = () => {
    if (!canDecrement) return;
    onDecrement();
  };

  const handleClear = () => {
    onChange(0);
    setOpen(false);
  };

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      overlayClassName="studyCountPopover"
      content={
        <div className="studyCountPopoverContent">
          <div className="studyCountPopoverHero">
            <div className="studyCountPopoverHeading">
              <Text className="studyCountPopoverTitle">学习次数</Text>
              <Text type="secondary" className="studyCountPopoverSubtitle">
                记录本轮学习进度
              </Text>
            </div>
            <div className="studyCountPopoverMetric" style={themeStyle}>
              <span className="studyCountPopoverMetricValue">{count}</span>
              <span className="studyCountPopoverMetricLabel">次</span>
            </div>
          </div>
          <div className="studyCountSection studyCountPanel">
            <Text className="studyCountSectionLabel">快捷调整</Text>
            <div className="studyCountQuickActions">
              <Button
                size="small"
                className="studyCountQuickButton"
                onClick={handleIncrement}
              >
                +1
              </Button>
              <Button
                size="small"
                className="studyCountQuickButton"
                onClick={handleDecrement}
                disabled={!canDecrement}
              >
                -1
              </Button>
              <Button
                size="small"
                className="studyCountQuickButton studyCountQuickButtonDanger"
                onClick={handleClear}
              >
                清零
              </Button>
            </div>
          </div>
        </div>
      }
    >
      <Tag
        className={open ? "studyCountTag studyCountTagActive" : "studyCountTag"}
        style={themeStyle}
      >
        <span className="studyCountTagDot" />
        <span className="studyCountTagLabel">学习</span>
        <span className="studyCountTagValue">{count} 次</span>
      </Tag>
    </Popover>
  );
}
