'use client';

import useSWR from 'swr';
import apiService from "@/app/services/apiService";
import ServerListItem from "./ServerListItem";

export type ServerType = {
    id: string;
    ip: string;
    port: number;
    name: string;
    map: string;
    published: boolean;
    map_image: string;
    map_icon: string;
    ping: string;
    current_players: number;
    max_players: number;
    author: { name: string };
    createdAt: string;
};

interface ServerListProps {
    showLimited?: boolean; // Prop to limit the number of displayed servers
}

// Fetcher function for SWR
const fetcher = (url: string) => apiService.get(url).then(res => res.data);

const ServerList = ({ showLimited }: ServerListProps) => {
    const { data: servers = [], error, isLoading } = useSWR<ServerType[]>('/api/servers', fetcher, {
        revalidateOnFocus: true, // Automatically revalidate when the window regains focus
        refreshInterval: 30000, // Poll every 30 seconds
    });

    // Compute displayed servers directly based on SWR data
    const displayedServers = showLimited ? servers.slice(0, 4) : servers;

    if (isLoading) {
        return (
            <div role="status" className="max-w-sm animate-pulse">
                <div className="h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                <span className="sr-only">Loading...</span>
            </div>
        ); // Loading indicator
    }

    if (error) {
        return <div>Error loading servers...</div>;
    }

    return (
        <>
            {displayedServers.map((server) => (
                <ServerListItem key={server.id} server={server} />
            ))}
        </>
    );
};

export default ServerList;
