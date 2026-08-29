export const PORTAL_URL = "https://portal.vantagesafetyservices.co.uk";

/**
 * The way an existing client gets to their documents.
 *
 * Deliberately not styled as a call to action: "Enquire Now" is the one thing
 * this site is asking a visitor to do, and a second button beside it would
 * compete with it. Someone who already has an account is not being persuaded of
 * anything — they just need the door to be findable.
 */
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
