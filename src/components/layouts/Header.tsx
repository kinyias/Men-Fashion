"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Search, User, ChevronDown, Menu } from "lucide-react"
import { CartSidebar } from "./CartSideBar"
import { MobileMenu } from "./MobileMenu"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/context/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { getCategories, getSubCategories } from "@/lib/api"
import { useCartStore } from "@/lib/store/cart-store"
import { Skeleton } from "@/components/ui/skeleton"

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { user, logout } = useAuth();
  const { itemCount, toggleCart } = useCartStore()
  
  // Fetch categories
  const { data: categoriesData, isLoading: isCategoryLoading } = useQuery({
    queryKey: ['header-categories'],
    queryFn: () => getCategories({ page: 1, limit: 100 }),
  })

  // Fetch sub-categories
  const { data: subCategoriesData,isLoading: isSubCategoryLoading } = useQuery({
    queryKey: ['header-sub-categories'],
    queryFn: () => getSubCategories({ page: 1, limit: 100 }),
  })

  // Process categories and sub-categories
  const navigationItems =
  [
    {
      name: "Hàng mới về",
      href: "#",
      hasDropdown: false,
      subcategories: []
    },
  ...categoriesData?.data.map(category => ({
    name: category.ten,
    href: `/category/${category.ma}`,
    hasDropdown: true,
    subcategories: subCategoriesData?.data
      .filter(sub => sub.madanhmuc === category.ma)
      .map(sub => ({
        name: sub.ten,
        href: `/sub-category/${sub.ma}`
      })) || []
  })) || []
]

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile, isMobileMenuOpen])

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(name)
    }
  }

  const closeDropdowns = () => {
    setActiveDropdown(null)
  }
  if(isCategoryLoading || isSubCategoryLoading) {
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2 font-bold text-xl">
              <Skeleton className="hidden md:block h-9 w-24 rounded-full" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Skeleton */}
          <nav className="hidden md:flex items-center gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </nav>

          {/* Right side icons Skeleton */}
          <div className="flex items-center gap-2 md:gap-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="hidden md:block h-9 w-24 rounded-full" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
           <Link href="/">
           <div className="flex items-center gap-2 font-bold text-xl">
              <ShoppingBag className="h-5 w-5" />
              <span>TKHANG</span>
            </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 relative">
            {navigationItems.map((item) => (
              <div key={item.name} className="relative group">
                <button
                  className="flex items-center text-sm font-medium transition-colors hover:text-primary relative group cursor-pointer"
                  onClick={() => item.hasDropdown && toggleDropdown(item.name)}
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <div className='absolute left-0 top-5 z-50 w-full h-full'></div>
                  {item.name}
                  {item.hasDropdown && <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200" />}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </button>

                {item.hasDropdown && activeDropdown === item.name && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => closeDropdowns()}
                  >
                    <div className="py-2">
                      {item.subcategories?.map((subcategory) => (
                        <Link
                          key={subcategory.name}
                          href={subcategory.href}
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                          onClick={() => closeDropdowns()}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" aria-label="Search" className="rounded-full">
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Shopping cart"
              className="rounded-full relative"
              onClick={toggleCart}
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount() || 0}
              </span>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="User account" className="hidden md:flex rounded-full">
              <User className="h-5 w-5" />
                  </Button>  
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      {/* <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p> */}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/account">Tài khoản</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings">Cài đặt</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                  <button className='cursor-pointer w-full h-full text-start' onClick={logout}>Đăng xuất</button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              ):(
            <Link href='/auth/login'>
            <Button variant="outline" size="sm" className="hidden md:flex rounded-full">
              Đăng nhập
            </Button>
            </Link>

              )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  )
}
