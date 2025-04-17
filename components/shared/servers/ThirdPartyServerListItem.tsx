import { Users, EllipsisVertical, CirclePlay } from "lucide-react";
import CopyButton from "../buttons/CopyServerButton";
import { ThirdPartyServerType } from "./ThirdPartyServersList";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ThirdPartyServerProps {
  server: ThirdPartyServerType;
}

const ThirdPartyServerListItem: React.FC<ThirdPartyServerProps> = ({
  server,
}) => {
  const textToCopy = `connect ${server.ip}:${server.port}`;

  if (!server.published) {
    return null; // Если сервер не опубликован, не рендерим ничего
  }

  return (
    <>
      {server.map ? (
        <div className="relative group w-full mb-4">
          {/* Общий контейнер для мобильной версии */}
          <div className="sm:hidden flex flex-col p-3 rounded-lg bg-gray-800/50">
            {/* Первая строка: название и статус */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {server.is_boosted && (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_HOST}/media/icons/crown-promo.png`}
                    className="w-8 mr-2 z-20 animate-pulse"
                  />
                )}
                <div className="font-light text-xs truncate max-w-[180px]">
                  {server.name}
                </div>
              </div>
              <div className="flex items-center text-xs">
                <Users size={12} className="mr-1" />
                <span className="text-gray-300">{server.current_players}/{server.max_players}</span>
              </div>
            </div>

            {/* Вторая строка: IP и кнопки */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-xs text-gray-400 truncate max-w-[180px]">
                {server.ip}:{server.port}
              </div>
              <div className="flex space-x-2">
                <CopyButton textToCopy={textToCopy} />
                <a href={`steam://connect/${server.ip}:${server.port}`} target="_blank">
                  <CirclePlay className="text-green-700 hover:text-green-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Десктопная версия (полностью оригинальная) */}
          <div className="hidden sm:flex relative h-14 items-center">
            {/* Градиентный фон (по бокам) */}
            <div className={server.is_boosted ? "absolute border-l-4 border-2 border-green-700 inset-0 shadow-lg bg-gradient-to-r from-green-500 via-transparent to-black opacity-70 transition-opacity duration-300 ease-in-out rounded-xl z-10" : 'absolute inset-0 shadow-lg bg-gradient-to-r from-black via-transparent to-black opacity-70 transition-opacity duration-300 ease-in-out rounded-xl z-10'}></div>

            {/* Левая часть: Название сервера и карты */}
            {server.is_boosted && <img src={`${process.env.NEXT_PUBLIC_API_HOST}/media/icons/crown-promo.png`} className="w-12 left-2 ml-4 z-20 animate-pulse" />}
            <div className="flex-1 p-3 text-gray-50 hover:text-white select-text z-20">
              <div className="font-light text-xs md:font-bold md:text-sm md:text-[10px] lg:text-xs truncate">
                {server.name}
              </div>
              <div className="text-xs mt-1 flex items-center text-gray-400">
                {server.description
                  ? `${server.description} | ${server.ip}:${server.port}`
                  : `${server.ip}:${server.port}`}
              </div>
            </div>

            {/* Картинка (справа, ширина 200px) */}
            <div className="text-xs flex items-center text-gray-200 mr-4">
              <img src={server.map_icon || '/media/servers/icons/default_icon.png'} className="max-w-6 mr-1" alt="Map Icon"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${process.env.NEXT_PUBLIC_API_HOST}/media/servers/icons/default_icon.png`;
                }} />
              {server.map}
            </div>
            <div className="w-[200px] h-full overflow-hidden z-0 mr-2 relative">
              <img
                className="object-cover object-center w-full h-full"
                src={server.map_image || `${process.env.NEXT_PUBLIC_API_HOST}/media/servers/maps/default_map.webp`}
                alt="Server Map"
                style={{
                  WebkitMaskImage: "linear-gradient(to right, transparent, white 30%, white 70%, transparent)",
                  maskImage: "linear-gradient(to right, transparent, white 30%, white 70%, transparent)"
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${process.env.NEXT_PUBLIC_API_HOST}/media/servers/maps/default_map.webp`;
                }}
              />
            </div>

            {/* Правая часть: Количество игроков и кнопка копировать */}
            <div className="flex items-center space-x-4 p-3 text-gray-50 hover:text-white select-text z-20 ml-2 flex-shrink-0">
              <Badge className="bg-gray-500/20 text-gray-400">{server.server_type.title}</Badge>
              <div className="flex items-center text-sm">
                <Users size={14} className="mr-1" />
                {server.current_players}/
                <div className="text-gray-300">{server.max_players}</div>
                <EllipsisVertical
                  className={
                    Number(server.current_players) > 15
                      ? "text-red-600 red-shape-blink mr-2"
                      : Number(server.current_players) > 10
                        ? "text-yellow-600 yellow-shape-blink mr-2"
                        : "text-green-600 green-shape-blink mr-2"
                  }
                />
                <CopyButton textToCopy={textToCopy} />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={`steam://connect/${server.ip}:${server.port}`} className="ml-2" target="_blank">
                        <CirclePlay className="text-green-700 hover:text-green-400" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>Подключиться к серверу</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ThirdPartyServerListItem;