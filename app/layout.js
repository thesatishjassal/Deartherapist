import { Inter } from "next/font/google";
import HeaderBar from "./components/Header";
import "./globals.css";
import Container from "@mui/material/Container";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HeaderBar />
        <Container>{children}</Container>
      </body>
    </html>
  );
}
