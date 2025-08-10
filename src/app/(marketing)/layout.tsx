import React from "react"
import Navbar from "@/components/Common/Navbar"
import Footer from "@/components/Common/Footer"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}



