import { useState } from "react";
import { motion } from "motion/react";

import {
    ArrowRight,
    BookOpen,
    BriefcaseBusiness,
    Check,
    Code2,
    FileText,
    Map,
    MessageSquareText,
    Play,
} from "lucide-react";

import LoginModal from "../components/LoginModal";

function Home({ setUser }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-[#0A0A0A] font-sans">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-black/10 bg-white/75 px-5 backdrop-blur-xl md:px-10"
            >
                <div className="mx-auto flex h-full max-w-7xl items-center justify-between">

                    {/* Logo */}

                    <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                            <BriefcaseBusiness size={17} className="text-black" />
                        </div>

                        <span className="text-base font-extrabold tracking-tight">
                            Fail7Fly
                            <span className="text-gray-400">
                                .AI
                            </span>
                        </span>

                    </div>

                    {/* Desktop Navigation */}

                    <div className="hidden items-center gap-8 text-sm font-medium text-gray-500 md:flex">

                        <a
                            href="#features"
                            className="transition hover:text-black"
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            className="transition hover:text-black"
                        >
                            How It Works
                        </a>

                        <a
                            href="#why-us"
                            className="transition hover:text-black"
                        >
                            Why Fail7Fly
                        </a>

                    </div>

                    {/* Login */}

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setIsLoginOpen(true)}
                        className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-4 py-2 text-xs font-semibold text-black shadow-sm transition hover:bg-gray-100 md:text-sm"
                    >
                        Log In
                        <ArrowRight size={14} className="text-black" />
                    </motion.button>

                </div>
            </motion.nav>


            {/* =====================================================
                HERO
            ===================================================== */}

            <section className="relative overflow-hidden pt-[60px]">

                {/* Background */}

                <div className="pointer-events-none absolute inset-0">

                    <motion.div
                        animate={{
                            x: [0, 60, 0],
                            y: [0, -40, 0],
                        }}
                        transition={{
                            duration: 9,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute left-[5%] top-24 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
                    />

                    <motion.div
                        animate={{
                            x: [0, -50, 0],
                            y: [0, 40, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute right-[5%] top-40 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl"
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

                </div>

                <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 md:px-10 md:pt-28">

                    <div className="grid items-center gap-16 lg:grid-cols-2">

                        {/* LEFT */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                x: -40,
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.7,
                            }}
                        >

                            {/* Badge */}

                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 15,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                transition={{
                                    delay: 0.2,
                                }}
                                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm backdrop-blur"
                            >
                                <BriefcaseBusiness size={13} className="text-black" />

                                AI-Powered Career Platform
                            </motion.div>


                            {/* Heading */}

                            <h1 className="mt-7 text-5xl font-black leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl">

                                Build your career.

                                <br />

                                <span className="text-gray-400">
                                    Prepare with AI.
                                </span>

                            </h1>


                            {/* Description */}

                            <p className="mt-7 max-w-xl text-base leading-7 text-gray-500 md:text-lg">
                                One AI-powered platform to prepare for
                                interviews, build an ATS-friendly resume,
                                and follow a personalized career roadmap.
                            </p>


                            {/* CTA */}

                            <div className="mt-8 flex flex-wrap gap-3">

                                <motion.button
                                    whileHover={{
                                        scale: 1.04,
                                        boxShadow:
                                            "0 15px 35px rgba(0,0,0,0.18)",
                                    }}
                                    whileTap={{
                                        scale: 0.96,
                                    }}
                                    onClick={() =>
                                        setIsLoginOpen(true)
                                    }
                                    className="group flex items-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black"
                                >
                                    Start Your Journey

                                    <ArrowRight
                                        size={11}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </motion.button>

                                <motion.a
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    href="#features"
                                    className="flex items-center gap-2 rounded-lg border border-black/10 bg-white px-6 py-3 text-sm font-semibold transition hover:bg-gray-50"
                                >
                                    Explore Features
                                </motion.a>

                            </div>


                            {/* Trust */}

                            <div className="mt-8 flex flex-wrap gap-5 text-xs text-gray-400">

                                <div className="flex items-center gap-2">
                                    <Check className="text-black" />
                                    AI Interview
                                </div>

                                <div className="flex items-center gap-2">
                                    <Check className="text-black" />
                                    Resume Builder
                                </div>

                                <div className="flex items-center gap-2">
                                    <Check className="text-black" />
                                    Career Roadmap
                                </div>

                            </div>

                        </motion.div>


                        {/* RIGHT - PRODUCT PREVIEW */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                scale: 0.9,
                                x: 40,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                x: 0,
                            }}
                            transition={{
                                duration: 0.8,
                                delay: 0.2,
                            }}
                            className="relative"
                        >

                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative mx-auto max-w-lg"
                            >

                                <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-r from-gray-200 via-white to-gray-200 blur-2xl" />

                                <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.12)]">

                                    {/* Dashboard Header */}

                                    <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100">
                                                <BriefcaseBusiness size={16} className="text-black" />
                                            </div>

                                            <div>
                                                <p className="text-sm font-bold">
                                                    Your Career
                                                </p>

                                                <p className="text-[10px] text-gray-400">
                                                    AI Career Dashboard
                                                </p>
                                            </div>

                                        </div>

                                        <div className="rounded-md bg-gray-100 px-2 py-1 text-[9px] font-semibold text-gray-500">
                                            AI POWERED
                                        </div>

                                    </div>


                                    {/* Cards */}

                                    <div className="space-y-3 bg-[#fafafa] p-5">

                                        {/* Interview */}

                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                x: -20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                delay: 0.8,
                                            }}
                                            className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                                        >

                                            <div className="flex items-center justify-between">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                                        <MessageSquareText size={15} className="text-black" />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold">
                                                            AI Interview
                                                        </p>

                                                        <p className="text-[10px] text-gray-400">
                                                            Technical Interview
                                                        </p>
                                                    </div>

                                                </div>

                                                <span className="text-sm font-black">
                                                    87%
                                                </span>

                                            </div>

                                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-gray-100">

                                                <motion.div
                                                    initial={{
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        width: "87%",
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        delay: 1,
                                                    }}
                                                    className="h-full rounded-full bg-black"
                                                />

                                            </div>

                                        </motion.div>


                                        {/* Resume */}

                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                x: 20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                delay: 1.1,
                                            }}
                                            className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                                        >

                                            <div className="flex items-center justify-between">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                                        <FileText
                                                            size={15}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold">
                                                            Resume Builder
                                                        </p>

                                                        <p className="text-[10px] text-gray-400">
                                                            ATS Optimization
                                                        </p>
                                                    </div>

                                                </div>

                                                <span className="rounded-md bg-green-50 px-2 py-1 text-[10px] font-bold text-green-600">
                                                    92 ATS
                                                </span>

                                            </div>

                                        </motion.div>


                                        {/* Roadmap */}

                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                x: -20,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                x: 0,
                                            }}
                                            transition={{
                                                delay: 1.4,
                                            }}
                                            className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                                        >

                                            <div className="flex items-center justify-between">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                                                        <Map
                                                            size={18}
                                                        />
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-bold">
                                                            Career Roadmap
                                                        </p>

                                                        <p className="text-[10px] text-gray-400">
                                                            Full Stack Developer
                                                        </p>
                                                    </div>

                                                </div>

                                                <span className="text-xs font-bold">
                                                    64%
                                                </span>

                                            </div>

                                            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">

                                                <motion.div
                                                    initial={{
                                                        width: 0,
                                                    }}
                                                    animate={{
                                                        width: "64%",
                                                    }}
                                                    transition={{
                                                        duration: 1,
                                                        delay: 1.5,
                                                    }}
                                                    className="h-full rounded-full bg-black"
                                                />

                                            </div>

                                        </motion.div>

                                    </div>


                                    {/* Bottom */}

                                    <div className="flex items-center justify-between border-t border-black/10 px-5 py-4">

                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <BookOpen size={14} className="text-black" />
                                            AI Career Assistant
                                        </div>

                                        <motion.div
                                            animate={{
                                                scale: [1, 1.08, 1],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                            }}
                                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                                        >
                                            <Play
                                                size={9}
                                                className="ml-0.5 text-black"
                                            />
                                        </motion.div>

                                    </div>

                                </div>

                            </motion.div>

                        </motion.div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                PRODUCT MODULES
            ===================================================== */}

            <section
                id="features"
                className="border-y border-black/10 bg-white px-5 py-24 md:px-10"
            >

                <div className="mx-auto max-w-6xl">

                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 30,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                        }}
                        className="mx-auto max-w-2xl text-center"
                    >

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                            One platform. Three powerful tools.
                        </p>

                        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                            Everything you need
                            <br />
                            <span className="text-gray-400">
                                to move your career forward.
                            </span>
                        </h2>

                        <p className="mt-5 text-sm leading-6 text-gray-500 md:text-base">
                            Fail7Fly.AI brings interview preparation,
                            resume building, and career planning together
                            in one intelligent platform.
                        </p>

                    </motion.div>


                    <div className="mt-14 grid gap-5 md:grid-cols-3">

                        {/* Interview */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: 0,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="group rounded-2xl border border-black/10 bg-[#fafafa] p-7 shadow-sm transition-shadow hover:shadow-xl"
                        >

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <MessageSquareText size={20} className="text-black" />
                            </div>

                            <h3 className="mt-6 text-xl font-bold">
                                AI Interview
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Practice realistic technical and HR
                                interviews with an AI interviewer and
                                receive instant performance feedback.
                            </p>

                            <div className="mt-6 flex items-center gap-2 text-xs font-bold">
                                Practice interviews
                                <ArrowRight
                                    size={9}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </div>

                        </motion.div>


                        {/* Resume */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: 0.12,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="group rounded-2xl border border-black/10 bg-[#fafafa] p-7 shadow-sm transition-shadow hover:shadow-xl"
                        >

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <FileText
                                    size={18}
                                    className="text-white"
                                />
                            </div>

                            <h3 className="mt-6 text-xl font-bold">
                                AI Resume Builder
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Create professional resumes, optimize
                                them for ATS systems, and tailor your
                                resume for specific job descriptions.
                            </p>

                            <div className="mt-6 flex items-center gap-2 text-xs font-bold">
                                Build your resume
                                <ArrowRight
                                    size={9}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </div>

                        </motion.div>


                        {/* Roadmap */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 30,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{
                                once: true,
                            }}
                            transition={{
                                delay: 0.24,
                            }}
                            whileHover={{
                                y: -8,
                            }}
                            className="group rounded-2xl border border-black/10 bg-[#fafafa] p-7 shadow-sm transition-shadow hover:shadow-xl"
                        >

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <Map
                                    size={20}
                                    className="text-white"
                                />
                            </div>

                            <h3 className="mt-6 text-xl font-bold">
                                Career Roadmap
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-gray-500">
                                Tell AI your career goal and get a
                                personalized roadmap with skills, projects,
                                learning paths, and milestones.
                            </p>

                            <div className="mt-6 flex items-center gap-2 text-xs font-bold">
                                Build your roadmap
                                <ArrowRight
                                    size={9}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </div>

                        </motion.div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                HOW IT WORKS
            ===================================================== */}

            <section
                id="how-it-works"
                className="bg-[#0A0A0A] px-5 py-24 text-white md:px-10"
            >

                <div className="mx-auto max-w-6xl">

                    <div className="text-center">

                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                            How it works
                        </p>

                        <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                            Your career journey,
                            <br />
                            <span className="text-gray-500">
                                powered by AI.
                            </span>
                        </h2>

                    </div>


                    <div className="mt-16 grid gap-10 md:grid-cols-3">

                        {[
                            {
                                number: "01",
                                title: "Tell us your goal",
                                text: "Choose the role you want, your current level, and where you want to go.",
                            },
                            {
                                number: "02",
                                title: "AI builds your path",
                                text: "Get a personalized roadmap, resume guidance, and interview preparation.",
                            },
                            {
                                number: "03",
                                title: "Practice & improve",
                                text: "Practice interviews, improve your resume, and track your career progress.",
                            },
                        ].map((step, index) => (

                            <motion.div
                                key={step.number}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.15,
                                }}
                            >

                                <div className="text-6xl font-black text-white/10">
                                    {step.number}
                                </div>

                                <h3 className="mt-3 text-xl font-bold">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    {step.text}
                                </p>

                            </motion.div>

                        ))}

                    </div>

                </div>

            </section>


            {/* =====================================================
                WHY FAIL7FLY
            ===================================================== */}

            <section
                id="why-us"
                className="px-5 py-24 md:px-10 bg-[#fafafa]"
            >
                <div className="max-w-6xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-2xl"
                    >
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                            The Fail7Fly Journey
                        </p>

                        <h2 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
                            From learning to
                            <br />
                            <span className="text-gray-600">
                                getting career ready.
                            </span>
                        </h2>

                        <p className="mt-5 text-sm md:text-base leading-7 text-gray-500">
                            Fail7Fly.AI guides you through every stage of your
                            career journey — from discovering your direction to
                            becoming ready for real-world opportunities.
                        </p>
                    </motion.div>

                    <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">

                        {[
                            {
                                number: "01",
                                title: "Discover",
                                text: "Identify your career goal, current skills, strengths, weaknesses and target role.",
                            },
                            {
                                number: "02",
                                title: "Learn",
                                text: "Follow an AI-powered learning path focused on the skills your target role requires.",
                            },
                            {
                                number: "03",
                                title: "Practice",
                                text: "Improve through coding, DSA, technical concepts and interview practice.",
                            },
                            {
                                number: "04",
                                title: "Build",
                                text: "Create real-world projects and build a portfolio that demonstrates your skills.",
                            },
                            {
                                number: "05",
                                title: "Improve",
                                text: "Get AI-powered feedback and identify exactly what you need to improve.",
                            },
                            {
                                number: "06",
                                title: "Prepare",
                                text: "Build an ATS-friendly resume and practice technical and HR interviews with AI.",
                            },
                            {
                                number: "07",
                                title: "Fly",
                                text: "Become career-ready, discover opportunities and keep growing toward your goals.",
                            },
                        ].map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className={`group rounded-2xl border border-black/10 bg-white p-6 shadow-sm hover:shadow-xl transition-all ${index === 6
                                        ? "md:col-span-2 lg:col-span-1"
                                        : ""
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">
                                        {step.number}
                                    </span>

                                    {step.number === "07" && (
                                        <span className="text-xl">
                                            
                                        </span>
                                    )}
                                </div>

                                <h3 className="mt-5 text-xl font-bold">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    {step.text}
                                </p>
                            </motion.div>
                        ))}

                    </div>

                </div>
            </section>


            {/* =====================================================
                CTA
            ===================================================== */}

            <section className="px-5 pb-24 md:px-10">

                <motion.div
                    initial={{
                        opacity: 0,
                        scale: 0.97,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-black px-7 py-16 text-center text-white md:px-16"
                >

                    <div className="absolute left-1/2 top-0 h-40 w-96 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative">

                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                            <BriefcaseBusiness size={24} className="text-black" />
                        </span>

                        <h2 className="mt-6 text-3xl font-black tracking-tight md:text-5xl">
                            Ready to build your
                            <br />
                            next career move?
                        </h2>

                        <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-400">
                            Practice interviews, create a better resume,
                            and follow a roadmap designed around your goals.
                        </p>

                        <motion.button
                            whileHover={{
                                scale: 1.05,
                            }}
                            whileTap={{
                                scale: 0.96,
                            }}
                            onClick={() =>
                                setIsLoginOpen(true)
                            }
                            className="mt-8 inline-flex items-center gap-3 rounded-lg bg-white px-6 py-3 text-sm font-bold text-black"
                        >
                            Start Your Journey
                            <ArrowRight size={14} className="text-black" />
                        </motion.button>

                    </div>

                </motion.div>

            </section>


            {/* =====================================================
                FOOTER
            ===================================================== */}

            <footer className="border-t border-black/10 bg-white">

                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 md:flex-row md:px-10">

                    <div className="flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
                            <BriefcaseBusiness size={14} className="text-black" />
                        </div>

                        <span className="text-sm font-bold">
                            Fail7Fly.AI
                        </span>

                    </div>

                    <p className="text-xs text-gray-400">
                        © 2026 Fail7Fly.AI. Your AI Career Copilot.
                    </p>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 transition hover:text-black"
                    >
                        <Code2 size={17} className="text-black" />
                    </a>

                </div>

            </footer>


            {/* =====================================================
                LOGIN MODAL
            ===================================================== */}

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                setUser={setUser}
            />

        </div>
    );
}

export default Home;