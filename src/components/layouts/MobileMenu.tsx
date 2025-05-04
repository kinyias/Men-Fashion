"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, ChevronDown, ChevronRight, User, LogOut, ShoppingBag, Settings } from "lucide-react"
import { useAuth } from "@/context/auth-provider"

interface NavigationItem {
  name: string
  href: string
  hasDropdown: boolean
  subcategories?: { name: string; href: string }[]
}

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navigationItems: NavigationItem[]
}
const accountMenuItems = [
  { name: "Đơn hàng", href: "/account/orders", icon: ShoppingBag },
  { name: "Tài khoản", href: "/account/settings", icon: Settings }
]
export  function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const {user, logout} = useAuth();

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }
  const toggleExpand = (name: string) => {
    if (expandedItems.includes(name)) {
      setExpandedItems(expandedItems.filter((item) => item !== name))
    } else {
      setExpandedItems([...expandedItems, name])
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[85%] max-w-xs bg-background z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <span>TKHANG</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          {user && (
            <div className="border-b">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.ho} {user.ten}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href="/account">Tài khoản</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-none bg-red-600" onClick={logout}>
                    <LogOut className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>

              {/* Account Navigation */}
              <div className="px-4 py-2">
                <button
                  className="flex items-center justify-between w-full py-2 text-sm font-medium"
                  onClick={() => toggleSection("account")}
                >
                  Tài khoản
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      expandedSection === "account" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedSection === "account" && (
                  <div className="space-y-1 mt-1 pl-2">
                    {accountMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center py-2 text-sm text-muted-foreground hover:text-foreground"
                        onClick={onClose}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name} className="border-b border-muted/60 last:border-0">
                  {item.hasDropdown ? (
                    <div>
                      <button
                        className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium"
                        onClick={() => toggleExpand(item.name)}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            expandedItems.includes(item.name) ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedItems.includes(item.name) && (
                        <div className="bg-muted/30 pl-4">
                          {item.subcategories?.map((subcategory) => (
                            <Link
                              key={subcategory.name}
                              href={subcategory.href}
                              className="flex items-center px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                              onClick={onClose}
                            >
                              <ChevronRight className="h-3 w-3 mr-2" />
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium"
                      onClick={onClose}
                    >
                      {item.name}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t p-4 space-y-3">
              {!user && (
                 <Link href="/auth/login" onClick={onClose}>
                 <Button className="w-full flex items-center justify-center gap-2 pb-2" variant="outline">
                   <User className="h-4 w-4" />
                   Đăng nhập
                 </Button>
                 </Link>
               )}
                 <div className="text-xs text-center text-muted-foreground">
                   <p>© {new Date().getFullYear()} TKhang</p>
                 </div>
               </div>
        </div>
      </div>
    </>
  )
}
