import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";

function ManagementSummary({ data }: { data?: any }) {
  if (!data) return null;

  return (
    <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/70 p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[#0F6B52] p-3 text-white"><Sparkles size={20} /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C89B3C]">Management Summary</p>
          <h2 className="mt-1 text-xl font-extrabold text-stone-950">{data.headline}</h2>
          <p className="mt-3 max-w-5xl text-sm leading-6 text-stone-600">{data.narrative}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-3">
        <Insight title="Positive Signals" icon={<CheckCircle2 size={16} />} items={data.positiveInsights || []} tone="green" />
        <Insight title="Attention Required" icon={<AlertTriangle size={16} />} items={data.attentionPoints || []} tone="amber" />
        <Insight title="Recommended Actions" icon={<Lightbulb size={16} />} items={data.recommendedActions || []} tone="blue" />
      </div>
    </section>
  );
}

function Insight({ title, icon, items, tone }: any) {
  const classes = tone === "amber"
    ? "border-amber-200 bg-amber-50 text-amber-900"
    : tone === "blue"
      ? "border-sky-200 bg-sky-50 text-sky-900"
      : "border-emerald-200 bg-emerald-50 text-emerald-900";

  return (
    <div className={`rounded-2xl border p-4 ${classes}`}>
      <div className="flex items-center gap-2 text-sm font-bold">{icon}{title}</div>
      <ul className="mt-3 space-y-2 text-xs leading-5">
        {items.map((item: string, index: number) => <li key={index}>• {item}</li>)}
      </ul>
    </div>
  );
}

export default ManagementSummary;
