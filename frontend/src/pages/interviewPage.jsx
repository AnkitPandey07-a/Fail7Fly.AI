
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    BriefcaseBusiness,
    MessageSquareText,
    CheckCircle2,
    Clock3,
    Code2,
    LoaderCircle,
    MessageSquare,
    RotateCcw,
    Send,
    ClipboardCheck,
    Trophy,
    UserRound,
    AlertCircle,
} from "lucide-react";
import interviewApi from "../utils/axios.js";

const INITIAL_FORM = {
    role: "",
    type: "technical",
    useResume: false,
};

function getPayload(response) {
    return response?.data?.data ?? response?.data ?? {};
}

function getErrorMessage(error) {
    return (
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again."
    );
}

export default function Interview() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialInterview = location.state?.interview;
    const hasInitialInterview =
        Boolean(initialInterview?._id ?? initialInterview?.id) &&
        Array.isArray(initialInterview?.questions) &&
        initialInterview.questions.length > 0;

    const [step, setStep] = useState(hasInitialInterview ? "interview" : "setup");
    const [form, setForm] = useState({
        ...INITIAL_FORM,
        role: location.state?.role ?? INITIAL_FORM.role,
        type: location.state?.type ?? INITIAL_FORM.type,
        useResume: location.state?.useResume ?? INITIAL_FORM.useResume,
    });
    const [interview, setInterview] = useState(
        hasInitialInterview ? initialInterview : null
    );
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [interviewer, setInterviewer] = useState("female");

    const questions = interview?.questions ?? [];
    const currentIndex = Number(interview?.currentQuestion ?? 0);
    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const progress =
        totalQuestions > 0
            ? Math.min(((currentIndex + 1) / totalQuestions) * 100, 100)
            : 0;

    const updateForm = (key, value) => {
        setForm((previous) => ({ ...previous, [key]: value }));
    };

    // Step 1: Create an interview
    const startInterview = async (event) => {
        event.preventDefault();
        setError("");

        if (!form.role.trim()) {
            setError("Please enter the job role you are preparing for.");
            return;
        }

        setLoading(true);

        try {
            const response = await interviewApi.post("/api/interview/start", {
                role: form.role.trim(),
                type: form.type,
                useResume: form.useResume,
            });

            const data = getPayload(response);
            const createdInterview = data.interview ?? data;

            if (!createdInterview?._id && !createdInterview?.id) {
                throw new Error(
                    "Interview ID missing in the API response. Check your backend controller."
                );
            }

            if (!Array.isArray(createdInterview.questions)) {
                throw new Error(
                    "Questions were not returned by the backend. Check the /start response."
                );
            }

            setInterview(createdInterview);
            setAnswer("");
            setFeedback(null);
            setReport(null);

            if (createdInterview.questions.length === 0) {
                throw new Error("No questions were generated for this interview.");
            }

            setStep("interview");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Submit an answer and receive feedback
    const submitAnswer = async (event) => {
        event.preventDefault();
        setError("");

        if (!answer.trim()) {
            setError("Please write your answer before submitting.");
            return;
        }

        const interviewId = interview?._id ?? interview?.id;

        if (!interviewId || !currentQuestion) {
            setError("Interview or question is missing. Please start again.");
            return;
        }

        setLoading(true);

        try {
            const response = await interviewApi.post(
                `/api/interview/${interviewId}/answer`,
                {
                    answer: answer.trim(),
                    questionIndex: currentIndex,
                }
            );

            const data = getPayload(response);
            const updatedInterview = data.interview ?? data;

            // Support APIs that return the updated interview document.
            if (Array.isArray(updatedInterview.questions)) {
                setInterview(updatedInterview);
            } else {
                // Support APIs that return only the feedback/result.
                const newQuestions = [...questions];
                newQuestions[currentIndex] = {
                    ...newQuestions[currentIndex],
                    userAnswer: answer.trim(),
                    feedback: data.feedback ?? newQuestions[currentIndex].feedback,
                };

                const nextIndex =
                    typeof data.currentQuestion === "number"
                        ? data.currentQuestion
                        : currentIndex + 1;

                setInterview((previous) => ({
                    ...previous,
                    questions: newQuestions,
                    currentQuestion: nextIndex,
                    status: data.status ?? previous.status,
                }));
            }

            const receivedFeedback =
                data.feedback ??
                updatedInterview.questions?.[currentIndex]?.feedback ??
                null;

            setFeedback(receivedFeedback);
            setAnswer("");

            const completed =
                data.completed === true ||
                data.status === "completed" ||
                updatedInterview.status === "completed" ||
                currentIndex >= totalQuestions - 1;

            if (completed) {
                setReport(data.report ?? data.summary ?? null);
                setStep("report");
            } else {
                // Show feedback before moving to the next question.
                setStep("feedback");
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const nextQuestion = () => {
        setFeedback(null);
        setError("");
        setStep("interview");
    };

    const restartSetup = () => {
        setStep("setup");
        setForm(INITIAL_FORM);
        setInterview(null);
        setAnswer("");
        setFeedback(null);
        setReport(null);
        setError("");
    };

    const score =
        report?.overallScore ??
        report?.overall_score ??
        interview?.overallScore;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <button
                        type="button"
                        onClick={() =>
                            step === "setup"
                                ? navigate("/dashboard")
                                : navigate("/dashboard")
                        }
                        className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-gray-900"
                    >
                        <ArrowLeft size={18} className="text-black" />
                        Dashboard
                    </button>

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
                {/* Page heading */}
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-900">
                        <ClipboardCheck size={14} className="text-black" />
                        AI-POWERED INTERVIEW PRACTICE
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        {step === "setup" && "Prepare for your next interview"}
                        {step === "interview" && "Your interview"}
                        {step === "feedback" && "Answer feedback"}
                        {step === "report" && "Interview completed"}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                        {step === "setup" &&
                            "Choose your interview type and target role to begin your practice session."}
                        {step === "interview" &&
                            "Take your time, think clearly, and submit your best answer."}
                        {step === "feedback" &&
                            "Review your feedback before moving to the next question."}
                        {step === "report" &&
                            "Review your results and use the feedback to improve your next attempt."}
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle size={19} className="mt-0.5 shrink-0 text-black" />
                        <p>{error}</p>
                    </div>
                )}

                {/* Setup */}
                {step === "setup" && (
                    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                        <form
                            onSubmit={startInterview}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
                        >
                            <h2 className="text-xl font-bold">Interview setup</h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Customize your session before generating questions.
                            </p>

                            <div className="mt-7">
                                <label
                                    htmlFor="role"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Target job role
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        id="role"
                                        value={form.role}
                                        onChange={(event) =>
                                            updateForm("role", event.target.value)
                                        }
                                        placeholder="e.g. MERN Stack Developer"
                                        maxLength={100}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-7">
                                <p className="mb-3 text-sm font-semibold">Interview type</p>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => updateForm("type", "technical")}
                                        className={`rounded-xl border p-4 text-left transition ${form.type === "technical"
                                            ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                                            : "border-slate-200 hover:border-violet-300"
                                            }`}
                                    >
                                        <Code2
                                            size={22}
                                            className={
                                                "text-black"
                                            }
                                        />

                                        <p className="mt-3 font-semibold">Technical</p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Programming, concepts and problem-solving questions.
                                        </p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => updateForm("type", "hr")}
                                        className={`rounded-xl border p-4 text-left transition ${form.type === "hr"
                                            ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                                            : "border-slate-200 hover:border-violet-300"
                                            }`}
                                    >
                                        <MessageSquare
                                            size={22}
                                            className={
                                                "text-black"
                                            }
                                        />

                                        <p className="mt-3 font-semibold">HR Interview</p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Communication, teamwork and behavioral questions.
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                                <input
                                    type="checkbox"
                                    checked={form.useResume}
                                    onChange={(event) =>
                                        updateForm("useResume", event.target.checked)
                                    }
                                    className="mt-1 h-4 w-4 accent-violet-600"
                                />

                                <span>
                                    <span className="block text-sm font-semibold">
                                        Personalize using my resume
                                    </span>

                                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                                        Request resume-based questions. Your backend must fetch
                                        the user's resume for this option to work.
                                    </span>
                                </span>
                            </label>

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

                        {/* Info card */}
                        <aside className="space-y-4">
                            <div className="rounded-2xl bg-gray-100 p-6 text-gray-900">
                                <ClipboardCheck size={25} className="text-black" />

                                <h3 className="mt-4 text-lg font-bold">
                                    Practice with purpose
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Answer questions, review feedback and identify areas where
                                    you can improve.
                                </p>
                            </div>

                            {[
                                {
                                    icon: MessageSquare,
                                    title: "Question-by-question",
                                    description: "Focus on one question at a time.",
                                },
                                {
                                    icon: Clock3,
                                    title: "Think before answering",
                                    description: "Organize your thoughts clearly.",
                                },
                                {
                                    icon: Trophy,
                                    title: "Review your progress",
                                    description: "Use the feedback to prepare better.",
                                },
                            ].map(({ icon: Icon, title, description }) => (
                                <div
                                    key={title}
                                    className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4"
                                >
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                        <Icon size={19} className="text-black" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold">{title}</p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </aside>
                    </div>
                )}

                {/* Interview question */}
                {step === "interview" && currentQuestion && (
                    <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.5fr)]">
                        <aside className="space-y-4">
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="relative aspect-video bg-gray-100">
                                    <video
                                        key={interviewer}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        aria-label={`${interviewer === "female" ? "Female" : "Male"} interview host`}
                                        className="h-full w-full object-cover"
                                    >
                                        <source
                                            src={`/interviewers/${interviewer}-ai.mp4`}
                                            type="video/mp4"
                                        />
                                    </video>
                                    <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-gray-900">
                                        Interview host
                                    </span>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="font-semibold">Choose your interviewer</p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                Switch the on-screen host at any time.
                                            </p>
                                        </div>
                                        <UserRound size={19} className="shrink-0 text-black" />
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-2">
                                        {[
                                            { id: "female", label: "Aarushi" },
                                            { id: "male", label: "Arjun" },
                                        ].map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                aria-pressed={interviewer === option.id}
                                                onClick={() => setInterviewer(option.id)}
                                                className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                                                    interviewer === option.id
                                                        ? "border-black bg-gray-100 text-gray-900"
                                                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                                }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-900">
                                    U
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold">Your answer</p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Type your response in the answer box.
                                    </p>
                                </div>
                            </section>
                        </aside>

                        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {form.role} · {form.type === "hr" ? "HR" : "Technical"}
                                    </p>
                                    <h1 className="mt-1 text-xl font-bold">Interview in progress</h1>
                                </div>
                                <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-semibold capitalize text-gray-900">
                                    {currentQuestion.difficulty || "Practice"}
                                </span>
                            </div>

                            <div className="mt-6 flex items-center justify-between text-sm">
                                <span className="font-medium text-slate-600">
                                    Question {Math.min(currentIndex + 1, totalQuestions)} of {totalQuestions}
                                </span>
                                <span className="font-semibold text-gray-900">{Math.round(progress)}%</span>
                            </div>
                            <div
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={Math.round(progress)}
                                className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
                            >
                                <div
                                    className="h-full rounded-full bg-gray-900 transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="mt-6 rounded-xl bg-gray-50 p-4 sm:p-5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    <MessageSquareText size={16} className="text-black" />
                                    Interview question
                                </div>
                                <h2 className="mt-3 text-lg font-semibold leading-7 sm:text-xl">
                                    {currentQuestion.question}
                                </h2>
                            </div>

                            <form onSubmit={submitAnswer} className="mt-6">
                                <div className="flex items-center justify-between gap-3">
                                    <label htmlFor="answer" className="text-sm font-semibold">
                                        Your answer
                                    </label>
                                    <span className="text-xs text-slate-400">
                                        {answer.length}/10000
                                    </span>
                                </div>
                                <textarea
                                    id="answer"
                                    value={answer}
                                    onChange={(event) => setAnswer(event.target.value)}
                                    placeholder="Write your answer here..."
                                    rows={8}
                                    maxLength={10000}
                                    className="mt-2 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-6 outline-none transition focus:border-gray-500 focus:ring-4 focus:ring-gray-100"
                                    required
                                />

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <button
                                        type="button"
                                        onClick={restartSetup}
                                        disabled={loading}
                                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        <RotateCcw size={16} className="text-black" />
                                        Restart
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loading || !answer.trim()}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderCircle size={17} className="animate-spin text-black" />
                                                Evaluating...
                                            </>
                                        ) : (
                                            <>
                                                Submit Answer
                                                <Send size={16} className="text-black" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                )}

                {/* Feedback */}
                {step === "feedback" && (
                    <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                                <CheckCircle2 size={24} className="text-black" />
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">Answer evaluated</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Review the feedback before continuing.
                                </p>
                            </div>
                        </div>

                        {feedback ? (
                            <div className="mt-7 space-y-5">
                                {typeof feedback === "string" ? (
                                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                                        {feedback}
                                    </p>
                                ) : (
                                    <>
                                        {feedback.score != null && (
                                            <div className="rounded-xl bg-violet-50 p-4">
                                                <p className="text-sm text-violet-700">
                                                    Answer score
                                                </p>

                                                <p className="mt-1 text-3xl font-bold text-violet-900">
                                                    {feedback.score}/100
                                                </p>
                                            </div>
                                        )}

                                        {feedback.feedback && (
                                            <div>
                                                <h3 className="font-semibold">Feedback</h3>
                                                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                                    {feedback.feedback}
                                                </p>
                                            </div>
                                        )}

                                        {Array.isArray(feedback.improvements) &&
                                            feedback.improvements.length > 0 && (
                                                <div>
                                                    <h3 className="font-semibold">
                                                        Areas to improve
                                                    </h3>

                                                    <ul className="mt-3 space-y-2">
                                                        {feedback.improvements.map((item, index) => (
                                                            <li
                                                                key={`${index}-${item}`}
                                                                className="flex gap-2 text-sm leading-6 text-slate-600"
                                                            >
                                                                <ArrowRight
                                                                    size={16}
                                                                    className="mt-1 shrink-0 text-black"
                                                                />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {[
                                                "correctness",
                                                "clarity",
                                                "relevance",
                                                "communication",
                                            ]
                                                .filter((key) => feedback[key] != null)
                                                .map((key) => (
                                                    <div
                                                        key={key}
                                                        className="rounded-xl border border-slate-200 p-4"
                                                    >
                                                        <p className="text-xs capitalize text-slate-500">
                                                            {key.replace(/([A-Z])/g, " $1")}
                                                        </p>

                                                        <p className="mt-1 text-xl font-bold">
                                                            {feedback[key]}/100
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <p className="mt-6 text-sm leading-6 text-slate-500">
                                The answer was submitted, but the backend did not return
                                feedback in the expected response format.
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={() => {
                                if (currentIndex >= totalQuestions) {
                                    setStep("report");
                                } else {
                                    nextQuestion();
                                }
                            }}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                        >
                            Continue
                            <ArrowRight size={18} className="text-black" />
                        </button>
                    </div>
                )}

                {/* Final report */}
                {step === "report" && (
                    <div className="mx-auto max-w-4xl">
                        <div className="rounded-2xl bg-gray-100 p-7 text-gray-900 sm:p-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
                                <Trophy size={28} className="text-black" />
                            </div>

                            <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
                                Great work completing your practice!
                            </h2>

                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                Review your report and keep practicing to improve your
                                interview performance.
                            </p>

                            {score != null && (
                                <div className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white/10 px-5 py-4">
                                    <div>
                                        <p className="text-xs text-slate-300">
                                            Overall score
                                        </p>

                                        <p className="mt-1 text-3xl font-bold">
                                            {score}
                                            <span className="text-base text-slate-300">/100</span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
                            <h3 className="text-lg font-bold">Interview summary</h3>

                            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                                {report?.summary ??
                                    report?.message ??
                                    interview?.summary ??
                                    "Your interview answers have been submitted. If the final AI summary is missing, verify that your backend returns the summary report."}
                            </p>

                            {[
                                {
                                    title: "Strengths",
                                    items: report?.strengths ?? interview?.strengths,
                                },
                                {
                                    title: "Areas to improve",
                                    items: report?.weaknesses ?? interview?.weaknesses,
                                },
                                {
                                    title: "Recommendations",
                                    items:
                                        report?.recommendations ?? interview?.recommendations,
                                },
                            ].map(({ title, items }) => (
                                <div key={title} className="mt-7">
                                    <h4 className="font-semibold">{title}</h4>

                                    {Array.isArray(items) && items.length > 0 ? (
                                        <ul className="mt-3 space-y-2">
                                            {items.map((item, index) => (
                                                <li
                                                    key={`${title}-${index}`}
                                                    className="flex gap-2 text-sm leading-6 text-slate-600"
                                                >
                                                    <CheckCircle2
                                                        size={17}
                                                        className="mt-1 shrink-0 text-black"
                                                    />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="mt-2 text-sm text-slate-400">
                                            Not provided by the backend.
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div className="mt-8 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={restartSetup}
                                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-200"
                                >
                                    <RotateCcw size={16} className="text-black" />
                                    Practice Again
                                </button>

                                <button
                                    type="button"
                                    onClick={() => navigate("/dashboard")}
                                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold transition hover:bg-slate-50"
                                >
                                    Back to Dashboard
                                    <ArrowRight size={16} className="text-black" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
