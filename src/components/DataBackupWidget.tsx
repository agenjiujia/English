import React from "react";
import { Alert, Button, Spin, Tooltip } from "antd";
import {
  DatabaseZap,
  Download,
  HardDriveDownload,
  HelpCircle,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import {
  applyBackup,
  collectBackup,
  computeBreakdown,
  downloadBackupFile,
  estimateStorage,
  formatBytes,
  parseBackup,
  type BackupData,
  type CategoryUsage,
  type ImportStrategy,
  type StorageEstimateResult,
} from "./studyDataTransfer";

type PendingImport = {
  backup: BackupData;
  fileName: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  notes: "#2f8f83",
  annotations: "#d99a2b",
  progress: "#4c86c6",
  quiz: "#b45309",
  dictionary: "#8a8f98",
};

const CATEGORY_HINTS: Record<string, string> = {
  dictionary:
    "在正文划词查询单词时，会把该词的释义、音标、例句缓存到浏览器（按单词去重）。“条数”是查过的不同单词数量，体积是这些释义的 JSON 总大小。清空后，下次查词会自动重新下载。",
};

export function DataBackupWidget({
  variant = "default",
}: {
  variant?: "default" | "noQuiz";
}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [busy, setBusy] = React.useState<"export" | "import" | null>(null);
  const [breakdown, setBreakdown] = React.useState<CategoryUsage[]>([]);
  const [estimate, setEstimate] = React.useState<StorageEstimateResult | null>(
    null,
  );
  const [message, setMessage] = React.useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [pendingImport, setPendingImport] =
    React.useState<PendingImport | null>(null);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    try {
      const [backup, storageEstimate] = await Promise.all([
        collectBackup(),
        estimateStorage(),
      ]);
      setBreakdown(computeBreakdown(backup));
      setEstimate(storageEstimate);
    } catch {
      setMessage({ type: "error", text: "读取本地存储信息失败" });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!open) return;
    void refresh();
  }, [open, refresh]);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
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

  const totalKnownBytes = breakdown.reduce((sum, item) => sum + item.bytes, 0);

  const handleExport = React.useCallback(async () => {
    setBusy("export");
    setMessage(null);
    try {
      const backup = await collectBackup();
      downloadBackupFile(backup);
      setMessage({ type: "success", text: "已导出备份文件到下载目录" });
    } catch {
      setMessage({ type: "error", text: "导出失败，请重试" });
    } finally {
      setBusy(null);
    }
  }, []);

  const handleFilePicked = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file) return;
      setMessage(null);
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const backup = parseBackup(String(reader.result || ""));
          setPendingImport({ backup, fileName: file.name });
        } catch (error) {
          setMessage({
            type: "error",
            text: error instanceof Error ? error.message : "无法解析该备份文件",
          });
        }
      };
      reader.onerror = () => {
        setMessage({ type: "error", text: "读取文件失败" });
      };
      reader.readAsText(file);
    },
    [],
  );

  const handleConfirmImport = React.useCallback(
    async (strategy: ImportStrategy) => {
      if (!pendingImport) return;
      setBusy("import");
      setMessage(null);
      try {
        await applyBackup(pendingImport.backup, strategy);
        setPendingImport(null);
        setMessage({
          type: "success",
          text: "导入成功，即将刷新页面以载入数据…",
        });
        window.setTimeout(() => window.location.reload(), 900);
      } catch {
        setMessage({ type: "error", text: "导入失败，数据未改动" });
        setBusy(null);
      }
    },
    [pendingImport],
  );

  const exportedAt = pendingImport
    ? new Date(pendingImport.backup.exportedAt).toLocaleString("zh-CN", {
        hour12: false,
      })
    : "";

  const widgetClassName = [
    "dataBackupWidget",
    variant === "noQuiz" ? "dataBackupWidgetNoQuiz" : "",
    open ? "dataBackupWidgetOpen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={widgetClassName}>
      <button
        type="button"
        className="dataBackupTrigger"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="dataBackupTriggerIcon">
          <DatabaseZap size={16} />
        </span>
        <span className="dataBackupTriggerLabel">数据备份</span>
        <span className="dataBackupTriggerCount">
          {estimate && estimate.supported
            ? `${estimate.percent.toFixed(estimate.percent < 1 ? 2 : 0)}%`
            : "···"}
        </span>
      </button>

      {open ? (
        <div className="dataBackupCard" role="dialog" aria-label="数据备份">
          <div className="dataBackupHeader">
            <div className="dataBackupHeaderMain">
              <strong className="dataBackupTitle">数据备份 & 容量</strong>
              <span className="dataBackupSubtitle">
                导入导出笔记、备注等全部本地内容
              </span>
            </div>
            <div className="dataBackupHeaderActions">
              <Tooltip title="刷新统计">
                <button
                  type="button"
                  className="dataBackupIconButton"
                  onClick={() => void refresh()}
                  disabled={loading}
                >
                  <RefreshCw
                    size={14}
                    className={loading ? "dataBackupSpin" : undefined}
                  />
                </button>
              </Tooltip>
              <button
                type="button"
                className="dataBackupIconButton"
                onClick={() => setOpen(false)}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="dataBackupBody">
            {!pendingImport && (
              <>
                <div className="dataBackupGauge">
                  <div className="dataBackupGaugeTop">
                    <span className="dataBackupGaugeLabel">浏览器存储占用</span>
                    {estimate && estimate.supported ? (
                      <span className="dataBackupGaugePercent">
                        {estimate.percent.toFixed(estimate.percent < 1 ? 2 : 0)}
                        %
                      </span>
                    ) : (
                      <span className="dataBackupGaugePercent">不支持</span>
                    )}
                  </div>
                  <div className="dataBackupGaugeTrack">
                    <div
                      className="dataBackupGaugeFill"
                      style={{
                        width: `${Math.max(
                          estimate?.percent ?? 0,
                          estimate && estimate.usage > 0 ? 1.5 : 0,
                        )}%`,
                      }}
                    />
                  </div>
                  {estimate && estimate.supported ? (
                    <div className="dataBackupGaugeMeta">
                      已用 {formatBytes(estimate.usage)} / 总配额{" "}
                      {formatBytes(estimate.quota)}
                      <span className="dataBackupGaugeFree">
                        （剩余约{" "}
                        {formatBytes(
                          Math.max(estimate.quota - estimate.usage, 0),
                        )}
                        ）
                      </span>
                    </div>
                  ) : (
                    <div className="dataBackupGaugeMeta">
                      当前浏览器不支持容量估算，仅展示各分类占用体积
                    </div>
                  )}
                </div>

                <div className="dataBackupBreakdown">
                  <div className="dataBackupBreakdownHead">
                    <span>内容占用明细</span>
                    <span className="dataBackupBreakdownTotal">
                      合计 {formatBytes(totalKnownBytes)}
                    </span>
                  </div>
                  {loading && !breakdown.length ? (
                    <div className="dataBackupLoading">
                      <Spin size="small" />
                    </div>
                  ) : (
                    <ul className="dataBackupCategoryList">
                      {breakdown.map((item) => {
                        const share =
                          totalKnownBytes > 0
                            ? (item.bytes / totalKnownBytes) * 100
                            : 0;
                        const color = CATEGORY_COLORS[item.key] || "#2f8f83";
                        const hint = CATEGORY_HINTS[item.key];
                        return (
                          <li key={item.key} className="dataBackupCategory">
                            <div className="dataBackupCategoryTop">
                              <span className="dataBackupCategoryName">
                                <span
                                  className="dataBackupCategoryDot"
                                  style={{ background: color }}
                                />
                                {item.label}
                                {hint ? (
                                  <Tooltip title={hint}>
                                    <span
                                      className="dataBackupCategoryHelp"
                                      role="button"
                                      tabIndex={0}
                                      aria-label={`${item.label}说明`}
                                    >
                                      <HelpCircle size={13} />
                                    </span>
                                  </Tooltip>
                                ) : null}
                              </span>
                              <span className="dataBackupCategorySize">
                                {formatBytes(item.bytes)}
                              </span>
                            </div>
                            <div className="dataBackupCategoryTrack">
                              <div
                                className="dataBackupCategoryFill"
                                style={{
                                  width: `${Math.max(share, item.bytes > 0 ? 2 : 0)}%`,
                                  background: color,
                                }}
                              />
                            </div>
                            <div className="dataBackupCategoryDesc">
                              {item.description}
                              {item.itemCount > 0
                                ? ` · ${item.itemCount} 条`
                                : ""}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {message ? (
                  <Alert
                    type={message.type}
                    message={message.text}
                    showIcon
                    className="dataBackupAlert"
                  />
                ) : null}
              </>
            )}
            {pendingImport ? (
              <div className="dataBackupImportConfirm">
                <div className="dataBackupImportInfo">
                  <strong>{pendingImport.fileName}</strong>
                  <span>备份于 {exportedAt}</span>
                </div>
                <p className="dataBackupImportHint">
                  选择导入方式：合并会保留现有数据并追加备份内容；覆盖会先清空当前数据再写入。
                </p>
                <div className="dataBackupImportActions">
                  <Button
                    type="primary"
                    icon={<HardDriveDownload size={15} />}
                    loading={busy === "import"}
                    onClick={() => void handleConfirmImport("merge")}
                  >
                    合并导入
                  </Button>
                  <Button
                    danger
                    loading={busy === "import"}
                    onClick={() => void handleConfirmImport("overwrite")}
                  >
                    覆盖导入
                  </Button>
                  <Button
                    type="text"
                    disabled={busy === "import"}
                    onClick={() => setPendingImport(null)}
                  >
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <div className="dataBackupActions">
                <Button
                  type="primary"
                  icon={<Download size={15} />}
                  loading={busy === "export"}
                  onClick={() => void handleExport()}
                  block
                >
                  导出备份
                </Button>
                <Button
                  icon={<Upload size={15} />}
                  disabled={busy === "export"}
                  onClick={() => fileInputRef.current?.click()}
                  block
                >
                  导入备份
                </Button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="dataBackupFileInput"
            onChange={handleFilePicked}
          />
        </div>
      ) : null}
    </div>
  );
}
