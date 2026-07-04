import Sidebar from "./Sidebar.jsx";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 p-6 max-w-[1400px]">{children}</main>
    </div>
  );
}
