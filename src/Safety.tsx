import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import header828 from "./assets/header-828.webp";
import header1280 from "./assets/header-1280.webp";
import header1920 from "./assets/header-1920.webp";
import logoBlack from "./assets/logo-black-icon.png";
import pillarExpertise from "./assets/pillar-expertise.webp";
import pillarOversight from "./assets/pillar-oversight.webp";
import pillarScalable from "./assets/pillar-scalable.webp";
import pillarResponse from "./assets/pillar-response.webp";

const headerSrcSet = `${header828} 828w, ${header1280} 1280w, ${header1920} 1920w`;
import { Check, Eye, Layers, ShieldCheck, UserCheck, Zap } from "lucide-react";
import Hero from "./components/Hero";
import Header from "./components/Header";
import { useScroll } from "./hooks/useScroll";
import PortalLink from "./components/PortalLink";

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
            <Header
                scrolled={isScrolled}
                contactAction={() => scrollTo(contactRef)}
                themeColor="#22C55E"
            />
            <Hero
                backgroundImage={header1280}
                backgroundImageSrcSet={headerSrcSet}
                backgroundImageAlt="Aerial view of a large UK construction site under active groundworks"
                tagIcon={ShieldCheck}
                tagLabel="YOUR OUTSOURCED HEALTH & SAFETY TEAM"
                title={
                    <>
                        HEALTH &amp; SAFETY
                        <br />
                        CONSULTANTS FOR
                        <br />
                        <span className="text-[#22C55E]">CONSTRUCTION</span>
                    </>
                }
                description="Wiltshire-based health & safety consultancy and CDM advisory for construction, groundworks and surfacing contractors."
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
                className="px-5 bg-white overflow-x-hidden"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
                        <div>
                            <div className="w-20 h-1.5 bg-[#22C55E] mb-6 md:mb-10"></div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-10 tracking-tight leading-tight text-black">
                                HEALTH &amp; SAFETY SUPPORT FOR{" "}
                                <span className="text-[#22C55E]">
                                    WILTSHIRE CONTRACTORS
                                </span>
                            </h2>
                            <p className="text-xl text-gray-800 font-inter leading-relaxed mb-6 md:mb-8">
                                Vantage Safety Services Ltd is a Wiltshire-based
                                consultancy providing clear, practical, and
                                reliable health &amp; safety support to
                                construction, groundworks, and surfacing
                                businesses across Wiltshire — including Swindon,
                                Salisbury, Chippenham, Trowbridge and Devizes.
                            </p>
                        </div>
                        <SupportPillars />
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
                                ON GOING HEALTH &amp; SAFETY SUPPORT
                            </h2>
                            <p className="text-gray-600 font-inter text-lg">
                                Choose the level of support that suits your
                                business.
                            </p>
                            <p className="text-gray-600 font-inter text-lg pt-5">
                                Our retained packages give construction
                                businesses access to professional H&S support
                                for a predictable monthly cost, with additional
                                project-specific services available when
                                required.
                            </p>
                        </div>
                    </div>

                    <PackageTable />
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
                <div className="max-w-7xl mx-auto">
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
                        INDIVIDUAL H&amp;S{" "}
                        <span className="text-[#22C55E]">SERVICES</span>
                    </h2>
                    <p className="text-gray-600 font-inter text-xl leading-relaxed">
                        Specialist ad-hoc support for contractors and
                        developers. Professional guidance provided on a
                        project-by-project basis across Wiltshire.
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

type PackageCell =
    | boolean
    | { text: string; note?: string; emphasis?: boolean };

const packageTiers = [
    { name: "Essential", price: "£295", highlight: false },
    { name: "Compliance", price: "£595", highlight: true },
    { name: "Partner", price: "£995", highlight: false },
];

const packageFeatures: { label: string; cells: PackageCell[] }[] = [
    { label: "Named Competent Person", cells: [true, true, true] },
    {
        label: "Vantage Competent Person Certificate",
        cells: [true, true, true],
    },
    { label: "Client Portal Access", cells: [true, true, true] },
    { label: "H&S Policy Annual Review", cells: [true, true, true] },
    { label: "Monthly Safety Bulletin", cells: [true, true, true] },
    { label: "Monthly Environmental Bulletin", cells: [true, true, true] },
    {
        label: "Resource Library (Templates & Guidance)",
        cells: [true, true, true],
    },
    {
        label: "General Advice (Phone / Email)",
        cells: [
            { text: "30 minutes" },
            { text: "1.5 hours" },
            { text: "3 hours" },
        ],
    },
    {
        label: "RAMS / Document Review",
        cells: [
            false,
            { text: "1 per month", note: "existing documents" },
            { text: "2 per month", note: "existing documents" },
        ],
    },
    {
        label: "Management Compliance Review",
        cells: [
            { text: "Annual" },
            { text: "6-monthly" },
            { text: "Quarterly" },
        ],
    },
    {
        label: "Training Matrix Review",
        cells: [false, { text: "6-monthly" }, { text: "Quarterly" }],
    },
    {
        label: "Site Inspection (including report)",
        cells: [false, false, { text: "1 every 2 months" }],
    },
    {
        label: "Discount on Additional Services",
        cells: [
            false,
            { text: "5%", emphasis: true },
            { text: "10%", emphasis: true },
        ],
    },
    { label: "Priority Support", cells: [false, false, true] },
];

