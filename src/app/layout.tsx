import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Agent Memory",
  description: "中文主叙述的 Agent Memory 单页专题，聚焦机制综述、比较框架与设计 checklist。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
