import {
  BarChart3,
  Bike,
  ClipboardList,
  DollarSign,
  LogOut,
  MessageSquareText,
  UsersRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface SidebarProps {
  brandCode: string;
}

function Sidebar({ brandCode }: SidebarProps) {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const links = [
    {
      label: "Sales Dashboard",
      icon: BarChart3,
      path: `/brand/${brandCode}`,
    },
    {
      label: "P&L Dashboard",
      icon: DollarSign,
      path: `/brand/${brandCode}/pnl`,
    },
    {
      label: "Staff Scheduling",
      icon: UsersRound,
      path: `/brand/${brandCode}/staff-scheduling`,
    },
    {
      label: "Delivery Business",
      icon: Bike,
      path: `/brand/${brandCode}/delivery`,
    },
    {
      label: "Customer Reviews",
      icon: MessageSquareText,
      path: `/brand/${brandCode}/reviews`,
    },
    {
      label: "Project Pipeline",
      icon: ClipboardList,
      path: `/brand/${brandCode}/pipeline`,
    },
  ];

  return (
    <aside className="hidden min-h-screen w-72 bg-gradient-to-b from-[#0F6B52] to-[#063F31] text-white shadow-xl lg:flex lg:flex-col">

      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <div>
          <h2 className="text-xl font-bold tracking-wide">
            Sprinklez
          </h2>

          <p className="text-sm text-emerald-100">
            Executive Workspace
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === `/brand/${brandCode}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white/15 text-white shadow-lg"
                    : "text-emerald-50 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-500/20 hover:text-white"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;