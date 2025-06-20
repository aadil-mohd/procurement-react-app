import React, { useRef, useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import "./StepIndicator.css";
import { IStep } from "../../../../types/approvalflowTypes";


// ✅ Corrected Props Typing
const StepIndicator: React.FC<{ steps: IStep[] }> = ({ steps }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    console.log(steps, "steps")
    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            setCanScrollLeft(scrollContainerRef.current.scrollLeft > 0);
            setCanScrollRight(
                scrollContainerRef.current.scrollLeft <
                scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth - 1
            );
        }
    };

    const handleScroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            const newScrollLeft =
                scrollContainerRef.current.scrollLeft +
                (direction === "left" ? -scrollAmount : scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        updateScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);
            return () => container.removeEventListener("scroll", updateScrollButtons);
        }
    }, []);

    return (
        <div className="relative flex items-center sticky top-0 bg-bgBlue">
            {canScrollLeft && (
                <button
                    onClick={() => handleScroll("left")}
                    className="absolute z-10 left-0 p-1 rounded-full bg-white shadow-md hover:bg-gray-50"
                >
                    <ChevronLeft className="w-4 h-4 text-blue-500" />
                </button>
            )}

            <div
                ref={scrollContainerRef}
                className="overflow-x-auto py-4 px-10 flex-1 scroll-smooth no-scrollbar"
            >
                <div className="relative flex items-center min-w-max">
                    {steps.map((step, index) => (
                        <div key={index} className="relative flex items-center mr-3">
                            <div className="flex items-center justify-center space-x-3">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center border-2 z-1
                                        ${`${step.status === "approved" || ((step.status === "pending" && (index == 0 || steps[index - 1].status == "approved"))) ? "bg-blue-500 border-white ring-blue-500 ring-2"
                                            : step.status === "rejected" ? "bg-red-500 border-white ring-red-500 ring-2"
                                                : "bg-white border-gray-200"}`
                                        }`}

                                >
                                    {step.status === "rejected" ? (
                                        <XIcon className="w-4 h-4 text-white" />
                                    ) : (step.status === "approved") ? (
                                        <Check className="w-4 h-4 text-white" />
                                    ) : (
                                        <span className={`text-[26px] ${((step.status === "pending" && (index == 0 || steps[index - 1].status == "approved"))) ? "text-white" : "text-gray-400"}`}>
                                            •
                                        </span>
                                    )}

                                </div>

                                <div className="mt-2 mb-1">
                                    <span className={`text-sm font-medium flex items-center ${step.current ? step.status == "rejected" ? "text-red-500" : "text-blue-500" : "text-gray-500"
                                        }`}>
                                        {step.approverRole}
                                    </span>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="w-12 flex items-center">
                                        <div className="w-full h-[2px] bg-gray-200" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {canScrollRight && (
                <button
                    onClick={() => handleScroll("right")}
                    className="absolute right-0 z-10 p-1 rounded-full bg-white shadow-md hover:bg-gray-50"
                >
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                </button>
            )}
        </div>
    );
};

export default StepIndicator;
