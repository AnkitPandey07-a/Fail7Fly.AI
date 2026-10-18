import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Video,
  FileText,
  Map,
  BookOpen,
  User,
  Coins,
  X,
  LogOut,
  UploadCloud,
  BriefcaseBusiness,
  PanelsTopLeft,
  ChevronRight,
} from "lucide-react";

function Sidebar({
  user,
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  setUser,
}) {
  const navigateTo = useNavigate();

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "AI Interview", icon: Video },
    { name: "Resume Analyzer", icon: UploadCloud },
    { name: "Resume Builder", icon: FileText },
    { name: "Career Roadmap", icon: Map },
    { name: "Resources", icon: BookOpen },
    { name: "Profile", icon: User },
  ];

  const navigate = (page) => {
    setSidebarOpen(false);

    if (page === "AI Interview") {
      navigateTo("/interview/start");
      return;
    }

    if (page === "Overview") {
      navigateTo("/dashboard");
      setActiveTab("Overview");
      return;
    }

    if (page === "Resume Analyzer") {
      navigateTo("/scorer");
      setActiveTab("Resume Analyzer");
      return;
    }

    // Existing dashboard tabs
    setActiveTab(page);
  };

  const handleLogout = () => {
    setSidebarOpen(false);

    // This updates frontend state only.
    // Connect your actual logout API here if required.
    setUser?.(null);
    navigateTo("/", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${sidebarOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
          }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:sticky lg:z-30 lg:translate-x-0 lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex h-24 shrink-0 items-center justify-between border-b border-gray-100 px-6">
          <button
            type="button"
            onClick={() => navigate("Overview")}
            className="group flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-sm font-bold text-white shadow-md transition-all duration-300 group-hover:rotate-[-6deg] group-hover:scale-110 group-hover:rounded-2xl">
              F7
            </div>

            <div>
              <h1 className="font-bold tracking-tight text-gray-900">
                Fail7Fly
                <span className="text-gray-400">.AI</span>
              </h1>

              <p className="mt-1 text-[10px] text-gray-400">
                AI Career Platform
              </p>
            </div>
          </button>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-gray-400 transition-all hover:rotate-90 hover:bg-gray-100 hover:text-black lg:hidden"
          >
            <X size={19} className="text-black" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-7">
          <div className="mb-4 flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
              Workspace
            </p>
            <PanelsTopLeft size={14} className="text-black" />
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = activeTab === item.name;

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => navigate(item.name)}
                  aria-current={active ? "page" : undefined}
                  style={{ transitionDelay: `${index * 15}ms` }}
                  className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-left text-sm transition-all duration-300 hover:translate-x-1 hover:shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${active
                      ? "bg-gray-100 font-medium text-gray-900"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  {active && (
                    <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-white/80" />
                  )}

                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 ${active
                        ? "bg-white/10"
                        : "bg-transparent group-hover:bg-white"
                      }`}
                  >
                    <Icon
                      size={18}
                      className="text-black"
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                  </span>

                  <span className="flex-1">
                    {item.name}
                  </span>

                  <ChevronRight
                    size={15}
                    className={`shrink-0 text-black transition-all duration-300 ${active
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-70"
                      }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Resume quick action */}
          <div className="mt-7 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all duration-300 hover:border-gray-200 hover:bg-white hover:shadow-md">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <BriefcaseBusiness size={15} className="text-black" />
              </div>

              <p className="text-xs font-semibold text-gray-800">
                Career Assistant
              </p>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Improve your resume and prepare for your next opportunity.
            </p>

            <button
              type="button"
              onClick={() => navigate("Resume Analyzer")}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-900 transition-all hover:bg-gray-100 active:scale-[0.98]"
            >
              Analyze Resume
              <ChevronRight size={14} className="text-black" />
            </button>
          </div>
        </div>

        {/* Bottom section */}
        <div className="shrink-0 border-t border-gray-100 p-4">
          {/* Interview credits */}
          <div className="group mb-5 overflow-hidden rounded-2xl bg-gray-100 p-4 text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">
                  Interview Credits
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <Coins size={20} className="text-black" />
                  <span className="text-2xl font-bold tabular-nums">
                    {user?.interviewCoin ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <Coins size={20} className="text-black" />
              </div>
            </div>

            <p className="mt-3 text-[10px] text-gray-500">
              Credits available for AI interviews
            </p>
          </div>

          {/* User profile */}
          <button
            type="button"
            onClick={() => navigate("Profile")}
            className="group mb-3 flex w-full items-center gap-3 rounded-xl p-2 text-left transition-all hover:bg-gray-100"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 group-hover:bg-black group-hover:text-white">
              {user?.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-gray-400">
                {user?.email || "No email"}
              </p>
            </div>

            <ChevronRight size={15} className="text-black" />
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-500 transition-all hover:translate-x-1 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
          >
            <LogOut size={18} className="text-black" />
            <span className="flex-1 text-left">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;