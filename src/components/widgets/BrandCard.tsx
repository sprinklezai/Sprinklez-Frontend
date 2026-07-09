import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BrandCardProps {
  name: string;
  code: string;
  logo: string;
  stores: number;
  countries: number;
}

function BrandCard({ name, code, logo, stores, countries }: BrandCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/brand/${code}`)}
      className="group rounded-3xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-24 items-center justify-center">
        <img
          src={logo}
          alt={name}
          className="max-h-20 max-w-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      <h3 className="mt-4 text-center font-bold text-slate-800">{name}</h3>

      <div className="mt-5 grid grid-cols-2 divide-x divide-slate-200 text-center">
        <div>
          <p className="text-xl font-bold text-slate-900">{stores}</p>
          <p className="text-xs text-slate-500">Stores</p>
        </div>

        <div>
          <p className="text-xl font-bold text-slate-900">{countries}</p>
          <p className="text-xs text-slate-500">Countries</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-blue-600">
        View Dashboard
        <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </div>
    </button>
  );
}

export default BrandCard;