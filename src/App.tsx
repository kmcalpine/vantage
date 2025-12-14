import "./index.css";
import headerImage from "./assets/header.jpg";
import aboutImage from "./assets/about.jpg";
import logo from "./assets/logo.png";
import logoWhite from "./assets/logo-white.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { CircleCheck, Menu } from "lucide-react";

function App() {
    const servicesRef = useRef<HTMLDivElement>(null);
    const packagesRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const contactRef = useRef<HTMLDivElement>(null);

    const sectionRefs = {
        services: servicesRef,
        packages: packagesRef,
        about: aboutRef,
        contact: contactRef,
    };

    const [scrolled, setScrolled] = useState(false);

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

    return (
        <>
            <div className="px-5 md:px-10 2xl:px-60">
                <Header scrolled={scrolled} sectionRefs={sectionRefs} />
                <Hero scrolled={scrolled} />

                <section ref={aboutRef} className="py-20 flex gap-30">
                    <About contactRef={contactRef} />
                </section>
                <section ref={servicesRef}>
                    <Services />
                </section>
            </div>
            <section ref={packagesRef}>
                <Packages />
            </section>
            <section ref={contactRef}>
                <div className="bg-white text-white px-5 md:px-10 2xl:px-60 py-20">
                    <Contact />
                </div>
            </section>
            <section>
                <Footer sectionRefs={sectionRefs} />
            </section>
        </>
    );
}

const PackageData = [
    {
        id: "starter",
        title: "Starter",
        content: {
            description: "Perfect for small contractors and new businesses",
            items: [
                "Competent Person (email & phone support)",
                "1 policy (H&S)",
                "1 RAMS per month",
                "Annual compliance review",
                "Access to standard templates",
            ],
        },
        price: "£99 /month",
    },
    {
        id: "core",
        title: "Core Package",
        content: {
            description:
                "For growing businesses needing regular safety support",
            items: [
                "Includes everything in Starter",
                "2 RAMS per month",
                "1 Toolbox Talk pack per month",
                "Accreditation support (CHAS/SMAS/SafeContractor)",
                "COSHH register setup (up to 10 substances)",
                "Document updates throughout the year",
            ],
        },
        price: "£199 /month",
    },
    {
        id: "complete",
        title: "Complete Package",
        content: {
            description: "Full outsourced safety support for busy contractors",
            items: [
                "Includes everything in Core",
                "Monthly site inspection & full report",
                "Unlimited RAMS",
                "Full policy suite (H&S, Environmental, Quality)",
                "PQQ assistance (2 per year)",
                "CDM documentation support (CPP/PCI)",
                "Priority response + same-day support",
            ],
        },
        price: "£399 /month",
    },
];

