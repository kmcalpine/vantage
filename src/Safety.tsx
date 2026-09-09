import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import header828 from "./assets/header-828.webp";
import header1280 from "./assets/header-1280.webp";
import header1920 from "./assets/header-1920.webp";
import logoBlack from "./assets/logo-black-icon.png";

const headerSrcSet = `${header828} 828w, ${header1280} 1280w, ${header1920} 1920w`;
import {
    Check,
    ChevronDown,
    ClipboardList,
    Eye,
    FileText,
    Layers,
    Leaf,
    Search,
    ShieldCheck,
    Zap,
} from "lucide-react";
import Hero from "./components/Hero";
import Header from "./components/Header";
import { useScroll } from "./hooks/useScroll";
import PortalLink from "./components/PortalLink";
import SupportPillars from "./components/SupportPillars";
import PortalSection from "./components/PortalSection";
import ClientLogos from "./components/ClientLogos";

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
    //const pricingRef = useRef<HTMLDivElement>(null);
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
                // overflow-x-clip, not -hidden: `hidden` would make this element
                // the scroll container for the pinned pillars inside it and stop
                // them sticking. `clip` contains the tiles' right-edge bleed
                // without creating a scroll container.
                className="bg-white overflow-x-clip"
            >
                <SupportPillars />
            </section>

            <PortalSection />

            {/* Consultancy Packages */}
            <section
                id="packages"
                ref={packagesRef}
                className="py-16 md:py-32 px-5 border-y border-stone-200"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl font-bold mb-4 md:mb-6 tracking-tight text-black">
                                ON GOING HEALTH &amp; SAFETY SUPPORT
                            </h2>
                            {/*                  <p className="text-gray-600 font-inter text-lg">
                                Choose the level of support that suits your
                                business.
                            </p> */}
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
            <section
                id="services"
                ref={servicesRef}
                className="py-16 md:py-32 px-5 bg-stone-100"
            >
                <Services />
            </section>

            {/*             <section
                id="pricing"
                ref={pricingRef}
                className="py-16 md:py-32 px-5 bg-gray-50 border-y border-stone-200"
            >
                <div className="max-w-7xl mx-auto">
                    <PriceTable />
                </div>
            </section> */}

            <ClientLogos />

            <section
                id="contact"
                ref={contactRef}
                className="min-h-screen flex flex-col bg-[#22C55E]"
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

/* Commented out alongside PriceTable and the #pricing section.
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
*/

/* const PriceTable = () => {
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
 */
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

/*
 * The copy sits on the brand green, where white text measures 2.3:1 and fails
 * outright, so everything there is black (9.2:1) or black/70 (5.6:1). The form
 * sits on a white card instead, which is why the field borders are stone-500
 * rather than the lighter greys used elsewhere: on white, stone-300 is 1.5:1
 * and stone-400 is 2.5:1, both under the 3:1 a form control's edge needs.
 */
