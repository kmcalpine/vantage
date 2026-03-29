import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, HardHat, ArrowRight } from "lucide-react";
import logoIcon from "./assets/logo-icon.png";

const SelectionPage = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<null | "safety" | "labour">(null);

    const handleSelect = (side: "safety" | "labour", path: string) => {
        setSelected(side);
        setTimeout(() => {
            navigate(path);
        }, 800); // Duration matches the CSS transition
    };

    return (
        <div
            className={`relative h-screen w-full overflow-hidden font-sora bg-black selection-container ${
                selected ? "is-selecting" : ""
            }`}
        >
            <div className="absolute top-4 left-4 z-20">
                <img src={logoIcon} className="w-12 h-12"></img>
            </div>
            <style>
                {`
                .selection-container {
                  --split-pos: 50%;
                  --split-offset: 5%;
                }

                .split-side {
                  position: absolute;
                  top: 0;
                  height: 100%;
                  width: 100%;
                  transition: clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease;
                  cursor: pointer;
                }
                
                .left-side {
                  left: 0;
                  z-index: 1;
                  clip-path: polygon(0 0, calc(50% + 5%) 0, calc(50% - 5%) 100%, 0 100%);
                }
                
                .right-side {
                  right: 0;
                  z-index: 1;
                  clip-path: polygon(calc(50% + 5%) 0, 100% 0, 100% 100%, calc(50% - 5%) 100%);
                }

                /* Hover States */
                .selection-container:not(.is-selecting):has(.left-side:hover) .left-side {
                  clip-path: polygon(0 0, 65% 0, 55% 100%, 0 100%);
                  z-index: 10;
                }
                .selection-container:not(.is-selecting):has(.left-side:hover) .right-side {
                  clip-path: polygon(65% 0, 100% 0, 100% 100%, 55% 100%);
                }

                .selection-container:not(.is-selecting):has(.right-side:hover) .left-side {
                  clip-path: polygon(0 0, 45% 0, 35% 100%, 0 100%);
                }
                .selection-container:not(.is-selecting):has(.right-side:hover) .right-side {
                  clip-path: polygon(45% 0, 100% 0, 100% 100%, 35% 100%);
                  z-index: 10;
                }

                /* Selection Expansion Logic */
                .is-selecting .left-side.selected {
                  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                  z-index: 50;
                }
                .is-selecting .left-side:not(.selected) {
                  z-index: 1;
                }

                .is-selecting .right-side.selected {
                  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                  z-index: 50;
                }
                .is-selecting .right-side:not(.selected) {
                  z-index: 1;
                }

                .is-selecting .content-reveal {
                  opacity: 0;
                  transform: translateY(-20px);
                  transition: opacity 0.4s ease, transform 0.4s ease;
                }

                /* Background Zoom */
                .bg-image {
                  position: absolute;
                  inset: 0;
                  background-size: cover;
                  background-position: center;
                  transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
                }

                .split-side:hover .bg-image {
                  transform: scale(1.08);
                }

                .content-reveal {
                  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .split-side:hover .content-reveal {
                  transform: scale(1.02);
                }

                @media (max-width: 1024px) {
                  .left-side {
                    clip-path: polygon(0 0, 100% 0, 100% 55%, 0 45%);
                  }
                  .right-side {
                    clip-path: polygon(0 45%, 100% 55%, 100% 100%, 0 100%);
                  }
                  .selection-container:not(.is-selecting):has(.left-side:hover) .left-side {
                    clip-path: polygon(0 0, 100% 0, 100% 65%, 0 55%);
                  }
                  .selection-container:not(.is-selecting):has(.left-side:hover) .right-side {
                    clip-path: polygon(0 55%, 100% 65%, 100% 100%, 0 100%);
                  }
                  .selection-container:not(.is-selecting):has(.right-side:hover) .left-side {
                    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 35%);
                  }
                  .selection-container:not(.is-selecting):has(.right-side:hover) .right-side {
                    clip-path: polygon(0 35%, 100% 45%, 100% 100%, 0 100%);
                  }
                }
              `}
            </style>

            {/* Left Side: Safety */}
            <div
                onClick={() => handleSelect("safety", "/safety")}
                className={`split-side left-side group ${
                    selected === "safety" ? "selected" : ""
                }`}
            >
                <div
                    className="bg-image"
                    style={{ backgroundImage: `url(src/assets/header.jpg)` }}
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative h-full flex flex-col items-start justify-center px-10 md:px-20 lg:pl-32 max-w-4xl">
                    <div className="">
                        <span className="block text-[#22C55E] font-bold tracking-[0.3em] text-xs mb-3 uppercase">
                            Division One
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            VANTAGE <br />
                            SAFETY
                        </h2>
                        <p className="text-gray-200 text-lg mb-8 font-inter leading-relaxed max-w-md hidden md:block">
                            Specialist H&S consultancy, CDM advisory, and
                            professional accreditation management.
                        </p>
                        <button className="flex items-center gap-3 px-8 py-4 bg-[#22C55E] text-white font-bold transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                            EXPLORE DIVISION{" "}
                            <ArrowRight
                                size={20}
                                className="transition-transform"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side: Labour */}
            <div
                onClick={() => handleSelect("labour", "/labour-hire")}
                className={`split-side right-side group ${
                    selected === "labour" ? "selected" : ""
                }`}
            >
                <div
                    className="bg-image"
                    style={{
                        backgroundImage: `url(https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070&auto=format&fit=crop)`,
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />

                <div className="relative h-full flex flex-col items-end justify-center px-10 md:px-20 lg:pr-32 text-right w-full ml-auto max-w-4xl">
                    <div className="flex flex-col items-end">
                        <span className="block text-[#FF8C00] font-bold tracking-[0.3em] text-xs mb-3 uppercase">
                            Division Two
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            VANTAGE <br />
                            LABOUR
                        </h2>
                        <p className="text-gray-200 text-lg mb-8 font-inter leading-relaxed max-w-md hidden md:block">
                            Reliable labour supply and safe workforce solutions
                            for construction and civil engineering.
                        </p>
                        <button className="flex items-center gap-3 px-8 py-4 bg-[#FF8C00] text-black font-bold transition-all hover:shadow-[0_0_30px_rgba(255,140,0,0.3)]">
                            HIRE WORKFORCE{" "}
                            <ArrowRight
                                size={20}
                                className="transition-transform"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Branding Tagline */}
            <div
                className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30 text-[10px] tracking-[0.5em] font-bold uppercase hidden md:block transition-opacity duration-500 ${
                    selected ? "opacity-0" : "opacity-100"
                }`}
            >
                Safety Led • Quality Driven • Industry Proven
            </div>
        </div>
    );
};

export default SelectionPage;
