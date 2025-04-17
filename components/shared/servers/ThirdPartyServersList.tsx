'use client';

import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import apiService from "@/app/services/apiService";
import ThirdPartyServerListItem from './ThirdPartyServerListItem';
import AddServerModal from '../modals/AddServerModal';
import { getUserId } from '@/app/lib/actions';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Flame, Pencil, Trash2 } from 'lucide-react';
import DeleteServerModal from '../modals/DeleteServer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import BoostServerModal from '../modals/BoostServerModal';
import EditServerModal from '../modals/EditServerModal';

export type ThirdPartyServerType = {
    id: string;
    ip: string;
    port: number;
    name: string;
    map: string;
    published: boolean;
    is_paid: boolean;
    is_boosted: boolean;
    server_type: { title: string };
    description: string;
    map_image: string;
    map_icon: string;
    ping: string;
    current_players: number;
    max_players: string;
    owner: { id: string; name: string };
    createdAt: string;
};

const fetcher = (url: string) => apiService.get(url).then(res => res.data);

const ThirdPartyServerList = () => {
    const { data: servers = [], error, isLoading } = useSWR<ThirdPartyServerType[]>('/api/servers/third-party/', fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 30000,
    });
    const [userId, setUserId] = useState<string | null>(null);
    const [selectedServerType, setSelectedServerType] = useState<string>('');
    const [serverToDelete, setServerToDelete] = useState<string | null>(null);
    const [serverToBoost, setServerToBoost] = useState<string | null>(null); 
    const [serverToEdit, setServerToEdit] = useState<ThirdPartyServerType | null>(null);
    const [visibleCount, setVisibleCount] = useState(5);
    const LOAD_COUNT = 5;
    useEffect(() => {
        const fetchUserId = async () => {
            const id = await getUserId();
            setUserId(id);
        };
        fetchUserId();
    }, []);
    if (isLoading) {
        return (
            <div role="status" className="max-w-sm animate-pulse">
                <div className="h-2.5 bg-gray-600/50 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
                <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 mb-2.5"></div>
                <div className="h-2 bg-gray-600/50 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    if (error) {
        return <div>Error loading servers: {error.message}</div>;
    }

    const handleEdit = (server: ThirdPartyServerType) => {
        console.log("Редактирование сервера:", server);
        setServerToEdit(server);
    };


    const sortedServers = [...servers].sort((a, b) => {
        const aPriority = a.is_paid || a.is_boosted;
        const bPriority = b.is_paid || b.is_boosted;

        if (aPriority && !bPriority) {
            return -1;
        } else if (!aPriority && bPriority) {
            return 1;
        } else {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
    });

    const filteredServers = selectedServerType
        ? sortedServers.filter(server => server.server_type && server.server_type.title === selectedServerType)
        : sortedServers;

    const serverTypes = [...new Set(servers.map(server => server.server_type ? server.server_type.title : '').filter(Boolean))];

    return (
        <div>
            <div className='font-bold text-2xl flex justify-center items-center'>Мониторинг серверов <AddServerModal /></div>
            <div className='font-light text-xs text-gray-400 flex justify-center items-center'>Все актуальные сервера Counter-Strike 2 в одном месте. Выбирай, подключайся и побеждай!</div>

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setSelectedServerType('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedServerType === ''
                            ? 'bg-green-500/10 text-green-300 text-lg font-light'
                            : 'bg-gray-600/20 text-gray-400 text-lg font-light hover:bg-gray-500/20'
                        }`}
                >
                    Все сервера
                </button>
                {serverTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => setSelectedServerType(type)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedServerType === type
                                ? 'bg-green-500/20 text-green-300 text-lg font-light'
                                : 'bg-gray-600/20 text-gray-400 text-lg font-light hover:bg-gray-500/20'
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {filteredServers.slice(0, visibleCount).map((server) => (
  <div key={server.id} className="flex flex-col sm:flex-row sm:justify-between">
    {/* Основной контент сервера */}
    <ThirdPartyServerListItem server={server} />

    {/* Кнопки действий владельца */}
    {userId === server.owner?.id && (
      <>
        {/* Десктопная версия (оставить как есть) */}
        <div className="hidden sm:flex ml-2 space-x-1 mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setServerToBoost(server.id)} 
                  className="bg-yellow-400/20 hover:bg-yellow-700/20 text-red-400/50 px-3 py-1 rounded-full text-sm"
                >
                  <Flame size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Поднять</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => handleEdit(server)} 
                  className="bg-gray-500/20 hover:bg-gray-700/20 text-gray-500/50 px-3 py-1 rounded-full text-sm"
                >
                  <Pencil size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Редактировать</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => setServerToDelete(server.id)} 
                  className="bg-red-500/20 hover:bg-red-700/20 text-red-500/50 px-3 py-1 rounded-full text-sm"
                >
                  <Trash2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Удалить</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Мобильная версия */}
        <div className="sm:hidden flex justify-end space-x-2 -mt-4 p-2 bg-gray-800/50 rounded-lg">
          <Button 
            onClick={() => setServerToBoost(server.id)} 
            className="bg-yellow-400/20 hover:bg-yellow-700/20 text-red-400/50 p-2 rounded-full h-8 w-8"
          >
            <Flame size={14} />
          </Button>
          
          <Button 
            onClick={() => handleEdit(server)} 
            className="bg-gray-500/20 hover:bg-gray-700/20 text-gray-500/50 p-2 rounded-full h-8 w-8"
          >
            <Pencil size={14} />
          </Button>
          
          <Button 
            onClick={() => setServerToDelete(server.id)} 
            className="bg-red-500/20 hover:bg-red-700/20 text-red-500/50 p-2 rounded-full h-8 w-8"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </>
    )}
  </div>
))}
          {visibleCount < filteredServers.length && (
  <div className="flex justify-center mt-6">
    <Button
      onClick={() => setVisibleCount(prev => prev + LOAD_COUNT)}
      className="bg-green-600/10 hover:bg-green-600/20 text-green-500"
    >
      Показать больше
    </Button>
  </div>
)}  
            {serverToDelete && (
            <DeleteServerModal
                    isOpen={!!serverToDelete}
                    onClose={() => setServerToDelete(null)}
                    serverId={serverToDelete}
                />)}
            {serverToBoost && (
            <BoostServerModal
                isOpen={!!serverToBoost}
                onClose={() => setServerToBoost(null)}
                serverId={serverToBoost}
            />
            )}
                        {serverToEdit && (
                <EditServerModal
                    isOpen={!!serverToEdit}
                    onClose={() => setServerToEdit(null)}
                    server={serverToEdit}
                />
            )}
        </div>

    );
};

export default ThirdPartyServerList;