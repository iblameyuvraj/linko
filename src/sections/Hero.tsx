"use client";

import Button from "@/components/Button";
import designExample1 from "@/assets/images/design-example-1.png";
import designExample2 from "@/assets/images/design-example-2.png";
import Image from "next/image";
import Pointer from "@/components/Pointer";
import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import cursorImage from "@/assets/images/cursor-you.svg";
import SignupModal from "@/components/SignupModal";
import LoginModal from "@/components/LoginModal";

export default function Hero() {
    const [leftDesignScope, leftDesignAnimate] = useAnimate();
    const [leftPointerScope, leftPointerAnimate] = useAnimate();

    const [rightDesignScope, rightDesignAnimate] = useAnimate();
    const [rightPointerScope, rightPointerAnimate] = useAnimate();

    // Local auth modal state for this section
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);

    useEffect(() => {
        leftDesignAnimate([
            [leftDesignScope.current, { opacity: 1 }, { duration: 0.5 }],
            [leftDesignScope.current, { y: 0, x: 0 }, { duration: 0.5 }],
        ]);

        leftPointerAnimate([
            [leftPointerScope.current, { opacity: 1 }, { duration: 0.5 }],
            [leftPointerScope.current, { y: 0, x: -100 }, { duration: 0.5 }],
            [
                leftPointerScope.current,
                { y: [0, 16, 0], x: 0 },
                { duration: 0.5, ease: "easeInOut" },
            ],
        ]);

        rightDesignAnimate([
            [
                rightDesignScope.current,
                { opacity: 1 },
                { duration: 0.5, delay: 1.5 },
            ],
            [rightDesignScope.current, { y: 0, x: 0 }, { duration: 0.5 }],
        ]);

        rightPointerAnimate([
            [
                rightPointerScope.current,
                { opacity: 1 },
                { duration: 0.5, delay: 1.5 },
            ],
            [rightPointerScope.current, { y: 0, x: 175 }, { duration: 0.5 }],
            [
                rightPointerScope.current,
                { y: [0, 20, 0], x: 0 },
                { duration: 0.5, ease: "easeInOut" },
            ],
        ]);
    }, []);

    return (
        <>
        <section
            className="py-24 overflow-x-clip"
            style={{
                cursor: `url(${cursorImage.src}), auto`,
            }}
        >
            <div className="container relative ">
                <motion.div
                    ref={leftDesignScope}
                    initial={{ opacity: 0, y: 100, x: -100 }}
                    className="absolute -left-32 top-16 hidden lg:block"
                    drag
                >
                    <Image
                        draggable={false}
                        src={designExample1}
                        alt="design example 1"
                    />
                </motion.div>
                <motion.div
                    ref={leftPointerScope}
                    initial={{ opacity: 0, y: 100, x: -200 }}
                    className="absolute top-96 left-56 hidden lg:block"
                >
                    <Pointer name="Andrea" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 100, x: 100 }}
                    ref={rightDesignScope}
                    className="absolute -right-64 -top-16 hidden lg:block"
                    drag
                >
                    <Image
                        draggable={false}
                        src={designExample2}
                        alt="design example 2"
                    />
                </motion.div>
                <motion.div
                    ref={rightPointerScope}
                    initial={{ opacity: 0, x: 275, y: 100 }}
                    className="absolute -top-4 right-80 hidden lg:block"
                >
                    <Pointer color="red" name="Brew" />
                </motion.div>

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
