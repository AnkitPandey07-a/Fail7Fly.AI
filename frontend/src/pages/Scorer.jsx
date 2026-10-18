
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Upload,
    FileText,
    FileSearch,
    AlertCircle,
    CheckCircle2,
    X,
    Target,
    BriefcaseBusiness,
    ArrowRight,
    LoaderCircle,
    ShieldCheck,
    RotateCcw,
    Lightbulb,
    UserRound,
    ThumbsUp,
    ShieldAlert,
    Coins,
} from "lucide-react";

const GATEWAY_URL = "http://localhost:8000";

const JOB_ROLES = [
    "MERN Stack Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "React.js Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Software Engineer",
    "Python Developer",
    "Java Developer",
    "AI/ML Engineer",
    "Data Analyst",
    "DevOps Engineer",
    "Other",
];

function normalizeList(...values) {
    const value = values.find((item) => {
        if (Array.isArray(item)) return item.length > 0;
        if (typeof item === "string") return item.trim().length > 0;
        return item != null;
    });

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === "string") {
                    return item.trim();
                }

                if (item && typeof item === "object") {
                    return String(
                        item.description ||
                        item.title ||
                        item.name ||
                        item.skill ||
                        ""
                    ).trim();
                }

                return "";
            })
            .filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(/\n|•/)
            .map((item) =>
                item.replace(/^[-*\d.)\s]+/, "").trim()
            )
            .filter(Boolean);
    }

    return [];
}

function displayItem(item) {
    if (typeof item === "string") return item;

    if (item && typeof item === "object") {
        return (
            item.description ||
            item.title ||
            item.name ||
            item.skill ||
            JSON.stringify(item)
        );
    }

    return String(item ?? "");
}

function SectionCard({ children }) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            {children}
        </section>
    );
}

