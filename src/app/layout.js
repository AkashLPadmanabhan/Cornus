import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cornus",
  description:
    "Cornus is an AI chatbot with two distinct modes: Friendly and Savvy. In Friendly mode, it responds in a congenial manner, while in Savvy mode, it provides more objective and straightforward answers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
