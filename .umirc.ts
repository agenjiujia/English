import { defineConfig } from "@umijs/max";

export default defineConfig({
  npmClient: "npm",
  base: "/English/",
  publicPath: "/English/",
  outputPath: "docs",
  routes: [
    {
      path: "/",
      component: "@/pages/index",
    },
    {
      path: "/remaining",
      component: "@/pages/remaining",
    },
    {
      path: "/phonics",
      component: "@/pages/phonics",
    },
  ],
  mfsu: false,
  title: "英语系统知识库",
  favicons: ["favicon.svg"],
});
