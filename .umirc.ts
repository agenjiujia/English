import { defineConfig } from "@umijs/max";

const isElectron = process.env.UMI_ENV === "electron";

export default defineConfig({
  npmClient: "npm",
  base: isElectron ? "./" : "/English/",
  publicPath: isElectron ? "./" : "/English/",
  outputPath: isElectron ? "dist" : "docs",
  history: { type: "hash" },
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
