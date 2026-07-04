import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutGrid, Store, LogOut, Settings, FileBarChart, Tag } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] transition-colors ${
          isActive
            ? "bg-sidebar-hover text-white font-medium"
            : "text-white/70 hover:text-white hover:bg-sidebar-hover/60"
        }`
      }
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

export default function Sidebar() {
  const [brands, setBrands] = useState([]);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/data/brands")
      .then(({ data }) => setBrands(data))
      .catch(() => {});
  }, []);

  return (
    <aside className="w-[220px] shrink-0 bg-sidebar min-h-screen flex flex-col py-5 px-3">
      <div className="px-2 mb-6">
        <div className="text-white font-bold text-[15px] tracking-tight">SalesIQ</div>
        <div className="text-white/40 text-[11px]">Business Intelligence</div>
      </div>

      <div className="text-white/35 text-[10.5px] font-semibold tracking-wider px-3 mb-1.5">
        ANALYZE
      </div>
      <nav className="flex flex-col gap-0.5 mb-5">
        <NavItem to="/overview" icon={LayoutGrid} label="Company Overview" />
        {brands.map((b) => (
          <NavItem
            key={b.brand}
            to={`/brands/${encodeURIComponent(b.brand)}`}
            icon={Tag}
            label={`${b.brand} Sales`}
          />
        ))}
      </nav>

      <div className="text-white/35 text-[10.5px] font-semibold tracking-wider px-3 mb-1.5">
        ACCOUNT
      </div>
      <nav className="flex flex-col gap-0.5">
        <NavItem to="/reports" icon={FileBarChart} label="Reports" />
        <NavItem to="/settings" icon={Settings} label="Settings" />
      </nav>

      <div className="mt-auto pt-4 border-t border-white/10 px-1">
        <div className="px-2 mb-2">
          <div className="text-white text-[13px] font-medium truncate">{user?.name || user?.username}</div>
          <div className="text-white/40 text-[11px]">{user?.role || "Viewer"}</div>
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13.5px] text-white/70 hover:text-white hover:bg-sidebar-hover/60 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}
