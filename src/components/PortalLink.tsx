export const PORTAL_URL = "https://portal.vantagesafetyservices.co.uk";

const PortalLink = ({
    tone = "dark",
    className = "",
}: {
    /** "light" for the hero, where it sits over a darkened photograph. */
    tone?: "light" | "dark";
    className?: string;
}) => {
    const colour =
        tone === "light"
            ? "text-white/90 hover:text-white"
            : "text-black/70 hover:text-black";

    return (
        <a
            href={PORTAL_URL}
            className={`font-sora text-sm font-semibold tracking-tight transition-colors
                        inline-flex items-center gap-2 ${colour} ${className}`}
        >
            Client Portal
            <span aria-hidden="true">→</span>
        </a>
    );
};

export default PortalLink;
