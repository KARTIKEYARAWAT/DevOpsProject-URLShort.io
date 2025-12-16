import React from "react";

const MagicButton = ({ title, icon, position, handleClick, otherClasses, loading }) => {
    return (
        <button
            className={`relative inline-flex h-14 overflow-hidden rounded-2xl p-[1px] focus:outline-none ${otherClasses}`}
            onClick={handleClick}
            disabled={loading}
        >
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span
                className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-slate-950 px-7 text-lg font-medium text-white backdrop-blur-3xl gap-2 ${loading ? 'opacity-70' : ''}`}
            >
                {position === "left" && icon}
                {loading ? (
                    <span className="animate-pulse">Processing...</span>
                ) : (
                    title
                )}
                {position === "right" && icon}
            </span>
        </button>
    );
};

export default MagicButton;
