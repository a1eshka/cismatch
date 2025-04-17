'use client';

import { useEffect, useState } from "react";
import apiService from "@/app/services/apiService";
import MiniNewsListItem from "./MiniNewsItem";



export type MiniNewsType = {
    id:string;
    title:string;
    published:boolean;
    url:string;
    author:{ name: string };
    createdAt: string;

}


const MiniNewsList = () => {
    const [mininews, setMiniNews] = useState<MiniNewsType[]>([]);
    const [loading, setLoading] = useState(true);

const getMiniNews = async () => {
        setLoading(true);
        const tmpMiniNews = await apiService.get('/api/adverts/mininews')
        setMiniNews(tmpMiniNews.data)
        setLoading(false);
    };

    useEffect(() => {
        getMiniNews();
    }, []);

 // Индикатор загрузки

    return (
        <>
            {mininews.map((mininew) => {
                return (
                    <MiniNewsListItem
                        key={mininew.id}
                        mininew={mininew}
                    />
                )
            })}
        </>
    )
}

export default MiniNewsList;