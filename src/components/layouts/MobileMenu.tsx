"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X, ChevronDown, ChevronRight, User } from "lucide-react"

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

export  function MobileMenu({ isOpen, onClose, navigationItems }: MobileMenuProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

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
              <span>Menu</span>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

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
            <Button className="w-full flex items-center justify-center gap-2" variant="outline">
              <User className="h-4 w-4" />
              Sign In
            </Button>
            <div className="text-xs text-center text-muted-foreground">
              <p>© {new Date().getFullYear()} NORTHSTYLE</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
