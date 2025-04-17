'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Modal from '../modals/Modal';
import apiService from '@/app/services/apiService';
import { mutate } from 'swr';
import { toast } from 'react-toastify';

interface EditServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    server: {
        id: string;
        ip: string;
        port: number;
        name: string;
        description: string;
        server_type: string;
    };
}

const EditServerModal: React.FC<EditServerModalProps> = ({ isOpen, onClose, server }) => {
    const [serverData, setServerData] = useState(server);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setServerData({ ...serverData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const jsonData = {
                ip: serverData.ip,
                port: serverData.port,
                server_type: typeof server.server_type === 'object' ? server.server_type.id : server.server_type,
                description: serverData.description,
            };
    
            console.log("📤 Отправка JSON:", jsonData);
    
            await apiService.put(`/api/servers/third-party/update/${server.id}/`, jsonData);
    
            mutate('/api/servers/third-party/');
            onClose();
        } catch (error) {
            console.error("❌ Ошибка при обновлении сервера", error);
        } finally {
            setLoading(false);
        }
    
    };

    return (
        <Modal 
            isOpen={isOpen}
            close={onClose}
            label="Редактировать сервер"
            content={
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Название сервера</label>
                        <div className="w-full bg-gray-700/30 text-gray-400 p-2 rounded-lg border border-gray-600">
                            {serverData.name}
                        </div>
                    </div>
                    <div className='flex w-full'>
                    <div className='mr-4 w-1/2'>
                        <label className="block text-sm font-medium text-gray-400">IP адрес</label>
                        <input 
                            type="text"
                            name="ip"
                            value={serverData.ip}
                            disabled
                            onChange={handleChange}
                            className="w-full bg-gray-700/30 text-gray-400 p-2 rounded-lg border border-gray-600"
                        />
                    </div>
                    <div className='w-1/2'>
                        <label className="block text-sm font-medium text-gray-400">Порт</label>
                        <input 
                            type="number"
                            name="port"
                            value={serverData.port}
                            onChange={handleChange}
                            disabled
                            className="w-full bg-gray-700/30 text-gray-400 p-2 rounded-lg border border-gray-600"
                        />
                    </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Описание</label>
                        <textarea 
                            name="description"
                            value={serverData.description}
                            onChange={handleChange}
                            className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600"
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button onClick={onClose} className="bg-gray-500/20 hover:bg-gray-600/20 text-gray-500" disabled={loading}>
                            Отмена
                        </Button>
                        <Button onClick={handleSave} className="bg-green-600/30 hover:bg-green-700/80 text-green-500" disabled={loading}>
                            {loading ? "Сохранение..." : "Сохранить"}
                        </Button>
                    </div>
                </div>
            }
        />
    );
};

export default EditServerModal;
