"use client";

import { useState } from "react";
import { useDailyGrenades } from "@/app/hooks/useDailyGrenades";
import GrenadePreview from "./GrenadePreview";
import GrenadeModal from "./GrenadeModal";


const DailyGrenades = () => {
    const { flash, smoke, isLoading, isError } = useDailyGrenades();
    const [selectedGrenade, setSelectedGrenade] = useState(null);

    if (isLoading) return (
        <div role="status" className="max-w-sm animate-pulse">
            <div className="h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
            <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
            <span className="sr-only">Loading...</span>
        </div>
    ); // Loading indicator
    if (isError || !flash || !smoke) return <p>Ошибка загрузки</p>;

    return (
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <GrenadePreview
                grenade={flash}
                type="flash"
                onClick={() => setSelectedGrenade(flash)}
            />
            <GrenadePreview
                grenade={smoke}
                type="smoke"
                onClick={() => setSelectedGrenade(smoke)}
            />

            {selectedGrenade && (
                <GrenadeModal
                    grenade={selectedGrenade}
                    onClose={() => setSelectedGrenade(null)}
                />
            )}
        </div>
    );
};

export default DailyGrenades;
