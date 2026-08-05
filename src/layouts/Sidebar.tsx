import {
  BarChart3,
  CalendarClock,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PackageSearch,
  ReceiptText,
  Users,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

type SidebarProps = {
  brandCode?: string;
};

type SidebarLinkProps = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  end?: boolean;
};

function SidebarLink({
  to,
  label,
  icon: Icon,
  end = false,
}: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 rounded-xl px-4 py-3",
          "text-sm font-semibold transition",
          isActive
            ? "bg-[#0F6B52] text-white shadow-sm"
            : "text-slate-600 hover:bg-emerald-50 hover:text-[#0F6B52]",
        ].join(" ")
      }
    >
      <Icon size={19} />
      <span>{label}</span>
    </NavLink>
  );
}

function Sidebar({ brandCode }: SidebarProps) {
  const navigate = useNavigate();

  const normalizedBrandCode = String(brandCode || "")
    .trim()
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("authUser");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authUser");

    navigate("/", { replace: true });
  };

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-emerald-100 bg-white lg:flex lg:flex-col">
      <div className="border-b border-emerald-100 px-6 py-6">
        <button
          type="button"
          onClick={() => navigate("/overview")}
          className="text-left"
        >
          <p className="text-xl font-bold text-[#0F6B52]">
            Sprinklez
          </p>

          <p className="mt-1 text-xs text-slate-500">
            F&amp;B Analytics Platform
          </p>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Organisation
        </p>

        <nav className="space-y-1">
          <SidebarLink
            to="/overview"
            label="Executive Overview"
            icon={LayoutDashboard}
            end
          />

          <SidebarLink
            to="/employee-analysis"
            label="Employee Analysis"
            icon={Users}
            end
          />
        </nav>

        {normalizedBrandCode && (
          <>
            <p className="mb-3 mt-8 px-4 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
              Brand Analytics
            </p>

            <nav className="space-y-1">
              <SidebarLink
                to={`/brand/${normalizedBrandCode}`}
                label="Sales Dashboard"
                icon={BarChart3}
                end
              />

              <SidebarLink
                to={`/brand/${normalizedBrandCode}/pnl`}
                label="Profit & Loss"
                icon={ReceiptText}
              />

              <SidebarLink
                to={`/brand/${normalizedBrandCode}/staff-scheduling`}
                label="Staff Scheduling"
                icon={CalendarClock}
              />

              <SidebarLink
                to={`/brand/${normalizedBrandCode}/delivery`}
                label="Delivery Business"
                icon={ClipboardList}
              />

              <SidebarLink
                to={`/brand/${normalizedBrandCode}/reviews`}
                label="Customer Reviews"
                icon={MessageSquareText}
              />

              <SidebarLink
                to={`/brand/${normalizedBrandCode}/pipeline`}
                label="Project Pipeline"
                icon={PackageSearch}
              />
            </nav>
          </>
        )}
      </div>

      <div className="border-t border-emerald-100 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;