export default function Loading() {
  return (
    <div className="container-page py-10 md:py-16">
      {/* Видимый прогресс-бар вверху */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand-200 dark:bg-brand-900 z-50">
        <div className="h-full bg-brand-600 animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: "40%" }} />
      </div>

      {/* Hero skeleton — белые блоки на bg */}
      <div className="max-w-xl mb-8">
        <div className="h-4 w-40 bg-ink-200 dark:bg-ink-600 rounded-full mb-5 animate-pulse" />
        <div className="h-10 bg-ink-200 dark:bg-ink-600 rounded-xl mb-3 w-full animate-pulse" />
        <div className="h-10 bg-ink-200 dark:bg-ink-600 rounded-xl mb-6 w-4/5 animate-pulse" />
        <div className="h-12 bg-ink-200 dark:bg-ink-600 rounded-xl w-full animate-pulse" />
      </div>

      {/* Categories skeleton */}
      <div className="h-6 w-48 bg-ink-200 dark:bg-ink-600 rounded-lg mb-4 mt-8 animate-pulse" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 bg-ink-100 dark:bg-ink-700 rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Specialists skeleton */}
      <div className="h-6 w-56 bg-ink-200 dark:bg-ink-600 rounded-lg mb-4 mt-12 animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-ink-100 dark:bg-ink-700 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
