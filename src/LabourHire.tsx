import { useEffect, useCallback, useRef } from "react";
import logoBlack from "./assets/logo-black.png";
import {
    ShieldCheck,
    Users,
    CheckCircle,
    Construction,
    Briefcase,
    Trophy,
    Target,
    Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero from "./components/Hero";

const LabourHire = () => {
    const navigate = useNavigate();

    const aboutRef = useRef<HTMLDivElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const differenceRef = useRef<HTMLDivElement>(null);
    const sectorsRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    const useScrollTo = () => {
        return useCallback((ref: React.RefObject<HTMLElement | null>) => {
            if (ref?.current) {
                const elementTop =
                    ref.current.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({
                    top: elementTop - 120, // subtract header height
                    behavior: "smooth",
                });
            }
        }, []);
    };

    const scrollTo = useScrollTo();

    useEffect(() => {
        const handleScroll = () => {
            // ... (keep the scroll logic if needed, but it's not being used here)
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="font-sora bg-white text-black">
            <Hero
                backgroundImage="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop"
                tagIcon={Users}
                tagLabel="VANTAGE WORKPLACE SOLUTIONS"
                title={
                    <>
                        SKILLED LABOUR.
                        <br />
                        <span className="text-[#FF8C00]">SAFETY LED.</span>
                    </>
                }
                description="At Vantage Workplace Solutions, we provide skilled labour and safety led workforce solutions to the construction industry."
                primaryButtonText="HIRE WORKFORCE"
                primaryButtonAction={() => scrollTo(contactRef)}
                secondaryButtonText="SAFETY SERVICES"
                secondaryButtonAction={() => navigate("/safety")}
                themeColor="#FF8C00"
                isDarkText={true}
            />

            {/* Introduction & Specialism */}
            <section
                id="about"
                ref={aboutRef}
                className="py-16 md:py-32 px-5 bg-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div>
                            <div className="w-20 h-1.5 bg-[#FF8C00] mb-6 md:mb-10"></div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-10 tracking-tight leading-tight text-black">
                                COMPETENT PEOPLE. <br />
                                <span className="text-[#FF8C00]">
                                    QUALITY DELIVERY.
                                </span>
                            </h2>
                            <p className="text-xl text-gray-800 font-inter leading-relaxed mb-6 md:mb-8">
                                We specialise in supplying competent groundworks
                                operatives, resurfacing teams, machine
                                operators, and qualified site
                                supervisors/managers.
                            </p>
                            <p className="text-lg text-gray-600 font-inter leading-relaxed italic border-l-4 border-[#FF8C00] pl-8 py-2">
                                "We don’t just supply labour — we provide people
                                who understand site expectations, follow safe
                                systems of work, and deliver quality from day
                                one."
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-stone-200 border border-stone-200">
                            {[
                                {
                                    title: "Competent Individuals",
                                    icon: CheckCircle,
                                },
                                {
                                    title: "High Safety Standards",
                                    icon: ShieldCheck,
                                },
                                { title: "Consistent Quality", icon: Trophy },
                                {
                                    title: "Professional Service",
                                    icon: Briefcase,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="p-8 md:p-10 bg-white flex flex-col items-center text-center hover:bg-stone-50 transition-colors group"
                                >
                                    <item.icon
                                        size={32}
                                        className="text-[#FF8C00] mb-4 md:mb-6"
                                    />
                                    <span className="font-bold text-xs uppercase tracking-[0.2em] text-black leading-relaxed">
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do / Services */}
            <section
                id="services"
                ref={servicesRef}
                className="py-16 md:py-32 px-5 bg-gray-50 border-y border-stone-200"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-bold mb-4 md:mb-6 tracking-tight text-black">
                                WHAT WE DO
                            </h2>
                            <p className="text-gray-600 font-inter text-lg">
                                Comprehensive skilled workforce solutions across
                                groundworks, resurfacing, and civil engineering
                                projects nationwide.
                            </p>
                        </div>
                        <div className="text-[#FF8C00] font-bold text-sm tracking-widest border-b-2 border-[#FF8C00] pb-2 uppercase">
                            Operational Excellence
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200 border border-stone-200">
                        {[
                            {
                                title: "Groundworks Operatives",
                                desc: "Drainage, foundations, plot works, kerbing, and finishing with precision.",
                                features: [
                                    "Housing & Infrastructure",
                                    "Drainage & Foundations",
                                    "Finishing Works",
                                ],
                            },
                            {
                                title: "Resurfacing Operatives",
                                desc: "High-standard tarmac and reinstatement works for roads and footpaths.",
                                features: [
                                    "Roads & Footpaths",
                                    "Patching Works",
                                    "Reinstatement",
                                ],
                            },
                            {
                                title: "Machine Operators",
                                desc: "CPCS / NPORS qualified operators for all plant types and operations.",
                                features: [
                                    "Excavators & Dumpers",
                                    "Rollers & Pavers",
                                    "Safe Lifting Awareness",
                                ],
                            },
                            {
                                title: "Management & Supervision",
                                desc: "SSSTS and SMSTS qualified leads for seamless project delivery.",
                                features: [
                                    "Site Supervisors",
                                    "Site Managers",
                                    "Coordination & Safety",
                                ],
                            },
                        ].map((service, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 md:p-10 flex flex-col group transition-colors"
                            >
                                <h3 className="text-lg font-bold mb-4 md:mb-6 text-black uppercase tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 font-inter text-sm mb-6 md:mb-10 flex-grow leading-relaxed">
                                    {service.desc}
                                </p>
                                <ul className="space-y-4 pt-6 md:pt-8 border-t border-stone-200">
                                    {service.features.map((f, j) => (
                                        <li
                                            key={j}
                                            className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-black"
                                        >
                                            <div className="w-1.5 h-1.5 bg-[#FF8C00]"></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Flexible Support */}
                    <div className="mt-12 md:mt-20 bg-black text-white p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 border-l-[12px] border-[#FF8C00]">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
                                Flexible Workforce Support
                            </h3>
                            <p className="text-gray-400 font-inter text-lg">
                                Scalable supply models tailored to your
                                project's evolving demands.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
                            {[
                                "Short-term Cover",
                                "Long-term Placements",
                                "Full Gang Supply",
                                "Individual Specialists",
                            ].map((t, i) => (
                                <div
                                    key={i}
                                    className="bg-white/5 px-4 md:px-6 py-3 md:py-4 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-center"
                                >
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Difference */}
            <section
                id="difference"
                ref={differenceRef}
                className="py-16 md:py-32 px-5 bg-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 md:gap-24">
                        <div className="lg:w-2/5">
                            <h2 className="text-4xl font-bold mb-6 md:mb-8 text-black tracking-tight">
                                THE VANTAGE{" "}
                                <span className="text-[#FF8C00]">
                                    DIFFERENCE
                                </span>
                            </h2>
                            <p className="text-gray-600 font-inter text-lg leading-relaxed mb-6 md:mb-10">
                                Unlike typical labour providers, we are backed
                                by practical health & safety experience and a
                                deep understanding of the groundworks and
                                surfacing trades.
                            </p>
                            <div className="h-1 w-24 bg-[#FF8C00]"></div>
                        </div>
                        <div className="lg:w-3/5 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            <div>
                                <div className="w-14 h-14 border-2 border-stone-100 flex items-center justify-center mb-6 md:mb-8 group-hover:border-[#FF8C00] transition-colors">
                                    <ShieldCheck
                                        className="text-[#FF8C00]"
                                        size={28}
                                    />
                                </div>
                                <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-black">
                                    Safety Led
                                </h4>
                                <p className="text-sm text-gray-500 font-inter leading-relaxed">
                                    Our operatives understand RAMS and safe
                                    systems of work, leading to higher standards
                                    of site behaviour and reduced risk.
                                </p>
                            </div>
                            <div>
                                <div className="w-14 h-14 border-2 border-stone-100 flex items-center justify-center mb-6 md:mb-8">
                                    <Target
                                        className="text-[#FF8C00]"
                                        size={28}
                                    />
                                </div>
                                <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-black">
                                    Quality
                                </h4>
                                <p className="text-sm text-gray-500 font-inter leading-relaxed">
                                    We prioritise people who turn up and
                                    perform, ensuring work is completed to the
                                    correct standard with a strong work ethic.
                                </p>
                            </div>
                            <div>
                                <div className="w-14 h-14 border-2 border-stone-100 flex items-center justify-center mb-6 md:mb-8">
                                    <Construction
                                        className="text-[#FF8C00]"
                                        size={28}
                                    />
                                </div>
                                <h4 className="font-bold mb-4 uppercase text-sm tracking-widest text-black">
                                    Expertise
                                </h4>
                                <p className="text-sm text-gray-500 font-inter leading-relaxed">
                                    We understand site pressures, programme
                                    demands, and client expectations because we
                                    come from the trade.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sectors & Promise */}
            <section
                id="sectors"
                ref={sectorsRef}
                className="py-16 md:py-32 px-5 bg-gray-950 text-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-8 md:mb-12 tracking-tight">
                                SECTORS WE SUPPORT
                            </h2>
                            <div className="grid grid-cols-1 gap-y-6 md:gap-y-8">
                                {[
                                    "Housebuilding Developments",
                                    "Groundworks & Civil Engineering",
                                    "Utilities & Infrastructure",
                                    "Local Authority Projects",
                                    "Commercial Construction",
                                ].map((sector, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-6 group"
                                    >
                                        <div className="w-8 h-px bg-[#FF8C00]"></div>
                                        <span className="font-bold text-sm tracking-[0.2em] uppercase text-gray-300 group-hover:text-white transition-colors">
                                            {sector}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/5 p-8 md:p-16 border border-white/10 relative">
                            <div className="absolute top-0 left-0 w-2 h-full bg-[#FF8C00]"></div>
                            <h3 className="text-[#FF8C00] text-xs font-bold tracking-[0.3em] mb-6 md:mb-8 uppercase">
                                OUR PROMISE
                            </h3>
                            <p className="text-2xl md:text-3xl font-bold leading-tight mb-8 md:mb-12 tracking-tight">
                                We deliver trusted, competent individuals who
                                contribute directly to the success and safety of
                                your project.
                            </p>
                            <div className="flex gap-4 md:gap-8 text-[10px] font-bold uppercase tracking-[0.4em] text-[#FF8C00]/60">
                                <span>Competence</span>
                                <span>•</span>
                                <span>Safety</span>
                                <span>•</span>
                                <span>Quality</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact & Footer Section */}
            <section
                id="contact-labour"
                ref={contactRef}
                className="min-h-screen flex flex-col bg-white"
            >
                <div className="flex-grow flex items-center py-8 md:py-20 px-5">
                    <div className="max-w-7xl mx-auto w-full">
                        <div className="bg-black text-white flex flex-col lg:flex-row border border-gray-800">
                            <div className="lg:w-1/2 p-8 md:p-20 border-b lg:border-b-0 lg:border-r border-gray-800">
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 tracking-tight">
                                    REQUEST WORKFORCE
                                </h2>
                                <p className="text-gray-400 font-inter text-lg mb-8 md:mb-12 leading-relaxed">
                                    Partner with Vantage for skilled,
                                    safety-conscious labour. Our team is ready
                                    to discuss your project requirements.
                                </p>
                                <div className="space-y-6 md:space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 border border-gray-800 flex items-center justify-center">
                                            <Zap
                                                size={20}
                                                className="text-[#FF8C00]"
                                            />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-widest">
                                            Rapid Response Support
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 border border-gray-800 flex items-center justify-center">
                                            <Users
                                                size={20}
                                                className="text-[#FF8C00]"
                                            />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-widest">
                                            Fully Vetted Workforce
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-1/2 bg-[#0a0a0a] p-8 md:p-20 text-black">
                                <form className="space-y-6 md:space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#FF8C00] transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#FF8C00] transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#FF8C00] transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Message
                                        </label>
                                        <textarea className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter h-32 focus:outline-none focus:border-[#FF8C00] transition-colors resize-none"></textarea>
                                    </div>
                                    <button className="w-full bg-[#FF8C00] text-black font-bold py-5 md:py-6 hover:bg-white transition-colors duration-300 uppercase tracking-widest text-sm">
                                        SEND ENQUIRY
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="py-12 px-5 border-t border-stone-100">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <img src={logoBlack} className="h-6" />
                            <p className="text-gray-500 font-inter text-xs">
                                VANTAGE WORKPLACE SOLUTIONS LTD
                            </p>
                        </div>
                        <div className="flex gap-8 text-xs font-bold text-gray-400">
                            <span
                                className="hover:text-black cursor-pointer transition-colors"
                                onClick={() =>
                                    window.scrollTo({
                                        top: 0,
                                        behavior: "smooth",
                                    })
                                }
                            >
                                HOME
                            </span>
                            <span
                                className="hover:text-black cursor-pointer transition-colors"
                                onClick={() => navigate("/safety")}
                            >
                                SAFETY
                            </span>
                            <span className="hover:text-black cursor-pointer transition-colors">
                                PRIVACY POLICY
                            </span>
                        </div>
                        <p className="font-inter text-[10px] text-gray-600 uppercase tracking-widest">
                            © 2026 Part of the Vantage Group.
                        </p>
                    </div>
                </footer>
            </section>
        </div>
    );
};

export default LabourHire;
