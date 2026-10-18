import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, LoaderCircle, Map, Target } from "lucide-react";
import { getCareerPaths } from "../apis/roadmap.api.js";

export default function TechnicalCareerRoadmap() {
    const [careerPaths, setCareerPaths] = useState([]);
    const [selectedPathId, setSelectedPathId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        getCareerPaths()
            .then((paths) => {
                if (isMounted) {
                    setCareerPaths(paths);
                    setSelectedPathId(paths[0]?.id ?? "");
                }
            })
            .catch((requestError) => {
                if (isMounted) {
                    setError(
                        requestError?.response?.data?.message ||
                        requestError.message ||
                        "Unable to load career roadmaps."
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

    const selectedPath = careerPaths.find(
        (path) => path.id === selectedPathId
    ) ?? careerPaths[0];

    if (loading) {
        return (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-gray-500">
                <LoaderCircle size={20} className="animate-spin text-black" />
                Loading technical career roadmaps...
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

    if (!careerPaths.length || !selectedPath) {
        return (
            <div role="status" className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
                No technical career roadmaps are available yet.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm text-gray-400">Career development</p>
                    <h1 className="mt-1 text-3xl font-bold">Technical Career Roadmaps</h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                        Choose a technical role to see a practical learning path, portfolio
                        projects, and resources. Learn in order and build as you go.
                    </p>
                </div>

                <label className="w-full sm:max-w-xs">
                    <span className="mb-2 block text-sm font-semibold">Choose a career path</span>
                    <select
                        value={selectedPathId}
                        onChange={(event) => setSelectedPathId(event.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    >
                        {careerPaths.map((path) => (
                            <option key={path.id} value={path.id}>{path.title}</option>
                        ))}
                    </select>
                </label>
            </div>

            <section className="rounded-2xl bg-gray-100 p-6 text-gray-900 sm:p-8">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10">
                        <Map size={23} className="text-black" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Selected path
                        </p>
                        <h2 className="mt-1 text-2xl font-bold">{selectedPath.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-600">{selectedPath.summary}</p>
                    </div>
                </div>
                <p className="mt-5 flex items-center gap-2 text-sm text-gray-600">
                    <Target size={16} className="text-black" />
                    Finish each stage by completing its portfolio project.
                </p>
            </section>

            <ol className="mt-6 space-y-4">
                {selectedPath.stages.map((stage, index) => (
                    <li key={stage.title} className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex items-start gap-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm font-bold text-violet-700">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold">{stage.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-gray-600">{stage.topics}</p>
                                <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-700">
                                    <CheckCircle2 size={17} className="mt-1 shrink-0 text-black" />
                                    <span><strong>Build:</strong> {stage.project}</span>
                                </div>
                            </div>
                            {index < selectedPath.stages.length - 1 && (
                                <ArrowRight size={17} className="mt-3 hidden shrink-0 text-black sm:block" />
                            )}
                        </div>
                    </li>
                ))}
            </ol>

        </div>
    );
}
