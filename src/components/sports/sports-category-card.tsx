
import type { SportCategory } from "@/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from 'react'; // Import React

interface SportsCategoryCardProps {
  category: SportCategory;
}

export function SportsCategoryCard({ category }: SportsCategoryCardProps) {
  return (
    <Link href={`/${category.id}`} className="block hover:scale-105 hover:-translate-y-1 transition-transform duration-200 ease-in-out">
      <Card className="h-full flex flex-col items-center justify-center text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-200 ease-in-out">
        <CardHeader className="p-2">
          <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            <div className="relative w-[36px] h-[36px]">
              {/* Apply invert filter to the icon */}
              {React.isValidElement(category.icon) ? 
                React.cloneElement(category.icon as React.ReactElement<{className?: string}>, { 
                  className: `${(category.icon.props.className || '')} invert`.trim() 
                }) : category.icon
              }
              {/* The mix-blend-color div from the previous attempt has been removed */}
            </div>
          </div>
          <CardTitle className="text-lg font-semibold font-headline">{category.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
