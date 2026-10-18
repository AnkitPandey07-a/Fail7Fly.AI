
import { useState } from "react";

export default function Step1setup({
    onNext,
    onBack,
    initialData = {},
}) {
    const [role, setRole] = useState(initialData.role || "");
    const [type, setType] = useState(initialData.type || "technical");
    const [useResume, setUseResume] = useState(
        initialData.useResume ?? false
    );
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!role.trim()) {
            setError("Please enter the job role.");
            return;
        }

        if (role.trim().length > 200) {
            setError("Job role must be 200 characters or fewer.");
            return;
        }

        setError("");
        onNext?.({
            role: role.trim(),
            type,
            useResume,
        });
    };

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-violet-600">
                    STEP 01 / SETUP
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Set up your interview
                </h1>
                <p className="mt-3 text-gray-500">
                    Customize your practice session according to your target job.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-7 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
            >
                <div>
                    <label
                        htmlFor="interview-role"
                        className="mb-2 block text-sm font-semibold text-gray-800"
                    >
                        Job role
                    </label>

                    <input
                        id="interview-role"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. MERN Stack Developer"
                        maxLength={200}
                        required
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    />

                    <p className="mt-2 text-xs text-gray-400">
                        Enter the position you are preparing for.
                    </p>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold text-gray-800">
                        Interview type
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() => setType("technical")}
                            aria-pressed={type === "technical"}
                            className={`rounded-2xl border p-5 text-left transition ${type === "technical"
                                    ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-xl">
                                {"</>"}
                            </span>

                            <span className="block font-semibold text-gray-900">
                                Technical Interview
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-gray-500">
                                Practice programming, concepts, problem-solving and
                                technical questions.
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setType("hr")}
                            aria-pressed={type === "hr"}
                            className={`rounded-2xl border p-5 text-left transition ${type === "hr"
                                    ? "border-violet-500 bg-violet-50 ring-2 ring-violet-100"
                                    : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-xl">
                                ☎
                            </span>

                            <span className="block font-semibold text-gray-900">
                                HR Interview
                            </span>
                            <span className="mt-2 block text-sm leading-6 text-gray-500">
                                Practice introductions, behavioral questions and
                                career-related discussions.
                            </span>
                        </button>
                    </div>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 p-4 transition hover:bg-gray-50">
                    <input
                        type="checkbox"
                        checked={useResume}
                        onChange={(e) => setUseResume(e.target.checked)}
                        className="mt-1 h-4 w-4 accent-violet-600"
                    />

                    <span>
                        <span className="block font-semibold text-gray-900">
                            Personalize using my resume
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-gray-500">
                            Generate questions based on your resume, if it is uploaded
                            and supported by the backend.
                        </span>
                    </span>
                </label>

                {useResume && (
                    <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                        Make sure your resume is available to the backend. Resume
                        personalization will not work until the backend passes the
                        resume text to the AI agent.
                    </p>
                )}

                {error && (
                    <p role="alert" className="text-sm font-medium text-red-600">
                        {error}
                    </p>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-xl border border-gray-200 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Back
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
                    >
                        Start Interview →
                    </button>
                </div>
            </form>
        </div>
    );
}