const FIELD =
    "w-full bg-white border border-stone-200 px-4 py-3 text-black font-inter placeholder-black/40 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-stone-700 transition-shadow";

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
        <div className="text-black grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
            <div className="lg:pr-8">
                <div className="w-20 h-1.5 bg-black mb-6 md:mb-10" />
                <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 tracking-tight uppercase">
                    Request support
                </h2>
                <p className="text-black/70 font-inter text-lg mb-8 md:mb-12 leading-relaxed max-w-md">
                    Questions, a job coming up, or a problem on site today —
                    fill this in and a consultant will come back to you.
                </p>
                <div className="space-y-4">
                    {[
                        { icon: Zap, label: "Fast response time" },
                        {
                            icon: ShieldCheck,
                            label: "Expert professional advice",
                        },
                    ].map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
                                <Icon size={20} className="text-[#22C55E]" />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-widest">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-8 md:p-12 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
                <form onSubmit={sendEmail} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                placeholder="First name"
                                autoComplete="given-name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className={FIELD}
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last name"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className={FIELD}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email address"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={FIELD}
                        />
                    </div>
                    <div className="space-y-2">
                        <textarea
                            id="message"
                            name="message"
                            placeholder="Your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            className={`${FIELD} h-32 resize-none`}
                        ></textarea>
                    </div>

                    {success && (
                        <p
                            role="status"
                            className="bg-black text-[#22C55E] font-bold text-sm uppercase tracking-widest px-4 py-3 text-center"
                        >
                            Thank you — we'll come back to you shortly.
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className={`w-full bg-black text-white font-bold py-5 md:py-6 uppercase tracking-widest text-sm transition-colors duration-300 hover:bg-stone-700 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
                            loading ? "opacity-50" : ""
                        }`}
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
        id: "rams",
        title: "RAMS — Risk Assessments & Method Statements",
        navLabel: "RAMS",
        icon: Zap,
        lede: "Task-specific risk assessments and method statements, written around your actual methodology rather than a template.",
        items: [
            "Hazards, control measures and plant requirements set out task by task",
            "Site-specific sequencing that matches how the work is really staged",
            "Independent review of existing RAMS against HASWA, MHSWR and CDM",
            "High-risk works: excavations, confined spaces, hot works, lifting and work at height",
        ],
    },
    {
        id: "cpp",
        title: "CPP — Construction Phase Plans",
        navLabel: "CPP",
        icon: ClipboardList,
        lede: "The plan that must be in place before a site opens.",
        items: [
            "Pre-construction information gathered, with the gaps identified early",
            "Site rules, welfare, traffic management and emergency arrangements",
            "The significant risks for the works actually in hand",
            "Revised as the phases change, so it still describes today's site",
        ],
    },
    {
        id: "cemp",
        title: "CEMP — Construction Environmental Management Plans",
        navLabel: "CEMP",
        icon: FileText,
        lede: "The environmental plan that commonly has to be approved before work can begin.",
        items: [
            "Written to the planning conditions and consents as actually worded",
            "Controls for dust, noise, vibration, water, waste and ecology",
            "Responsibilities named, so it is clear who does what on site",
            "The monitoring records that show the plan was followed",
        ],
    },
    {
        id: "site-inspections",
        title: "Site Inspections & Safety Audits",
        navLabel: "Inspections",
        icon: Eye,
        lede: "Independent inspections that find the problems while they are still cheap to fix.",
        items: [
            "Site setup, welfare, plant and workforce behaviour assessed on the ground",
            "Photographic evidence of both the hazards and what is being done well",
            "Written reports with corrective actions ranked by risk",
            "Monthly or quarterly programmes across multiple sites",
        ],
    },
    {
        id: "accreditations",
        title: "SSIP Accreditation Support",
        navLabel: "Accreditations",
        icon: ShieldCheck,
        lede: "CHAS, SMAS, SafeContractor and Constructionline, taken from gap analysis to approval.",
        items: [
            "Gap analysis against the scheme and level that suits your business",
            "Evidence prepared: policy, RAMS, training matrices and competence records",
            "Full submission handled, including requests for further information",
            "Renewals tracked so approval does not lapse between jobs",
        ],
    },
    {
        id: "investigations",
        title: "Accident & Incident Investigation",
        navLabel: "Investigations",
        icon: Search,
        lede: "Independent investigation, started quickly enough to be useful and recorded well enough to stand up later.",
        items: [
            "Same-day advice on securing the area and preserving evidence",
            "What must be reported, and by when",
            "Root cause established from interviews and the sequence of events",
            "Written findings, corrective actions and liaison with the HSE or your insurer",
        ],
    },
    {
        id: "policies",
        title: "H&S Policies & Management Systems",
        navLabel: "Policies",
        icon: Layers,
        lede: "Policies that describe how your company actually operates, not how a template says it should.",
        items: [
            "Health & safety, environmental and quality policies written for your organisation",
            "The specifics too: lone working, PPE, driving and site-specific arrangements",
            "Integrated management content aligned to ISO 9001, 14001 and 45001",
            "Annual review, and updates for audits, client requests or renewals",
        ],
    },
    {
        id: "environmental",
        title: "Environmental Management",
        navLabel: "Environmental",
        icon: Leaf,
        lede: "Waste, permits and duty of care handled inside your safety system rather than alongside it.",
        items: [
            "Waste transfer notes, carrier checks and consignment records kept in order",
            "Permits, exemptions and consents identified before the work starts",
            "Practical controls for spills, storage and watercourse protection",
            "Environmental arrangements built into the same system as your H&S",
        ],
    },
];

const Services = () => {
    const [active, setActive] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    /*
     * Below lg each service collapses behind its own title: eight expanded
     * blocks is a very long scroll on a phone. The breakpoint is restated here
     * rather than read from the CSS because this decides which *element* is
     * rendered — a heading at lg, a disclosure button below it — and a button
     * that does nothing would still be focusable and announced as a button.
     * Initialised synchronously so desktop never paints a collapsed frame.
     */
    const [isDesktop, setIsDesktop] = useState(
        () => window.matchMedia("(min-width: 64rem)").matches,
    );
    const [openId, setOpenId] = useState<string>(_services[0].id);

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 64rem)");
        const update = () => setIsDesktop(mq.matches);
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

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
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
            <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-32">
                    <div className="w-12 h-1 bg-[#22C55E] mb-6"></div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight text-black uppercase">
                        OUR HEALTH &amp; SAFETY <br />
                        <span className="text-[#22C55E]">SERVICES</span>
                    </h2>
                    <nav className="flex-col gap-px hidden lg:flex">
                        {_services.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                className={`flex gap-5 text-left py-5 px-5 border-l-5 transition-all duration-300 ${
                                    active === s.id
                                        ? "border-[#22C55E] bg-white text-black font-bold"
                                        : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(s.id);
                                }}
                            >
                                <span>
                                    <s.icon size={18} />
                                </span>
                                <span className="text-xs uppercase tracking-widest">
                                    {s.navLabel}
                                </span>
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col lg:gap-32">
                {_services.map((s) => {
                    const expanded = isDesktop || openId === s.id;
                    return (
                        <div
                            key={s.id}
                            id={s.id}
                            ref={(el) => {
                                sectionRefs.current[s.id] = el;
                            }}
                            className="scroll-mt-32 border-b border-stone-200 lg:border-b-0"
                        >
                            {isDesktop ? (
                                <div className="flex items-start gap-6 mb-8 border-l-5 border-[#22C55E] pl-6">
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight uppercase">
                                            {s.title}
                                        </h3>
                                        <p className="text-lg text-gray-600 font-inter leading-relaxed max-w-2xl">
                                            {s.lede}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <h3>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenId(
                                                openId === s.id ? "" : s.id,
                                            )
                                        }
                                        aria-expanded={expanded}
                                        aria-controls={`${s.id}-panel`}
                                        className="w-full flex items-center justify-between gap-5 py-6 text-left cursor-pointer group"
                                    >
                                        <span className="text-lg font-bold tracking-tight uppercase group-hover:text-[#22C55E] transition-colors">
                                            {s.title}
                                        </span>
                                        <ChevronDown
                                            size={20}
                                            aria-hidden="true"
                                            className={`shrink-0 text-[#22C55E] transition-transform duration-300 motion-reduce:transition-none ${
                                                expanded ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                </h3>
                            )}

                            <div
                                id={`${s.id}-panel`}
                                hidden={!expanded}
                                className="pb-8 lg:pb-0"
                            >
                                {!isDesktop && (
                                    <p className="text-base text-gray-600 font-inter leading-relaxed mb-6">
                                        {s.lede}
                                    </p>
                                )}
                                <ul className="border-t border-stone-200">
                                    {s.items.map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-5 py-5 border-b border-stone-200 last:border-b-0 lg:last:border-b"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="w-1.5 h-1.5 mt-2.5 shrink-0 bg-[#22C55E]"
                                            />
                                            <span className="text-base md:text-md text-gray-700 font-inter leading-relaxed">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

/*
 * Anchors for the in-page links. #pricing is deliberately absent: that section
 * is commented out, and a footer link to an id that is not in the document
 * silently does nothing.
 */
const footerLinks = [
    { href: "#about", label: "Why Vantage" },
    { href: "#packages", label: "Packages" },
    { href: "#services", label: "Services" },
    { href: "#portal", label: "Client Portal" },
    { href: "#contact", label: "Contact" },
];

const Footer = () => {
    return (
        <footer className="border-t border-stone-200 bg-white text-black">
            <div className="max-w-7xl mx-auto md:px-0 px-5 py-14 md:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr] gap-12 md:gap-16">
                <div className="flex flex-col gap-5">
                    <img
                        src={logoBlack}
                        className="h-6 self-start"
                        alt="Vantage Safety Services"
                    />
                    <p className="text-gray-600 font-inter text-sm leading-relaxed max-w-sm">
                        Wiltshire-based health &amp; safety consultancy and CDM
                        advisory. Serving Swindon, Salisbury, Chippenham,
                        Trowbridge, Devizes, Marlborough, Warminster and
                        Melksham.
                    </p>
                </div>

                <nav aria-label="Footer">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-5">
                        Explore
                    </h2>
                    <ul className="flex flex-col gap-3">
                        {footerLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="font-inter text-sm text-gray-700 hover:text-black transition-colors"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-5">
                        Registered
                    </h2>
                    <dl className="flex flex-col gap-3 font-inter text-sm">
                        <div className="flex flex-col">
                            <dt className="text-gray-500">Companies House</dt>
                            <dd className="text-gray-800">16923133</dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="text-gray-500">ICO registration</dt>
                            <dd className="text-gray-800">ZC235091</dd>
                        </div>
                    </dl>
                </div>

                {/* Where a returning client looks, once they have scrolled
                    past everything meant for a new one. */}
                <div>
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-5">
                        Existing clients
                    </h2>
                    <PortalLink />
                    <p className="text-gray-600 font-inter text-sm leading-relaxed mt-3 max-w-xs">
                        Sign in to read your documents.
                    </p>
                </div>
            </div>

            <div className="border-t border-stone-200">
                <div className="max-w-7xl mx-auto px-5 py-6">
                    <p className="text-gray-500 font-inter text-xs">
                        © 2026 Vantage Safety Services Ltd
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Safety;
