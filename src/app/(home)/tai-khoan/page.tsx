"use client"

import { AccountHeader } from "@/components/account/AccountHeader"
import { AccountSidebar } from "@/components/account/AccountSidebar"
import { LoyaltyProgram } from "@/components/account/LoyaltyProgram"
import { OrderHistory } from "@/components/account/OrderHistory"
import { ProfileSection } from "@/components/account/ProfileSection"
import { useState } from "react"

export default function AccountPage() {
  const [activeSection, setActiveSection] = useState("profile")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSection />
      case "orders":
        return <OrderHistory />
      case "loyalty":
        return <LoyaltyProgram />
      default:
        return <ProfileSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AccountHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <AccountSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderActiveSection()}</div>
        </div>
      </div>
    </div>
  )
}
