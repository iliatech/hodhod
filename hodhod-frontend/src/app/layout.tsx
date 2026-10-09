import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "همراه کاریابی - هدهد",
  description: "پلتفرم هوش مصنوعی برای کاریابی و ساخت رزومه",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}