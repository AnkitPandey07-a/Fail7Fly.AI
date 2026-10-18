
import { useState } from "react";
import api from "../../utils/axios.js";

export default function Step2Interview({
    interview,
    onComplete,
    onBack,
}) {
    const interviewData = interview?.data || interview;
    const questions = interviewData?.questions || [];
    const interviewId = interviewData?._id || interviewData?.id;

    const [currentIndex, setCurrentIndex] = useState(
        interviewData?.currentQuestion || 0
    );
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const currentQuestion = questions[currentIndex];
    const totalQuestions = questions.length;
    const progress =
        totalQuestions > 0
            ? ((currentIndex + 1) / totalQuestions) * 100
            : 0;

    const getErrorMessage = (err) =>
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!interviewId) {
            setError("Interview ID is missing. Please restart the interview.");
            return;
        }

        if (!currentQuestion) {
            setError("No question is available at this step.");
            return;
        }

        if (!answer.trim()) {
            setError("Please enter your answer before continuing.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await api.post(`/api/interview/${interviewId}/answer`, {
                answer: answer.trim(),
                questionIndex: currentIndex,
            });

            const isLastQuestion = currentIndex === totalQuestions - 1;

            if (isLastQuestion) {
                const response = await api.post(
                    `/api/interview/${interviewId}/complete`
                );

                onComplete?.(response.data?.data || interviewData);
                return;
            }

            setCurrentIndex((previous) => previous + 1);
            setAnswer("");
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (!totalQuestions) {
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-white p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                    No interview questions found
                </h2>
                <p className="mt-2 text-gray-500">
                    Please return to setup and generate the questions again.
                </p>
                <button
                    type="button"
                    onClick={onBack}
                    className="mt-6 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
                >
                    Back to Setup
                </button>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-700">The current question is unavailable.</p>
                <button
                    type="button"
                    onClick={() => {
                        setCurrentIndex(0);
                        setAnswer("");
                        setError("");
                    }}
                    className="mt-4 rounded-xl bg-violet-600 px-5 py-3 text-white"
                >
                    Restart Questions
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-violet-600">
                        LIVE INTERVIEW
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {interviewData?.role || "Interview Session"}
                    </h1>
                </div>

                <span className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700">
                    {interviewData?.type === "hr" ? "HR Interview" : "Technical Interview"}
                </span>
            </div>

            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-600">
                        Question {currentIndex + 1} of {totalQuestions}
                    </span>
                    <span className="font-semibold text-violet-700">
                        {Math.round(progress)}% completed
                    </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full bg-violet-600 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
            >
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase text-blue-700">
                        {currentQuestion.difficulty || "Question"}
                    </span>

                    {currentQuestion.timer > 0 && (
                        <span className="text-sm text-gray-500">
                            Suggested time: {Math.ceil(currentQuestion.timer / 60)} min
                        </span>
                    )}
                </div>

                <h2 className="text-xl font-semibold leading-8 text-gray-900 sm:text-2xl">
                    {currentQuestion.question}
                </h2>

                <label
                    htmlFor="interview-answer"
                    className="mb-2 mt-8 block text-sm font-semibold text-gray-800"
                >
                    Your answer
                </label>

                <textarea
                    id="interview-answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Explain your answer clearly. Include examples where relevant..."
                    rows={8}
                    required
                    className="w-full resize-y rounded-2xl border border-gray-200 bg-gray-50 p-4 text-gray-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />

                <p className="mt-2 text-xs text-gray-400">
                    Your answer is saved before moving to the next question.
                </p>

                {error && (
                    <p
                        role="alert"
                        className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className="rounded-xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Exit Interview
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Saving..."
                            : currentIndex === totalQuestions - 1
                                ? "Finish Interview"
                                : "Save & Next →"}
                    </button>
                </div>
            </form>
        </div>
    );
}
