import React, { useState } from "react";
import { Button, Popover, Tag, Typography } from "antd";

const { Text } = Typography;

type StudyCountTagProps = {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (count: number) => void;
};

export function StudyCountTag({
  count,
  onIncrement,
  onDecrement,
  onChange,
}: StudyCountTagProps) {
  const [open, setOpen] = useState(false);
  const canDecrement = count > 0;

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
            <div className="studyCountPopoverMetric">
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
      >
        <span className="studyCountTagDot" />
        <span className="studyCountTagLabel">学习</span>
        <span className="studyCountTagValue">{count} 次</span>
      </Tag>
    </Popover>
  );
}
