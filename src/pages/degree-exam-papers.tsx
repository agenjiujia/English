import React from "react";
import "antd/dist/reset.css";
import {
  Button,
  ConfigProvider,
  FloatButton,
  Layout,
  Space,
  Typography,
} from "antd";
import { BookOpen, GraduationCap } from "lucide-react";
import { DegreeExamPaperPanel } from "@/components/DegreeExamPaperPanel";
import { degreeExamFullPapers } from "@/data/degreeExamFullPapers";
import {
  AnnotationToolbar,
  StudyAnnotationsProvider,
  useStudyAnnotations,
} from "@/components/StudyAnnotations";
import "./index.less";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

export default function DegreeExamPapersPage() {
  const goToRoute = React.useCallback((path: string) => {
    window.location.hash = path;
  }, []);
  const annotations = useStudyAnnotations("degree-exam-papers");

  return (
    <StudyAnnotationsProvider
      updateNote={annotations.updateNote}
      deleteNote={annotations.deleteNote}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2f8f83",
            borderRadius: 14,
            fontFamily:
              '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif',
          },
        }}
      >
        <Layout className="pageShell">
          <Content className="content degreePaperPageContent">
            <header className="hero">
              <div className="heroBadge">
                <GraduationCap size={18} />
                <span>13000 英语（专升本）正式卷</span>
              </div>
              <Title className="heroTitle">英语（专升本）正式卷</Title>
              <Paragraph className="heroText">
                这里是独立于知识点页的正式卷页面。现在正式卷已经支持直接作答、
                点击交卷、本地判客观题、统计总分，并可按你的三方接口配置进行作文评分。
              </Paragraph>
              <div className="heroStats">
                <div>
                  <strong>{degreeExamFullPapers.length}</strong>
                  <span>完整样卷</span>
                </div>
                <div>
                  <strong>7</strong>
                  <span>大题型</span>
                </div>
                <div>
                  <strong>150</strong>
                  <span>分钟</span>
                </div>
              </div>
            </header>

            <div className="routeCard routeCardAction">
              <BookOpen size={20} />
              <span>
                这套正式卷按 `13000 英语（专升本）英语（二）自学教程` 和英语（专升本）卷面结构单独出卷，
                与当前知识点练习卷相互独立。
              </span>
              <Space wrap size={[10, 10]}>
                <Button
                  type="primary"
                  onClick={() => {
                    goToRoute("/degree-exam");
                  }}
                >
                  返回知识点页
                </Button>
              </Space>
            </div>

            <DegreeExamPaperPanel
              papers={degreeExamFullPapers}
              getAnnotations={annotations.getAnnotations}
            />
          </Content>

          <AnnotationToolbar
            selection={annotations.selection}
            applyAnnotation={annotations.applyAnnotation}
            applyAnnotationAtSelection={annotations.applyAnnotationAtSelection}
            clearSelection={annotations.clearSelection}
            clearAll={annotations.clearAll}
          />
          <FloatButton.BackTop />
        </Layout>
      </ConfigProvider>
    </StudyAnnotationsProvider>
  );
}
