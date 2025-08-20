import CallToAction from "@/sections/CallToAction";
import Faqs from "@/sections/Faqs";
import Features from "@/sections/Features";
import Footer from "@/sections/Footer";
import Hero from "@/sections/Hero";
import { Analytics } from "@vercel/analytics/next"


import Introduction from "@/sections/Introduction";
import Navbar from "@/sections/Navbar";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Introduction />
            <Features />
            <Faqs />
            <CallToAction />
            <Footer />
            <Analytics/>
        </>
    );
}
