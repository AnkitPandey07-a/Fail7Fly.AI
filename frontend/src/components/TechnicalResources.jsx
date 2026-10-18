import { useEffect, useState } from "react";
import { AlertCircle, ArrowUpRight, BookOpen, LoaderCircle, PlayCircle } from "lucide-react";
import { getCareerResources } from "../apis/resources.api.js";

export default function TechnicalResources() {
    const [careerResources, setCareerResources] = useState([]);
    const [selectedPathId, setSelectedPathId] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getCareerResources()
            .then((resources) => {
                if (isMounted) setCareerResources(resources);
            })
            .catch((requestError) => {
                if (isMounted) {
                    setError(
                        requestError?.response?.data?.message ||
                        requestError.message ||
                        "Unable to load learning resources."
                    );
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const paths = selectedPathId === "all"
        ? careerResources
        : careerResources.filter((path) => path.careerId === selectedPathId);

    if (loading) {
        return (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-gray-500">
                <LoaderCircle size={20} className="animate-spin text-black" />
                Loading technical learning resources...
            </div>
        );
    }

    if (error) {
        return (
            <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={19} className="mt-0.5 shrink-0 text-black" />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm text-gray-400">Keep learning</p>
                    <h1 className="mt-1 text-3xl font-bold">Technical Learning Resources</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                        Curated YouTube searches, official documentation, and practice
                        platforms for each career path.
                    </p>
                </div>
                <label className="w-full sm:max-w-xs">
                    <span className="mb-2 block text-sm font-semibold">Filter by career</span>
                    <select
                        value={selectedPathId}
                        onChange={(event) => setSelectedPathId(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    >
                        <option value="all">All technical careers</option>
                        {careerResources.map((path) => (
                            <option key={path.careerId} value={path.careerId}>{path.careerTitle}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mt-7 space-y-6">
                {paths.map((path) => (
                    <section key={path.careerId} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-black">
                                <BookOpen size={20} className="text-black" />
                            </div>
                            <div>
                                <h2 className="font-bold">{path.careerTitle}</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-500">{path.careerSummary}</p>
                            </div>
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {path.resources.map((resource) => {
                                const isVideo = resource.kind === "YouTube";
                                const Icon = isVideo ? PlayCircle : ArrowUpRight;
                                return (
                                    <a
                                        key={resource.title}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition hover:border-violet-200 hover:bg-violet-50"
                                    >
                                        <Icon size={19} className="shrink-0 text-black" />
                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold">{resource.title}</span>
                                            <span className="mt-1 block text-xs text-gray-500">{resource.kind} · Opens in a new tab</span>
                                        </span>
                                        <ArrowUpRight size={15} className="shrink-0 text-black" />
                                    </a>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
