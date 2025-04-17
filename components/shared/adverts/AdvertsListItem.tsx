import { Users, MapPin, EllipsisVertical, Copy } from "lucide-react";
import CopyButton from "../buttons/CopyServerButton";
import { AdvertType } from "./AdvertsList";
import Link from "next/link";

interface AdvertProps {
    advert:AdvertType;
    
}

const AdvertListItem: React.FC<AdvertProps> = ({
    advert
}) => {

    if (!advert.published) {
        return null; // Если сервер не опубликован, не рендерим ничего
    }
    return (
        <>
    <Link href={advert.url}>
    <div className="relative h-40 group">
    <div className="absolute inset-0 rounded-xl"></div>
    <div className="rounded-xl overflow-hidden h-full">
        <img className="w-full h-full object-cover rounded-xl " src={advert.advert_image_url} alt="Server Map" />
    </div>
    {advert.title ? 
    <div className="absolute inset-0 flex m-5 items-center justify-center text-gray-50 hover:text-white">
        <div className="font-bold text-xs md:text-[10px] lg:text-xs">{advert.title}</div>
    </div> 
    : ''}
    </div>
    </Link>
        </>
    )}

export default AdvertListItem;