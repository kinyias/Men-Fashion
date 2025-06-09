"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Package, MapPin, CreditCard, Settings, Shield, Heart, Star, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface AccountSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Personal information",
  },
  {
    id: "orders",
    label: "Order History",
    icon: Package,
    description: "Track your orders",
    badge: "3",
  },
  {
    id: "addresses",
    label: "Address Book",
    icon: MapPin,
    description: "Manage addresses",
  },
  {
    id: "payments",
    label: "Payment Methods",
    icon: CreditCard,
    description: "Cards & billing",
  },
  {
    id: "wishlist",
    label: "Wishlist",
    icon: Heart,
    description: "Saved items",
    badge: "12",
  },
  {
    id: "loyalty",
    label: "Loyalty Program",
    icon: Star,
    description: "Points & rewards",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Settings,
    description: "Notifications & more",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password & privacy",
  },
]

export function AccountSidebar({ activeSection, onSectionChange }: AccountSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const SidebarContent = () => (
    <Card className="p-6">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Account Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <nav className="mt-6 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-auto p-3 text-left",
                isActive && "bg-primary/10 text-primary border-primary/20",
              )}
              onClick={() => {
                onSectionChange(item.id)
                setIsMobileMenuOpen(false)
              }}
            >
              <div className="flex items-center gap-3 w-full">
                <Icon className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
            </Button>
          )
        })}
      </nav>
    </Card>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <SidebarContent />
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-6">
        <Button variant="outline" onClick={() => setIsMobileMenuOpen(true)} className="w-full justify-start">
          <Menu className="h-4 w-4 mr-2" />
          Account Menu
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-80 bg-background border-r shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Account Menu</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