function InsightSection({
    title,
    subtitle,
    items = [],
    icon: Icon,
    iconClass = "",
    itemClass = "",
    itemIcon: ItemIcon = CheckCircle2,
    itemIconClass = "",
    emptyText = "No suggestions available.",
}) {
    return (
        <SectionCard>
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
                >
                    <Icon size={18} />
                </div>

                <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-xs text-gray-500">
                        {subtitle}
                    </p>
                </div>
            </div>

            {items.length > 0 ? (
                <ul className="mt-4 space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={`${title}-${index}`}
                            className={`flex items-start gap-2 rounded-lg p-3 text-sm leading-6 text-gray-700 ${itemClass}`}
                        >
                            <ItemIcon
                                size={16}
                                className={`mt-1 shrink-0 ${itemIconClass}`}
                            />
                            <span>{displayItem(item)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="mt-4 text-sm leading-6 text-gray-500">
                    {emptyText}
                </p>
            )}
        </SectionCard>
    );
}

export default function Scorer({ onBuildResume, setUser, user }) {
    const fileInput = useRef(null);

    const [resume, setResume] = useState(null);
    const [selectedRole, setSelectedRole] = useState(
        "MERN Stack Developer"
    );
    const [jobRole, setJobRole] = useState(
        "MERN Stack Developer"
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    function handleFileChange(event) {
        const file = event.target.files?.[0];

        setError("");
        setResult(null);

        if (!file) {
            setResume(null);
            return;
        }

        if (
            file.type !== "application/pdf" &&
            !file.name.toLowerCase().endsWith(".pdf")
        ) {
            setResume(null);
            setError("Please select a PDF file.");
            event.target.value = "";
            return;
        }

        if (file.size > 20 * 1024 * 1024) {
            setResume(null);
            setError("PDF size must be less than 20 MB.");
            event.target.value = "";
            return;
        }

        setResume(file);
    }

    function removeResume() {
        setResume(null);
        setResult(null);
        setError("");

        if (fileInput.current) {
            fileInput.current.value = "";
        }
    }

    async function analyzeResume(event) {
        event.preventDefault();

        if (!resume) {
            setError("Please select your PDF resume first.");
            return;
        }

        if (!jobRole.trim()) {
            setError("Please enter your target job role.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const formData = new FormData();
            formData.append("resume", resume);
            formData.append("jobRole", jobRole.trim());

            const response = await fetch(
                `${GATEWAY_URL}/api/resume/upload`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    data.error ||
                    `Resume service returned status ${response.status}.`
                );
            }

            if (
                typeof setUser === "function" &&
                data.interviewCoin != null &&
                Number.isFinite(Number(data.interviewCoin))
            ) {
                setUser((previousUser) =>
                    previousUser
                        ? {
                            ...previousUser,
                            interviewCoin: Number(data.interviewCoin),
                        }
                        : previousUser
                );
            }

            const analysis = data.data?.analysis ?? data.data;

            if (!analysis || typeof analysis !== "object") {
                throw new Error(
                    "The server did not return resume analysis data."
                );
            }

            const rawScore =
                analysis.score ?? analysis.resumeScore;
            const score = Number(rawScore);

            if (
                rawScore == null ||
                !Number.isFinite(score) ||
                score < 0 ||
                score > 100
            ) {
                throw new Error(
                    "Resume was processed, but a valid score was not returned."
                );
            }

            const resultData = {
                ...analysis,
                score,
                jobRole: analysis.jobRole || jobRole.trim(),

                strengths: normalizeList(
                    analysis.strengths,
                    analysis.strongPoints,
                    analysis.keyStrengths,
                    analysis.resumeStrengths
                ),

                weaknesses: normalizeList(
                    analysis.weaknesses,
                    analysis.weakPoints,
                    analysis.areasForImprovement,
                    analysis.improvements,
                    analysis.gaps
                ),

                missingSkills: normalizeList(
                    analysis.missingSkills,
                    analysis.skillsGap
                ),

                recommendations: normalizeList(
                    analysis.recommendations,
                    analysis.suggestions,
                    analysis.tips,
                    analysis.actionItems
                ),

                achievements: normalizeList(
                    analysis.achievements
                ),
            };

            setResult(resultData);
        } catch (err) {
            setError(
                err.message ||
                "Could not connect to the Resume Service."
            );
        } finally {
            setLoading(false);
        }
    }

    function getScoreLabel(score) {
        if (score >= 80) return "Excellent";
        if (score >= 65) return "Good";
        if (score >= 45) return "Needs improvement";
        return "Needs work";
    }

    function getScoreColor(score) {
        if (score >= 80) return "text-emerald-600";
        if (score >= 65) return "text-blue-600";
        if (score >= 45) return "text-amber-600";
        return "text-red-600";
    }

    return (
        <div className="min-h-screen bg-[#fafafa] px-4 py-6 text-[#0a0a0a] sm:px-6 sm:py-8">
            <div className="mx-auto max-w-4xl">
                <motion.header
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-wrap items-start justify-between gap-4"
                >
                    <div>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                <FileSearch size={21} className="text-black" />
                            </div>

                            <div>
                                <h2 className="text-base font-bold">
                                    Fail7Fly.AI
                                </h2>
                                <p className="text-xs text-gray-500">
                                    AI-powered career platform
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                Resume Scorer
                            </h1>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                                AI Analysis
                            </span>
                        </div>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                            Upload your resume to get a personalized score,
                            role-specific skill gaps and actionable suggestions.
                        </p>
                    </div>

                    <div
                        aria-live="polite"
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
                    >
                        <Coins size={18} className="text-black" />
                        <span className="text-sm text-gray-500">Coins</span>
                        <span className="text-lg font-bold tabular-nums">
                            {user?.interviewCoin ?? 0}
                        </span>
                    </div>
                </motion.header>

                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="mb-6 flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                            <FileText size={21} className="text-black" />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold">
                                Analyze your resume
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Upload a PDF and choose your target role.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={analyzeResume}>
                        <label
                            htmlFor="jobRole"
                            className="mb-2 flex items-center gap-2 text-sm font-semibold"
                        >
                            <BriefcaseBusiness size={16} className="text-black" />
                            Target job role
                        </label>

                        <select
                            id="jobRole"
                            value={selectedRole}
                            disabled={loading}
                            onChange={(event) => {
                                const role = event.target.value;
                                setSelectedRole(role);
                                setJobRole(role === "Other" ? "" : role);
                            }}
                            className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-200 disabled:bg-gray-50"
                        >
                            {JOB_ROLES.map((role) => (
                                <option key={role} value={role}>
                                    {role === "Other"
                                        ? "Other (Enter your role)"
                                        : role}
                                </option>
                            ))}
                        </select>

                        {selectedRole === "Other" && (
                            <div className="mt-4">
                                <label
                                    htmlFor="customJobRole"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Enter your job role
                                </label>

                                <input
                                    id="customJobRole"
                                    type="text"
                                    value={jobRole}
                                    onChange={(event) =>
                                        setJobRole(event.target.value)
                                    }
                                    placeholder="e.g. Blockchain Developer"
                                    disabled={loading}
                                    required
                                    className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-gray-200"
                                />
                            </div>
                        )}

                        <div className="mb-2 mt-7 flex items-center justify-between gap-3">
                            <label className="flex items-center gap-2 text-sm font-semibold">
                                <Upload size={16} className="text-black" />
                                Upload your resume
                            </label>
                            <span className="text-xs text-gray-400">
                                PDF · Max 20 MB
                            </span>
                        </div>

                        <input
                            ref={fileInput}
                            type="file"
                            accept=".pdf,application/pdf"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        <AnimatePresence mode="wait">
                            {!resume ? (
                                <motion.button
                                    key="upload"
                                    type="button"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => fileInput.current?.click()}
                                    disabled={loading}
                                    className="group flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 px-5 py-7 transition hover:border-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                                        <Upload size={22} className="text-black" />
                                    </span>
                                    <span className="text-center text-sm font-semibold">
                                        Click to upload your resume
                                    </span>
                                    <span className="mt-2 text-xs text-gray-500">
                                        Select a PDF file from your device
                                    </span>
                                    <span className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-xs font-medium">
                                        Browse files
                                    </span>
                                </motion.button>
                            ) : (
                                <motion.div
                                    key="selected"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4"
                                >
                                    <FileText size={22} className="shrink-0 text-black" />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold">
                                            {resume.name}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {(resume.size / (1024 * 1024)).toFixed(2)} MB · PDF
                                        </p>
                                    </div>

                                    <CheckCircle2
                                        size={19}
                                        className="shrink-0 text-black"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeResume}
                                        disabled={loading}
                                        aria-label="Remove resume"
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-black"
                                    >
                                        <X size={17} className="text-black" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    role="alert"
                                    className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                                >
                                    <AlertCircle size={19} className="mt-0.5 shrink-0 text-black" />
                                    <p>{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={!loading && resume ? { scale: 1.005 } : undefined}
                            whileTap={!loading && resume ? { scale: 0.99 } : undefined}
                            type="submit"
                            disabled={loading || !resume}
                            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-5 text-sm font-semibold text-gray-900 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={18} className="animate-spin text-black" />
                                    Analyzing your resume...
                                </>
                            ) : (
                                <>
                                    <FileSearch size={18} className="text-black" />
                                    Analyze Resume
                                    <ArrowRight size={17} className="text-black" />
                                </>
                            )}
                        </motion.button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                            <ShieldCheck size={15} className="text-black" />
                            Your resume is processed through the configured backend.
                        </div>
                    </form>
                </motion.section>

                <AnimatePresence>
                    {result && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-7 space-y-4"
                        >
                            <SectionCard>
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2
                                            size={20}
                                            className="text-black"
                                        />
                                        <h2 className="font-bold">
                                            Analysis complete
                                        </h2>
                                    </div>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        Successfully analyzed
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-4 sm:grid-cols-[90px_1fr] sm:items-center">
                                    <div className="flex h-[90px] w-[90px] flex-col items-center justify-center rounded-full border-4 border-gray-100">
                                        <span
                                            className={`text-2xl font-bold ${getScoreColor(result.score)}`}
                                        >
                                            {result.score}
                                        </span>
                                        <span className="text-[10px] text-gray-500">
                                            Out of 100
                                        </span>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Resume score
                                        </p>
                                        <h3 className="mt-1 text-xl font-bold">
                                            {getScoreLabel(result.score)}
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {result.name || result.fullName || "Your Resume"}
                                        </p>

                                        <div className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-xs">
                                            <Target size={14} className="text-black" />
                                            <span className="text-gray-500">
                                                Target role:
                                            </span>
                                            <span className="font-semibold">
                                                {result.jobRole}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>

                            {result.summary && (
                                <SectionCard>
                                    <div className="flex items-center gap-3">
                                        <UserRound size={19} className="text-black" />
                                        <h3 className="font-bold">
                                            Resume Summary
                                        </h3>
                                    </div>
                                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                                        {result.summary}
                                    </p>
                                </SectionCard>
                            )}

                            <InsightSection
                                title="Strengths"
                                subtitle="Strong points identified in your resume"
                                items={result.strengths}
                                icon={ThumbsUp}
                                iconClass="bg-gray-100 text-black"
                                itemClass="bg-emerald-50/70"
                                itemIcon={CheckCircle2}
                                itemIconClass="text-black"
                                emptyText="No strengths returned. Check your backend analysis."
                            />

                            <InsightSection
                                title="Weaknesses"
                                subtitle="Areas that may need improvement"
                                items={result.weaknesses}
                                icon={ShieldAlert}
                                iconClass="bg-gray-100 text-black"
                                itemClass="bg-amber-50/70"
                                itemIcon={AlertCircle}
                                itemIconClass="text-black"
                                emptyText="No improvement areas returned."
                            />

                            <InsightSection
                                title="Missing Skills"
                                subtitle="Skills not sufficiently demonstrated for your target role"
                                items={result.missingSkills}
                                icon={Target}
                                iconClass="bg-gray-100 text-black"
                                itemClass="border border-red-100 bg-red-50"
                                itemIcon={AlertCircle}
                                itemIconClass="text-black"
                                emptyText="No skill gaps returned."
                            />

                            <InsightSection
                                title="Recommendations"
                                subtitle="Actionable suggestions based on your resume"
                                items={result.recommendations}
                                icon={Lightbulb}
                                iconClass="bg-gray-100 text-black"
                                itemClass="border border-gray-100 bg-gray-50"
                                itemIcon={CheckCircle2}
                                itemIconClass="text-black"
                                emptyText="No recommendations returned. Check your backend resume agent."
                            />

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setResult(null);
                                        setError("");
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                    }}
                                    className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold hover:bg-gray-50"
                                >
                                    <RotateCcw size={17} className="text-black" />
                                    Analyze again
                                </button>

                                {onBuildResume && (
                                    <button
                                        type="button"
                                        onClick={() => onBuildResume(result)}
                                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-black px-5 text-sm font-semibold text-white hover:bg-gray-800"
                                    >
                                        <FileText size={17} className="text-black" />
                                        Improve Resume
                                        <ArrowRight size={17} className="text-black" />
                                    </button>
                                )}
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                <footer className="py-7 text-center text-xs text-gray-400">
                    Fail7Fly.AI · Build a stronger professional profile
                </footer>
            </div>
        </div>
    );
}
