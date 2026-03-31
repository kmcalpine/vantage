import logo from "../assets/logo-black-icon.png";

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

            <div className="hidden md:flex items-center gap-10">
                <ul className="flex gap-10 items-center m-0 p-0">
                    <button
                        onClick={contactAction}
                        style={{ backgroundColor: "black" }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = themeColor)
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "black")
                        }
                        className="text-white px-5 py-3 cursor-pointer transition font-sora text-md font-bold"
                    >
                        Enquire Now
                    </button>
                </ul>
            </div>
        </div>
    );
};

export default Header;
