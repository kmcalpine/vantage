import PortalLink from "./PortalLink";

/*
 * The flat surface the cards lift off. Still an illustration rather than a
 * screenshot: no legible text, no window chrome, nothing that depicts an
 * interface or implies a feature. Out of the accessibility tree, since
 * narrating an invented UI would be worse than saying nothing.
 */
const DocumentSurface = () => (
    <svg
        viewBox="0 0 420 260"
        className="w-full h-auto"
        aria-hidden="true"
        focusable="false"
    >
        {[0, 1, 2, 3].map((row) => {
            const y = 12 + row * 62;
            return (
                <g key={row}>
                    <rect x="0" y={y} width="420" height="50" fill="#fafaf9" />
                    <rect
                        x="16"
                        y={y + 15}
                        width="20"
                        height="20"
                        fill="#e7e5e4"
                    />
                    <rect
                        x="50"
                        y={y + 16}
                        width={[190, 150, 210, 130][row]}
                        height="8"
                        fill="#d6d3d1"
                    />
                    <rect
                        x="50"
                        y={y + 30}
                        width={[96, 120, 80, 104][row]}
                        height="6"
                        fill="#e7e5e4"
                    />
                </g>
            );
        })}
    </svg>
);

/*
 * The cards carry real words, so unlike the surface behind them they stay in
 * the accessibility tree: "RAMS, Policies, CEMPs" tells a screen reader reader
 * the same thing the shapes tell a sighted one. They are named document types,
 * not portal features, so they claim nothing about what the software does.
 *
 * Placement is per-card rather than generated: an even scatter reads as a grid
 * that has slipped, where an uneven one reads as a handful of things set down.
 * Nothing overhangs the right edge — the panel no longer clips, and a card
 * past it would open a horizontal scrollbar at some widths.
 */
const documentTypes = [
    {
        label: "RAMS",
        chip: "bg-[#16A34A]",
        position: "top-[2%] left-0 md:-left-15",
    },
    {
        label: "Policies",
        chip: "bg-black",
        position: "top-[36%] left-[22%] md:left-[70%]",
    },
    {
        label: "CEMPs",
        chip: "bg-stone-400",
        position: "top-[68%] left-[6%] md:-left-2",
    },
    {
        label: "COSHH",
        chip: "bg-purple-400",
        position: "top-[-16%] left-[6%] md:left-[35%]",
    },
];

const PortalSection = () => {
    return (
        <section id="portal" className="py-16 md:py-32 px-5 bg-stone-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 lg:items-center">
                    <div>
                        <div className="w-20 h-1.5 bg-black mb-6 md:mb-10" />
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 tracking-tight leading-tight text-black uppercase">
                            Your documents, in one place
                        </h2>
                        <p className="text-lg md:text-xl text-black/80 font-inter leading-relaxed mb-6 max-w-xl">
                            Every client gets a portal account. Policies,
                            assessments, reports and certificates sit together,
                            ready when you need them.
                        </p>
                        <PortalLink />
                    </div>

                    <div className="relative hidden sm:block bg-white p-6 md:p-10 rounded-md">
                        <DocumentSurface />

                        <ul
                            aria-label="Document types kept in the portal"
                            className="absolute inset-6 md:inset-10 pointer-events-none"
                        >
                            {documentTypes.map((type) => (
                                <li
                                    key={type.label}
                                    className={`absolute rounded-md flex items-center gap-3 bg-white border border-stone-200 pl-3 pr-5 py-3 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.45)] ${type.position}`}
                                >
                                    <span
                                        className={`w-6 h-6 shrink-0 ${type.chip}`}
                                        aria-hidden="true"
                                    />
                                    <span className="font-bold text-[11px] md:text-xs uppercase tracking-[0.2em] text-black whitespace-nowrap">
                                        {type.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PortalSection;
