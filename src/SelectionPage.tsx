import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import safetyHero from "./assets/header.jpg";
import labourHero from "./assets/vantage-labour.jpg";
import Logo from "./components/Logo";

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
            <Logo />
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
                  z-index: 10;
                  clip-path: polygon(0 0, calc(50% + 5%) 0, calc(50% - 5%) 100%, 0 100%);
                }
                
                .right-side {
                  right: 0;
                  z-index: 5;
                  clip-path: polygon(calc(50% + 5%) 0, 100% 0, 100% 100%, calc(50% - 5%) 100%);
                }

                /* Hover States - Desktop */
                @media (min-width: 1025px) {
                  .selection-container:not(.is-selecting):has(.left-side:hover) .left-side {
                    clip-path: polygon(0 0, 65% 0, 55% 100%, 0 100%);
                    z-index: 20;
                  }
                  .selection-container:not(.is-selecting):has(.left-side:hover) .right-side {
                    clip-path: polygon(65% 0, 100% 0, 100% 100%, 55% 100%);
                  }

                  .selection-container:not(.is-selecting):has(.right-side:hover) .left-side {
                    clip-path: polygon(0 0, 45% 0, 35% 100%, 0 100%);
                  }
                  .selection-container:not(.is-selecting):has(.right-side:hover) .right-side {
                    clip-path: polygon(45% 0, 100% 0, 100% 100%, 35% 100%);
                    z-index: 20;
                  }
                }

                /* Mobile/Tablet Layout */
                @media (max-width: 1024px) {
                  .left-side {
                    clip-path: polygon(0 0, 100% 0, 100% 55%, 0 45%);
                  }
                  .right-side {
                    clip-path: polygon(0 45%, 100% 55%, 100% 100%, 0 100%);
                  }
                  
                  /* Content adjustment for mobile clipping */
                  .left-side .content-container {
                    height: 50%;
                    justify-content: center;
                    padding-top: 2rem;
                  }
                  .right-side .content-container {
                    height: 50%;
                    margin-top: auto;
                    justify-content: center;
                    padding-bottom: 2rem;
                  }

                  /* Tap/Hover States - Mobile */
                  .selection-container:not(.is-selecting) .left-side:active,
                  .selection-container:not(.is-selecting):has(.left-side:hover) .left-side {
                    clip-path: polygon(0 0, 100% 0, 100% 60%, 0 50%);
                    z-index: 20;
                  }
                  .selection-container:not(.is-selecting):has(.left-side:hover) .right-side {
                    clip-path: polygon(0 50%, 100% 60%, 100% 100%, 0 100%);
                  }

                  .selection-container:not(.is-selecting) .right-side:active,
                  .selection-container:not(.is-selecting):has(.right-side:hover) .left-side {
                    clip-path: polygon(0 0, 100% 0, 100% 50%, 0 40%);
                  }
                  .selection-container:not(.is-selecting):has(.right-side:hover) .right-side {
                    clip-path: polygon(0 40%, 100% 50%, 100% 100%, 0 100%);
                    z-index: 20;
                  }
                }

                /* Hover Tints */
                .tint-overlay {
                  position: absolute;
                  inset: 0;
                  opacity: 0;
                  transition: opacity 0.5s ease;
                  pointer-events: none;
                  z-index: 5;
                }

                .selection-container:not(.is-selecting):has(.left-side:hover) .right-side .tint-overlay {
                  background-color: rgba(255, 140, 0, 0.25);
                  opacity: 1;
                }

                .selection-container:not(.is-selecting):has(.right-side:hover) .left-side .tint-overlay {
                  background-color: rgba(34, 197, 94, 0.25);
                  opacity: 1;
                }

                /* Selection Expansion Logic */
                .is-selecting .left-side.selected,
                .is-selecting .right-side.selected {
                  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
                  z-index: 100;
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
                    style={{ backgroundImage: `url(${safetyHero})` }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="tint-overlay" />

                <div className="content-container relative z-20 h-full flex flex-col items-start justify-center px-8 md:px-20 lg:pl-32 max-w-4xl">
                    <div className="content-reveal">
                        <span className="block text-[#22C55E] font-bold tracking-[0.3em] text-[10px] md:text-xs mb-3 uppercase">
                            Safety Solutions
                        </span>
                        <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                            VANTAGE <br />
                            SAFETY
                        </h2>
                        <p className="text-gray-200 text-base md:text-lg mb-8 font-inter leading-relaxed max-w-md hidden sm:block">
                            Specialist H&S consultancy, CDM advisory, and
                            professional accreditation management.
                        </p>
                        <button className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-[#22C55E] text-white font-bold transition-all cursor-pointer text-sm md:text-base">
                            VIEW SERVICES{" "}
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Side: Labour */}
            <div
                onClick={() => handleSelect("labour", "/labour-hire")}
                className={`split-side right-side flex items-end group ${
                    selected === "labour" ? "selected" : ""
                }`}
            >
                <div
                    className="bg-image"
                    style={{
                        backgroundImage: `url(${labourHero})`,
                    }}
                />
                <div className="absolute inset-0 bg-black/60" />
                <div className="tint-overlay" />

                <div className="content-container relative z-20 h-full flex flex-col items-end justify-center px-8 md:px-20 lg:pr-32 text-right w-full md:ml-auto max-w-4xl">
                    <div className="content-reveal flex flex-col items-end">
                        <span className="block text-[#FF8C00] font-bold tracking-[0.3em] text-[10px] md:text-xs mb-3 uppercase">
                            Workplace Solutions
                        </span>
                        <h2 className="text-3xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
                            VANTAGE <br />
                            LABOUR
                        </h2>
                        <p className="text-gray-200 text-base md:text-lg mb-8 font-inter leading-relaxed max-w-md hidden sm:block">
                            Reliable labour supply and safe workforce solutions
                            for construction and civil engineering.
                        </p>
                        <button className="flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-[#FF8C00] text-black font-bold transition-all cursor-pointer text-sm md:text-base">
                            HIRE WORKFORCE{" "}
                            <ArrowRight
                                size={18}
                                className="transition-transform group-hover:translate-x-1"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectionPage;