/*
 * The Vantage mark leans its bars 16.8 degrees off vertical, parallel to the
 * leading stroke of the V. The tiles run a little steeper than the mark at
 * roughly 19.8 degrees (46px across a 128px tile), which reads as deliberate
 * at this scale where matching the logo exactly looked almost-but-not-quite.
 * Clipping rather than skewing keeps the photo and the label upright inside
 * the slanted frame.
 *
 * Stepping each tile right by exactly one --shear chains the bottom-left
 * corner of one onto the top-left corner of the next, so the four left edges
 * read as a single unbroken diagonal rather than a staircase.
 */
const PILLAR_CLIP =
    "polygon(0 0, calc(100% - var(--shear)) 0, 100% 100%, var(--shear) 100%)";

/*
 * Escapes the centred max-w-7xl column and its px-5 padding so the photos run
 * off the right of the viewport. The extra --shear pushes the tiles' diagonal
 * right edge past the screen, leaving a flush cut; the section clips the
 * overshoot so it never opens a horizontal scrollbar. Below sm --shear is 0,
 * so this reduces to the px-5 padding and the tiles sit flush to both edges.
 */
const PILLAR_BLEED =
    "calc((min(100vw, 80rem) - 100vw) / 2 - 1.25rem - var(--shear))";

const supportPillars = [
    { title: "Senior Expertise", icon: UserCheck, image: pillarExpertise },
    { title: "Independent Oversight", icon: Eye, image: pillarOversight },
    { title: "Scalable Support", icon: Layers, image: pillarScalable },
    { title: "Rapid Response", icon: Zap, image: pillarResponse },
];

