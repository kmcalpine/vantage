import React from "react";
import { ArrowRight } from "lucide-react";

interface HeroProps {
    backgroundImage: string;
    tagIcon: any;
    tagLabel: string;
    title: React.ReactNode;
    description: string;
    primaryButtonText: string;
    primaryButtonAction: () => void;
    secondaryButtonText: string;
    secondaryButtonAction: () => void;
    themeColor: string;
    isDarkText?: boolean;
}

const Hero: React.FC<HeroProps> = ({
    backgroundImage,
    tagIcon: TagIcon,
    tagLabel,
    title,
    description,
    primaryButtonText,
    primaryButtonAction,
    secondaryButtonText,
    secondaryButtonAction,
    themeColor,
    isDarkText = false,
}) => {
    return (
        <div className="relative h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    transform: "scale(1.08)",
                }}
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 h-full flex items-center px-5 max-w-7xl mx-auto w-full">
                <div className="max-w-4xl">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-bold mb-6 opacity-0 animate-fade-in-up"
                        style={{
                            backgroundColor: themeColor,
                            color: isDarkText ? "black" : "white",
                        }}
                    >
                        <TagIcon size={14} />
                        {tagLabel}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight opacity-0 animate-fade-in-up animation-delay-200">
                        {title}
                    </h1>
                    <p className="mt-8 text-xl text-gray-300 font-inter leading-relaxed max-w-2xl opacity-0 animate-fade-in-up animation-delay-400">
                        {description}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-5 opacity-0 animate-fade-in-up animation-delay-600">
                        <button
                            onClick={primaryButtonAction}
                            className="px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition flex items-center justify-center gap-2 cursor-pointer"
                            style={{
                                backgroundColor: themeColor,
                                color: isDarkText ? "black" : "white",
                            }}
                        >
                            {primaryButtonText} <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={secondaryButtonAction}
                            className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-black transition cursor-pointer"
                        >
                            {secondaryButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
