import {
  BarChart3,
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  PackageSearch,
  ReceiptText,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

type SidebarProps = {
  brandCode?: string;
  brandName?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

type MenuItem = {
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
  to: string;
  end?: boolean;
};

const normalizeBrandCode = (value?: string) =>
  String(value || "").trim().toUpperCase();

const getStoredUser = () => {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      localStorage.getItem("authUser") ||
      sessionStorage.getItem("user") ||
      sessionStorage.getItem("authUser");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

function Sidebar({
  brandCode,
  brandName,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const normalizedBrandCode = normalizeBrandCode(brandCode);
  const user = getStoredUser();

  const displayName =
    user?.emp_name ||
    user?.employee_name ||
    user?.name ||
    user?.emp_id ||
    "Dashboard User";

  const designation =
    user?.designation ||
    user?.role ||
    "Authorised User";

  const globalMenuItems: MenuItem[] = [
    {
      label: "Executive Overview",
      icon: LayoutDashboard,
      to: "/overview",
      end: true,
    },
    {
      label: "Employee Analysis",
      icon: Users,
      to: "/employee-analysis",
      end: true,
    },
  ];

  const brandMenuItems: MenuItem[] = normalizedBrandCode
    ? [
        {
          label: "Sales Dashboard",
          icon: BarChart3,
          to: `/brand/${normalizedBrandCode}`,
          end: true,
        },
        {
          label: "Profit & Loss",
          icon: ReceiptText,
          to: `/brand/${normalizedBrandCode}/pnl`,
        },
        {
          label: "Staff Scheduling",
          icon: CalendarClock,
          to: `/brand/${normalizedBrandCode}/staff-scheduling`,
        },
        {
          label: "Delivery Business",
          icon: ClipboardList,
          to: `/brand/${normalizedBrandCode}/delivery`,
        },
        {
          label: "Customer Reviews",
          icon: MessageSquareText,
          to: `/brand/${normalizedBrandCode}/reviews`,
        },
        {
          label: "Project Pipeline",
          icon: PackageSearch,
          to: `/brand/${normalizedBrandCode}/pipeline`,
        },
      ]
    : [];

  useEffect(() => {
    onMobileClose?.();
  }, [location.pathname]);

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

  const renderMenuItem = (item: MenuItem) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        title={collapsed ? item.label : undefined}
        className={({ isActive }) =>
          [
            "group flex min-h-11 items-center rounded-xl px-3 py-2.5",
            "text-sm font-medium transition-all duration-200",
            collapsed ? "justify-center" : "gap-3",
            isActive
              ? "bg-sky-50 text-sky-700 shadow-sm ring-1 ring-sky-100"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
          ].join(" ")
        }
      >
        <Icon
          size={19}
          className="shrink-0"
        />

        {!collapsed && (
          <span className="truncate">
            {item.label}
          </span>
        )}
      </NavLink>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white">
      <div
        className={[
          "flex h-20 items-center border-b border-slate-200 px-4",
          collapsed ? "justify-center" : "justify-between",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => navigate("/overview")}
          className={[
            "flex min-w-0 items-center",
            collapsed ? "justify-center" : "gap-3",
          ].join(" ")}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm">
            <Building2 size={21} />
          </div>

          {!collapsed && (
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-bold text-slate-900">
                Sprinklez
              </p>

              <p className="truncate text-xs text-slate-500">
                F&amp;B Analytics
              </p>
            </div>
          )}
        </button>

        <button
          type="button"
          onClick={onMobileClose}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <nav className="space-y-1">
          {!collapsed && (
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Organisation
            </p>
          )}

          {globalMenuItems.map(renderMenuItem)}
        </nav>

        {brandMenuItems.length > 0 && (
          <nav className="mt-7 space-y-1">
            {!collapsed && (
              <div className="mb-2 px-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Brand Analytics
                </p>

                <p className="mt-1 truncate text-xs font-medium text-slate-600">
                  {brandName || normalizedBrandCode}
                </p>
              </div>
            )}

            {brandMenuItems.map(renderMenuItem)}
          </nav>
        )}
      </div>

      <div className="border-t border-slate-200 p-3">
        {!collapsed && (
          <div className="mb-3 rounded-xl bg-slate-50 px-3 py-3">
            <p className="truncate text-sm font-semibold text-slate-800">
              {displayName}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-500">
              {designation}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
          className={[
            "flex min-h-11 w-full items-center rounded-xl px-3 py-2.5",
            "text-sm font-medium text-rose-600 transition",
            "hover:bg-rose-50",
            collapsed ? "justify-center" : "gap-3",
          ].join(" ")}
        >
          <LogOut size={19} />

          {!collapsed && <span>Logout</span>}
        </button>

        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          className={[
            "mt-2 hidden min-h-10 w-full items-center rounded-xl",
            "px-3 text-sm font-medium text-slate-500",
            "transition hover:bg-slate-100 hover:text-slate-900 lg:flex",
            collapsed ? "justify-center" : "justify-between",
          ].join(" ")}
        >
          {!collapsed && <span>Collapse menu</span>}

          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white",
          "transition-all duration-300 lg:block",
          collapsed ? "w-20" : "w-72",
        ].join(" ")}
      >
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar overlay"
            onClick={onMobileClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 w-[86%] max-w-72 border-r border-slate-200 bg-white shadow-2xl">
            {sidebarContent}
          </aside>
        </div>
      )}

      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => {
          if (onMobileClose) {
            return;
          }
        }}
        className="hidden"
      >
        <Menu />
      </button>
    </>
  );
}

export default Sidebar;