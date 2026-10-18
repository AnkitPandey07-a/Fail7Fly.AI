
import { useMemo, useState } from "react";
import { Download, FileText, BadgeCheck, CheckCircle2 } from "lucide-react";

const DEFAULT_FORM = {
    name: "",
    email: "",
    phone: "",
    location: "",
    git: "",
    linkedin: "",
    role: "",
    summary: "",
    skills: "",
    education: "",
    experience: "",
    projects: "",
    achievements: "",
};

const SECTIONS = [
    ["summary", "Professional Summary", "Write your professional summary..."],
    ["skills", "Technical Skills", "Category: Skill 1, Skill 2"],
    ["experience", "Professional Experience", "Role, company, dates and responsibilities..."],
    ["projects", "Project Experience", "Project name, description and tech stack..."],
    ["education", "Education", "Degree, university and graduation year..."],
    ["achievements", "Achievements", "Your achievements..."],
];

const toList = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (typeof item === "string") return item.trim();
                if (item && typeof item === "object") {
                    return String(
                        item.description || item.title || item.name || item.skill || ""
                    ).trim();
                }
                return "";
            })
            .filter(Boolean);
    }

    if (typeof value === "string") {
        return value
            .split(/\n|•/)
            .map((item) => item.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
            .filter(Boolean);
    }

    return [];
};

// Skills ko categories mein group karta hai.
// Existing category labels ko preserve karta hai.
const formatSkills = (skills) => {
    if (Array.isArray(skills)) {
        const formatted = skills
            .map((skill) => {
                if (typeof skill === "string") return skill.trim();

                if (skill && typeof skill === "object") {
                    const category = skill.category || skill.name || "";
                    const values = toList(skill.skills || skill.items);

                    if (category && values.length) {
                        return `${category}: ${values.join(", ")}`;
                    }

                    return category || values.join(", ");
                }

                return "";
            })
            .filter(Boolean);

        return groupSkills(formatted.join("\n"));
    }

    if (typeof skills === "string") {
        return groupSkills(skills.trim());
    }

    return "";
};

