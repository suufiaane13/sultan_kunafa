/**
 * Skeleton affiché pendant le chargement des routes lazy (Menu, About).
 */
export function RouteSkeleton() {
  return (
    <div className="mx-auto min-h-[50vh] max-w-7xl px-4 py-12" aria-hidden>
      <div className="animate-pulse space-y-8">
        <div className="h-10 w-48 rounded-lg bg-gold/15" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gold/10 bg-cream-dark/50">
              <div className="aspect-[4/3] bg-gold/10" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 rounded bg-gold/15" />
                <div className="h-4 w-1/4 rounded bg-gold/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
