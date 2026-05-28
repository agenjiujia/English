import React from "react";
import { Alert, Drawer, FloatButton, Spin, Typography } from "antd";
import { MessageCircle } from "lucide-react";

const { Paragraph, Link } = Typography;

const DOUBAO_WIDGET_URL = "https://www.doubao.com/chat-widget";

export function DoubaoChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [showFallbackHint, setShowFallbackHint] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 960 : false,
  );

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 960);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (!open || loaded) return;
    const timer = window.setTimeout(() => setShowFallbackHint(true), 8000);
    return () => window.clearTimeout(timer);
  }, [open, loaded]);

  const handleOpen = () => {
    setOpen(true);
    if (!loaded) setShowFallbackHint(false);
  };

  return (
    <>
      <FloatButton
        icon={<MessageCircle size={18} />}
        tooltip="豆包助手"
        onClick={handleOpen}
        style={{ right: 24, bottom: 90 }}
      />
      <Drawer
        title="豆包助手"
        placement="right"
        width={isMobile ? "96vw" : "calc(100vw - 240px)"}
        styles={{
          wrapper: {
            width: isMobile ? "96vw" : "calc(100vw - 240px)",
            maxWidth: isMobile ? "96vw" : "calc(100vw - 240px)",
          },
          body: { padding: 16 },
        }}
        onClose={() => setOpen(false)}
        open={open}
      >
        <Paragraph type="secondary">
          使用嵌入组件进行对话。如无法加载，可点
          <Link href={DOUBAO_WIDGET_URL} target="_blank">
            这里新窗口打开
          </Link>
          。
        </Paragraph>
        {showFallbackHint ? (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 12 }}
            message="组件加载较慢或被浏览器策略拦截，请尝试新窗口打开。"
          />
        ) : null}
        <div
          style={{
            position: "relative",
            height: "calc(100vh - 220px)",
            minHeight: 420,
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          {!loaded ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255,255,255,0.88)",
                zIndex: 1,
              }}
            >
              <Spin tip="正在加载聊天组件..." />
            </div>
          ) : null}
          <iframe
            title="Doubao Chat Widget"
            src={DOUBAO_WIDGET_URL}
            style={{ width: "100%", height: "100%", border: 0 }}
            allow="autoplay; fullscreen"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </Drawer>
    </>
  );
}
