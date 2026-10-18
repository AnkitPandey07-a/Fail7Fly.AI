
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    MessageSquareText,
    BriefcaseBusiness,
    CheckCircle2,
    Code2,
    LoaderCircle,
    MessageSquare,
    ClipboardCheck,
    FileText,
    AlertCircle,
} from "lucide-react";

// Use the existing Axios instance configured for port 8000.
import api from "../utils/axios.js";

export default function InterviewStart({ user }) {
    const navigate = useNavigate();

    // Store the user's interview setup choices.
    const [role, setRole] = useState("");
    const [type, setType] = useState("technical");
    const [useResume, setUseResume] = useState(false);

    // Manage loading and error messages.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Start a new interview by calling the backend.
    const handleStartInterview = async (event) => {
        event.preventDefault();
        setError("");

        // Validate the required role field.
        if (!role.trim()) {
            setError("Please enter the job role you want to prepare for.");
            return;
        }

        setLoading(true);

        try {
            // The main backend should expose this route on port 8000.
            const response = await api.post("/api/interview/start", {
                role: role.trim(),
                type,
                useResume,
            });

            // Support common API response formats.
            const payload = response?.data?.data ?? response?.data ?? {};
            const interview = payload.interview ?? payload;

            // Ensure the backend returned an interview ID.
            const interviewId = interview?._id ?? interview?.id;

            if (!interviewId) {
                throw new Error(
                    "The backend did not return an interview ID. Check the /api/interview/start response."
                );
            }

            // If the backend already generated questions, make sure they exist.
            if (
                Array.isArray(interview.questions) &&
                interview.questions.length === 0
            ) {
                throw new Error(
                    "No interview questions were generated. Please check your backend question-generation logic."
                );
            }

            // Save the interview ID for the active interview page.
            // The active page can load the complete interview using this ID.
            navigate("/interview", {
                state: {
                    interviewId,
                    interview,
                    role: role.trim(),
                    type,
                    useResume,
                },
            });
        } catch (err) {
            // Show the backend's message when available.
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to start the interview. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    {/* Return to the dashboard */}
                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-violet-700"
                    >
                        <ArrowLeft size={18} className="text-black" />
                        Dashboard
                    </button>

                    {/* Application branding */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                            <BriefcaseBusiness size={19} className="text-black" />
                        </div>

                        <span className="font-bold">
                            Fail7Fly<span className="text-violet-600">.AI</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                {/* Page title */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-900">
                        <ClipboardCheck size={14} className="text-black" />
                        AI-POWERED INTERVIEW PRACTICE
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Prepare for your next interview
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Select your target role, choose the interview type, and practice
                        with AI-generated questions and feedback.
                    </p>
                </div>

                {/* Display validation or backend errors */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle size={19} className="mt-0.5 shrink-0 text-black" />
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    {/* Interview setup form */}
                    <form
                        onSubmit={handleStartInterview}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
                    >
                        <h2 className="text-xl font-bold">Interview setup</h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Customize your practice session before getting started.
                        </p>

                        {/* Target job role */}
                        <div className="mt-7">
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Target job role
                            </label>

                            <div className="relative">
                                <BriefcaseBusiness
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    id="role"
                                    type="text"
                                    value={role}
                                    onChange={(event) => setRole(event.target.value)}
                                    placeholder="e.g. MERN Stack Developer"
                                    maxLength={100}
                                    required
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                />
                            </div>
                        </div>

                        {/* Interview type selection */}
                        <div className="mt-7">
                            <p className="mb-3 text-sm font-semibold">Interview type</p>

                            <div className="grid gap-3 sm:grid-cols-2">
                                {/* Technical interview option */}
                                <button
                                    type="button"
                                    aria-pressed={type === "technical"}
                                    onClick={() => setType("technical")}
                                    className={`rounded-xl border p-4 text-left transition ${type === "technical"
                                            ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                                            : "border-slate-200 hover:border-violet-300"
                                        }`}
                                >
                                    <Code2
                                        size={23}
                                        className={
                                            type === "technical"
                                                ? "text-black"
                                                : "text-black"
                                        }
                                    />

                                    <p className="mt-3 font-semibold">Technical</p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Programming, technical concepts, and problem-solving.
                                    </p>

                                    {type === "technical" && (
                                        <CheckCircle2
                                            size={17}
                                            className="mt-3 text-black"
                                        />
                                    )}
                                </button>

                                {/* HR interview option */}
                                <button
                                    type="button"
                                    aria-pressed={type === "hr"}
                                    onClick={() => setType("hr")}
                                    className={`rounded-xl border p-4 text-left transition ${type === "hr"
                                            ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                                            : "border-slate-200 hover:border-violet-300"
                                        }`}
                                >
                                    <MessageSquare
                                        size={23}
                                        className={
                                            type === "hr" ? "text-black" : "text-black"
                                        }
                                    />

                                    <p className="mt-3 font-semibold">HR Interview</p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Communication, teamwork, and behavioral questions.
                                    </p>

                                    {type === "hr" && (
                                        <CheckCircle2 size={17} className="mt-3 text-black" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Resume-based personalization option */}
                        <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-violet-300">
                            <input
                                type="checkbox"
                                checked={useResume}
                                onChange={(event) => setUseResume(event.target.checked)}
                                className="mt-1 h-4 w-4 accent-violet-600"
                            />

                            <span>
                                <span className="flex items-center gap-2 text-sm font-semibold">
                                    <FileText size={17} className="text-black" />
                                    Personalize using my resume
                                </span>

                                <span className="mt-1 block text-xs leading-5 text-slate-500">
                                    Generate questions based on your skills, projects, and
                                    experience. Your backend must retrieve your saved resume.
                                </span>
                            </span>
                        </label>

                        {/* Submit the setup form */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={18} className="animate-spin text-black" />
                                    Generating interview...
                                </>
                            ) : (
                                <>
                                    Start Interview
                                    <ArrowRight size={18} className="text-black" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Informational sidebar */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl bg-gray-100 p-6 text-gray-900">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white">
                                <ClipboardCheck size={21} className="text-black" />
                            </span>

                            <h2 className="mt-4 text-lg font-bold">Practice with purpose</h2>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Prepare for interviews in a structured way and understand
                                where you can improve.
                            </p>
                        </div>

                        {/* Feature 1 */}
                        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                <MessageSquare size={19} className="text-black" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Question by question</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Focus on one question at a time.
                                </p>
                            </div>
                        </div>

                        {/* Feature 2 */}
                        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                <MessageSquareText size={19} className="text-black" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">AI feedback</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Review your answers and identify areas to improve.
                                </p>
                            </div>
                        </div>

                        {/* Feature 3 */}
                        <div className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                <CheckCircle2 size={19} className="text-black" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Performance report</p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Track your strengths and improvement areas.
                                </p>
                            </div>
                        </div>

                        {/* Show the logged-in user when available */}
                        {user?.name && (
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <p className="text-xs text-slate-500">Practice session for</p>
                                <p className="mt-1 text-sm font-semibold">{user.name}</p>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}
