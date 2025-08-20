"use client";

import { Menu, X } from "lucide-react";
import Button from "@/components/Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/edit" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);

    return (
        <>
            <section className="py-4 lg:py-8 fixed w-full top-0 z-50 ">
                <div className="container max-w-5xl">
                    <div className="border border-white/15 rounded-[27px] lg:rounded-full bg-neutral-950/70 backdrop-blur">
                        <figure className="grid grid-cols-2 lg:grid-cols-3  py-2 lg:px-2 px-4  items-center ">
                            <div className="flex items-center">
                                <svg
                                    viewBox="0 0 370 99.51387157577669"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-7 w-auto md:h-8"
                                    role="img"
                                    aria-label="Layer logo"
                                >
                                    <defs></defs>
                                    <g
                                        transform="matrix(3.115100622177124,0,0,3.115100622177124,0.15838625897268133,0.0965715165747583)"
                                        fill="#89F363"
                                    >
                                        <path d="M24.5-.031c-1.918.001-3.808.714-5.25 2.156l-3.906 3.906 2.125 2.125 3.906-3.906c1.716-1.716 4.546-1.721 6.375.031 1.779 1.704 1.737 4.499 0 6.344-.01.011-.021.02-.031.031l-6.969 6.969c-1.716 1.716-4.577 1.753-6.406 0l-2.094 2.156c2.971 2.847 7.741 2.853 10.625-.031l7-7c2.832-2.955 2.98-7.74-.031-10.625-1.486-1.424-3.426-2.157-5.344-2.156zm-10.094 10c-1.918.001-3.839.714-5.281 2.156l-7 7a1.5 1.5 0 0 0 0 .031c-2.832 2.955-2.98 7.74.031 10.625 2.971 2.847 7.71 2.853 10.594-.031l4-4-2.125-2.125-4 4c-1.716 1.716-4.546 1.753-6.375 0-1.789-1.715-1.737-4.53.031-6.375l6.969-7c1.716-1.716 4.577-1.721 6.406.031l2.094-2.156c-1.486-1.424-3.426-2.157-5.344-2.156z"></path>
                                    </g>
                                    <g
                                        transform="matrix(2.843494176864624,0,0,2.843494176864624,113.4030930960573,-23.529569111017587)"
                                        fill="#FFFFFF"
                                    >
                                        <path d="M8 11.440000000000001 l0 28.56 l-5.68 0 l0 -28.56 l5.68 0 z M18.32 11.440000000000001 l0 4.68 l-5.68 0 l0 -4.68 l5.68 0 z M18.32 19.32 l0 20.68 l-5.68 0 l0 -20.68 l5.68 0 z M34.68 18.76 c2.64 0 4.5532 0.66676 5.74 2.0001 s1.78 3.4533 1.78 6.36 l0 12.88 l-5.68 0 l0 -11.72 c0 -1.7067 -0.27332 -2.9734 -0.82 -3.8 s-1.4867 -1.24 -2.82 -1.24 c-1.5467 0 -2.6667 0.46668 -3.36 1.4 s-1.04 2.4666 -1.04 4.6 l0 10.76 l-5.68 0 l0 -20.68 l5.4 0 l0 2.88 l0.12 0 c1.4133 -2.2933 3.5333 -3.44 6.36 -3.44 z M52.72 11.440000000000001 l0 15.32 l7.16 -7.44 l6.72 0 l-7.8 7.6 l8.68 13.08 l-6.88 0 l-5.68 -9.24 l-2.2 2.12 l0 7.12 l-5.68 0 l0 -28.56 l5.68 0 z M79.52 18.76 c3.3067 0 5.92 1.0067 7.84 3.02 s2.88 4.6468 2.88 7.9 c0 3.28 -0.98 5.9132 -2.94 7.9 s-4.5532 2.98 -7.78 2.98 c-3.28 0 -5.88 -1.0067 -7.8 -3.02 s-2.88 -4.6332 -2.88 -7.86 c0 -3.3333 0.98 -5.9868 2.94 -7.96 s4.54 -2.96 7.74 -2.96 z M74.52 29.68 c0 2.1067 0.42668 3.7333 1.28 4.88 s2.0933 1.72 3.72 1.72 c1.68 0 2.94 -0.58668 3.78 -1.76 s1.26 -2.7866 1.26 -4.84 c0 -2.1333 -0.43332 -3.7733 -1.3 -4.92 s-2.1267 -1.72 -3.78 -1.72 c-1.6 0 -2.8267 0.57332 -3.68 1.72 s-1.28 2.7867 -1.28 4.92 z"></path>
                                    </g>
                                </svg>
                            </div>
                            <div className="hidden lg:flex justify-center items-center ">
                                <nav className="flex gap-6 font-medium ">
                                    {navLinks.map((each) => (
                                        <a href={each.href} key={each.href}>
                                            {each.label}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="lg:hidden"
                                >
                                    {!isOpen ? (
                                        <motion.div
                                            initial={{ opacity: 1 }}
                                            animate={{
                                                opacity: isOpen ? 0 : 1,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Menu
                                                className="text-white"
                                                size={30}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: isOpen ? 1 : 0,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <X
                                                className="text-white"
                                                size={30}
                                            />
                                        </motion.div>
                                    )}
                                </button>
                                <Button
                                    variant="secondary"
                                    className="hidden lg:inline-flex items-center"
                                    onClick={() => setLoginOpen(true)}
                                >
                                    Login
                                </Button>
                                <Button
                                    variant="primary"
                                    className="hidden lg:inline-flex items-center"
                                    onClick={() => setSignupOpen(true)}
                                >
                                    Signup
                                </Button>
                            </div>
                        </figure>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.figure
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    exit={{ height: 0 }}
                                    className="overflow-hidden lg:hidden"
                                >
                                    <div className="flex flex-col items-center gap-4 py-4">
                                        {navLinks.map((link) => (
                                            <a key={link.href} href={link.href}>
                                                {link.label}
                                            </a>
                                        ))}
                                        <Button
                                            className="w-3/4"
                                            variant="secondary"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setLoginOpen(true);
                                            }}
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            className="w-3/4"
                                            variant="primary"
                                            onClick={() => {
                                                setIsOpen(false);
                                                setSignupOpen(true);
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </div>
                                </motion.figure>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* Auth Modals */}
            <LoginModal
                isOpen={loginOpen}
                onClose={() => setLoginOpen(false)}
                onSwitchToSignup={() => setSignupOpen(true)}
            />

            <SignupModal
                isOpen={signupOpen}
                onClose={() => setSignupOpen(false)}
                onSwitchToLogin={() => setLoginOpen(true)}
            />

            <div className="pb-[86px] md:pb-[98px]"></div>
        </>
    );
}

