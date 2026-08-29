import logo from "../assets/logo-black-icon.png";
import PortalLink from "./PortalLink";

interface HeaderProps {
    scrolled: boolean;
    contactAction: () => void;
    themeColor: string;
}

const Header = ({ scrolled, contactAction, themeColor }: HeaderProps) => {
    return (
        <div
            className={`flex absolute top-0 w-full px-4 items-center justify-between bg-white z-100 transition-shadow duration-300 ${
                scrolled
                    ? "shadow-lg fixed top-0 left-0 right-0 h-[70px] px-4"
                    : "hidden"
            }`}
        >
            <div className="flex items-center gap-4">
                <img
                    src={logo}
                    alt="Vantage Safety Services"
                    className="h-6 cursor-pointer"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                />
            </div>

            <style>{`
                :root {
                    --theme-color: ${themeColor};
                }
            `}</style>

            <nav className="flex items-center gap-6 md:gap-10">
                <PortalLink />
                <a
                    href="#contact"
                    onClick={(e) => {
                        e.preventDefault();
                        contactAction();
                    }}
                    style={{ backgroundColor: "black" }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = themeColor)
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "black")
                    }
                    className="hidden md:inline-flex text-white px-5 py-3 cursor-pointer transition font-sora text-md font-bold"
                >
                    Enquire Now
                </a>
            </nav>
        </div>
    );
};

export default Header;
