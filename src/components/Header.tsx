import { useState, useEffect } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import labourLogo from "../assets/vantage-labour.png";

interface NavItemProps {
    label: string;
    onClick: () => void;
    isInter?: boolean;
    themeColor: string;
}

const NavItem = ({ label, onClick, isInter, themeColor }: NavItemProps) => (
    <li
        className="cursor-pointer transition list-none"
        onClick={onClick}
        style={{ color: "inherit" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = themeColor)}
        onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
    >
        <span
            className={`${isInter ? "font-inter" : "font-sora"} text-md font-bold`}
        >
            {label}
        </span>
    </li>
);

interface HeaderProps {
    scrolled: boolean;
    navItems: { label: string; action: () => void; isInter?: boolean }[];
    contactAction: () => void;
    themeColor: string;
    isLabour?: boolean;
}

const Header = ({
    scrolled,
    navItems,
    contactAction,
    themeColor,
    isLabour,
}: HeaderProps) => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setShowMenu(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            className={`flex w-full items-center justify-between bg-white z-50 transition-shadow duration-300 ${
                scrolled
                    ? "shadow-lg fixed top-0 left-0 right-0 h-[80px] px-5 md:px-10 2xl:px-60"
                    : "h-[80px] md:h-[120px]"
            }`}
        >
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/")}
                    className="p-2 hover:bg-gray-100 transition-colors cursor-pointer group"
                    title="Back to selection"
                >
                    <ArrowLeft
                        size={20}
                        style={{ transition: "color 0.3s" }}
                        className="group-hover:text-[var(--theme-color)]"
                    />
                </button>
                <img
                    src={isLabour ? labourLogo : logo}
                    className="h-[25px] cursor-pointer"
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

            <div className="hidden lg:flex items-center gap-10">
                <ul className="flex gap-10 items-center m-0 p-0">
                    {navItems.map((item, index) => (
                        <NavItem
                            key={index}
                            label={item.label}
                            onClick={() => {
                                item.action();
                                setShowMenu(false);
                            }}
                            isInter={item.isInter}
                            themeColor={themeColor}
                        />
                    ))}
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

            <div className="lg:hidden flex items-center">
                <button
                    className="w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
                    onClick={() => setShowMenu((prev) => !prev)}
                >
                    <Menu />
                </button>
            </div>

            {showMenu && (
                <div
                    onClick={() => setShowMenu(false)}
                    className="fixed inset-0 h-screen z-50 bg-black/50 mt-[80px]"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-0 left-0 right-0 bg-white flex flex-col p-5 shadow-xl"
                    >
                        <ul className="flex flex-col gap-8 m-0 p-0">
                            {navItems.map((item, index) => (
                                <NavItem
                                    key={index}
                                    label={item.label}
                                    onClick={() => {
                                        item.action();
                                        setShowMenu(false);
                                    }}
                                    isInter={item.isInter}
                                    themeColor={themeColor}
                                />
                            ))}
                            <NavItem
                                label="Contact Us"
                                onClick={() => {
                                    contactAction();
                                    setShowMenu(false);
                                }}
                                themeColor={themeColor}
                            />
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
