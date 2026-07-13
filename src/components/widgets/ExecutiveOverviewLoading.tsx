function ExecutiveOverviewLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-slate-200 bg-white"
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <div className="h-[360px] rounded-3xl border border-slate-200 bg-white" />
        <div className="h-[360px] rounded-3xl border border-slate-200 bg-white" />
        <div className="h-[360px] rounded-3xl border border-slate-200 bg-white" />
      </div>

      <div className="h-64 rounded-3xl border border-slate-200 bg-white" />

      <div className="grid gap-5 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-72 rounded-3xl border border-slate-200 bg-white"
          />
        ))}
      </div>
    </div>
  );
}

export default ExecutiveOverviewLoading;
