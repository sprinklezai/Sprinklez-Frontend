interface Option {
  label: string;
  value: string;
}

interface FilterBarProps {
  brandName?: string;
  countries?: Option[];
  companies?: Option[];
  stores?: Option[];
  selectedCountry: string;
  selectedCompany: string;
  selectedStore: string;
  onCountryChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onStoreChange: (value: string) => void;
  onReset: () => void;
}

function FilterBar({
  brandName,
  countries = [],
  companies = [],
  stores = [],
  selectedCountry,
  selectedCompany,
  selectedStore,
  onCountryChange,
  onCompanyChange,
  onStoreChange,
  onReset,
}: FilterBarProps) {
  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-slate-900">Dashboard Filters</h3>
        <p className="text-sm text-slate-500">
          Brand is fixed. Filter by country, company and store.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Brand
          </label>
          <input
            value={brandName || ""}
            disabled
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Countries</option>
            {countries.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Company
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => onCompanyChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Companies</option>
            {companies.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Store
          </label>
          <select
            value={selectedStore}
            onChange={(e) => onStoreChange(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">All Stores</option>
            {stores.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export default FilterBar;