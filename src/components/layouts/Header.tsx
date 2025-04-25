'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';
import { Monitor } from 'lucide-react';
import { ModeToggle } from '../theme-toggle';
import { useAuth } from '@/context/auth-provider';

const services = [
  { title: 'Remote Support', href: '/services/remote-support' },
  { title: 'On-Site Support', href: '/services/on-site-support' },
];

export default function Header() {
    const { user, logout } = useAuth();
  return (
    <header className="bg-secondary shadow-sm sticky top-0 border border-b-primary/10 z-50">
        <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Monitor className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">ITSupport</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Dịch vụ</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                       
                            <Monitor className="h-6 w-6 text-white" />
                            <div className="mt-4 mb-2 text-lg font-medium text-white">
                              IT Support
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Đảm bảo sự hài lòng của khách hàng
                            </p>
                  
                        </NavigationMenuLink>
                      </li>
                      {services.map((service) => (
                        <ListItem
                          key={service.title}
                          title={service.title}
                          href={service.href}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about" >
                      Về chúng tôi
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact" >

                      Liên hệ
      
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
              {/* <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button> */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        {user.fullName}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  {/* <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1"> */}
                      {/* <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p> */}
                    {/* </div>
                  </DropdownMenuLabel> */}
                  {/* <DropdownMenuSeparator /> */}
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
            </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Đăng nhập</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Đăng kí</Button>
                </Link>
              </>
            )}
          </div>
        </div>
        </div>
    </header>
  );
}

const ListItem = ({
  className,
  title,
  href,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { title: string }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          href={href}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
};
