
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    CheckCircle2,
    CircleAlert,
    LoaderCircle,
    RotateCcw,
    ClipboardCheck,
    Trophy,
    TrendingUp,
    Target,
    Lightbulb,
} from "lucide-react";

// Use your existing Axios instance.
// Base URL: http://localhost:8000
import api from "../utils/axios.js";

// Reusable score card for displaying scores.
function ScoreCard({ title, score, icon: Icon }) {
    const validScore = Number.isFinite(Number(score))
        ? Math.min(100, Math.max(0, Number(score)))
        : null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">{title}</p>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <Icon size={20} className="text-black" />
                </div>
            </div>

            <p className="mt-4 text-3xl font-bold text-slate-900">
                {validScore === null ? "—" : `${validScore}/100`}
            </p>

            {/* Visual representation of the score. */}
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-violet-600 transition-all"
                    style={{ width: `${validScore ?? 0}%` }}
                />
            </div>
        </div>
    );
}

// Reusable list for strengths, weaknesses and recommendations.
function ReportList({ title, items, icon: Icon }) {
    const list = Array.isArray(items) ? items : [];

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <Icon size={20} className="text-black" />
                </div>

                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            </div>

            {list.length > 0 ? (
                <ul className="mt-5 space-y-3">
                    {list.map((item, index) => (
                        <li
                            key={`${title}-${index}`}
                            className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                        >
                            <CheckCircle2
                                size={17}
                                className="mt-1 shrink-0 text-black"
                            />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm text-slate-400">
                    No information was provided by the backend.
                </p>
            )}
        </section>
    );
}

// Main Interview Report page.
export default function InterviewReport() {
    const navigate = useNavigate();
    const { interviewId } = useParams();

    // Store the interview report returned by the backend.
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch the completed interview using its ID from the URL.
    useEffect(() => {
        let isMounted = true;

        async function fetchReport() {
            if (!interviewId) {
                setError("Interview ID is missing from the URL.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                // GET http://localhost:8000/api/interview/:interviewId
                const response = await api.get(`/api/interview/${interviewId}`);

                // Support common API response structures.
                const payload = response?.data?.data ?? response?.data ?? {};
                const reportData = payload.interview ?? payload;

                if (isMounted) {
                    setInterview(reportData);
                }
            } catch (err) {
                if (isMounted) {
                    setError(
                        err?.response?.data?.message ||
                        err?.message ||
                        "Unable to load your interview report."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchReport();

        // Prevent state updates if the page unmounts.
        return () => {
            isMounted = false;
        };
    }, [interviewId]);

    // Display a loading state while fetching the report.
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex items-center gap-3 text-slate-600">
                    <LoaderCircle className="animate-spin" size={24} />
                    <span>Loading your interview report...</span>
                </div>
            </div>
        );
    }

    // Display an error if the API request fails.
    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 shadow-sm">
                    <CircleAlert size={36} className="text-black" />

                    <h1 className="mt-4 text-xl font-bold text-slate-900">
                        Could not load report
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-600">{error}</p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700"
                        >
                            Try Again
                        </button>

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Extract report fields with safe fallbacks.
    const overallScore =
        interview?.overallScore ?? interview?.overall_score;

    const summary =
        interview?.summary ?? interview?.report?.summary;

    const strengths =
        interview?.strengths ?? interview?.report?.strengths ?? [];

    const weaknesses =
        interview?.weaknesses ?? interview?.report?.weaknesses ?? [];

    const recommendations =
        interview?.recommendations ??
        interview?.report?.recommendations ??
        [];

    const questions = Array.isArray(interview?.questions)
        ? interview.questions
        : [];

    // Render the completed interview report.
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Page header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-violet-700"
                    >
                        <ArrowLeft size={18} className="text-black" />
                        Dashboard
                    </button>

                    <div className="flex items-center gap-2 font-bold">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                            <BriefcaseBusiness size={19} className="text-black" />
                        </div>

                        <span>
                            Fail7Fly<span className="text-violet-600">.AI</span>
                        </span>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
                {/* Report introduction */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-900">
                        <ClipboardCheck size={14} className="text-black" />
                        AI INTERVIEW ANALYSIS
                    </div>

                    <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Your Interview Report
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        Review your performance, understand your strengths and identify
                        areas to improve for your next interview.
                    </p>
                </div>

                {/* Highlight card containing the overall score. */}
                <section className="rounded-2xl bg-black p-7 text-white sm:p-10">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                                <Trophy size={25} className="text-black" />
                            </div>

                            <h2 className="mt-5 text-2xl font-bold">
                                Practice session completed
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-300">
                                {interview?.role || "Interview practice"} ·{" "}
                                {interview?.type === "hr" ? "HR Interview" : "Technical Interview"}
                            </p>

                            <p className="mt-2 text-sm text-slate-400">
                                Questions answered:{" "}
                                {
                                    questions.filter((question) =>
                                        question?.userAnswer?.trim()
                                    ).length
                                }{" "}
                                / {questions.length}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/10 p-6 sm:min-w-44">
                            <p className="text-sm text-slate-300">Overall score</p>

                            <p className="mt-2 text-4xl font-bold">
                                {overallScore ?? "—"}
                                <span className="text-lg text-slate-300">/100</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* Summary */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-lg font-bold">Interview summary</h2>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {summary ||
                            "The backend has not provided a summary for this interview yet."}
                    </p>
                </section>

                {/* Score cards */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <ScoreCard
                        title="Overall performance"
                        score={overallScore}
                        icon={Trophy}
                    />

                    <ScoreCard
                        title="Questions answered"
                        score={
                            questions.length > 0
                                ? Math.round(
                                    (questions.filter((question) =>
                                        question?.userAnswer?.trim()
                                    ).length /
                                        questions.length) *
                                    100
                                )
                                : 0
                        }
                        icon={Target}
                    />

                    <ScoreCard
                        title="Feedback received"
                        score={
                            questions.length > 0
                                ? Math.round(
                                    (questions.filter((question) => question?.feedback).length /
                                        questions.length) *
                                    100
                                )
                                : 0
                        }
                        icon={TrendingUp}
                    />
                </div>

                {/* Strengths, weaknesses and recommendations */}
                <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <ReportList
                        title="Your strengths"
                        items={strengths}
                        icon={CheckCircle2}
                    />

                    <ReportList
                        title="Areas to improve"
                        items={weaknesses}
                        icon={Target}
                    />

                    <div className="lg:col-span-2">
                        <ReportList
                            title="Recommendations"
                            items={recommendations}
                            icon={Lightbulb}
                        />
                    </div>
                </div>

                {/* Question-by-question feedback */}
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-xl font-bold">Question-wise review</h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Review your answers and the feedback returned by the AI.
                    </p>

                    {questions.length > 0 ? (
                        <div className="mt-6 space-y-5">
                            {questions.map((question, index) => (
                                <article
                                    key={question?._id ?? index}
                                    className="rounded-xl border border-slate-200 p-5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-700">
                                            Question {index + 1}
                                        </p>

                                        {question?.difficulty && (
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                                                {question.difficulty}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="mt-3 font-semibold leading-7">
                                        {question?.question || "Question text unavailable"}
                                    </h3>

                                    <div className="mt-5">
                                        <p className="text-sm font-semibold">Your answer</p>

                                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                            {question?.userAnswer ||
                                                "No answer was saved for this question."}
                                        </p>
                                    </div>

                                    {/* Feedback can be an object or a plain string. */}
                                    {question?.feedback && (
                                        <div className="mt-5 rounded-xl bg-violet-50 p-4">
                                            <p className="text-sm font-semibold text-violet-900">
                                                AI feedback
                                            </p>

                                            {typeof question.feedback === "string" ? (
                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-violet-900">
                                                    {question.feedback}
                                                </p>
                                            ) : (
                                                <>
                                                    {question.feedback.score != null && (
                                                        <p className="mt-2 text-sm font-semibold text-violet-900">
                                                            Score: {question.feedback.score}/100
                                                        </p>
                                                    )}

                                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-violet-900">
                                                        {question.feedback.feedback ||
                                                            "Feedback details are unavailable."}
                                                    </p>

                                                    {Array.isArray(question.feedback.improvements) &&
                                                        question.feedback.improvements.length > 0 && (
                                                            <ul className="mt-3 space-y-2">
                                                                {question.feedback.improvements.map(
                                                                    (item, improvementIndex) => (
                                                                        <li
                                                                            key={improvementIndex}
                                                                            className="flex items-start gap-2 text-sm leading-6 text-violet-900"
                                                                        >
                                                                            <ArrowRight
                                                                                size={16}
                                                                                className="mt-1 shrink-0 text-black"
                                                                            />
                                                                            <span>{item}</span>
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-5 text-sm text-slate-400">
                            No questions were returned for this interview.
                        </p>
                    )}
                </section>

                {/* Actions at the bottom of the report */}
                <div className="mt-8 flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate("/interview/start")}
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                    >
                        <RotateCcw size={17} className="text-black" />
                        Practice Again
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold transition hover:bg-slate-50"
                    >
                        Back to Dashboard
                        <ArrowRight size={17} className="text-black" />
                    </button>
                </div>
            </main>
        </div>
    );
}
