
import { cn } from "@/lib/utils";
import React from 'react';

interface SectionTitleProps {
  title: string;
  className?: string;
  id?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export function SectionTitle({ title, className, id, as: Component = 'h2' }: SectionTitleProps) {
  return (
    <Component id={id} className={cn("text-3xl font-bold tracking-tight text-foreground mb-6 font-headline", className)}>
      {title}
    </Component>
  );
}
