import { ServerType } from "./ServerList";
import { Users, MapPin, EllipsisVertical, Copy } from "lucide-react";
import CopyButton from "../buttons/CopyServerButton";

interface ServerProps {
    server:ServerType;
    
}

const ServerListItem: React.FC<ServerProps> = ({
    server
}) => {
    const textToCopy = `connect ${server.ip}:${server.port}`;
    if (!server.published) {
        return null; // Если сервер не опубликован, не рендерим ничего
    }
    return (
        <>
    
    {server.map ? 
    <div className="relative h-20 group">
    <div className="absolute inset-0 shadow-lg bg-gradient-to-r from-black via-gray-900 to-gray-700 opacity-70 transition-opacity duration-300 ease-in-out group-hover:opacity-0 rounded-xl"></div>
    <div className="rounded-xl overflow-hidden h-full">
        <img className="w-full h-full object-cover rounded-xl" src={server.map_image} alt="Server Map" />
    </div>
    <div className="absolute inset-0 flex m-5 items-center justify-center text-gray-50 hover:text-white">
        <div className="font-bold text-xs md:text-[10px] lg:text-xs">{server.name} <div className="font-normal flex items-center text-gray-200"> <img src={server.map_icon} className="max-w-6 mr-1"/> {server.map}</div></div>
    <div className="flex items-center text-sm"><Users size={14} className="mr-1"/> {server.current_players}/<div className="text-gray-300">{server.max_players} </div><EllipsisVertical className={Number(server.current_players) > 15
    ? "text-red-600 red-shape-blink mr-2"
    : Number(server.current_players) > 10
    ? "text-yellow-600 yellow-shape-blink mr-2"
    : "text-green-600 green-shape-blink mr-2"
  }/>  <div><CopyButton textToCopy={textToCopy} /></div></div>
        
    </div>
    </div>

: ''}
        </>
    )}

export default ServerListItem;