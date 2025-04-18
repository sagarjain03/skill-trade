import type React from "react"
export default function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-gray-950">{children}</div>
}