const SupportPillars = () => {
    return (
        <ul
            // Below sm the tiles are plain full-bleed rectangles: --shear of 0
            // flattens the clip path to a rectangle and zeroes every step.
            className="flex flex-col -ml-5 sm:ml-0 [--shear:0px] sm:[--shear:clamp(22px,6vw,46px)]"
            style={{ marginRight: PILLAR_BLEED }}
        >
            {supportPillars.map((pillar, i) => (
                <li
                    key={pillar.title}
                    className="group relative h-28 md:h-48"
                    style={
                        {
                            clipPath: PILLAR_CLIP,
                            marginLeft: `calc(${i} * var(--shear))`,
                        } as React.CSSProperties
                    }
                >
                    <img
                        src={pillar.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35 transition-colors duration-300 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/20 motion-reduce:transition-none" />
                    <div className="relative h-full flex items-center gap-4 pl-[calc(var(--shear)+1.25rem)] sm:pl-[calc(var(--shear)+1.5rem)] pr-8">
                        <pillar.icon
                            size={26}
                            className="text-[#22C55E] shrink-0"
                            aria-hidden="true"
                        />
                        <span className="font-bold text-xs md:text-sm uppercase tracking-[0.2em] text-white leading-relaxed">
                            {pillar.title}
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const PackageCellValue = ({ cell }: { cell: PackageCell }) => {
    if (typeof cell === "boolean") {
        return cell ? (
            <>
                <Check
                    className="w-5 h-5 text-[#22C55E] mx-auto"
                    strokeWidth={3}
                    aria-hidden="true"
                />
                <span className="sr-only">Included</span>
            </>
        ) : (
            <>
                <span aria-hidden="true" className="text-stone-400">
                    –
                </span>
                <span className="sr-only">Not included</span>
            </>
        );
    }

    return (
        <>
            <span
                className={`font-inter text-black ${cell.emphasis ? "font-bold" : ""}`}
            >
                {cell.text}
            </span>
            {cell.note && (
                <span className="block font-inter text-xs text-gray-500 mt-0.5">
                    ({cell.note})
                </span>
            )}
        </>
    );
};

const PackageTable = () => {
    const lastRow = packageFeatures.length - 1;

    return (
        <>
            {/* Comparison table — desktop */}
            <table className="hidden lg:table w-full border-collapse border border-stone-200 text-sm">
                <caption className="sr-only">
                    Monthly health and safety consultancy packages compared by
                    feature
                </caption>
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="w-[34%] bg-black text-white text-left align-bottom px-6 py-6 font-bold uppercase tracking-tight text-lg"
                        >
                            Features
                        </th>
                        {packageTiers.map((tier) => (
                            <th
                                key={tier.name}
                                scope="col"
                                className={`px-6 py-6 text-center text-white ${
                                    tier.highlight
                                        ? "bg-[#22C55E] border-t-2 border-x-2 border-[#22C55E]"
                                        : "bg-black border-l border-gray-800"
                                }`}
                            >
                                <span className="block text-lg font-bold uppercase tracking-tight">
                                    {tier.name}
                                </span>
                                <span className="block font-inter text-base mt-1">
                                    {tier.price} / month
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {packageFeatures.map((feature, i) => (
                        <tr
                            key={feature.label}
                            className={i % 2 === 1 ? "bg-gray-50" : "bg-white"}
                        >
                            <th
                                scope="row"
                                className="px-6 py-4 text-left font-inter font-normal text-gray-700 border-t border-stone-200"
                            >
                                {feature.label}
                            </th>
                            {feature.cells.map((cell, j) => {
                                const tier = packageTiers[j];
                                return (
                                    <td
                                        key={tier.name}
                                        className={`px-6 py-4 text-center border-t border-t-stone-200 ${
                                            tier.highlight
                                                ? `border-x-2 border-x-[#22C55E] ${
                                                      i === lastRow
                                                          ? "border-b-2 border-b-[#22C55E]"
                                                          : ""
                                                  }`
                                                : "border-l border-l-stone-200"
                                        }`}
                                    >
                                        <PackageCellValue cell={cell} />
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Comparison table — stacked by tier on mobile */}
            <div className="lg:hidden flex flex-col gap-8">
                {packageTiers.map((tier, j) => (
                    <div
                        key={tier.name}
                        className={`bg-white ${
                            tier.highlight
                                ? "border-2 border-[#22C55E]"
                                : "border border-stone-200"
                        }`}
                    >
                        <div
                            className={`px-6 py-5 text-white ${tier.highlight ? "bg-[#22C55E]" : "bg-black"}`}
                        >
                            <h3 className="text-lg font-bold uppercase tracking-tight">
                                {tier.name}
                            </h3>
                            <p className="font-inter text-base mt-1">
                                {tier.price} / month
                            </p>
                        </div>
                        <dl className="px-6 py-2">
                            {packageFeatures.map((feature) => {
                                const cell = feature.cells[j];
                                const excluded = cell === false;
                                return (
                                    <div
                                        key={feature.label}
                                        className={`flex items-baseline justify-between gap-6 py-3 border-t border-stone-200 first:border-t-0 text-sm ${
                                            excluded ? "text-stone-400" : ""
                                        }`}
                                    >
                                        <dt
                                            className={`font-inter ${excluded ? "" : "text-gray-700"}`}
                                        >
                                            {feature.label}
                                        </dt>
                                        <dd className="shrink-0 text-right">
                                            <PackageCellValue cell={cell} />
                                        </dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </div>
                ))}
            </div>
        </>
    );
};

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
            // Ensure URL ends with a slash to avoid 301 redirect issues with CORS
            const res = await fetch(
                `https://api.vantagesafetyservices.co.uk/`,
                {
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
                },
            );
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
                            <label
                                htmlFor="firstName"
                                className="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                            >
                                First Name
                            </label>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#22C55E] transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="lastName"
                                className="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                            >
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#22C55E] transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-transparent border-b border-gray-800 px-0 py-3 text-white font-inter focus:outline-none focus:border-[#22C55E] transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="message"
                            className="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
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
        title: "SSIP Accreditation Support",
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
        title: "RAMS — Risk Assessments & Method Statements",
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
        title: "H&S Policies & Management Systems",
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
        title: "Site Inspections & Safety Audits",
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
                        OUR HEALTH &amp; SAFETY <br />
                        <span className="text-[#22C55E]">SERVICES</span>
                    </h2>
                    <nav className="flex-col gap-2 hidden md:flex">
                        {_services.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className={`text-left py-3 px-4 border-l-2 transition-all duration-300 ${
                                    active === s.id
                                        ? "border-[#22C55E] bg-gray-50 text-black font-bold"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(s.id);
                                }}
                            >
                                <span className="text-xs uppercase tracking-widest">
                                    {s.title}
                                </span>
                            </a>
                        ))}
                    </nav>
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
    return (
        <footer className="py-12 px-5 border-t border-stone-100 bg-white text-black">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img
                        src={logoBlack}
                        className="h-6"
                        alt="Vantage Safety Services"
                    />
                    <p className="text-gray-500 font-inter text-xs">
                        © 2026 VANTAGE SAFETY SERVICES LTD
                    </p>
                    <p className="text-gray-500 font-inter text-xs">
                        Wiltshire-based health &amp; safety consultancy and CDM
                        advisory. Serving Swindon, Salisbury, Chippenham,
                        Trowbridge, Devizes, Marlborough, Warminster and
                        Melksham.
                    </p>
                </div>

                {/* The footer already laid out two columns and only ever had
                    one. This is where a returning client looks once they have
                    scrolled past everything meant for a new one. */}
                <div className="flex flex-col items-center md:items-end gap-2">
                    <PortalLink />
                    <p className="text-gray-500 font-inter text-xs">
                        Existing clients — sign in to read your documents.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Safety;
