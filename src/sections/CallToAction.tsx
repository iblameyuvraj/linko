"use client";

import { AnimationPlaybackControls, motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import LoginModal from "@/components/LoginModal";
import SignupModal from "@/components/SignupModal";

export default function CallToAction() {
    const animation = useRef<AnimationPlaybackControls>();
    const [scope, animate] = useAnimate();

    const [slowDownAnimation, setSlowDownAnimation] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        animation.current = animate(
            scope.current,
            { x: "-50%" },
            { duration: 30, ease: "linear", repeat: Infinity }
        );
    }, []);

    useEffect(() => {
        if (animation.current) {
            if (slowDownAnimation) {
                animation.current.speed = 0.5;
            } else {
                animation.current.speed = 1;
            }
        }
    }, [slowDownAnimation]);

    return (
        <>
        <section className="py-24">
            <div className="overflow-x-clip p-4 flex">
                <motion.div
                    ref={scope}
                    className="flex flex-none gap-16 pr-16 text-7xl md:text-8xl font-medium"
                    onMouseEnter={() => setSlowDownAnimation(true)}
                    onMouseLeave={() => setSlowDownAnimation(false)}
                >
                    {Array.from({ length: 10 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-16">
                            <span className="text-lime-400 text-7xl ">
                                &#10038;
                            </span>
                            <span
                                className={twMerge(
                                    "cursor-pointer select-none",
                                    slowDownAnimation && "text-lime-400"
                                )}
                                onClick={() => setSignupOpen(true)}
                            >
                                Try it for free
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
        {/* Auth Modals scoped to CallToAction */}
        <LoginModal
            isOpen={loginOpen}
            onClose={() => setLoginOpen(false)}
            onSwitchToSignup={() => {
                setLoginOpen(false);
                setSignupOpen(true);
            }}
        />
        <SignupModal
            isOpen={signupOpen}
            onClose={() => setSignupOpen(false)}
            onSwitchToLogin={() => {
                setSignupOpen(false);
                setLoginOpen(true);
            }}
        />
        </>
    );
}
