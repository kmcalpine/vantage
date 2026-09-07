import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, Layers, UserCheck, Zap } from "lucide-react";
import pillarExpertise from "../assets/pillar-expertise.webp";
import pillarOversight from "../assets/pillar-oversight.webp";
import pillarScalable from "../assets/pillar-scalable.webp";
import pillarResponse from "../assets/pillar-response.webp";

/*
 * The Vantage mark leans its bars 16.8 degrees off vertical, parallel to the
 * leading stroke of the V. The tiles sit just under that at 15.6 degrees: at
 * this size the band spans the whole screen, and the mark's own angle proved
 * heavier across that width than it looks in a logo. Clipping rather than
 * skewing keeps the photo and the label upright inside the slanted frame.
 *
 * At lg the tiles divide the pinned panel — the viewport less the nav — one
 * each. The shear is then derived from that tile height rather than fixed:
 * 0.28 of it is tan(15.6 degrees), so the angle holds at every viewport
 * height, where a fixed pixel shear would flatten as the tiles grew.
 *
 * Stepping each tile right by exactly one --shear chains the bottom-left
 * corner of one onto the top-left corner of the next, so the four left edges
 * read as a single unbroken diagonal rather than a staircase.
 *
 * Tiles overlap by a pixel. Dividing the panel by four puts two of the three
 * internal boundaries on a half-pixel at any viewport height, and where one
 * tile's bottom rounds down while the next tile's top rounds up, the page
 * shows through as a hairline seam. Overlapping guarantees they meet.
 *
 * Each overlapping tile grows by the pixel it gives back to the margin, so the
 * run still measures exactly four --tile and ends flush with the panel. Taking
 * the pixel from the margin alone would leave the band short of the fold.
 */
/*
 * Header.tsx pins itself as `fixed ... h-[70px]` once the page is scrolled,
 * which it always is by the time this section is reached. The pinned pillars
 * sit below it: the sticky offset, the usable height and the scroll maths all
 * derive from this one number.
 */
const NAV_HEIGHT = 70;

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

/*
 * The green edge is the li's own background showing through a gap: the inner
 * panel carries the same polygon but sits 6px right, so the exposed strip
 * follows the diagonal instead of being clipped into a wedge, as a straight
 * left-hand bar would be. --fill sets how far down that strip is filled, so
 * the whole run of edges reads as one progress indicator: pillars already
 * scrolled past stay full, the active one tracks scroll, later ones are empty.
 *
 * Every tile carries the gap and the gradient, filled or not. A tile that
 * only gained the 6px offset on becoming active would nudge its photo sideways
 * at that moment; an unfilled strip is just the white page showing through.
 */
const PILLAR_EDGE_FILL =
    "linear-gradient(to bottom, #22C55E 0 calc(var(--fill, 0) * 100%), transparent calc(var(--fill, 0) * 100%))";

const supportPillars = [
    {
        title: "Senior Expertise",
        icon: UserCheck,
        image: pillarExpertise,
        body: "The same senior consultant on every visit. They get to know your sites, your crews and how you actually build.",
    },
    {
        title: "Independent Oversight",
        icon: Eye,
        image: pillarOversight,
        body: "An outside inspection, written up with the actions ranked by risk, so nothing serious hides behind something trivial.",
    },
    {
        title: "Scalable Support",
        icon: Layers,
        image: pillarScalable,
        body: "Some months need an inspection and three RAMS reviews. Others need nothing. You pay the same retainer either way.",
    },
    {
        title: "Rapid Response",
        icon: Zap,
        image: pillarResponse,
        body: "Call your consultant directly. Incident advice, RIDDOR and HSE liaison, the same day.",
    },
];

/*
 * Active pillar is derived from how far the viewport has travelled through the
 * wrapper, rather than from observers on the tiles themselves: at lg the tiles
 * are pinned and never move relative to the viewport, so there is nothing for
 * an observer to watch. Reading the wrapper works unchanged in both layouts,
 * which keeps the pinned and flowing cases on one code path.
 */
