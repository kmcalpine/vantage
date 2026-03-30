import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import headerImage from "./assets/header.jpg";
import logoBlack from "./assets/logo-black-icon.png";
import { Eye, Layers, ShieldCheck, UserCheck, Zap } from "lucide-react";
import Hero from "./components/Hero";
import Header from "./components/Header";
import { useScroll } from "./hooks/useScroll";

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

function Safety() {
    const servicesRef = useRef<HTMLDivElement>(null);
    const packagesRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const pricingRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    const scrollTo = useScrollTo();
    const navigate = useNavigate();
    const isScrolled = useScroll();

    return (
        <div className="font-sora bg-white text-black">
            <Header scrolled={isScrolled} />
            <Hero
                backgroundImage={headerImage}
                tagIcon={ShieldCheck}
                tagLabel="VANTAGE SAFETY SERVICES"
                title={
                    <>
                        PROTECTING PEOPLE.
                        <br />
                        <span className="text-[#22C55E]">MANAGING RISK.</span>
                    </>
                }
                description="Professional health & safety consultancy and CDM advisory solutions designed to keep your projects compliant and your workforce safe."
                primaryButtonText="ENQUIRE NOW"
                primaryButtonAction={() => scrollTo(contactRef)}
                secondaryButtonText="LABOUR SERVICES"
                secondaryButtonAction={() => navigate("/labour-hire")}
                themeColor="#22C55E"
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
                            <div className="w-20 h-1.5 bg-[#22C55E] mb-6 md:mb-10"></div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-10 tracking-tight leading-tight text-black">
                                EXPERT GUIDANCE. <br />
                                <span className="text-[#22C55E]">
                                    TOTAL COMPLIANCE.
                                </span>
                            </h2>
                            <p className="text-xl text-gray-800 font-inter leading-relaxed mb-6 md:mb-8">
                                At Vantage Safety Services, we provide clear,
                                practical, and reliable health & safety support
                                to construction, groundworks, and surfacing
                                businesses across the UK.
                            </p>
                            <p className="text-lg text-gray-600 font-inter leading-relaxed italic border-l-4 border-[#22C55E] pl-8 py-2">
                                "We specialise in delivering straightforward,
                                usable solutions designed to support busy sites
                                and fast-moving projects, without unnecessary
                                complexity."
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-stone-200 border border-stone-200">
                            {[
                                {
                                    title: "Senior Expertise",
                                    icon: UserCheck,
                                },
                                {
                                    title: "Independent Oversight",
                                    icon: Eye,
                                },
                                {
                                    title: "Scalable Support",
                                    icon: Layers,
                                },
                                {
                                    title: "Rapid Response",
                                    icon: Zap,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="p-8 md:p-10 bg-white flex flex-col items-center text-center hover:bg-stone-50 transition-colors group"
                                >
                                    <item.icon
                                        size={32}
                                        className="text-[#22C55E] mb-4 md:mb-6"
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

            {/* Consultancy Packages */}
            <section
                id="packages"
                ref={packagesRef}
                className="py-16 md:py-32 px-5 bg-gray-50 border-y border-stone-200"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-bold mb-4 md:mb-6 tracking-tight text-black">
                                CONSULTANCY PACKAGES
                            </h2>
                            <p className="text-gray-600 font-inter text-lg">
                                Comprehensive safety management solutions
                                tailored to your business needs and risk
                                profiles.
                            </p>
                        </div>
                        <div className="text-[#22C55E] font-bold text-sm tracking-widest border-b-2 border-[#22C55E] pb-2 uppercase">
                            Strategic Safety Partner
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-stone-200 border border-stone-200">
                        {PackageData.map((pkg, i) => (
                            <div
                                key={i}
                                className="bg-white p-8 md:p-10 flex flex-col group transition-colors"
                            >
                                <h3 className="text-lg font-bold mb-4 md:mb-6 text-black uppercase tracking-tight">
                                    {pkg.title}
                                </h3>
                                <p className="text-gray-600 font-inter text-sm mb-6 md:mb-10 leading-relaxed">
                                    {pkg.content.description}
                                </p>
                                <ul className="space-y-4 pt-6 md:pt-8 border-t border-stone-200">
                                    {pkg.content.items.map((item, j) => (
                                        <li
                                            key={j}
                                            className="flex items-start gap-3 text-[11px] font-bold uppercase tracking-widest text-black"
                                        >
                                            <div className="w-1.5 h-1.5 bg-[#22C55E] mt-0.5 shrink-0"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Detailed Services */}
            <div className="max-w-7xl mx-auto px-5">
                <section
                    id="services"
                    ref={servicesRef}
                    className="py-16 md:py-32"
                >
                    <Services />
                </section>
            </div>

            <section
                id="pricing"
                ref={pricingRef}
                className="py-16 md:py-32 px-5 bg-gray-50 border-y border-stone-200"
            >
                <div className="max-w-7xl mx-auto px-5">
                    <PriceTable />
                </div>
            </section>

            <section
                id="contact"
                ref={contactRef}
                className="min-h-screen flex flex-col bg-white"
            >
                <div className="flex-grow flex items-center py-8 md:py-20 px-5">
                    <div className="max-w-7xl mx-auto w-full">
                        <Contact />
                    </div>
                </div>

                <Footer />
            </section>
        </div>
    );
}

const individualPricings = [
    {
        title: "Site Inspections & Audits",
        items: [
            {
                title: "Half-day Inspection",
                notes: "Ideal for smaller sites or specific audits",
            },
            {
                title: "Full-day Audit",
                notes: "Comprehensive site-wide compliance review",
            },
            {
                title: "Additional Site (Same Day)",
                notes: "Efficient multi-site coverage",
            },
        ],
    },
    {
        title: "RAMS & CDM",
        items: [
            {
                title: "RAMS Review",
                notes: "Third-party independent verification",
            },
            {
                title: "Bespoke RAMS Creation",
                notes: "Task-specific safe systems of work",
            },
            {
                title: "Construction Phase Plan (CPP)",
                notes: "Full project-start documentation",
            },
            {
                title: "CDM Advisory Support",
                notes: "Appointed advisor for duty holders",
            },
        ],
    },
    {
        title: "Accidents & Enforcement",
        items: [
            {
                title: "Accident Investigation",
                notes: "Root cause analysis & reporting",
            },
            {
                title: "RIDDOR Investigation",
                notes: "Official regulatory reporting support",
            },
            {
                title: "HSE Enforcement Support",
                notes: "Immediate advice for HSE visits",
            },
        ],
    },
    {
        title: "Policies & Systems",
        items: [
            {
                title: "H&S Policy Review / Creation",
                notes: "Annual compliance updates",
            },
            {
                title: "SSIP Applications",
                notes: "CHAS, SMAS & Constructionline support",
            },
            {
                title: "COSHH Assessments",
                notes: "Hazardous substance management",
            },
        ],
    },
];

const PriceTable = () => {
    return (
        <div className="flex flex-col gap-16 md:gap-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                <div className="max-w-3xl">
                    <div className="w-16 h-1 bg-[#22C55E] mb-8"></div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-black uppercase">
                        INDIVIDUAL{" "}
                        <span className="text-[#22C55E]">SERVICES</span>
                    </h2>
                    <p className="text-gray-600 font-inter text-xl leading-relaxed">
                        Specialist ad-hoc support for contractors and
                        developers. Professional guidance provided on a
                        project-by-project basis nationwide.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {individualPricings.map((category, i) => (
                    <div
                        key={i}
                        className="flex flex-col border border-stone-200 bg-white p-8"
                    >
                        <div className="flex flex-col gap-6">
                            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-[#22C55E] border-b border-[#22C55E]/20 pb-4">
                                {category.title}
                            </h3>

                            <div className="flex flex-col divide-y divide-stone-200/60">
                                {category.items.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="group relative py-6 transition-all duration-300 -mx-4 px-4"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold uppercase tracking-widest text-black mb-2 leading-tight group-hover:text-[#22C55E] transition-colors">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm text-gray-500 font-inter leading-relaxed max-w-md">
                                                    {item.notes}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PackageData = [
    {
        id: "starter",
        title: "COMPLIANCE ASSURANCE",
        content: {
            description:
                "For contractors needing reliable, professional H&S cover",
            items: [
                "Appointed Competent Person",
                "Senior consultant advice (phone & email)",
                "Annual H&S policy & legal register review",
                "Up to 6 RAMS reviews per month",
                "1 formal site inspection per quarter",
                "Inspection reports with prioritised actions",
                "Incident advice & corrective actions",
                "SSIP maintenance (CHAS, SMAS, Constructionline)",
            ],
        },
    },
    {
        id: "core",
        title: "OPERATIONAL RISK MANAGEMENT",
        content: {
            description: "For contractors delivering higher risk works",
            items: [
                "Competent Person + Operational H&S Partner",
                "Priority consultant access",
                "2 structured site inspections per month",
                "Management level reports & trend analysis",
                "Up to 8 RAMS reviews per month",
                "CPP creation or review (up to 2 per year)",
                "Accident & RIDDOR investigation support",
                "Client audit & pre-start meeting attendance",
                "Monthly management compliance summary",
                "Full SSIP management & renewals",
            ],
        },
    },
    {
        id: "complete",
        title: "STRATEGIC H&S PARTNERSHIP",
        content: {
            description: "Full outsourced safety support for busy contractors",
            items: [
                "Named Senior / Principal H&S Consultant",
                "Full Competent Person & strategic advisory role",
                "Weekly or fortnightly site inspections",
                "Unlimited RAMS review",
                "All CPPs included",
                "Full accident investigation & HSE liaison",
                "Director & senior leadership briefings",
                "Annual H&S strategy & improvement roadmap",
                "KPI dashboards & performance reporting",
                "Toolbox talks (up to 8 per year)",
                "Client facing meetings & audit attendance",
                "Same day incident response support",
            ],
        },
    },
];

const Contact = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        try {
            const res = await fetch("http://localhost:8085/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    message,
                }),
            });
            if (res.status === 200) {
                setSuccess(true);
                setFirstName("");
                setLastName("");
                setEmail("");
                setMessage("");
            }
        } catch (error) {
            console.error("Error sending email:", error);
        }
        setLoading(false);
    };

    return (
        <div className="bg-black text-white flex flex-col lg:flex-row border border-gray-800">
            <div className="lg:w-1/2 p-8 md:p-20 border-b lg:border-b-0 lg:border-r border-gray-800">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 tracking-tight uppercase">
                    REQUEST <span className="text-[#22C55E]">SUPPORT</span>
                </h2>
                <p className="text-gray-400 font-inter text-lg mb-8 md:mb-12 leading-relaxed">
                    If you have any questions, need support, or just want to get
                    in touch, we’re here to help. Simply fill out the contact
                    form and a member of our team will get back to you as soon
                    as possible.
                </p>
                <div className="space-y-6 md:space-y-8">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 border border-gray-800 flex items-center justify-center">
                            <Zap size={20} className="text-[#22C55E]" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">
                            Fast Response Time
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 border border-gray-800 flex items-center justify-center">
                            <ShieldCheck size={20} className="text-[#22C55E]" />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-widest">
                            Expert Professional Advice
                        </span>
                    </div>
                </div>
            </div>
            <div className="lg:w-1/2 bg-[#0a0a0a] p-8 md:p-20 text-black">
                <form onSubmit={sendEmail} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#22C55E] transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#22C55E] transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#22C55E] transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter h-32 focus:outline-none focus:border-[#22C55E] transition-colors resize-none"
                        ></textarea>
                    </div>

                    {success && (
                        <p className="text-[#22C55E] font-bold text-center">
                            Thank you! We'll get back to you soon.
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className={`w-full bg-[#22C55E] text-black font-bold py-5 md:py-6 hover:bg-white transition-colors duration-300 uppercase tracking-widest text-sm ${loading ? "opacity-50" : ""}`}
                    >
                        {loading ? "SENDING..." : "SEND ENQUIRY"}
                    </button>
                </form>
            </div>
        </div>
    );
};

const _services = [
    {
        id: "accreditations",
        title: "Accreditations",
        icon: ShieldCheck,
        legislation: "SSIP / PAS91",
        description:
            "Our Accreditation Support service helps your business achieve recognised standards such as CHAS, SMAS, SafeContractor, and Constructionline.",
        sections: [
            {
                title: "Selection & Review",
                content:
                    "We assess your current health & safety setup and identify the accreditation level most suitable for your business, including a full gap analysis.",
            },
            {
                title: "Evidence Preparation",
                content:
                    "Preparation of all essential documents: H&S Policy, RAMS, training matrices, and competence records aligned with current standards.",
            },
            {
                title: "Assessor Liaison",
                content:
                    "We handle the full submission process and communicate directly with scheme assessors to manage requests for additional information.",
            },
        ],
    },
    {
        id: "rams",
        title: "Risk & Method Statements",
        icon: Zap,
        legislation: "MHSWR 1999",
        description:
            "Professionally written, task-specific RAMS tailored to your actual methodology—not generic templates.",
        sections: [
            {
                title: "Bespoke Compilation",
                content:
                    "Detailed assessments covering hazards, control measures, plant requirements, and site-specific sequencing.",
            },
            {
                title: "Review & Refinement",
                content:
                    "Independent review of existing RAMS for compliance with HASWA, MHSWR, and CDM expectations.",
            },
            {
                title: "High-Risk Specialist",
                content:
                    "Expert documentation for excavations, confined spaces, hot works, lifting operations, and work at height.",
            },
        ],
    },
    {
        id: "policies",
        title: "Policies & Systems",
        icon: Layers,
        legislation: "HASWA 1974",
        description:
            "Clear, compliant, and practical H&S, Environmental, and Quality policies designed to reflect how your company actually operates.",
        sections: [
            {
                title: "System Creation",
                content:
                    "Development of professional policies specific to your organisation, including Lone Working, PPE, and Driving policies.",
            },
            {
                title: "ISO Alignment",
                content:
                    "Integrated management content aligned with ISO 9001, 14001, and 45001 frameworks.",
            },
            {
                title: "Maintenance",
                content:
                    "Annual policy updates and revisions for audits, client requests, or accreditation renewals.",
            },
        ],
    },
    {
        id: "site-inspections",
        title: "Site Inspections",
        icon: Eye,
        legislation: "CDM 2015",
        description:
            "Independent, detailed site inspections and audits to identify risks and demonstrate compliance to Principal Contractors.",
        sections: [
            {
                title: "Physical Audits",
                content:
                    "Comprehensive assessment of site setup, welfare, plant, and workforce behaviour with photographic evidence.",
            },
            {
                title: "Technical Reporting",
                content:
                    "Professional reports detailing identified hazards, positive observations, and prioritised corrective actions.",
            },
            {
                title: "Monitoring Programmes",
                content:
                    "Planned monthly or quarterly inspection schedules to continuously monitor performance across multiple sites.",
            },
        ],
    },
];

const Services = () => {
    const [active, setActive] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const intersecting = entries.filter((e) => e.isIntersecting);
                if (intersecting.length > 0) {
                    // Always pick the one closest to the top margin if multiple intersect
                    const mostVisible = intersecting.reduce((prev, curr) =>
                        curr.boundingClientRect.top <
                        prev.boundingClientRect.top
                            ? curr
                            : prev,
                    );
                    setActive(mostVisible.target.id);
                }
            },
            { rootMargin: "-20% 0px -70% 0px", threshold: 0 },
        );

        _services.forEach((s) => {
            const element = sectionRefs.current[s.id];
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id: string) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        setActive(id); // Immediately update UI
        const y = el.getBoundingClientRect().top + window.scrollY - 160;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
            <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                    <div className="w-12 h-1 bg-[#22C55E] mb-6"></div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-black uppercase">
                        OUR <br />
                        <span className="text-[#22C55E]">SERVICES</span>
                    </h2>
                    <div className="flex-col gap-2 hidden md:flex">
                        {_services.map((s) => (
                            <button
                                key={s.id}
                                className={`text-left py-3 px-4 border-l-2 transition-all duration-300 ${
                                    active === s.id
                                        ? "border-[#22C55E] bg-gray-50 text-black font-bold"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                                onClick={() => scrollToSection(s.id)}
                            >
                                <span className="text-xs uppercase tracking-widest">
                                    {s.title}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-24 md:gap-32">
                {_services.map((s) => (
                    <div
                        key={s.id}
                        id={s.id}
                        ref={(el) => {
                            sectionRefs.current[s.id] = el;
                        }}
                        className="scroll-mt-32"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="px-3 py-1 bg-gray-100 text-[10px] font-bold tracking-widest text-gray-500 uppercase border border-gray-200">
                                LEG: {s.legislation}
                            </div>
                            <div className="h-px flex-grow bg-stone-200"></div>
                        </div>

                        <div className="flex items-start gap-6 mb-8">
                            <div className="w-14 h-14 bg-[#22C55E]/15 text-[#22C55E] flex items-center justify-center shrink-0">
                                <s.icon size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight uppercase">
                                    {s.title}
                                </h3>
                                <p className="text-lg text-gray-600 font-inter leading-relaxed max-w-2xl">
                                    {s.description}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200 border border-stone-200">
                            {s.sections.map((section, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-8 hover:bg-gray-50 transition-colors group"
                                >
                                    <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#22C55E]">
                                        {section.title}
                                    </h4>
                                    <p className="text-sm text-gray-500 font-inter leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="py-12 px-5 border-t border-stone-100 bg-white text-black">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img src={logoBlack} className="h-6" alt="Vantage Logo" />
                    <p className="text-gray-500 font-inter text-xs">
                        VANTAGE SAFETY SERVICES LTD
                    </p>
                </div>
                <p className="font-inter text-[10px] text-gray-600 uppercase tracking-widest">
                    © 2026 Part of the Vantage Group.
                </p>
            </div>
        </footer>
    );
};

export default Safety;
