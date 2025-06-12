
// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { Flame, Menu } from 'lucide-react'; // Added Menu
import { sportCategories } from '@/lib/sports-data';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react'; // Added useState
import { Button } from "@/components/ui/button"; // Added Button
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose, // Added SheetClose
} from "@/components/ui/sheet"; // Added Sheet components

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center p-0.5 m-0.5"> {/* Added p-0.5 and m-0.5 */}
        {/* Brand */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Flame className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            sportsurge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4 text-sm ml-auto overflow-x-auto whitespace-nowrap">
          {sportCategories.map((category) => {
            const isActive = pathname === `/${category.id}`; // Updated path
            return (
              <Link
                key={category.id}
                href={`/${category.id}`} // Updated path
                className={cn(
                  "transition-colors hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden ml-auto">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
              <div className="p-4">
                 <SheetClose asChild>
                    <Link href="/" className="mb-6 flex items-center space-x-2">
                        <Flame className="h-6 w-6 text-primary" />
                        <span className="font-bold font-headline text-lg text-foreground">
                        sportsurge
                        </span>
                    </Link>
                 </SheetClose>
                <nav className="flex flex-col gap-1 mt-4">
                  {sportCategories.map((category) => {
                    const isActive = pathname === `/${category.id}`; // Updated path
                    return (
                      <SheetClose asChild key={category.id}>
                        <Link
                          href={`/${category.id}`} // Updated path
                          className={cn(
                            "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                            isActive
                              ? "text-primary bg-primary/10 font-semibold"
                              : "text-foreground hover:bg-muted hover:text-primary"
                          )}
                        >
                          {category.name}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
