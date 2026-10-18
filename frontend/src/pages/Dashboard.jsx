import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  FileText,
  Map,
  BookOpen,
  User,
  Coins,
  TrendingUp,
  ArrowRight,
  BriefcaseBusiness,
  PanelsTopLeft,
  Menu,
  X,
  LogOut,
  UploadCloud,
} from "lucide-react";

import Scorer from "./Scorer";
import ResumeBuilder from "./Builder";
import TechnicalCareerRoadmap from "../components/TechnicalCareerRoadmap.jsx";
import TechnicalResources from "../components/TechnicalResources.jsx";

function Dashboard({ user, setUser }) {
  const navigateTo = useNavigate();

  const [activeTab, setActiveTab] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  const menuItems = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "AI Interview", icon: Video },
    { name: "Resume Analyzer", icon: UploadCloud },
    { name: "Resume Builder", icon: FileText },
    { name: "Career Roadmap", icon: Map },
    { name: "Resources", icon: BookOpen },
    { name: "Profile", icon: User },
  ];

  // Dashboard tabs and application routes
  const navigate = (page) => {
    setSidebarOpen(false);

    if (page === "AI Interview") {
      navigateTo("/interview/start");
      return;
    }

    if (page === "Overview") {
      setActiveTab("Overview");
      navigateTo("/dashboard");
      return;
    }

    if (page === "Resume Analyzer") {
      setActiveTab("Resume Analyzer");
      navigateTo("/dashboard");
      return;
    }

    if (page === "Resume Builder") {
      setActiveTab("Resume Builder");
      navigateTo("/dashboard");
      return;
    }

    setActiveTab(page);
  };

  const handleLogout = () => {
    setSidebarOpen(false);

    if (typeof setUser === "function") {
      setUser(null);
    }

    navigateTo("/", { replace: true });
  };

  const firstName = user?.name || "User";
  const interviewCoins = user?.interviewCoin ?? 0;

  return (
    <div className="min-h-screen bg-[#f7f7f8] text-gray-900">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-5 lg:hidden">
        <button
          type="button"
          onClick={() => navigate("Overview")}
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black font-bold text-white">
            F7
          </div>

          <span className="font-bold">
            Fail7Fly<span className="text-gray-400">.AI</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div
            aria-live="polite"
            aria-label={`${interviewCoins} interview coins`}
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2 text-sm font-bold tabular-nums"
          >
            <Coins size={16} className="text-black" />
            {interviewCoins}
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen((previous) => !previous)}
            className="rounded-lg border p-2 transition hover:bg-gray-100"
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? <X size={20} className="text-black" /> : <Menu size={20} className="text-black" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)] lg:min-h-screen">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          {/* Logo */}
          <div className="flex h-24 shrink-0 items-center justify-between border-b border-gray-100 px-6">
            <button
              type="button"
              onClick={() => navigate("Overview")}
              className="group flex items-center gap-3 text-left"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black font-bold text-white shadow-md transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
                F7
              </div>

              <div>
                <p className="font-bold">
                  Fail7Fly<span className="text-gray-400">.AI</span>
                </p>

                <p className="text-xs text-gray-400">
                  AI Career Platform
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-black lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} className="text-black" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-7">
            <div className="mb-4 flex items-center justify-between px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Workspace
              </p>

              <PanelsTopLeft size={15} className="text-black" />
            </div>

            <nav className="space-y-2">
              {menuItems.map(({ name, icon: Icon }, index) => {
                const active = activeTab === name;

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => navigate(name)}
                    aria-current={active ? "page" : undefined}
                    style={{ transitionDelay: `${index * 15}ms` }}
                    className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-xl px-4 py-3.5 text-left text-sm transition-all duration-300 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${active
                        ? "bg-gray-100 font-medium text-gray-900"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <span
                      className={`absolute inset-y-2 left-0 w-1 rounded-r-full ${active
                          ? "bg-black opacity-100"
                          : "bg-black opacity-0 group-hover:opacity-100"
                        }`}
                    />

                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${active
                          ? "bg-white/10"
                          : "group-hover:bg-violet-100"
                        }`}
                    >
                      <Icon
                        size={19}
                        className="text-black"
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                    </span>

                    <span className="flex-1">{name}</span>

                    <ArrowRight
                      size={16}
                      className={`text-black shrink-0 transition ${active
                          ? "opacity-100"
                          : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                        }`}
                    />
                  </button>
                );
              })}
            </nav>

            {/* Career Assistant */}
            <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-violet-200 hover:bg-white hover:shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                  <BriefcaseBusiness size={17} className="text-black" />
                </div>

                <p className="text-sm font-semibold text-gray-800">
                  Career Assistant
                </p>
              </div>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                Improve your resume and prepare for your next opportunity.
              </p>

              <button
                type="button"
                onClick={() => navigate("Resume Analyzer")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-3 text-xs font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Analyze Resume
                <ArrowRight size={14} className="text-black" />
              </button>
            </div>
          </div>

          {/* Sidebar Bottom */}
          <div className="shrink-0 border-t border-gray-100 p-5">
            {/* Interview Credits */}
            <div className="group mb-5 rounded-2xl bg-gray-100 p-4 text-gray-900 transition hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    Interview Credits
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <Coins size={20} className="text-black" />

                    <span className="text-2xl font-bold tabular-nums">
                      {interviewCoins}
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

            {/* User Profile */}
            <button
              type="button"
              onClick={() => navigate("Profile")}
              className="group mb-3 flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-violet-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-700 transition group-hover:bg-violet-600 group-hover:text-white">
                {firstName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {firstName}
                </p>

                <p className="truncate text-xs text-gray-400">
                  {user?.email || "No email"}
                </p>
              </div>

              <ArrowRight size={15} className="text-black" />
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut size={18} className="text-black" />

              <span className="flex-1 text-left">Logout</span>

              <ArrowRight
                size={15}
                className="opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100"
              />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Desktop Header */}
          <header className="hidden h-20 items-center justify-between border-b border-gray-200 bg-white px-8 lg:flex">
            <div>
              <p className="text-xs text-gray-400">Dashboard</p>

              <h2 className="mt-1 text-lg font-semibold">
                {activeTab}
              </h2>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                <Coins size={16} className="text-black" />
              </div>

              <div>
                <p className="text-[10px] text-gray-400">
                  Interview Coins
                </p>

                <p className="text-sm font-bold">{interviewCoins}</p>
              </div>
            </div>
          </header>

          <div className="p-5 sm:p-8">
            <div className="mx-auto max-w-7xl">
              {/* Overview */}
              {activeTab === "Overview" && (
                <>
                  <div className="mb-8">
                    <p className="mb-1 text-sm text-gray-400">
                      Good to see you back 👋
                    </p>

                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      Welcome, {firstName}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                      Continue your journey from failure to success.
                    </p>
                  </div>

                  {/* Stats Cards */}
                  <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      {
                        title: "Interview Coins",
                        value: interviewCoins,
                        icon: Coins,
                      },
                      {
                        title: "Interviews",
                        value: "—",
                        icon: Video,
                      },
                      {
                        title: "Resume Score",
                        value: resumeData?.score ?? "—",
                        icon: FileText,
                      },
                      {
                        title: "Career Progress",
                        value: "—",
                        icon: TrendingUp,
                      },
                    ].map(({ title, value, icon: Icon }) => (
                      <div
                        key={title}
                        className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-gray-400">
                              {title}
                            </p>

                            <h3 className="mt-2 text-2xl font-bold transition group-hover:text-violet-700">
                              {value}
                            </h3>
                          </div>

                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 transition group-hover:bg-violet-100 group-hover:text-violet-700">
                            <Icon size={19} className="text-black" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Hero Card */}
                  <div className="group mb-6 overflow-hidden rounded-2xl bg-gray-100 p-7 text-gray-900 transition hover:shadow-2xl sm:p-9">
                    <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                      <BriefcaseBusiness size={15} className="text-black" />
                      AI POWERED
                    </div>

                    <h2 className="text-2xl font-bold sm:text-3xl">
                      Ready for your next interview?
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                      Practice interviews, analyze your resume, and improve
                      your career profile with Fail7Fly.AI.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("AI Interview")}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-violet-100 active:scale-95"
                    >
                      Start AI Interview
                      <ArrowRight size={16} className="text-black" />
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => navigate("Resume Analyzer")}
                      className="group rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 transition group-hover:bg-violet-100 group-hover:text-violet-700">
                        <UploadCloud size={20} className="text-black" />
                      </div>

                      <h3 className="mt-4 font-semibold">
                        Resume Analyzer
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Upload your PDF resume and get AI-powered feedback.
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                        Analyze Resume
                        <ArrowRight size={16} className="text-black" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("Resume Builder")}
                      className="group rounded-2xl border border-gray-200 bg-white p-6 text-left transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 transition group-hover:bg-violet-100 group-hover:text-violet-700">
                        <FileText size={20} className="text-black" />
                      </div>

                      <h3 className="mt-4 font-semibold">
                        Resume Builder
                      </h3>

                      <p className="mt-2 text-sm text-gray-500">
                        Create and improve your professional resume.
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                        Build Resume
                        <ArrowRight size={16} className="text-black" />
                      </span>
                    </button>
                  </div>
                </>
              )}

              {/* AI Interview */}
              {activeTab === "AI Interview" && (
                <div className="mx-auto max-w-5xl">
                  <h1 className="text-3xl font-bold">AI Interview</h1>

                  <p className="mt-2 text-sm text-gray-500">
                    Practice technical and HR interviews with AI.
                  </p>

                  <div className="mt-7 rounded-2xl bg-gray-100 p-8 text-gray-900 sm:p-12">
                    <BriefcaseBusiness size={28} className="text-black" />

                    <h2 className="mt-5 text-2xl font-bold">
                      Ready for your interview?
                    </h2>

                    <p className="mt-3 text-sm text-gray-600">
                      Start a new interview and practice your skills.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("AI Interview")}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-violet-100"
                    >
                      Start Interview
                      <ArrowRight size={16} className="text-black" />
                    </button>
                  </div>
                </div>
              )}

              {/* Resume Analyzer */}
              {activeTab === "Resume Analyzer" && (
                <Scorer
                  user={user}
                  setUser={setUser}
                  onBuildResume={(result) => {
                    setResumeData(result);
                    setActiveTab("Resume Builder");
                  }}
                />
              )}

              {/* Resume Builder */}
              {activeTab === "Resume Builder" && (
                <div className="mx-auto max-w-5xl">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-400">
                        Career Tools
                      </p>

                      <h1 className="mt-1 text-3xl font-bold">
                        Resume Builder
                      </h1>

                      <p className="mt-2 text-sm text-gray-500">
                        Create and improve your professional resume.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate("Resume Analyzer")}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:border-violet-200 hover:bg-violet-50"
                    >
                      Back to Analyzer
                    </button>
                  </div>

                  <ResumeBuilder
                    resumeData={resumeData}
                    onBack={() => navigate("Resume Analyzer")}
                  />

                  {!resumeData && (
                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">
                      You can open the builder directly. To transfer AI
                      analysis results, analyze a PDF first.
                    </div>
                  )}
                </div>
              )}

              {/* Career Roadmap */}
              {activeTab === "Career Roadmap" && (
                <TechnicalCareerRoadmap />
              )}

              {/* Resources */}
              {activeTab === "Resources" && (
                <TechnicalResources />
              )}

              {/* Profile */}
              {activeTab === "Profile" && (
                <div className="mx-auto max-w-4xl">
                  <p className="text-sm text-gray-400">Account</p>

                  <h1 className="mt-1 text-3xl font-bold">Profile</h1>

                  <div className="mt-7 rounded-2xl border border-gray-200 bg-white p-7">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                        {firstName.charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-semibold">{firstName}</h2>

                        <p className="break-all text-sm text-gray-500">
                          {user?.email || "No email available"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-7 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-400">Name</p>
                        <p className="mt-2 font-medium">{firstName}</p>
                      </div>

                      <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-xs text-gray-400">
                          Interview Coins
                        </p>

                        <p className="mt-2 font-medium">
                          {interviewCoins}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;