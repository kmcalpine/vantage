import a1Solutions from "../assets/clients/a1-solutions-south-west.webp";
import conlon from "../assets/clients/conlon.webp";
import cwp from "../assets/clients/cwp.webp";
import gradus from "../assets/clients/gradus-groundworks.webp";
import highways from "../assets/clients/highways-management-group.webp";

/*
 * Every logo is normalised before it gets here: flattened onto white, inverted
 * if it arrived as light artwork on a dark ground, and trimmed to its own
 * bounding box. That last step is what lets this row be sized arithmetically —
 * the source files carry wildly different amounts of built-in padding (Gradus
 * had 112px of dead space above its wordmark), and untrimmed, their stated
 * dimensions would describe the export canvas rather than the artwork.
 *
 * Natural dimensions travel with each entry so the browser can reserve the
 * right box before the image loads, and so the sizing below has something to
 * work from.
 */
const CLIENTS = [
    {
        name: "Highways Management Group",
        src: highways,
        width: 199,
        height: 112,
    },
    { name: "CWP", src: cwp, width: 412, height: 138 },
    { name: "Conlon", src: conlon, width: 409, height: 143 },
    { name: "Gradus Groundworks", src: gradus, width: 277, height: 88 },
    {
        name: "A1 Solutions South West",
        src: a1Solutions,
        width: 601,
        height: 240,
    },
];

/*
 * Logos are matched on area, not on height.
 *
 * A shared max-height is the obvious approach and the wrong one here, because
 * these logos are not the same shape: they run from wide wordmarks (Gradus,
 * aspect 3.15) to a stacked mark (Highways, 1.78). Give them all the same
 * height and Highways renders about half the visual mass of its neighbours —
 * the eye reads the smaller *area* as a smaller logo, however level the tops
 * are.
 *
 * So each logo is scaled to a common area instead: h = sqrt(AREA / aspect).
 * The constant is chosen so a typical wordmark lands near 44px tall, which is
 * also the ceiling the source files allow — at these sizes the two tightest
 * (Highways and Gradus) are still at 2x on a retina screen, and a larger
 * constant would start to soften them.
 */
const OPTICAL_AREA = 5540;

const opticalHeight = (width: number, height: number) =>
    Math.round(Math.sqrt(OPTICAL_AREA / (width / height)));

const ClientLogos = () => {
    return (
        <section
            id="clients"
            className="py-16 md:py-32 px-5 bg-white border-t border-stone-200"
        >
            <div className="max-w-7xl mx-auto">
                <div className="w-20 h-1.5 bg-black mb-6 md:mb-10" />
                <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 tracking-tight leading-tight text-black uppercase">
                    Who we work with
                </h2>
                <p className="text-lg md:text-xl text-black/80 font-inter leading-relaxed max-w-xl">
                    Contractors across groundworks, surfacing and highways rely
                    on us for their health &amp; safety support.
                </p>

                <ul className="flex flex-wrap items-center justify-between gap-x-12 gap-y-10 md:gap-x-20 md:gap-y-12 mt-12 md:mt-20">
                    {CLIENTS.map((client) => (
                        <li key={client.name} className="flex">
                            <img
                                src={client.src}
                                alt={client.name}
                                width={client.width}
                                height={client.height}
                                loading="lazy"
                                decoding="async"
                                style={
                                    {
                                        "--logo-h": opticalHeight(
                                            client.width,
                                            client.height,
                                        ),
                                    } as React.CSSProperties
                                }
                                className="w-auto h-[calc(var(--logo-h)*0.78px)] md:h-[calc(var(--logo-h)*1px)]"
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default ClientLogos;