const useScrollProgress = (count: number) => {
    const wrapper = useRef<HTMLDivElement>(null);
    const pinned = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    useEffect(() => {
        let frame = 0;
        const measure = () => {
            frame = 0;
            const el = wrapper.current;
            if (!el) return;
            const { top, height } = el.getBoundingClientRect();
            /*
             * When pinned, the run is the wrapper minus the pinned panel and
             * progress is measured from where the panel parks (below the nav),
             * not from the top of the viewport. When the panel is static —
             * below lg — it is the section itself scrolling past, so the
             * viewport is the yardstick and there is no nav offset. Reading
             * the computed position keeps the CSS the single source of truth
             * for which of those is in play.
             */
            const panel = pinned.current;
            const isPinned =
                !!panel && getComputedStyle(panel).position === "sticky";
            const offset = isPinned ? NAV_HEIGHT : 0;
            const viewport =
                isPinned && panel ? panel.offsetHeight : window.innerHeight;
            const travel = height - viewport;
            if (travel <= 0) return;
            const scaled = Math.min(
                count,
                Math.max(0, ((offset - top) / travel) * count),
            );
            const next = Math.min(count - 1, Math.floor(scaled));
            /*
             * How far through the active pillar's own slice we are, written
             * straight to a custom property. The green edge reads it in CSS,
             * so it can track every frame without re-rendering React; only
             * the index, which changes four times, goes through state.
             */
            el.style.setProperty(
                "--pillar-progress",
                String(Math.min(1, Math.max(0, scaled - next))),
            );
            setActive(next);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };
        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [count]);

    return { wrapper, pinned, active, setActive };
};

const SupportPillars = () => {
    const { wrapper, pinned, active, setActive } = useScrollProgress(
        supportPillars.length,
    );

    // Clicking or focusing a tile scrolls to the matching slice of the wrapper,
    // so pointer and keyboard land in the same place the scroll would.
    const goTo = useCallback(
        (i: number) => {
            const el = wrapper.current;
            const panel = pinned.current;
            setActive(i);
            if (!el) return;
            const isPinned =
                !!panel && getComputedStyle(panel).position === "sticky";
            const offset = isPinned ? NAV_HEIGHT : 0;
            const viewport =
                isPinned && panel ? panel.offsetHeight : window.innerHeight;
            const travel = el.offsetHeight - viewport;
            if (travel <= 0) return;
            const origin = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top:
                    origin -
                    offset +
                    (travel * i) / (supportPillars.length - 1 || 1),
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
                    .matches
                    ? "auto"
                    : "smooth",
            });
        },
        [wrapper, pinned, setActive],
    );

    return (
        <div
            ref={wrapper}
            className="lg:h-[400vh]"
            style={
                {
                    "--nav": `${NAV_HEIGHT}px`,
                    "--count": supportPillars.length,
                } as React.CSSProperties
            }
        >
            <div
                ref={pinned}
                className="lg:sticky lg:top-[var(--nav)] lg:h-[calc(100vh_-_var(--nav))] lg:flex lg:items-center py-16 md:py-24 lg:py-0"
            >
                <div className="max-w-7xl mx-auto w-full px-5">
                    {/*
                     * The section's own heading is kept for the document
                     * outline and for the Wiltshire keyword, which the
                     * per-pillar copy no longer carries.
                     */}
                    <h2 className="sr-only">
                        Health &amp; safety support for Wiltshire contractors
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-10 lg:gap-20 lg:items-center">
                        {/*
                         * Below lg every pillar's copy is in normal flow, which
                         * is both the more useful mobile reading and what makes
                         * the section tall enough to have scroll travel at all.
                         * Only lg stacks them for the crossfade. All four stay
                         * in the accessibility tree either way — the fade is a
                         * visual treatment, not a way of hiding content.
                         */}
                        <div className="relative order-2 lg:order-1 flex flex-col gap-14 lg:block lg:min-h-[18rem]">
                            {supportPillars.map((pillar, i) => (
                                <div
                                    key={pillar.title}
                                    className={`lg:absolute lg:inset-0 lg:transition-opacity lg:duration-500 motion-reduce:lg:transition-none ${
                                        i === active
                                            ? "lg:opacity-100"
                                            : "lg:opacity-0 lg:pointer-events-none"
                                    }`}
                                >
                                    <div className="w-20 h-1.5 bg-[#22C55E] mb-6 md:mb-10" />
                                    <h3 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 tracking-tight leading-tight text-black uppercase">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-lg md:text-xl text-gray-800 font-inter leading-relaxed max-w-xl">
                                        {pillar.body}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <ul
                            className="order-1 lg:order-2 flex flex-col -ml-5 sm:ml-0 [--shear:0px] sm:[--shear:clamp(18px,4.8vw,36px)] lg:[--tile:calc((100vh_-_var(--nav))/var(--count))] lg:[--shear:calc(var(--tile)*0.28)]"
                            style={{ marginRight: PILLAR_BLEED }}
                        >
                            {supportPillars.map((pillar, i) => (
                                <li
                                    key={pillar.title}
                                    className="group relative h-28 md:h-32 lg:h-[var(--tile)] lg:[&:not(:last-child)]:h-[calc(var(--tile)_+_1px)] lg:[&:not(:last-child)]:-mb-px"
                                    style={
                                        {
                                            clipPath: PILLAR_CLIP,
                                            marginLeft: `calc(${i} * var(--shear))`,
                                            backgroundImage: PILLAR_EDGE_FILL,
                                            "--fill":
                                                i < active
                                                    ? "1"
                                                    : i === active
                                                      ? "var(--pillar-progress, 0)"
                                                      : "0",
                                        } as React.CSSProperties
                                    }
                                >
                                    <button
                                        type="button"
                                        onClick={() => goTo(i)}
                                        onFocus={() => setActive(i)}
                                        aria-current={i === active}
                                        style={{ clipPath: PILLAR_CLIP }}
                                        className="absolute inset-y-0 right-0 left-1.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                                    >
                                        <img
                                            src={pillar.image}
                                            alt=""
                                            loading="lazy"
                                            decoding="async"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div
                                            className={`absolute inset-0 bg-gradient-to-r transition-colors duration-500 motion-reduce:transition-none ${
                                                i === active
                                                    ? "from-black/70 via-black/45 to-black/15"
                                                    : "from-black/90 via-black/80 to-black/60"
                                            }`}
                                        />
                                        <span className="relative h-full flex items-center gap-4 pl-[calc(var(--shear)+1.25rem)] sm:pl-[calc(var(--shear)+1.5rem)] pr-8">
                                            <pillar.icon
                                                size={26}
                                                className={`shrink-0 transition-colors duration-500 motion-reduce:transition-none ${
                                                    i === active
                                                        ? "text-[#22C55E]"
                                                        : "text-white/50"
                                                }`}
                                                aria-hidden="true"
                                            />
                                            <span
                                                className={`font-bold text-xs md:text-sm uppercase tracking-[0.2em] leading-relaxed transition-colors duration-500 motion-reduce:transition-none ${
                                                    i === active
                                                        ? "text-white"
                                                        : "text-white/60"
                                                }`}
                                            >
                                                {pillar.title}
                                            </span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPillars;
