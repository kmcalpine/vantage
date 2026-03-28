import { useState, useEffect, useCallback, useRef } from "react";
import logo from "./assets/logo.png";
import logoWhite from "./assets/logo-white.png";
import {
    HardHat,
    ShieldCheck,
    Users,
    CheckCircle,
    Construction,
    Briefcase,
    Trophy,
    Target,
    Zap,
    ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";

const LabourHire = () => {
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    const aboutRef = useRef<HTMLDivElement>(null);
    const servicesRef = useRef<HTMLDivElement>(null);
    const differenceRef = useRef<HTMLDivElement>(null);
    const sectorsRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    const useScrollTo = () => {
        return useCallback((ref: React.RefObject<HTMLElement>) => {
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
            if (window.scrollY > 120) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        {
            label: "Home",
            action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        { label: "About Us", action: () => scrollTo(aboutRef) },
        { label: "Services", action: () => scrollTo(servicesRef) },
        { label: "Our Difference", action: () => scrollTo(differenceRef) },
        { label: "Sectors", action: () => scrollTo(sectorsRef) },
    ];

    return (
        <div className="font-sora bg-white text-black">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
                <div 
                    className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000"
                    style={{ transform: "scale(1.08)" }}
                ></div>
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-[#FF8C00] text-black px-4 py-1 rounded-full text-xs font-bold mb-6">
                            <Users size={14} />
                            VANTAGE WORKPLACE SOLUTIONS
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                            SKILLED LABOUR.
                            <br />
                            <span className="text-[#FF8C00]">SAFETY LED.</span>
                        </h1>
                        <p className="mt-8 text-xl text-gray-300 font-inter leading-relaxed">
                            At Vantage Workplace Solutions, we provide skilled
                            labour and safety led workforce solutions to the
                            construction industry.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-5">
                            <button
                                onClick={() => scrollTo(contactRef)}
                                className="bg-[#FF8C00] text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-white transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                HIRE WORKFORCE <ArrowRight size={20} />
                            </button>
                            <button
                                onClick={() => navigate("/safety")}
                                className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition cursor-pointer"
                            >
                                SAFETY SERVICES
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Introduction & Specialism */}
            <section id="about" ref={aboutRef} className="py-24 px-5 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-8">
                                COMPETENT PEOPLE,{" "}
                                <span className="text-[#FF8C00]">
                                    QUALITY DELIVERY.
                                </span>
                            </h2>
                            <p className="text-lg text-gray-700 font-inter leading-relaxed mb-6">
                                We specialise in supplying competent groundworks
                                operatives, resurfacing teams, machine
                                operators, and qualified site
                                supervisors/managers, all selected for their
                                experience, reliability, and commitment to
                                working safely.
                            </p>
                            <p className="text-lg text-gray-700 font-inter leading-relaxed italic border-l-4 border-[#FF8C00] pl-6">
                                "We don’t just supply labour — we provide people
                                who understand site expectations, follow safe
                                systems of work, and deliver quality from day
                                one."
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
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
                                    className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center text-center"
                                >
                                    <item.icon
                                        size={32}
                                        className="text-[#FF8C00] mb-4"
                                    />
                                    <span className="font-bold text-sm">
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
                className="py-24 px-5 bg-gray-50"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">WHAT WE DO</h2>
                        <p className="text-gray-600 font-inter">
                            Skilled workforce solutions across groundworks,
                            resurfacing, and civil engineering.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                title: "Groundworks Operatives",
                                desc: "Drainage, foundations, plot works, kerbing, and finishing.",
                                features: [
                                    "Housing & Infrastructure",
                                    "Drainage & Foundations",
                                    "Finishing Works",
                                ],
                            },
                            {
                                title: "Resurfacing Operatives",
                                desc: "Tarmac and reinstatement works for roads and footpaths.",
                                features: [
                                    "Roads & Footpaths",
                                    "Patching Works",
                                    "Reinstatement",
                                ],
                            },
                            {
                                title: "Machine Operators",
                                desc: "CPCS / NPORS qualified operators for all plant types.",
                                features: [
                                    "Excavators & Dumpers",
                                    "Rollers & Pavers",
                                    "Safe Lifting Awareness",
                                ],
                            },
                            {
                                title: "Management & Supervision",
                                desc: "SSSTS and SMSTS qualified leads for project delivery.",
                                features: [
                                    "Site Supervisors",
                                    "Site Managers",
                                    "Coordination & Safety",
                                ],
                            },
                        ].map((service, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col"
                            >
                                <h3 className="text-xl font-bold mb-4 text-[#FF8C00]">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 font-inter text-sm mb-6 flex-grow">
                                    {service.desc}
                                </p>
                                <ul className="space-y-3">
                                    {service.features.map((f, j) => (
                                        <li
                                            key={j}
                                            className="flex items-center gap-2 text-xs font-bold text-gray-800"
                                        >
                                            <div className="w-1.5 h-1.5 bg-[#FF8C00] rounded-full"></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Flexible Support */}
                    <div className="mt-16 bg-black text-white p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">
                                Flexible Workforce Support
                            </h3>
                            <p className="text-gray-400 font-inter">
                                Tailored supply to meet your project's specific
                                demands.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {[
                                "Short-term Cover",
                                "Long-term Placements",
                                "Full Gang Supply",
                                "Individual Specialists",
                            ].map((t, i) => (
                                <span
                                    key={i}
                                    className="bg-white/10 px-5 py-2 rounded-full text-xs font-bold border border-white/20"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Difference */}
            <section
                id="difference"
                ref={differenceRef}
                className="py-24 px-5 bg-white overflow-hidden"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/3">
                            <h2 className="text-4xl font-bold mb-6 text-black">
                                OUR{" "}
                                <span className="text-[#FF8C00]">
                                    DIFFERENCE
                                </span>
                            </h2>
                            <p className="text-gray-600 font-inter leading-relaxed">
                                Unlike typical labour providers, we are backed
                                by practical health & safety experience and a
                                deep understanding of the groundworks and
                                surfacing trades.
                            </p>
                        </div>
                        <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div>
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                                    <ShieldCheck className="text-[#FF8C00]" />
                                </div>
                                <h4 className="font-bold mb-4">Safety Led</h4>
                                <p className="text-sm text-gray-600 font-inter leading-relaxed">
                                    Our operatives understand RAMS and safe
                                    systems of work, leading to higher standards
                                    of site behaviour and reduced risk.
                                </p>
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                                    <Target className="text-[#FF8C00]" />
                                </div>
                                <h4 className="font-bold mb-4">
                                    Quality & Reliability
                                </h4>
                                <p className="text-sm text-gray-600 font-inter leading-relaxed">
                                    We prioritise people who turn up and
                                    perform, ensuring work is completed to the
                                    correct standard with a strong work ethic.
                                </p>
                            </div>
                            <div>
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
                                    <Construction className="text-[#FF8C00]" />
                                </div>
                                <h4 className="font-bold mb-4">
                                    Industry Experience
                                </h4>
                                <p className="text-sm text-gray-600 font-inter leading-relaxed">
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
                className="py-24 px-5 bg-gray-900 text-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-10">
                                SECTORS WE SUPPORT
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                                {[
                                    "Housebuilding Developments",
                                    "Groundworks & Civil Engineering",
                                    "Utilities & Infrastructure",
                                    "Local Authority Projects",
                                    "Commercial Construction",
                                ].map((sector, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 bg-[#FF8C00] rounded-full"></div>
                                        <span className="font-bold text-sm tracking-wide">
                                            {sector}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-white/5 p-12 rounded-3xl border border-white/10 text-center">
                            <h3 className="text-[#FF8C00] text-sm font-bold tracking-widest mb-4">
                                OUR PROMISE
                            </h3>
                            <p className="text-2xl font-bold leading-relaxed mb-8">
                                We aim to deliver more than labour — we provide
                                trusted, competent individuals who contribute to
                                the success of your project.
                            </p>
                            <div className="justify-center gap-6 text-xs font-bold uppercase tracking-widest text-[#FF8C00] hidden md:flex">
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

            {/* Contact Section */}
            <section
                id="contact-labour"
                ref={contactRef}
                className="py-24 px-5 bg-white"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="bg-black text-white rounded-[40px] overflow-hidden flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 p-12 md:p-20">
                            <h2 className="text-4xl font-bold mb-8">
                                REQUEST WORKFORCE
                            </h2>
                            <p className="text-gray-400 font-inter text-lg mb-10">
                                Need skilled, safety-conscious labour for your
                                project? Get in touch with our team today to
                                discuss your requirements.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#FF8C00]/20 rounded-full flex items-center justify-center">
                                        <Zap
                                            size={18}
                                            className="text-[#FF8C00]"
                                        />
                                    </div>
                                    <span className="font-bold">
                                        Rapid Response Support
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#FF8C00]/20 rounded-full flex items-center justify-center">
                                        <Users
                                            size={18}
                                            className="text-[#FF8C00]"
                                        />
                                    </div>
                                    <span className="font-bold">
                                        Fully Vetted Workforce
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-gray-50 p-12 md:p-20 text-black">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="w-full bg-white border border-gray-200 px-6 py-4 rounded-xl font-inter focus:outline-none focus:border-[#FF8C00]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="w-full bg-white border border-gray-200 px-6 py-4 rounded-xl font-inter focus:outline-none focus:border-[#FF8C00]"
                                    />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-white border border-gray-200 px-6 py-4 rounded-xl font-inter focus:outline-none focus:border-[#FF8C00]"
                                />
                                <textarea
                                    placeholder="How can we help?"
                                    className="w-full bg-white border border-gray-200 px-6 py-4 rounded-xl font-inter h-32 focus:outline-none focus:border-[#FF8C00]"
                                ></textarea>
                                <button className="w-full bg-black text-white font-bold py-5 rounded-xl hover:bg-[#FF8C00] transition duration-300">
                                    SEND ENQUIRY
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-16 px-5 border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <img src={logoWhite} className="h-4" />
                        <p className="text-gray-500 font-inter text-xs">
                            VANTAGE WORKPLACE SOLUTIONS LTD
                        </p>
                    </div>
                    <div className="flex gap-8 text-xs font-bold text-gray-400">
                        <span
                            className="hover:text-white cursor-pointer"
                            onClick={() =>
                                window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                        >
                            HOME
                        </span>
                        <span
                            className="hover:text-white cursor-pointer"
                            onClick={() => navigate("/safety")}
                        >
                            SAFETY
                        </span>
                        <span className="hover:text-white cursor-pointer">
                            PRIVACY POLICY
                        </span>
                    </div>
                    <p className="font-inter text-[10px] text-gray-600 uppercase tracking-widest">
                        © 2026 Part of the Vantage Group.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LabourHire;
