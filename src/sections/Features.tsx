"use client";

import FeatureCard from "@/components/FeatureCard";
import Tag from "@/components/Tag";
import avatar1 from "@/assets/images/avatar-ashwin-santiago.jpg";
import avatar2 from "@/assets/images/avatar-florence-shaw.jpg";
import avatar3 from "@/assets/images/avatar-lula-meyers.jpg";
import Image from "next/image";
import Avatar from "@/components/Avatar";
import { Ellipsis } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    "Profile Branding",
    "Share Anywhere",
    "Username Links",
    "Instant Setup",
];

const parentVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.7,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function Features() {
    return (
        <section className="py-24 ">
            <div className="container">
                <div className="flex justify-center">
                    <Tag>Features</Tag>
                </div>
                <h2 className="text-6xl font-medium text-center mt-6 max-w-2xl m-auto">
                    Where your <span className="text-lime-400">links</span> come alive
                </h2>
                <motion.div
                    variants={parentVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8">
                        {/* Card 1 - Active Users */}
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <FeatureCard
                                title="Active community"
                                description="Thousands of users share, click, and connect every single day."
                                className="md:col-span-2 lg:col-span-1"
                            >
                                <div className="aspect-video flex items-center justify-center">
                                    <Avatar className="z-40">
                                        <Image
                                            src={avatar1}
                                            alt="Avatar 1"
                                            className="rounded-full"
                                        />
                                    </Avatar>
                                    <Avatar className="-ml-6 border-indigo-500 z-30">
                                        <Image
                                            src={avatar2}
                                            alt="Avatar 2"
                                            className="rounded-full"
                                        />
                                    </Avatar>
                                    <Avatar className="-ml-6 border-amber-500 z-20">
                                        <Image
                                            src={avatar3}
                                            alt="Avatar 3"
                                            className="rounded-full"
                                        />
                                    </Avatar>
                                    <Avatar className="-ml-6 border-transparent z-10">
                                        <div className="rounded-full flex justify-center items-center size-full bg-neutral-700">
                                            <Ellipsis size={30} />
                                        </div>
                                    </Avatar>
                                </div>
                            </FeatureCard>
                        </motion.div>

                        {/* Card 2 - Username Link */}
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <FeatureCard
                                title="Your personal link"
                                description="Claim your unique username and share it everywhere."
                                className="md:col-span-2 lg:col-span-1 group transition duration-500"
                            >
                                <div className="aspect-video flex items-center justify-center">
                                    <p className="group-hover:text-white/40 transition duration-500 text-4xl font-extrabold text-white/20 text-center">
                                        linko/
                                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                            username
                                        </span>
                                    </p>
                                </div>
                            </FeatureCard>
                        </motion.div>

                        {/* Card 3 - Social Actions */}
                        {/* Card 3 - Social Actions */}
                        <motion.div
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <FeatureCard
                                title="Instant actions"
                                description="Add quick links for Instagram, WhatsApp, email, or DMs."
                                className="group md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto"
                            >
                                <div className="aspect-video flex items-center justify-center">
                                    {/* Small curved glass card */}
                                    <div className="relative w-40 h-36 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl overflow-hidden">
                                        {/* soft gradient glow */}
                                        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full" />

                                        {/* Instagram logo at top-right */}
                                        <div className="absolute top-3 right-3 p-2 rounded-2xl bg-white/10 border border-white/10 shadow-md">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="white"
                                                stroke-width="2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            >

                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>


                                                <circle cx="12" cy="12" r="4"></circle>


                                                <circle cx="17.5" cy="6.5" r="1"></circle>
                                            </svg>


                                        </div>

                                        {/* Two glassy bars */}
                                        <div className="absolute inset-x-4 bottom-5 flex flex-col gap-3">
                                            <div className="h-4 w-24 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md shadow-sm" />
                                            <div className="h-4 w-24 rounded-xl bg-white/10 border border-white/10 backdrop-blur-md shadow-sm" />
                                        </div>

                                        {/* subtle highlight overlay */}
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
                                    </div>
                                </div>
                            </FeatureCard>
                        </motion.div>

                    </div>
                </motion.div>

                <div className="my-8 flex items-center justify-center flex-wrap gap-2 max-w-3xl m-auto">
                    {features.map((feature) => (
                        <div
                            className="bg-neutral-900 border border-white/10 inline-flex px-3 md:px-5 md:py-2 py-1.5 rounded-2xl gap-3 items-center hover:scale-105 transition duration-500 group"
                            key={feature}
                        >
                            <span className="bg-lime-400 text-neutral-900 size-5 rounded-full inline-flex items-center justify-center text-xl group-hover:rotate-45 transition duration-500">
                                &#10038;
                            </span>
                            <span className="font-medium md:text-lg">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
