"use client";
import { motion } from "framer-motion";

interface GrenadeStoryProps {
    grenade: { id: number; name: string; map_name: string; description: string; video_webm_url: string };
}

const GrenadeStory: React.FC<GrenadeStoryProps> = ({ grenade }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-1/2 p-3 bg-gray-900 rounded-lg shadow-lg"
        >
            <h3 className="text-md font-semibold">{grenade.name}</h3>
            <p className="text-xs text-gray-400">{grenade.map_name}</p>
            <div>{grenade.description}</div>
            <video className="w-full mt-3 rounded-lg" controls autoPlay muted loop>
                <source src={grenade.video_webm_url} type="video/webm" />
                Ваш браузер не поддерживает WebM-видео.
            </video>
        </motion.div>
    );
};

export default GrenadeStory;
