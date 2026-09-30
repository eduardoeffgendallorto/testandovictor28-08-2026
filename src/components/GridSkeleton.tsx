import { Skeleton } from "@/components/ui/skeleton";

export const GridSkeleton = ({
  title,
  subtitle,
  count = 6,
}: {
  title?: string;
  subtitle?: string;
  count?: number;
}) => (
  <section className="container py-10 md:py-14" aria-busy="true" aria-live="polite">
    {title && (
      <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">{title}</h1>
        {subtitle && <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>}
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl bg-surface p-5 md:p-6 shadow-card border border-border/40">
          <Skeleton className="h-44 md:h-52 w-full rounded-2xl mb-4" />
          <Skeleton className="h-5 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-7 w-1/3" />
        </div>
      ))}
    </div>
  </section>
);
