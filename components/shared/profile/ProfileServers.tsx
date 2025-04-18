import { getUserId } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import React, { useEffect, useState } from 'react';
import DeleteServerModal from '../modals/DeleteServer';
import EditServerModal from '../modals/EditServerModal';
import { ThirdPartyServerType } from '../servers/ThirdPartyServersList';
import { Edit2, Flame, Trash2 } from 'lucide-react';
import BoostServerModal from '../modals/BoostServerModal';
export type ServerType = {
    id: string;
    ip: string;
    port: number;
    name: string;
    map: string;
    published: boolean;
    is_paid: boolean;
    is_boosted: boolean;
     server_type: { id: string | number; title: string };
    description: string;
    map_image: string;
    map_icon: string;
    ping: string;
    current_players: number;
    max_players: string;
    owner: { id: string; name: string };
    createdAt: string;
  };
const Servers = () => {
    const [userServers, setUserServers] = useState<ServerType[]>([]);
    const [loading, setLoading] = useState(true); // Состояние для индикатора загрузки
    const [serverToDelete, setServerToDelete] = useState<string | null>(null);
    const [editingServer, setEditingServer] = useState<ServerType | null>(null);
    const [serverToBoost, setServerToBoost] = useState<string | null>(null); 

    useEffect(() => {
        fetchUserServers();
    }, []);

    const fetchUserServers = async () => {
        setLoading(true);
        try {
            const id = await getUserId();
            const response = await apiService.get(`/api/servers/third-party/user/?user_id=${id}`);
            if (response.data) {
                setUserServers(response.data);
            }
        } catch (error) {
            console.error('Ошибка при получении серверов:', error);
        } finally {
            setLoading(false);
        }
    };
    const openDeleteModal = (serverId: string) => {
        setServerToDelete(serverId);
    };
    const closeDeleteModal = () => {
        setServerToDelete(null);
    };

    const openEditModal = (server: ServerType) => {
        setEditingServer(server);
    };

    const closeEditModal = () => {
        setEditingServer(null);
    };
    return (
        <div className="w-full sm:w-3/4 main-block-bg mb-10 p-4 sm:p-7 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Мои сервера</h3>

            {/* Индикатор загрузки */}
            {loading ? (
                <div role="status">
                    <svg
                        aria-hidden="true"
                        className="w-20 h-20 mt-5 text-gray-300/50 animate-spin dark:text-gray-600 fill-gray-600/50"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                        />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            ) : (
                // Если сервера загружены, отображаем их
                <div>
                    {userServers.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {userServers.map((server) => (
                                <div key={server.id} className="bg-gray-800 p-4 rounded-lg">
                                    <h4 className="text-xs font-semibold">{server.name}</h4>
                                    <p className="text-gray-400 text-xs">{server.ip}:{server.port}</p>
                                    <p className="text-gray-400 text-xs">{server.description}</p>
                                    <button
                                        onClick={() => openEditModal(server)}
                                        className="mt-3 bg-gray-600/20 hover:bg-gray-700/20 text-gray-600 py-1 px-3 rounded text-sm mr-2"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(server.id)}
                                        className="mt-3 bg-red-600/20 hover:bg-red-700/20 text-red-600 py-1 px-3 rounded text-sm mr-2"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setServerToBoost(server.id)}
                                        className="mt-3 bg-yellow-400/20 hover:bg-yellow-700/20 text-red-400/50 py-1 px-3 rounded text-sm"
                                    >
                                        <Flame size={18} />
                                    </button>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">У вас нет серверов.</p>
                    )}
                </div>
            )}
            {/* Модальное окно удаления */}
            {serverToDelete && (
                <DeleteServerModal
                    isOpen={!!serverToDelete}
                    onClose={closeDeleteModal}
                    serverId={serverToDelete}
                    onServerDeleted={fetchUserServers}
                />
            )}

            {/* Модальное окно редактирования */}
            {editingServer && (
                <EditServerModal
                    isOpen={!!editingServer}
                    onClose={closeEditModal}
                    server={editingServer}
                    onServerUpdated={fetchUserServers}
                />
            )}
                        <BoostServerModal
                            isOpen={!!serverToBoost}
                            onClose={() => setServerToBoost(null)}
                            serverId={serverToBoost}
                        />
        </div>
    );
};

export default Servers;
