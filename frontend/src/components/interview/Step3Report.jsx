
export default function Step3Report({
    report,
    interview,
    onRestart,
    onBack,
}) {
    const data = report?.data || report || interview?.data || interview || {};
    const questions = data.questions || [];
    const score = Number(data.overallScore);
    const hasScore =
        data.overallScore !== undefined &&
        data.overallScore !== null &&
        Number.isFinite(score);

    const answeredCount = questions.filter(
        (question) => question.userAnswer?.trim()
    ).length;

    const getScoreLabel = (value) => {
        if (value >= 85) return "Excellent";
        if (value >= 70) return "Good";
        if (value >= 50) return "Keep Practicing";
        return "Needs Improvement";
    };

    const getScoreColor = (value) => {
        if (value >= 70) return "text-emerald-600";
        if (value >= 50) return "text-amber-600";
        return "text-red-600";
    };

    const renderList = (items, emptyMessage) => {
        if (!Array.isArray(items) || items.length === 0) {
            return <p className="text-sm text-gray-500">{emptyMessage}</p>;
        }

        return (
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={`${index}-${item}`} className="flex gap-3 text-sm text-gray-700">
                        <span className="mt-1 text-violet-600">•</span>
                        <span>{typeof item === "string" ? item : JSON.stringify(item)}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold text-violet-600">
                    INTERVIEW REPORT
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Interview completed!
                </h1>

                <p className="mt-3 text-gray-500">
                    Review your performance and identify areas to improve.
                </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Interview role</p>
                        <h2 className="mt-1 text-2xl font-bold text-gray-900">
                            {data.role || "Interview"}
                        </h2>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                                {data.type === "hr" ? "HR Interview" : "Technical Interview"}
                            </span>

                            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold capitalize text-gray-700">
                                {data.status || "completed"}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-5 text-center sm:min-w-40">
                        <p className="text-sm text-gray-500">Overall score</p>

                        <p
                            className={`mt-1 text-4xl font-bold ${hasScore ? getScoreColor(score) : "text-gray-400"
                                }`}
                        >
                            {hasScore ? `${score}/100` : "N/A"}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                            {hasScore
                                ? getScoreLabel(score)
                                : "Score not available yet"}
                        </p>
                    </div>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Total questions</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {questions.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Answered</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {answeredCount}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 p-5">
                        <p className="text-sm text-gray-500">Unanswered</p>
                        <p className="mt-2 text-2xl font-bold text-gray-900">
                            {Math.max(0, questions.length - answeredCount)}
                        </p>
                    </div>
                </div>

                <section className="mt-8">
                    <h3 className="mb-3 text-lg font-bold text-gray-900">
                        Interview summary
                    </h3>

                    <div className="rounded-2xl bg-gray-50 p-5 leading-7 text-gray-700">
                        {data.summary ||
                            "A detailed AI-generated summary is not available yet. Connect the summary agent to the interview completion flow to generate one."}
                    </div>
                </section>

                <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <section className="rounded-2xl border border-gray-200 p-5">
                        <h3 className="mb-4 font-bold text-gray-900">Strengths</h3>
                        {renderList(
                            data.strengths,
                            "AI-generated strengths are not available yet."
                        )}
                    </section>

                    <section className="rounded-2xl border border-gray-200 p-5">
                        <h3 className="mb-4 font-bold text-gray-900">Areas to improve</h3>
                        {renderList(
                            data.weaknesses,
                            "AI-generated improvement areas are not available yet."
                        )}
                    </section>
                </div>

                <section className="mt-5 rounded-2xl border border-gray-200 p-5">
                    <h3 className="mb-4 font-bold text-gray-900">
                        Recommendations
                    </h3>

                    {renderList(
                        data.recommendations,
                        "Recommendations will appear after the AI summary integration is completed."
                    )}
                </section>

                <section className="mt-8">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                        Your answers
                    </h3>

                    {questions.length === 0 ? (
                        <p className="rounded-2xl bg-gray-50 p-5 text-sm text-gray-500">
                            No question details were included in the report.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {questions.map((question, index) => (
                                <article
                                    key={question._id || index}
                                    className="rounded-2xl border border-gray-200 p-5"
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                                            Question {index + 1}
                                        </p>

                                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-600">
                                            {question.difficulty || "General"}
                                        </span>
                                    </div>

                                    <h4 className="mt-3 font-semibold leading-7 text-gray-900">
                                        {question.question}
                                    </h4>

                                    <p className="mt-3 text-sm font-medium text-gray-500">
                                        Your answer
                                    </p>

                                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                        {question.userAnswer?.trim() ||
                                            "No answer recorded."}
                                    </p>

                                    {question.feedback &&
                                        typeof question.feedback.feedback === "string" &&
                                        question.feedback.feedback.trim() && (
                                            <div className="mt-4 rounded-xl bg-violet-50 p-4">
                                                <p className="text-sm font-semibold text-violet-900">
                                                    Feedback
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-violet-800">
                                                    {question.feedback.feedback}
                                                </p>

                                                {Number.isFinite(Number(question.feedback.score)) && (
                                                    <p className="mt-2 text-sm font-semibold text-violet-900">
                                                        Question score: {question.feedback.score}/100
                                                    </p>
                                                )}

                                                {renderList(
                                                    question.feedback.improvements,
                                                    ""
                                                )}
                                            </div>
                                        )}
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={onRestart}
                        className="rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
                    >
                        Start New Interview →
                    </button>
                </div>
            </div>
        </div>
    );
}
