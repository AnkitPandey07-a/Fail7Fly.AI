import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    FaGoogle,
    FaGithub,
    FaTimes,
} from "react-icons/fa";

import {
    signInWithPopup,
    GithubAuthProvider,
} from "firebase/auth";

import { auth, provider } from "../utils/firebase";
import api from "../utils/axios";

function LoginModal({ isOpen, onClose, setUser }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loginWithFirebase = async (firebaseProvider) => {
        try {
            setLoading(true);
            setError("");

            const result = await signInWithPopup(
                auth,
                firebaseProvider
            );

            const token = await result.user.getIdToken();

            await api.post("/api/auth/login", {
                token,
            });

            const response = await api.get("/api/me");

            if (response.data?.success && response.data?.user) {
                setUser(response.data.user);
                onClose();
            } else {
                setError("Unable to fetch user data.");
            }

        } catch (error) {
            setError(
                error?.response?.data?.message ||
                error?.message ||
                "Login failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        loginWithFirebase(provider);
    };

    const handleGithubAuth = () => {
        const githubProvider = new GithubAuthProvider();

        loginWithFirebase(githubProvider);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10,
                        }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-sm rounded-2xl bg-white px-5 py-5 shadow-2xl"
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-black"
                        >
                            <FaTimes size={12} className="text-black" />
                        </button>

                        <div className="flex justify-center">
                            <div className="rounded-lg bg-[#0A0A0A] px-3 py-1.5 text-xs font-semibold text-white">
                                Fail7Fly.AI
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <h2 className="text-xl font-bold">
                                Welcome Back
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Login to continue your AI Interview Journey
                            </p>
                        </div>

                        {error && (
                            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleGoogleAuth}
                                disabled={loading}
                                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 disabled:opacity-50"
                            >
                                <FaGoogle size={15} className="text-black" />
                                {loading
                                    ? "Signing in..."
                                    : "Continue with Google"}
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={handleGithubAuth}
                                disabled={loading}
                                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-900 disabled:opacity-50"
                            >
                                <FaGithub size={16} className="text-black" />
                                {loading
                                    ? "Signing in..."
                                    : "Continue with GitHub"}
                            </motion.button>
                        </div>

                        <p className="mt-5 text-center text-[11px] text-gray-400">
                            By continuing, you agree to our Terms
                            and Privacy Policy.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LoginModal;