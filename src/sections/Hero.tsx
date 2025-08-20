"use client";

import Button from "@/components/Button";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import cursorImage from "@/assets/images/cursor-you.svg";
import SignupModal from "@/components/SignupModal";
import LoginModal from "@/components/LoginModal";

export default function Hero() {
    // Local auth modal state for this section
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    return (
        <>
            <section
                className="py-24 overflow-x-clip"
                style={{
                    cursor: `url(${cursorImage.src}), auto`,
                }}
            >
                <div className="container relative ">


                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-center mt-6">
                        Stop the bio chaos. <br /> Start <a className="text-lime-400">Linko.</a>
                    </h1>
                    <p className="text-center text-xl text-white/50 mt-8 max-w-2xl mx-auto">
                        All your socials, content and creds in one clean, scroll-proof link. Fast to make, easy to <a className="text-lime-400">flex.</a>
                    </p>
                    {/* CTA: "Start Linko" */}

                    <div className="mx-auto text-center mt-8 max-w-xl">
                        <Button
                            size="sm"
                            className="whitespace-nowrap"
                            type="submit"
                            variant="primary"
                            onClick={() => setSignupOpen(true)}
                        >
                            Sign Up
                        </Button>
                    </div>
                </div>
            </section>
            {/* Auth Modals scoped to Hero */}
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
