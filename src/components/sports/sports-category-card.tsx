import type { SportCategory } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface SportsCategoryCardProps {
  category: SportCategory;
}

export function SportsCategoryCard({ category }: SportsCategoryCardProps) {
  return (
    <Link href={`/category/${category.id}`} className="block hover:scale-105 transition-transform duration-200 ease-in-out">
      <Card className="h-full flex flex-col items-center justify-center text-center p-4 hover:shadow-lg hover:border-primary transition-all duration-200 ease-in-out">
        <CardHeader className="p-2">
          <div className="text-primary w-12 h-12 mx-auto mb-2 flex items-center justify-center">
            {category.icon}
          </div>
          <CardTitle className="text-lg font-semibold font-headline">{category.name}</CardTitle>
        </CardHeader>
      </Card>
    </Link>
  );
}
