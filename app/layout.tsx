import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import LayoutWrapper from "@/components/LayoutWrapper" // 👈 import new wrapper

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SkillQuest - Gamified Skill Trading",
  description: "Learn and teach skills in a fun, gamified environment",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-950 text-gray-100`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