const Packages = () => {
    const renderPackage = (_package: any) => {
        return (
            <div className="col-span-1 bg-white rounded-2xl h-full overflow-hidden shadow-md border-1 border-gray-300 flex flex-col">
                <div className="p-10 bg-gray-50 border-b-1 border-gray-300">
                    <h3 className="font-sora text-xl font-bold text-black text-center">
                        {_package.title}
                    </h3>
                    <p className="mt-5 text-gray-700 font-inter text-lg leading-relaxed text-center">
                        {_package.content.description}
                    </p>
                </div>
                <div className="py-5 flex h-full flex-col gap-10">
                    <ul>
                        {_package.content.items.map((item: string) => (
                            <li className="px-8 py-2 flex gap-2 items-center">
                                <div className="w-[25px] h-[25px] flex items-center">
                                    <CircleCheck color="#00A878" size={23} />
                                </div>

                                <p className="font-inter text-md text-gray-700">
                                    {item}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-auto">
                        <span className="font-sora text-2xl font-medium text-black px-10 py-5 block text-center">
                            {_package.price}
                        </span>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="w-full bg-gray-200 px-5 2xl:px-60 py-20 md:gap-10 flex flex-col">
            <h2 className="font-sora text-4xl font-medium text-black text-center">
                Service Packages
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 py-10 h-full">
                {PackageData.map((item) => renderPackage(item))}
            </div>
        </div>
    );
};

const Footer = ({ sectionRefs }: any) => {
    const scrollTo = useScrollTo();
    return (
        <div className="bg-black text-white px-5 md:px-10 2xl:px-60 py-10">
            <div className="flex flex-col items-center md:items-start">
                <img src={logoWhite} className="h-[15px]" />
                <div className="flex items-center gap-10 mt-5">
                    <ul className="flex gap-7 font-inter text-xs font-medium">
                        <NavItem
                            onClick={() => {
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });
                            }}
                        >
                            <span className="font-inter">Home</span>
                        </NavItem>
                        <NavItem
                            onClick={() => {
                                scrollTo(sectionRefs.about);
                            }}
                        >
                            <span className="font-inter">About</span>
                        </NavItem>
                        <NavItem
                            onClick={() => {
                                scrollTo(sectionRefs.services);
                            }}
                        >
                            <span className="font-inter">Services</span>
                        </NavItem>
                        <NavItem
                            onClick={() => {
                                scrollTo(sectionRefs.packages);
                            }}
                        >
                            <span className="font-inter">Packages</span>
                        </NavItem>
                        <NavItem
                            onClick={() => {
                                scrollTo(sectionRefs.contact);
                            }}
                        >
                            <span className="font-inter">Contact</span>
                        </NavItem>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const Header = ({ scrolled, sectionRefs }: any) => {
    const scrollTo = useScrollTo();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                //setShowMenu(false);
                setShowMenu(false);
            } else {
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <div
            className={`flex w-full items-center justify-between  bg-white z-50 transition-shadow duration-300  ${
                scrolled
                    ? "shadow-lg fixed top-0 left-0 right-0 h-[80px] px-5 md:px-10 2xl:px-60"
                    : "h-[80px] md:h-[120px]"
            }`}
        >
            <img src={logo} className="h-[25px] z-100" />
            <div className="hidden lg:flex items-center gap-10">
                <ul className="flex gap-10 font-inter text-md flex items-center">
                    <NavItem
                        onClick={() => {
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });
                            setShowMenu(false);
                        }}
                    >
                        <span className="font-sora text-md font-bold">
                            Home
                        </span>
                    </NavItem>
                    <NavItem
                        onClick={() => {
                            scrollTo(sectionRefs.about);
                            setShowMenu(false);
                        }}
                    >
                        <span className="font-sora text-md font-bold">
                            About Us
                        </span>
                    </NavItem>
                    <NavItem
                        onClick={() => {
                            scrollTo(sectionRefs.services);
                            setShowMenu(false);
                        }}
                    >
                        <span className="font-sora text-md font-bold">
                            Services
                        </span>
                    </NavItem>

                    <NavItem
                        onClick={() => {
                            scrollTo(sectionRefs.packages);
                            setShowMenu(false);
                        }}
                    >
                        <span className="font-sora text-md font-bold">
                            Packages
                        </span>
                    </NavItem>
                    <button
                        onClick={() => scrollTo(sectionRefs.contact)}
                        className="bg-black rounded-full text-white px-5 py-3 hover:bg-[#00A878] cursor-pointer transition"
                    >
                        <span className="font-sora text-md font-bold">
                            Enquire Now
                        </span>
                    </button>
                </ul>
            </div>
            <div className="lg:hidden flex items-center">
                <button
                    className="w-[25px] h-[25px] flex items-center cursor-pointer"
                    onClick={() => setShowMenu((prev) => !prev)}
                >
                    <Menu />
                </button>
            </div>
            {showMenu && (
                <div
                    onClick={() => setShowMenu(false)}
                    className={`absolute h-screen z-50 top-0 left-0 right-0 bottom-0 bg-black/50 ${
                        scrolled
                            ? "mt-[80px] md:mt-[120px]"
                            : "mt-[80px] md:mt-[120px]"
                    }`}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute  z-50 top-0 left-0 right-0 bg-white flex flex-col gap-10"
                    >
                        <div className="flex items-center cursor-pointer p-5">
                            <ul className="flex flex-col gap-10 font-sora text-md font-medium">
                                <NavItem
                                    onClick={() => {
                                        window.scrollTo({
                                            top: 0,
                                            behavior: "smooth",
                                        });
                                        setShowMenu(false);
                                    }}
                                >
                                    <span className="font-sora  font-bold">
                                        Home
                                    </span>
                                </NavItem>
                                <NavItem
                                    onClick={() => {
                                        scrollTo(sectionRefs.about);
                                        setShowMenu(false);
                                    }}
                                >
                                    <span className="font-sora  font-bold">
                                        About Us
                                    </span>
                                </NavItem>
                                <NavItem
                                    onClick={() => {
                                        scrollTo(sectionRefs.services);
                                        setShowMenu(false);
                                    }}
                                >
                                    <span className="font-sora font-bold">
                                        Services
                                    </span>
                                </NavItem>
                                <NavItem
                                    onClick={() => {
                                        scrollTo(sectionRefs.packages);
                                        setShowMenu(false);
                                    }}
                                >
                                    <span className="font-sora font-bold">
                                        Packages
                                    </span>
                                </NavItem>
                                <NavItem
                                    onClick={() => {
                                        scrollTo(sectionRefs.contact);
                                        setShowMenu(false);
                                    }}
                                >
                                    <span className="font-inter font-bold">
                                        Contact Us
                                    </span>
                                </NavItem>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Hero = ({ scrolled }: { scrolled: boolean }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-3xl ${
                scrolled ? "mt-[80px] md:mt-[120px]" : ""
            }`}
        >
            <img
                src={headerImage}
                className="w-full object-cover h-[500px] md:h-[700px]"
            />
            <div className="absolute inset-0 bg-gradient-to-b to-black/70 via-black/25 from-black/0"></div>
            <div className="absolute bottom-0 text-white p-5 md:p-20">
                <div className="gap-2 flex flex-col border-b-5 border-white pb-5">
                    <h1 className="font-sora text-3xl md:text-5xl font-medium">
                        Be Compliant. The Wise Way.
                    </h1>
                    <span className="text-lg md:text-xl font-inter">
                        We take care of your compliance whilst you focus on
                        other priorities
                    </span>
                </div>
            </div>
        </div>
    );
};

const About = ({ contactRef }: any) => {
    const scrollTo = useScrollTo();
    return (
        <>
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div>
                    <h2 className="font-sora text-4xl font-medium">About Us</h2>
                    <p className="mt-5 text-gray-700 max-w-3xl font-inter text-lg leading-relaxed">
                        At Vantage safety services, we provide clear, practical
                        and reliable health & safety support to construction,
                        groundworks, and surfacing businesses across the UK. Our
                        consultancy helps contractors stay compliant, work
                        safely, and meet the high standards expected by clients,
                        principal contractors, and accreditation bodies. We
                        specialise in delivering straightforward, usable
                        solutions designed to support busy sites and fast-moving
                        projects, without unnecessary complexity.
                    </p>
                    <button
                        onClick={() => scrollTo(contactRef)}
                        className="mt-10 bg-black rounded-full text-white px-5 py-3 font-sora text-sm hover:bg-[#00A878] cursor-pointer transition"
                    >
                        Enquire Now
                    </button>
                </div>
            </div>
            <img
                src={aboutImage}
                className="w-1/2 object-cover h-[500px] rounded-3xl shadow-md hidden lg:block"
            />
        </>
    );
};

const Contact = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const sendEmail = async () => {
        await fetch("https://api.shouts.gg/vantage-contact/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                message: message,
            }),
        });
    };

    return (
        <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-20">
            <div className="gap-10 flex flex-col w-full lg:w-1/2">
                <h2 className="font-sora text-4xl font-medium text-black">
                    Contact Us
                </h2>
                <div className="flex flex-row gap-20">
                    <p className="text-gray-700 font-inter text-lg leading-relaxed flex-1">
                        If you have any questions, need support, or just want to
                        get in touch, we’re here to help. Simply fill out the
                        contact form and a member of our team will get back to
                        you as soon as possible. We look forward to hearing from
                        you!
                    </p>
                </div>
            </div>
            <div className="w-full lg:w-1/2">
                <form action={sendEmail} method="POST">
                    <div className="flex justify-end flex-col">
                        <div className="form-group">
                            <div className="form-row">
                                <div className="row mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={firstName}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                        className="bg-gray-200 form-control rounded-md h-10 text-black border border-gray-300 px-3"
                                        placeholder="First Name"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="name"
                                        value={lastName}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                        className="bg-gray-200 form-control rounded-md h-10 text-black border border-gray-300 px-3"
                                        placeholder="Last Name"
                                        required
                                    />
                                </div>
                                <div className="col">
                                    <input
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="bg-gray-200 form-control rounded-md h-10 text-black border border-gray-300 px-3 w-full mb-4"
                                        placeholder="Email Address"
                                        required
                                    />
                                    <textarea
                                        name="message"
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        className="bg-gray-200 form-control rounded-md py-3 h-32 text-black border border-gray-300 px-3 w-full mb-4"
                                        placeholder="Your Message"
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full lg:w-auto ml-auto bg-black rounded-full text-white px-5 py-3 font-sora text-sm hover:bg-[#00A878] cursor-pointer transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const _services = [
    {
        id: "accreditations",
        title: "Accreditations",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Accreditations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    Our Accreditation Support service helps your business
                    achieve recognised standards such as CHAS, SMAS,
                    SafeContractor, Constructionline, and similar schemes. We
                    guide you through the full process, ensuring your documents,
                    evidence, and systems meet assessor expectations.
                </p>
            </div>
        ),
        benefits: (
            <>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Accreditation Selection & Initial Review
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We assess your current health & safety setup and identify
                    the accreditation level most suitable for your business.
                    Includes:
                    <ul className="list-disc list-inside mt-2">
                        <li>Gap analysis against scheme requirements</li>
                        <li>Clear action plan to reach compliance</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Documentation & Evidence Preparation
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We prepare or update all essential documents required for
                    your submission, such as:
                    <ul className="list-disc list-inside mt-2">
                        <li>Health & Safety Policy</li>
                        <li>RAMS & SSOW</li>
                        <li>Training matrix and competence records</li>
                        <li>
                            Insurance and company document We ensure everything
                            aligns with current standards and meets
                            accreditation criteria
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Full Application & Assessor Liaison
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We handle the submission process from start to finish:
                    <ul className="list-disc list-inside mt-2">
                        <li>Portal completion and evidence upload</li>
                        <li>Communication with scheme assessors</li>
                        <li>
                            Managing any requests for additional information Our
                            goal is to secure approval as smoothly and
                            efficiently as possible
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Non-Compliance & Corrective Actions
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    If an assessor flags issues, we quickly resolve them by
                    updating documents, adding missing evidence, and
                    resubmitting until approval is achieved.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ongoing Support & Annual Renewals
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    To keep you compliant year round, we offer:
                    <ul className="list-disc list-inside mt-2">
                        <li>Renewal management</li>
                        <li>Periodic document updates</li>
                        <li>Support with PQQs and client compliance checks</li>
                    </ul>
                </p>
            </>
        ),
    },
    {
        id: "rams",
        title: "Risk & Method Statements",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Risk & Method Statements (Review/completion)
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We provide professionally written, clear and compliant Risk
                    Assessments and Method Statements (RAMS) tailored to the
                    specific tasks your team carries out. Our service ensures
                    your documentation is practical, site-ready, and aligned
                    with current legislation and industry best practice.
                </p>
            </div>
        ),
        benefits: (
            <>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Bespoke RAMS Compilation
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We create detailed, task-specific RAMS covering:
                    <ul className="list-disc list-inside mt-2">
                        <li>Identified hazards and associated risks</li>
                        <li>Control measures and safe systems of work</li>
                        <li>Plant, equipment, and PPE requirements</li>
                        <li>
                            Site-specific considerations such as ground
                            conditions, utilities, and sequencing.
                        </li>
                        <li>
                            All RAMS are tailored to your actual activities and
                            methodology—not generic templates.
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Existing RAMS Review & Improvement
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    If you already have RAMS in place, we review them for:
                    <ul className="list-disc list-inside mt-2">
                        <li>Compliance with legislation (HASWA, MHSWR, CDM)</li>
                        <li>
                            Accuracy and relevance to current work practices
                        </li>
                        <li>
                            Clarity, layout, and usability on-site We then
                            refine or update them to meet client and principal
                            contractor expectations.
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    High-Risk Activity Assessments
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We provide specialist RAMS for higher-risk work, including:
                    <ul className="list-disc list-inside mt-2">
                        <li>Excavations & groundworks</li>
                        <li>Confined spaces</li>
                        <li>Hot works</li>
                        <li>Lifting operations</li>
                        <li>Work at height & scaffolding</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Client & Principal Contractor Approval Support
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We ensure your RAMS meet the standards required for approval
                    by:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Principal contractors</li>
                        <li>Local authorities</li>
                        <li>Developers and main clients</li>
                    </ul>
                    We handle amendments and revisions until acceptance is
                    achieved.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ongoing Updates & Version Control
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    As site conditions or methods change, we offer:
                    <ul className="list-disc list-inside mt-2">
                        <li>Quick updates to existing RAMS</li>
                        <li>New task-specific assessments</li>
                        <li>
                            Version control to keep documentation current and
                            audit-ready
                        </li>
                    </ul>
                </p>
            </>
        ),
    },
    {
        id: "policies",
        title: "Policies",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Policies
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We create clear, compliant and practical Health & Safety,
                    Environmental, and Quality policies tailored to your
                    business. Whether you need brand-new policies or updates to
                    existing ones, we ensure they meet legal requirements, align
                    with accreditation standards, and reflect how your company
                    actually operates.
                </p>
            </div>
        ),
        benefits: (
            <>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Bespoke Policy Creation
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We develop professional policies specific to your
                    organisation, including:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Health & Safety Policy</li>
                        <li>Environmental Policy</li>
                        <li>Quality Policy</li>
                        <li>
                            Drug & Alcohol, PPE, Driving, Lone Working, and
                            other operational policies
                        </li>
                    </ul>
                    Each policy is customised to your activities, workforce, and
                    risk profile.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Policy Review & Updates
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    If you already have policies in place, we:
                    <ul className="list-disc list-inside mt-2">
                        <li>Review them for legal compliance and accuracy</li>
                        <li>Update outdated content, roles, or procedures</li>
                        <li>
                            Ensure they meet accreditation requirements (CHAS,
                            SMAS, Constructionline, ISO standards)
                        </li>
                        <li>
                            Improve clarity and layout for easy communication
                            across your team
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Integrated Management Content
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Where needed, we can align your policies with ISO frameworks
                    (9001, 14001, 45001) to support future certification or
                    demonstrate a structured management approach.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Company Branding & Presentation
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We provide professionally formatted policies that include:
                    <ul className="list-disc list-inside mt-2">
                        <li>Your company logo & branding</li>
                        <li>Version control and dates</li>
                        <li>
                            Clear structure suitable for tenders and client
                            submission
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ongoing Maintenance
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    As regulations or company processes change, we offer:
                    <ul className="list-disc list-inside mt-2">
                        <li>Annual policy updates</li>
                        <li>
                            Quick revisions for audits, client requests, or
                            accreditation renewals
                        </li>
                        <li>
                            Support keeping documentation consistent across all
                            systems
                        </li>
                    </ul>
                </p>
            </>
        ),
    },
    {
        id: "toolbox-talks",
        title: "Toolbox Talks",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Toolbox Talks
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We provide engaging, practical Toolbox Talks designed to
                    keep your workforce informed, compliant, and safety focused.
                    Our talks are tailored to your trade, tasks, and site
                    conditions, helping reinforce a strong safety culture across
                    your business.
                </p>
            </div>
        ),
        benefits: (
            <>
                {" "}
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Bespoke Toolbox Talk Creation
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We develop clear, job-specific TBTs covering a wide range of
                    topics, such as:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Excavations & groundworks safety</li>
                        <li>Work at height</li>
                        <li>Manual handling</li>
                        <li>Plant & machinery operation</li>
                        <li>PPE, housekeeping & site hazards</li>
                        <li>Environmental and behavioural safety</li>
                    </ul>
                    Each talk is easy to understand and relevant to the daily
                    challenges your teams face.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    On-Site or Remote Delivery
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We can deliver TBTs directly to your workforce:
                    <ul className="list-disc list-inside mt-2">
                        <li>Delivered on-site before work begins</li>
                        <li>Remote/online sessions for multiple teams</li>
                        <li>
                            Tailored content to address current site risks or
                            recent incidents
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Toolbox Talk Packs for Supervisors
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    For businesses wanting internal delivery, we provide
                    ready-to-use TBT packs that include:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Scripted briefings</li>
                        <li>Topic background and key messages</li>
                        <li>Attendance sheets</li>
                        <li>Visual aids where required</li>
                    </ul>
                    This ensures consistent safety messaging across all sites.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Compliance & Record Keeping
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We support you in maintaining clear evidence of safety
                    communication by providing:
                    <ul className="list-disc list-inside mt-2">
                        <li>Signed attendance records</li>
                        <li>Version-controlled TBT documents</li>
                        <li>
                            Digital copies for audits, client checks, and
                            accreditation renewals
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Monthly or Quarterly TBT Programmes
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We offer planned schedules of toolbox talks to ensure
                    ongoing compliance and regular engagement with your
                    workforce.
                </p>
            </>
        ),
    },
    {
        id: "coshh",
        title: "COSHH Assessments",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    COSHH Assessments
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We provide clear, compliant COSHH Assessments to help you
                    manage hazardous substances safely on site. Our assessments
                    ensure your workforce understands the risks, required
                    control measures, and how to work safely around chemicals,
                    fuels, adhesives, and other hazardous materials.
                </p>
            </div>
        ),
        benefits: (
            <>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ready-to-Use H&S Templates
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We supply a full range of editable templates, including:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Risk Assessments & Method Statements (RAMS)</li>
                        <li>Site Inductions</li>
                        <li>Toolbox Talks</li>
                        <li>Daily/Weekly Inspection Sheets</li>
                        <li>COSHH Assessments</li>
                        <li>
                            Permits (Hot Works, Excavations, Work at Height,
                            etc.)
                        </li>
                        <li>Accident/Incident Forms</li>
                    </ul>
                    Each template is structured to meet legal and industry
                    expectations.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Custom-Branded Templates
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    All templates can be personalised with:
                    <ul className="list-disc list-inside mt-2">
                        <li>Your company logo and branding</li>
                        <li>Specific project details</li>
                        <li>
                            Custom fields relevant to your operations. This
                            ensures you present a professional image to clients
                            and principal contractors.
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Sector-Specific Packs
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We provide template packs tailored to specialised work, such
                    as:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Groundworks & civil engineering</li>
                        <li>Plant & lifting operations</li>
                        <li>Utilities and street works (NRSWA)</li>
                        <li>General construction trades</li>
                    </ul>
                    These packs help teams produce documentation aligned with
                    the risks of their specific tasks.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Compliance-Focused Design
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Our templates are created in line with:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>HASWA & MHSWR requirements</li>
                        <li>CDM principles</li>
                        <li>
                            Accreditation standards (CHAS, SMAS, SafeContractor,
                            Constructionline)
                        </li>
                    </ul>
                    This ensures your documentation supports audits, tenders,
                    and client reviews.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ongoing Updates
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We keep templates up to date with legislative changes and
                    industry best practice, offering optional:
                    <ul className="list-disc list-inside mt-2">
                        <li>Annual template updates</li>
                        <li>New forms or documents as your company grows</li>
                        <li>Revised versions for accreditation renewals</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Substance Identification & Review
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We review all substances used or stored by your business,
                    including:
                    <ul className="list-disc list-inside mt-2">
                        <li>Fuels, oils, paints, resins</li>
                        <li>Concrete additives and sealants</li>
                        <li>Cleaning agents and solvents</li>
                        <li>Dusts, fumes and other hazardous by products</li>
                    </ul>
                    This ensures nothing is overlooked in your COSHH register.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Comprehensive COSHH Assessments
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We create clear, easy-to-follow assessments that include:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>
                            Hazard information (using up-to-date SDS details)
                        </li>
                        <li>Exposure risks and potential health effects</li>
                        <li>Required control measures and PPE</li>
                        <li>Safe handling, storage, and disposal procedures</li>
                        <li>Emergency actions and first aid guidance</li>
                    </ul>
                    Each assessment is tailored to your site activities and
                    usage.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Safety Data Sheet (SDS) Management
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We gather, update, and organise all relevant SDS documents
                    to support your COSHH system, ensuring accuracy and
                    compliance for audits or client checks.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    COSHH Register & Site Pack Preparation
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We compile your assessments into a structured COSHH register
                    or site pack, making it easy for supervisors and operatives
                    to access the right information quickly.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ongoing Updates & Monitoring
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    As substances, suppliers, or site conditions change, we
                    offer:
                    <ul className="list-disc list-inside mt-2">
                        <li>Regular updates to COSHH assessments</li>
                        <li>Replacement documents when SDSs are updated</li>
                        <li>
                            Additional assessments for new products or tasks
                        </li>
                    </ul>
                </p>
            </>
        ),
    },
    {
        id: "pqq",
        title: "Contractor PQQ",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Contractor PQQ
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We assist your business in completing Contractor
                    Pre-Qualification Questionnaires (PQQs) accurately and
                    comprehensively. Our service ensures your submissions meet
                    client requirements, highlight your strengths, and improve
                    your chances of winning contracts.
                </p>
            </div>
        ),
        benefits: (
            <>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Full PQQ Review & Requirements Check
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We analyse the PQQ criteria and identify exactly what
                    documentation and evidence you need, ensuring nothing is
                    missed. This includes:
                    <ul className="list-disc list-inside mt-2">
                        <li>H&S documentation</li>
                        <li>Training and competence records</li>
                        <li>Policies and insurances</li>
                        <li>Environmental, quality, and CSR requirements</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Document Gathering & Formatting
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We collect, update, and prepare all required evidence,
                    including:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>RAMS, policies, and procedures</li>
                        <li>
                            Accreditation certificates (CHAS, SMAS,
                            Constructionline, etc.)
                        </li>
                        <li>
                            Organisational charts, CVs, and training matrices
                        </li>
                        <li>Insurances and company certifications</li>
                    </ul>
                    Everything is formatted clearly for submission.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Completion of PQQ Forms & Online Portals
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We complete the PQQ on your behalf by:
                    <ul className="list-disc list-inside mt-2">
                        <li>Answering all technical questions</li>
                        <li>Uploading supporting documents</li>
                        <li>Ensuring consistency and accuracy throughout</li>
                        <li>Highlighting your strengths and compliance</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Gap-Filling & Improvements
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    If your business is missing required documents or evidence,
                    we:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Create or update policies</li>
                        <li>Prepare new RAMS or templates</li>
                        <li>Provide solutions to meet minimum standards</li>
                    </ul>
                    This ensures your submission is competitive, even if you’re
                    still developing your systems.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Final Review & Submission Support
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Before submitting, we conduct a full quality check to
                    ensure:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>All sections are complete</li>
                        <li>Evidence meets client expectations</li>
                        <li>Information is presented professionally</li>
                    </ul>
                    We can also assist with resubmissions or clarifications if
                    the client requests additional information.
                </p>
            </>
        ),
    },
    {
        id: "accident-investigation",
        title: "Accident Investigation",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Accident Investigation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We provide independent, thorough accident and incident
                    investigations to identify root causes, prevent recurrence,
                    and protect your workforce. Our investigations support legal
                    compliance, strengthen safety performance, and provide clear
                    evidence for insurers and clients.
                </p>
            </div>
        ),
        benefits: (
            <>
                {" "}
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Immediate Response & Fact-Finding
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We respond quickly to gather essential information,
                    including:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Site conditions and physical evidence</li>
                        <li>Witness statements</li>
                        <li>Photographs, CCTV, and relevant documentation</li>
                        <li>Initial timeline of events</li>
                    </ul>
                    This ensures accurate reporting while details are still
                    fresh.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Root Cause Analysis
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Using structured investigation techniques, we identify:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Direct causes (unsafe acts/conditions)</li>
                        <li>
                            Underlying factors (training, planning, equipment,
                            communication)
                        </li>
                        <li>Organisational or systemic issues</li>
                    </ul>
                    Our analysis helps you understand not only what happened,
                    but why it happened.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Report Writing & Corrective Actions
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We produce a clear, professional investigation report that
                    includes:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Summary of events</li>
                        <li>Evidence collected</li>
                        <li>Root cause findings</li>
                        <li>Recommended corrective and preventative actions</li>
                        <li>
                            Any required updates to RAMS, policies, or training
                        </li>
                    </ul>
                    Reports are client-ready and suitable for insurers,
                    principal contractors, or regulatory bodies.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Support with RIDDOR & Client Notifications
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    If the incident meets reporting thresholds, we assist with:
                    <ul className="list-disc list-inside mt-2">
                        <li>Completing RIDDOR submissions</li>
                        <li>
                            Communicating with principal contractors or clients
                        </li>
                        <li>
                            Providing supporting documents for compliance checks
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Follow-Up & Monitoring
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We help you implement and track corrective actions to ensure
                    improvements are embedded, including updates to:
                    <ul className="list-disc list-inside mt-2">
                        <li>Risk assessments</li>
                        <li>Method statements</li>
                        <li>Toolbox talks</li>
                        <li>Training or supervision arrangements</li>
                    </ul>
                </p>
            </>
        ),
    },
    {
        id: "dse",
        title: "DSE Assessments",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    DSE Assessments
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We carry out quick, professional DSE assessments to ensure
                    employees using computers or laptops work safely,
                    comfortably, and in line with DSE Regulations.
                </p>
            </div>
        ),
        benefits: (
            <>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Workstation Assessments
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Review of posture, seating, screen height, desk layout, and
                    lighting
                    <ul className="list-disc list-inside mt-2">
                        <li>On-site or remote assessments available</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ergonomic Advice
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Immediate adjustments to improve comfort
                    <ul className="list-disc list-inside mt-2">
                        <li>
                            Recommendations for supportive equipment (footrests,
                            risers, chairs, etc.)
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Individual Reports
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Simple, clear reports outlining issues, improvements, and
                    follow-up actions.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Office, Home & Hybrid Workers
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Suitable for any working environment, including remote/home
                    setups.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Follow-Up Support
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Reassessments if needs change or discomfort continues.
                </p>
            </>
        ),
    },
    {
        id: "competent-person",
        title: "Competent Person",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Competent Person
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We act as your appointed Competent Person, giving your
                    business access to professional health & safety advice
                    whenever you need it. This ensures you meet your legal
                    duties under the Management of Health & Safety at Work
                    Regulations and strengthens your overall safety management.
                </p>
            </div>
        ),
        benefits: (
            <>
                {" "}
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Appointment as Your Competent Person
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We provide formal documentation confirming us as your named
                    Competent Person for client, accreditation, and legal
                    requirements.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Ongoing Health & Safety Advice
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    You gain access to expert support for:
                    <ul className="list-disc list-inside mt-2">
                        <li>Day-to-day safety queries</li>
                        <li>Interpretation of HSE guidance</li>
                        <li>Client and contractor compliance requests</li>
                        <li>Best-practice recommendations</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Documentation & Systems Support
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We assist with key safety documentation, including:
                    <ul className="list-disc list-inside mt-2">
                        <li>Policies and procedures</li>
                        <li>RAMS and COSHH assessments</li>
                        <li>Toolbox talks and site forms</li>
                        <li>PQQ and accreditation evidence</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Incident & Compliance Support
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    When issues arise, we provide help with:
                    <ul className="list-disc list-inside mt-2">
                        <li>Accident/incident advice</li>
                        <li>RIDDOR guidance</li>
                        <li>Corrective actions and improvement plans</li>
                        <li>Safety communication with clients or regulators</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Annual Review & Ongoing Monitoring
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We ensure continued compliance by offering:
                    <ul className="list-disc list-inside mt-2">
                        <li>Yearly system reviews</li>
                        <li>Updates to policies and documentation</li>
                        <li>Recommendations for training or improvements</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Who Benefits
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Ideal for SMEs, subcontractors, start-ups and companies
                    without an in-house H&S professional needing reliable,
                    ongoing safety support.
                </p>
            </>
        ),
    },
    {
        id: "cdm",
        title: "CDM Support",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    CDM Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We provide professional CDM Support to help duty holders
                    meet their legal responsibilities under the CDM Regulations
                    2015. Whether you're a client, principal contractor,
                    contractor, or designer, we ensure your projects are
                    planned, managed, and delivered safely and compliantly.
                </p>
            </div>
        ),
        benefits: (
            <>
                {" "}
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Duty Holder Guidance
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Clear advice tailored to your role, including:
                    <ul className="list-disc list-inside mt-2">
                        <li>
                            Clients: Pre-construction information, competence
                            checks, and project oversight
                        </li>
                        <li>
                            Principal Contractors: Construction phase planning
                            and site safety management
                        </li>
                        <li>
                            Contractors: RAMS, inductions, and safe coordination
                            of work
                        </li>
                        <li>
                            Designers: Eliminating or reducing risk at source
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    CDM Documentation
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We prepare and support key CDM documents such as:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Pre-Construction Information (PCI)</li>
                        <li>Construction Phase Plans (CPP)</li>
                        <li>Site-specific RAMS and safety arrangements</li>
                        <li>Health & Safety Files</li>
                    </ul>
                    All documentation is tailored to your project and compliant
                    with HSE guidance.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Project Compliance Monitoring
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We provide ongoing support throughout the project,
                    including:
                    <ul className="list-disc list-inside mt-2">
                        <li>Regular site reviews</li>
                        <li>Advice on risk management and coordination</li>
                        <li>
                            Updates to CPPs and other documents as work
                            progresses
                        </li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Contractor Competence & Management
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We help ensure all contractors on-site meet CDM standards
                    by:
                    <ul className="list-disc list-inside mt-2">
                        <li>Reviewing accreditations and competencies</li>
                        <li>Checking RAMS, insurances, and training</li>
                        <li>Supporting safe coordination between trades</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Practical Safety Support
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Where required, we can also assist with:
                    <ul className="list-disc list-inside mt-2">
                        <li>Site inductions</li>
                        <li>Toolbox talks</li>
                        <li>Incident guidance</li>
                        <li>Safety meetings and documentation checks</li>
                    </ul>
                </p>
            </>
        ),
    },
    {
        id: "site-inspections",
        title: "Site Inspections",
        item: (
            <div>
                <h3 className="font-sora text-3xl font-semibold mb-4">
                    Site Inspections
                </h3>
                <p className="text-gray-600 leading-relaxed">
                    We provide independent, detailed site inspections and audits
                    to help you identify risks, improve safety standards, and
                    demonstrate compliance to clients and principal contractors.
                    Our inspections offer practical, actionable feedback to
                    support safer, more efficient site operations.
                </p>
            </div>
        ),
        benefits: (
            <>
                {" "}
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Comprehensive Site Inspections
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We carry out routine or one-off site visits to assess:
                    <ul className="list-disc list-inside mt-2 mb-4">
                        <li>Site setup, welfare, access & housekeeping</li>
                        <li>Work at height, excavations, plant & machinery</li>
                        <li>PPE and workforce behaviour</li>
                        <li>RAMS implementation and control measures</li>
                        <li>Environmental and site-specific risks</li>
                    </ul>
                    Each inspection is tailored to the type of work being
                    carried out.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Detailed Audit Reports
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Following each visit, you receive a clear, professional
                    report featuring:
                    <ul className="list-disc list-inside mt-2">
                        <li>Photographic evidence</li>
                        <li>Identified hazards and non-compliances</li>
                        <li>Positive observations</li>
                        <li>Recommended corrective actions and timeframes</li>
                    </ul>
                    Reports are suitable for internal use, client review, and
                    accreditation evidence.
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Follow-Up Actions & Support
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We help you close out actions by providing:
                    <ul className="list-disc list-inside mt-2">
                        <li>Guidance on corrective measures</li>
                        <li>Updated documents or RAMS if needed</li>
                        <li>Follow-up inspections to verify improvements</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Specialist & High-Risk Audits
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    Where required, we can conduct focused audits on:
                    <ul className="list-disc list-inside mt-2">
                        <li>Excavations and groundworks</li>
                        <li>Lifting operations</li>
                        <li>Temporary works</li>
                        <li>Traffic management</li>
                        <li>Fire safety and emergency arrangements</li>
                    </ul>
                </p>
                <h5 className="font-sora text-lg font-semibold mt-8">
                    Planned Inspection Programmes
                </h5>
                <p className="text-gray-600 leading-relaxed mt-2">
                    We can create monthly, fortnightly, or quarterly inspection
                    schedules to continuously monitor safety performance and
                    compliance across multiple sites.
                </p>
            </>
        ),
    },
];

const Services = () => {
    const [active, setActive] = useState<string | null>(null);
    const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActive(entry.target.id);
                    }
                });
            },
            { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
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

        const y = el.getBoundingClientRect().top + window.scrollY - 220; // your fixed header height

        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-15 py-20">
                <div className="md:col-span-1">
                    <div className="md:sticky md:top-[140px] flex flex-col">
                        <h2 className="font-sora text-4xl font-medium text-black h-[80px]">
                            Our Services
                        </h2>
                        <div className="hidden md:flex flex-col gap-4">
                            {_services.map((s) => (
                                <button
                                    key={s.id}
                                    className={`text-left font-sora cursor-pointer hover:text-black text-lg transition-all ${
                                        active === s.id
                                            ? "font-semibold text-black"
                                            : "text-gray-500"
                                    }`}
                                    onClick={() => scrollToSection(s.id)}
                                >
                                    {s.title}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-20 md:pt-[80px]">
                    {_services.map((s) => (
                        <ServiceItem
                            service={s}
                            key={s.id}
                            id={s.id}
                            ref={(el: any) => (sectionRefs.current[s.id] = el)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ServiceItem = ({ service, ref, id }: any) => {
    const [showBenefits, setShowBenefits] = useState(
        () => window.innerWidth >= 768
    );

    useEffect(() => {
        let isDesktop = window.innerWidth >= 768;

        const handleResize = () => {
            const nowDesktop = window.innerWidth >= 768;
            if (nowDesktop !== isDesktop) {
                setShowBenefits(nowDesktop);
                isDesktop = nowDesktop;
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            id={id}
            ref={ref}
            className="bg-white border-b-1 border-gray-300 pb-8"
        >
            {service.item}

            {showBenefits && <div>{service.benefits}</div>}

            <button
                onClick={() => setShowBenefits(!showBenefits)}
                className="md:hidden block mt-4 text-white px-4 hover:bg-[#00A878] p-2 bg-black rounded-full text-sm font-inter cursor-pointer transition"
            >
                <span className="font-inter">
                    {showBenefits ? "Hide Benefits" : "Show Benefits"}
                </span>
            </button>
        </div>
    );
};

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

const NavItem = ({ children, onClick }: any) => (
    <li
        className="hover:text-[#00A878] cursor-pointer transition"
        onClick={onClick}
    >
        {children}
    </li>
);

export default App;
