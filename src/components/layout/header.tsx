// src/components/layout/header.tsx
'use client';

import Link from 'next/link';
import { Flame } from 'lucide-react';
import { sportCategories } from '@/lib/sports-data';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Flame className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline">
            sportsurge
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm overflow-x-auto whitespace-nowrap">
          {sportCategories.map((category) => {
            const isActive = pathname === `/category/${category.id}`;
            return (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
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
      </div>
    </header>
  );
}
