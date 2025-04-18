'use client';

import Modal from './Modal'; 
import { Button } from '@/components/ui/button'; 
import apiService from '@/app/services/apiService';
import { mutate } from 'swr';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface DeleteServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverId: string;
  onServerDeleted: () => Promise<void>;
}

const DeleteServerModal: React.FC<DeleteServerModalProps> = ({ isOpen, onClose, serverId }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await apiService.delete(`/api/servers/delete/${serverId}/`);
      toast.success("Сервер удален!");
      mutate('/api/servers/third-party/'); // Обновляем список серверов
      onClose(); // Закрываем модалку после удаления
    } catch (error) {
      console.error("Ошибка удаления сервера:", error);
      alert("Не удалось удалить сервер");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      label="Удаление сервера"
      content={
        <div>
          <p className="text-lg mb-4 text-gray-300">
            Вы уверены, что хотите удалить этот сервер? Это действие <span className="font-bold text-red-400">нельзя отменить</span>.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              className="bg-gray-500/20 hover:bg-gray-600/20 text-gray-500"
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600/20 hover:bg-red-700/20 text-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Удаление..." : "Удалить"}
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default DeleteServerModal;
