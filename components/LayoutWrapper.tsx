"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const hideNavbar = ["/", "/login", "/register","/registration-success"].includes(pathname)

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbar && <Navbar />}
      <main className="flex-1">{children}</main>
    </div>
  )
}
