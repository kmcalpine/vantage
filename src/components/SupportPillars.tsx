import { useCallback, useEffect, useRef, useState } from "react";
import { Eye, Layers, UserCheck, Zap } from "lucide-react";
import pillarExpertise from "../assets/pillar-expertise.webp";
import pillarOversight from "../assets/pillar-oversight.webp";
import pillarScalable from "../assets/pillar-scalable.webp";
import pillarResponse from "../assets/pillar-response.webp";

/*
 * Header.tsx pins itself as `fixed ... h-[70px]` once the page is scrolled,
 * which it always is by the time this section is reached. The pinned pillars
 * sit below it: the sticky offset, the usable height and the scroll maths all
 * derive from this one number.
 */
const NAV_HEIGHT = 70;

/*
 * Escapes the centred container and its padding so the photos run off the right
 * of the viewport; the section clips the overshoot so it never opens a
 * horizontal scrollbar. Applies only while the band is absolutely positioned —
 * below lg it is a static block and `right` does nothing.
 */
const BAND_BLEED = "calc((min(100vw, 80rem) - 100vw) / 2 - 1.25rem)";

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
            const progress = Math.min(1, Math.max(0, (offset - top) / travel));
            /*
             * One unbroken figure for the whole section rather than a
             * per-pillar one: the bar is a single rectangle spanning the full
             * height, so it fills continuously instead of resetting at each
             * boundary. Written straight to a custom property so it can track
             * every frame without re-rendering; only the index, which changes
             * four times, goes through state.
             */
            el.style.setProperty("--pillar-progress", String(progress));
            setActive(
                Math.min(count - 1, Math.max(0, Math.floor(progress * count))),
            );
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
                className="lg:sticky lg:top-[var(--nav)] lg:h-[calc(100vh_-_var(--nav))] py-16 md:py-24 lg:py-0"
            >
                <div className="max-w-7xl mx-auto w-full px-5 lg:h-full">
                    {/*
                     * The section's own heading is kept for the document
                     * outline and for the Wiltshire keyword, which the
                     * per-pillar copy no longer carries.
                     */}
                    <h2 className="sr-only">
                        Health &amp; safety support for Wiltshire contractors
                    </h2>

                    {/* Geometry for the three layers lives in index.css */}
                    <div className="pillar-stage relative lg:h-full">
                        {/*
                         * The progress bar: a plain rectangle, no clip of its
                         * own. The two opaque layers above cut it down to the
                         * diagonal wedge between them.
                         */}
                        <div
                            aria-hidden="true"
                            className="hidden lg:block absolute inset-x-0 top-0 bg-[#22C55E]"
                            style={{
                                height: "calc(var(--pillar-progress, 0) * 100%)",
                            }}
                        />

                        {/* Copy layer — opaque, so it masks the bar to its left */}
                        <div
                            className="lg:absolute lg:inset-0 lg:bg-white lg:flex lg:items-center"
                            style={{ clipPath: "var(--copy-clip, none)" }}
                        >
                            {/*
                             * Below lg every pillar's copy is in normal flow,
                             * which is both the more useful reading at that
                             * width and what makes the section tall enough to
                             * have scroll travel at all. Only lg stacks them
                             * for the crossfade. All four stay in the
                             * accessibility tree either way — the fade is a
                             * visual treatment, not a way of hiding content.
                             */}
                            <div className="relative flex flex-col gap-14 lg:block lg:min-h-[18rem] lg:w-[var(--split)] lg:pr-14">
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
                                        <p className="text-lg md:text-xl text-gray-800 font-inter leading-relaxed">
                                            {pillar.body}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/*
                         * Band layer — one clip for all four tiles, so the left
                         * edge is a single straight diagonal by construction
                         * rather than four segments chained corner to corner.
                         * Black behind the photos so any rounding seam between
                         * tiles reads as a dark line rather than letting the
                         * green bar show through.
                         */}
                        <div
                            className="lg:absolute lg:inset-y-0 lg:left-0 lg:bg-black"
                            style={{
                                clipPath: "var(--band-clip, none)",
                                right: BAND_BLEED,
                            }}
                        >
                            <ul className="hidden sm:flex flex-col lg:h-full">
                                {supportPillars.map((pillar, i) => (
                                    <li
                                        key={pillar.title}
                                        className="relative h-28 md:h-32 lg:h-auto lg:flex-1"
                                        style={
                                            {
                                                /*
                                                 * Clear the diagonal at this
                                                 * row's lowest point, where it
                                                 * reaches furthest right.
                                                 */
                                                "--row-pad": `calc(var(--split) + var(--bar) + var(--drop) * ${i + 1} / var(--count) + 1.5rem)`,
                                            } as React.CSSProperties
                                        }
                                    >
                                        <button
                                            type="button"
                                            onClick={() => goTo(i)}
                                            onFocus={() => setActive(i)}
                                            aria-current={i === active}
                                            className="absolute inset-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                                        >
                                            {/*
                                             * The band layer spans the whole
                                             * stage so its clip can be stated
                                             * in the same coordinates as the
                                             * copy layer's. The photo starts
                                             * at the split instead, or
                                             * object-cover would centre it on
                                             * a point the clip cuts away.
                                             *
                                             * The width is stated rather than
                                             * left auto: an absolutely
                                             * positioned replaced element
                                             * resolves auto width from its
                                             * intrinsic size and ignores
                                             * `right`, so the photo stopped at
                                             * its natural ratio and left the
                                             * band's black backing showing.
                                             */}
                                            <img
                                                src={pillar.image}
                                                alt=""
                                                loading="lazy"
                                                decoding="async"
                                                className="absolute inset-0 lg:left-[var(--split)] h-full w-full lg:w-[calc(100%_-_var(--split))] object-cover"
                                            />
                                            <div
                                                className={`absolute inset-0 lg:left-[var(--split)] bg-gradient-to-r transition-colors duration-500 motion-reduce:transition-none ${
                                                    i === active
                                                        ? "from-black/70 via-black/45 to-black/15"
                                                        : "from-black/90 via-black/80 to-black/60"
                                                }`}
                                            />
                                            <span className="relative h-full flex items-center gap-4 pl-6 lg:pl-[var(--row-pad)] pr-8">
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
        </div>
    );
};

export default SupportPillars;