const SKILL_CATEGORIES = [
    {
        name: "Programming Languages",
        test: /\b(javascript|typescript|python|java|c\+\+|c#|c\b|sql|bash|php|go|rust)\b/i,
    },
    {
        name: "Frontend",
        test: /\b(react(?:\.js)?|next\.js|html|css|tailwind(?: css)?|bootstrap|redux|vite|shadcn|angular|vue(?:\.js)?)\b/i,
    },
    {
        name: "Backend",
        test: /\b(node\.js|express(?:\.js)?|nestjs|fastapi|django|flask|rest(?:ful)? apis?|graphql|websockets|microservices)\b/i,
    },
    {
        name: "Databases & Caching",
        test: /\b(mongodb|postgres(?:ql)?|mysql|sqlite|redis|drizzle orm|prisma|mongoose|chromadb|pgvector|timescaledb)\b/i,
    },
    {
        name: "AI & GenAI",
        test: /\b(langchain|llm?s?|rag|ollama|openai|gemini|mistral|hugging ?face|prompt engineering|ai agent orchestration|whisper|pytorch|tensorflow|machine learning|computer vision)\b/i,
    },
    {
        name: "DevOps & Tools",
        test: /\b(git|github|linux|docker|kubernetes|aws|vercel|render|nginx|github actions|ci\/cd|postman|vs code|mongodb compass|jira|figma|notion|agile methodologies|team collaboration|leadership)\b/i,
    },
];

function groupSkills(value) {
    const lines = String(value || "")
        .split(/\n/)
        .map((line) => line.trim().replace(/^[•*-]\s*/, ""))
        .filter(Boolean);

    if (!lines.length) return "";

    // Already categorized skills ko as-is rakho.
    if (lines.some((line) => /^[^:]{2,45}:\s*.+/.test(line))) {
        return lines.join("\n");
    }

    const allSkills = lines
        .flatMap((line) => line.split(/[,;|]/))
        .map((skill) => skill.trim())
        .filter(Boolean);

    const groups = new Map();
    const unknown = [];

    allSkills.forEach((skill) => {
        const category = SKILL_CATEGORIES.find(({ test }) => test.test(skill));

        if (!category) {
            unknown.push(skill);
            return;
        }

        if (!groups.has(category.name)) groups.set(category.name, []);
        if (!groups.get(category.name).includes(skill)) {
            groups.get(category.name).push(skill);
        }
    });

    const result = [];

    SKILL_CATEGORIES.forEach(({ name }) => {
        if (groups.has(name)) {
            result.push(`${name}: ${groups.get(name).join(", ")}`);
        }
    });

    if (unknown.length) {
        result.push(`Other Skills: ${[...new Set(unknown)].join(", ")}`);
    }

    return result.join("\n");
}

const formatProjects = (projects) => {
    if (typeof projects === "string") return projects.trim();
    if (!Array.isArray(projects)) return "";

    return projects
        .map((project) => {
            if (typeof project === "string") return project.trim();
            if (!project || typeof project !== "object") return "";

            const technologies = toList(
                project.technologies || project.techStack || project.tech_stack
            );

            return [
                project.name || project.title || "",
                project.description || "",
                technologies.length ? `Tech Stack: ${technologies.join(", ")}` : "",
            ]
                .filter(Boolean)
                .join("\n");
        })
        .filter(Boolean)
        .join("\n\n");
};

const formatEducation = (education) => {
    if (typeof education === "string") return education.trim();
    if (!Array.isArray(education)) return "";

    return education
        .map((item) => {
            if (typeof item === "string") return item.trim();
            if (!item || typeof item !== "object") return "";

            const years = [item.startYear || item.start_year, item.endYear || item.end_year]
                .filter(Boolean)
                .join(" – ");

            return [
                [item.degree, item.field].filter(Boolean).join(" in "),
                [item.institution || item.university, item.location].filter(Boolean).join(" | "),
                years,
                item.cgpa != null ? `CGPA: ${item.cgpa}` : "",
                item.percentage != null ? `Percentage: ${item.percentage}%` : "",
                toList(item.coursework).length
                    ? `Coursework: ${toList(item.coursework).join(", ")}`
                    : "",
            ]
                .filter(Boolean)
                .join("\n");
        })
        .filter(Boolean)
        .join("\n\n");
};

const formatExperience = (experience) => {
    if (typeof experience === "string") return experience.trim();
    if (!Array.isArray(experience)) return "";

    return experience
        .map((item) => {
            if (typeof item === "string") return item.trim();
            if (!item || typeof item !== "object") return "";

            const dates = [
                item.startDate || item.start_date,
                item.endDate || item.end_date || (item.current ? "Present" : ""),
            ]
                .filter(Boolean)
                .join(" – ");

            return [
                [item.title || item.role || item.position, item.company, dates]
                    .filter(Boolean)
                    .join(" | "),
                item.description || "",
                ...toList(item.responsibilities),
            ]
                .filter(Boolean)
                .join("\n");
        })
        .filter(Boolean)
        .join("\n\n");
};

const formatAchievements = (achievements) => {
    if (typeof achievements === "string") return achievements.trim();
    return toList(achievements).join("\n");
};

const getAnalysisData = (resumeData) => {
    if (!resumeData || typeof resumeData !== "object") return {};

    const candidates = [
        resumeData?.data?.analysis,
        resumeData?.analysis,
        resumeData?.data?.result,
        resumeData?.result,
        resumeData?.data,
        resumeData,
    ];

    return (
        candidates.find(
            (item) =>
                item &&
                typeof item === "object" &&
                !Array.isArray(item) &&
                [
                    "name",
                    "email",
                    "skills",
                    "education",
                    "projects",
                    "summary",
                    "achievements",
                ].some((key) => item[key] !== undefined)
        ) ||
        candidates.find(
            (item) => item && typeof item === "object" && !Array.isArray(item)
        ) ||
        {}
    );
};

const getLines = (text) =>
    String(text || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/^[•*-]\s*/, ""));

// Category label bold; skills compact and readable.
function PrintableSkills({ value }) {
    const lines = getLines(value);

    return (
        <ul className="resume-bullets resume-skills">
            {lines.map((line, index) => {
                const separator = line.indexOf(":");

                if (separator > 0) {
                    return (
                        <li key={index}>
                            <strong>{line.slice(0, separator + 1)}</strong>
                            {" " + line.slice(separator + 1).trim()}
                        </li>
                    );
                }

                return <li key={index}>{line}</li>;
            })}
        </ul>
    );
}

