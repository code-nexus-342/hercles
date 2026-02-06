import type { Metadata } from "next";
import "./globals.css";
import { FloatingNav } from "@/components/FloatingNav";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Hercles Computers | Premium Laptops",
  description: "A minimal gallery of premium laptops and rare engineering firsts.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en">
      <body className={cn("min-h-screen antialiased bg-[#FAFAFA]")}>
        <Providers session={session}>
          <FloatingNav />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
