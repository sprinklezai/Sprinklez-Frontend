import DashboardLayout from "../layouts/DashboardLayout";

function EmployeeAnalysis() {
  return (
    <DashboardLayout>
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
          Workforce Analytics
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Employee Analysis
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          F&amp;B workforce demographics and organisation overview.
        </p>

        <div className="mt-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Employee dashboard setup completed
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            The Excel upload, KPI cards and demographic charts will be added next.
          </p>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default EmployeeAnalysis;