function PrintableEntries({ value, sectionKey }) {
    const entries = String(value || "")
        .split(/\n\s*\n/)
        .map((entry) => entry.trim())
        .filter(Boolean);

    const normalizedEntries = entries.length
        ? entries
        : [String(value || "").trim()].filter(Boolean);

    return (
        <div className="resume-entries">
            {normalizedEntries.map((entry, index) => {
                const lines = getLines(entry);
                if (!lines.length) return null;

                return (
                    <div
                        className="resume-entry"
                        key={`${sectionKey}-${index}`}
                    >
                        {lines.map((line, lineIndex) => {
                            const techMatch = line.match(
                                /^(Tech Stack|Technologies|Coursework|CGPA|Percentage):\s*(.*)$/i
                            );

                            if (techMatch) {
                                return (
                                    <p className="resume-entry-line" key={lineIndex}>
                                        <strong>{techMatch[1]}:</strong> {techMatch[2]}
                                    </p>
                                );
                            }

                            if (lineIndex === 0) {
                                return (
                                    <p className="resume-entry-title" key={lineIndex}>
                                        {line}
                                    </p>
                                );
                            }

                            return (
                                <p
                                    className="resume-entry-line resume-bullet-line"
                                    key={lineIndex}
                                >
                                    {line}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

function PrintableSection({ sectionKey, label, value }) {
    if (!String(value || "").trim()) return null;

    return (
        <section className="resume-section">
            <h2>{label}</h2>

            {sectionKey === "summary" ? (
                <p className="resume-summary">{value.trim()}</p>
            ) : sectionKey === "skills" ? (
                <PrintableSkills value={value} />
            ) : sectionKey === "achievements" ? (
                <ul className="resume-bullets">
                    {getLines(value).map((line, index) => (
                        <li key={index}>{line}</li>
                    ))}
                </ul>
            ) : (
                <PrintableEntries value={value} sectionKey={sectionKey} />
            )}
        </section>
    );
}

function InsightSection({ title, description, items }) {
    return (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mb-3 mt-1 text-xs text-gray-500">{description}</p>

            {items.length > 0 ? (
                <ul className="space-y-2">
                    {items.map((item, index) => (
                        <li
                            key={`${title}-${index}`}
                            className="flex gap-2 text-sm leading-5 text-gray-700"
                        >
                            <span className="text-gray-400">•</span>
                            <span className="break-words">{item}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-gray-400">
                    No suggestions available for this section.
                </p>
            )}
        </section>
    );
}

export default function ResumeBuilder({ resumeData }) {
    const analysisData = useMemo(
        () => (resumeData ? getAnalysisData(resumeData) : null),
        [resumeData]
    );
    const ai = useMemo(() => {
        const data = analysisData ?? {};

        return {
            strengths: toList(data.strengths),
            weaknesses: toList(data.weaknesses),
            missingSkills: toList(data.missingSkills || data.missing_skills),
            recommendations: toList(data.recommendations),
            suggestedRole:
                data.suggestedRole ||
                data.suggested_role ||
                data.jobRole ||
                "",
        };
    }, [analysisData]);

    const resumeForm = useMemo(() => {
        const next = { ...DEFAULT_FORM };

        if (!analysisData) return next;

        const data = analysisData;
        const fillIfEmpty = (field, value) => {
            if (typeof value === "string" && value.trim()) {
                next[field] = value.trim();
            }
        };

        fillIfEmpty("name", data.name || data.fullName);
        fillIfEmpty("email", data.email);
        fillIfEmpty("phone", data.phone || data.phoneNumber);
        fillIfEmpty("location", data.location);
        fillIfEmpty("git", data.git || data.github || data.githubUrl);
        fillIfEmpty("linkedin", data.linkedin || data.linkedinUrl);
        fillIfEmpty("role", data.jobRole || data.suggestedRole || data.suggested_role);
        fillIfEmpty("summary", data.summary || data.professionalSummary);
        fillIfEmpty("skills", formatSkills(data.skills));
        fillIfEmpty("projects", formatProjects(data.projects));
        fillIfEmpty("education", formatEducation(data.education));
        fillIfEmpty("experience", formatExperience(data.experience));
        fillIfEmpty("achievements", formatAchievements(data.achievements));

        return next;
    }, [analysisData]);

    const [formOverrides, setFormOverrides] = useState({});
    const form = { ...resumeForm, ...formOverrides };
    const [notice, setNotice] = useState("");

    const updateField = (field, value) => {
        setFormOverrides((previous) => ({ ...previous, [field]: value }));
        setNotice("");
    };

    const fields = [
        ["name", "Full Name", "Your full name"],
        ["email", "Email", "you@example.com"],
        ["phone", "Phone", "+91 XXXXX XXXXX"],
        ["location", "Location", "City, Country"],
        ["git", "GitHub URL", "https://github.com/username"],
        ["linkedin", "LinkedIn URL", "https://linkedin.com/in/username"],
        ["role", "Target Role", "MERN Stack Developer"],
    ];

    const inputClass =
        "mt-1 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

    const cleanUrl = (value) =>
        String(value || "")
            .trim()
            .replace(/^https?:\/\//i, "")
            .replace(/\/$/, "");

    const applySuggestedRole = () => {
        if (!ai.suggestedRole) return;
        updateField("role", ai.suggestedRole);
        setNotice("AI-suggested role applied.");
    };

    const addMissingSkillsToDraft = () => {
        if (!ai.missingSkills.length) return;

        const reviewText = [
            "Skills to review and learn:",
            ...ai.missingSkills.map((skill) => `• ${skill}`),
        ].join("\n");

        updateField(
            "achievements",
            [form.achievements.trim(), reviewText].filter(Boolean).join("\n\n")
        );

        setNotice(
            "Review list added. Remove it before applying if it does not belong in your resume."
        );
    };

    const handleDownload = () => {
        window.print();
    };

    return (
        <>
            {/* Print-only resume */}
            <article className="resume-print-root">
                <header className="resume-header">
                    {form.name.trim() && <h1>{form.name}</h1>}

                    {form.role.trim() && (
                        <p className="resume-job-title">{form.role}</p>
                    )}

                    <p className="resume-contact">
                        {[form.location, form.email, form.phone].filter(Boolean).join(" | ")}
                    </p>

                    <p className="resume-contact">
                        {[form.linkedin, form.git].filter(Boolean).map(cleanUrl).join(" | ")}
                    </p>
                </header>

                {SECTIONS.map(([key, label]) => (
                    <PrintableSection
                        key={key}
                        sectionKey={key}
                        label={label}
                        value={form[key]}
                    />
                ))}
            </article>

            {/* Normal application UI */}
            <div className="resume-editor mx-auto w-full min-w-0 max-w-7xl space-y-5">
                <section className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                    <div className="mb-4 flex items-center gap-2">
                        <BadgeCheck size={18} className="shrink-0 text-black" />
                        <div>
                            <h2 className="text-sm font-semibold">AI Resume Suggestions</h2>
                            <p className="text-xs text-gray-500">
                                Insights from your uploaded resume analysis
                            </p>
                        </div>
                    </div>

                    {ai.suggestedRole && (
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-3">
                            <div>
                                <p className="text-xs text-gray-500">Suggested job role</p>
                                <p className="text-sm font-semibold">{ai.suggestedRole}</p>
                            </div>
                            <button
                                type="button"
                                onClick={applySuggestedRole}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-900 hover:bg-gray-100"
                            >
                                Use Suggested Role
                            </button>
                        </div>
                    )}

                    {notice && (
                        <p role="status" className="mb-3 flex items-start gap-2 text-xs text-blue-700">
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-black" />
                            {notice}
                        </p>
                    )}

                    <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                        <InsightSection
                            title="Strengths"
                            description="Strong points identified in your resume"
                            items={ai.strengths}
                        />
                        <InsightSection
                            title="Weaknesses"
                            description="Areas that may need improvement"
                            items={ai.weaknesses}
                        />
                        <InsightSection
                            title="Missing Skills"
                            description="Skills gaps for your target role"
                            items={ai.missingSkills}
                        />
                        <InsightSection
                            title="Recommendations"
                            description="Actionable suggestions from your AI agent"
                            items={ai.recommendations}
                        />
                    </div>

                    {ai.missingSkills.length > 0 && (
                        <button
                            type="button"
                            onClick={addMissingSkillsToDraft}
                            className="mt-3 rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium hover:bg-gray-50"
                        >
                            Add Skills Review List
                        </button>
                    )}
                </section>

                <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-5">
                    {/* Editable form */}
                    <form
                        onSubmit={(event) => event.preventDefault()}
                        className="min-w-0 space-y-4 lg:col-span-3"
                    >
                        <section className="rounded-xl border border-gray-200 bg-white p-4">
                            <div className="mb-3 flex items-center gap-2">
                                <FileText size={18} className="text-black" />
                                <h2 className="text-sm font-semibold text-gray-900">
                                    Personal Information
                                </h2>
                            </div>

                            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                                {fields.map(([key, label, placeholder]) => (
                                    <label
                                        key={key}
                                        className="min-w-0 text-xs font-medium text-gray-700"
                                    >
                                        {label}
                                        <input
                                            type="text"
                                            value={form[key]}
                                            onChange={(event) => updateField(key, event.target.value)}
                                            placeholder={placeholder}
                                            autoComplete="off"
                                            className={inputClass}
                                        />
                                    </label>
                                ))}
                            </div>
                        </section>

                        {SECTIONS.map(([key, label, placeholder]) => (
                            <section
                                key={key}
                                className="min-w-0 rounded-xl border border-gray-200 bg-white p-4"
                            >
                                <label className="block text-sm font-semibold text-gray-900">
                                    {label}
                                    <textarea
                                        rows={key === "summary" ? 4 : 5}
                                        value={form[key]}
                                        onChange={(event) => updateField(key, event.target.value)}
                                        placeholder={placeholder}
                                        className={`${inputClass} resize-y font-normal`}
                                    />
                                </label>

                                {key === "skills" && (
                                    <p className="mt-2 text-xs text-gray-500">
                                        Tip: Use one category per line, for example:
                                        {" "}Frontend: React, Next.js
                                        {" "}and Backend: Node.js, Express.js.
                                    </p>
                                )}
                            </section>
                        ))}

                        <button
                            type="button"
                            onClick={handleDownload}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                        >
                            <Download size={16} className="text-black" />
                            Download Resume (PDF)
                        </button>

                        <p className="text-xs text-gray-500">
                            Print dialog mein destination “Save as PDF” choose karo.
                            Apply karne se pehle details verify kar lena.
                        </p>
                    </form>

                    {/* Responsive live preview */}
                    <aside className="min-w-0 w-full lg:sticky lg:top-5 lg:col-span-2">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-gray-900">
                                Live Preview
                            </h2>
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                                Live
                            </span>
                        </div>

                        <div className="w-full min-w-0 overflow-hidden border border-gray-200 bg-white shadow-sm">
                            <div
                                className="resume-live-page w-full min-w-0 px-4 py-6 text-gray-900 sm:px-6"
                                style={{
                                    fontFamily: "Arial, Helvetica, sans-serif",
                                    fontSize: "10px",
                                    lineHeight: 1.45,
                                    overflowWrap: "anywhere",
                                    wordBreak: "normal",
                                }}
                            >
                                <header className="mb-4 text-center">
                                    <h1 className="mb-1 break-words text-xl font-bold uppercase tracking-wide text-gray-950">
                                        {form.name || "Your Name"}
                                    </h1>

                                    {form.role && (
                                        <p className="mb-1 break-words text-xs font-semibold text-gray-800">
                                            {form.role}
                                        </p>
                                    )}

                                    <p className="break-words text-[9px] leading-5 text-gray-700">
                                        {[form.location, form.email, form.phone]
                                            .filter((item) => item?.trim())
                                            .join(" | ")}
                                    </p>

                                    <p className="break-words text-[9px] leading-5 text-gray-700">
                                        {[form.linkedin, form.git]
                                            .filter((item) => item?.trim())
                                            .map(cleanUrl)
                                            .join(" | ")}
                                    </p>
                                </header>

                                <div className="space-y-3">
                                    {SECTIONS.map(([key, label]) => {
                                        const value = form[key]?.trim();
                                        if (!value) return null;

                                        return (
                                            <section key={key} className="resume-section min-w-0">
                                                <h2 className="mb-1 border-b border-gray-500 pb-1 text-[10px] font-bold uppercase tracking-wide text-gray-950">
                                                    {label}
                                                </h2>

                                                {key === "summary" ? (
                                                    <p className="whitespace-pre-wrap text-[10px] leading-[1.5] text-gray-800">
                                                        {value}
                                                    </p>
                                                ) : key === "skills" ? (
                                                    <PrintableSkills value={value} />
                                                ) : key === "achievements" ? (
                                                    <ul className="resume-bullets">
                                                        {getLines(value).map((line, index) => (
                                                            <li key={index}>{line}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <PrintableEntries value={value} sectionKey={key} />
                                                )}
                                            </section>
                                        );
                                    })}
                                </div>

                                {!form.name &&
                                    !form.role &&
                                    !SECTIONS.some(([key]) => form[key]?.trim()) && (
                                        <p className="py-10 text-center text-xs text-gray-400">
                                            Fill in your resume details to see your preview here.
                                        </p>
                                    )}
                            </div>
                        </div>

                        <p className="mt-3 text-center text-xs text-gray-400">
                            Preview updates automatically as you edit the form.
                        </p>
                    </aside>
                </div>
            </div>
        </>
    );
}
