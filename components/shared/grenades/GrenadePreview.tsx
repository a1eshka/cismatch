"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
    grenade: {
      id: number;
      name: string;
      description: string;
      map_name: string;
      video_webm_url: string;
    };
    type: "flash" | "smoke"; // Явно указываем тип гранаты
    onClick: () => void;
  }
  
  // Функция для получения правильного изображения
  const getMapImage = (mapName: string, type: "flash" | "smoke"): string => {
    if (!mapName) return "/maps/default.jpg";
    const suffix = type ? `_${type}` : "";
    return `${process.env.NEXT_PUBLIC_API_HOST}/media/grenades/${mapName}${suffix}.webp`;
  };
  
  const GrenadePreview: React.FC<Props> = ({ grenade, type, onClick }) => {
    const mapImage = getMapImage(grenade.map_name, type);

    return (
<motion.div
  whileHover={{ scale: 1.05 }}
  onClick={onClick}
  className="cursor-pointer w-full rounded-xl relative p-[2px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600"
>
  <div className="relative rounded-[11px] overflow-hidden bg-gray-800/20">
    {/* Фоновое изображение */}
    <img
      src={mapImage}
      alt={grenade.map_name}
      className="w-full h-40 object-cover absolute inset-0 z-0"
    />

    {/* Затемнённый градиент и текст поверх */}
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-black/10 px-3 py-2 z-10">
      <h3 className="text-white text-sm font-semibold">{grenade.name}</h3>
      <p className="text-gray-300 text-xs">{grenade.map_name}</p>
    </div>

    {/* Чтобы сохранить пропорции и видимость фона */}
    <div className="pt-40" />
  </div>
</motion.div>
    );
};

export default GrenadePreview;
