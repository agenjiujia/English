import React, { useEffect, useState } from "react";
import { Button, InputNumber, Popover, Space, Tag, Typography } from "antd";

const { Text } = Typography;

type StudyCountTagProps = {
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange: (count: number) => void;
};

function normalizeCount(value: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
}

export function StudyCountTag({
  count,
  onIncrement,
  onDecrement,
  onChange,
}: StudyCountTagProps) {
  const [open, setOpen] = useState(false);
  const [draftCount, setDraftCount] = useState(count);

  useEffect(() => {
    if (!open) {
      setDraftCount(count);
    }
  }, [count, open]);

  const canDecrement = count > 0;
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setDraftCount(count);
    }
  };

  const handleSave = () => {
    onChange(normalizeCount(draftCount));
    setOpen(false);
  };

  const handleCancel = () => {
    setDraftCount(count);
    setOpen(false);
  };

  const handleIncrement = () => {
    onIncrement();
    setDraftCount((current) => normalizeCount(current + 1));
  };

  const handleDecrement = () => {
    if (!canDecrement) return;
    onDecrement();
    setDraftCount((current) => normalizeCount(current - 1));
  };

  const handleClear = () => {
    onChange(0);
    setDraftCount(0);
    setOpen(false);
  };

  return (
    <Popover
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
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
          <div className="studyCountEditorCard studyCountPanel">
            <Text className="studyCountEditorLabel">直接输入次数</Text>
            <div className="studyCountEditorRow">
              <InputNumber
                min={0}
                precision={0}
                controls={false}
                value={draftCount}
                onChange={(value) => setDraftCount(normalizeCount(value))}
                onPressEnter={handleSave}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    event.preventDefault();
                    event.stopPropagation();
                    handleCancel();
                  }
                }}
                className="studyCountInput"
              />
            </div>
          </div>
          <div className="studyCountActionsRow">
            <Button
              size="small"
              type="primary"
              onClick={handleSave}
              className="studyCountSaveButton"
            >
              保存
            </Button>
            <Button
              size="small"
              onClick={handleCancel}
              className="studyCountCancelButton"
            >
              取消
            </Button>
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
