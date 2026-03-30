import { useState, useEffect } from "react";

export function useScroll(threshold = 70) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if the current scroll position is greater than or equal to the threshold
            setIsScrolled(window.scrollY >= threshold);
        };

        // Run the check immediately on mount in case the user refreshes midway down the page
        handleScroll();

        // Attach the event listener
        window.addEventListener("scroll", handleScroll);

        // Cleanup the event listener on unmount to prevent memory leaks
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [threshold]);

    return isScrolled;
}
