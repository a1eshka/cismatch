'use client';

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";
import AdvertListItem from "./AdvertsListItem";


export type AdvertType = {
    id:string;
    title:string;
    body:string;
    published:boolean;
    url:string;
    advert_image_url:string;
    author:{ name: string };
    createdAt: string;

}


const AdvertList = () => {
    const [adverts, setAdverts] = useState<AdvertType[]>([]);
    const [loading, setLoading] = useState(true);

const getAdverts = async () => {
        setLoading(true);
        const tmpAdverts = await apiService.get('/api/adverts')
        setAdverts(tmpAdverts.data)
        setLoading(false);
    };

    useEffect(() => {
        getAdverts();
    }, []);

    if (loading) {
        return (
            <div role="status" className="animate-pulse">
            <div className="h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
            <div className="h-2.5 mx-auto bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[540px]"></div>
            <div className="flex items-center justify-center mt-4">
                <div className="w-20 h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 me-3"></div>
                <div className="w-20 h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 me-3"></div>
                <div className="w-24 h-2 bg-gray-600/50 rounded-full dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
            </div>
        )} // Индикатор загрузки

    return (
        <>
            {adverts.map((advert) => {
                return (
                    <AdvertListItem
                        key={advert.id}
                        advert={advert}
                    />
                )
            })}
        </>
    )
}

export default AdvertList;