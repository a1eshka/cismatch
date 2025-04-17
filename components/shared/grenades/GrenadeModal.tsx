"use client";

import { motion } from "framer-motion";
import { Keyboard, Mouse, X } from "lucide-react";

interface Props {
    grenade: { id: number; name: string; map_name: string; description: string; video_webm_url: string };
    onClose: () => void;
}

const GrenadeModal: React.FC<Props> = ({ grenade, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-800 border border-gray-500/20 rounded-lg p-6 w-[95%] max-w-3xl relative"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-white hover:text-red-400"
                >
                    <X size={24} />
                </button>

                <h3 className="text-white text-xl font-bold mb-1">{grenade.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{grenade.map_name}</p>
                <div className="flex text-sm font-bold items-center text-gray-400 mb-4"><Keyboard className="mr-1"/>+<Mouse className="mx-1"/>{grenade.description}</div>
                <video
                    className="w-full max-h-[80vh] rounded-lg"
                    src={grenade.video_webm_url}
                    controls
                    autoPlay
                    muted
                    loop
                />
            </motion.div>
        </motion.div>
    );
};

export default GrenadeModal;
