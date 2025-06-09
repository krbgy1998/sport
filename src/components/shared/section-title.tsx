import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  className?: string;
}

export function SectionTitle({ title, className }: SectionTitleProps) {
  return (
    <h2 className={cn("text-3xl font-bold tracking-tight text-foreground mb-6 font-headline", className)}>
      {title}
    </h2>
  );
}
