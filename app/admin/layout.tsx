import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const logo = require("@/app/assets/koop.png");

export const metadata: Metadata = {
  title: "KOOP Admin",
  description: "Bienvenue sur l'interface Admin de KOOP@",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" flex">
        <main className=" w-36 bg-sky-500 text-white min-h-screen">
          <div>
            <Image src={logo} width={300} height={300} alt="logo" />
            <div>KOOP Admin 1.0.1</div>
          </div>
        </main>
        {children}
      </body>
    </html>
  );
}
