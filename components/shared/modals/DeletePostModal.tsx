'use client';

import Modal from './Modal';
import { Button } from '@/components/ui/button';
import apiService from '@/app/services/apiService';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { getUserId } from '@/app/lib/actions';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onPostDeleted: () => void;
}

const DeletePostModal: React.FC<DeletePostModalProps> = ({ isOpen, onClose, postId, onPostDeleted }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await apiService.delete(`/api/post/delete/${postId}/`);
      toast.success("Пост успешно удалён!");

      const userId = await getUserId();
      mutate(`/api/posts/user/?user_id=${userId}`); // Обновляем кэш SWR

      onPostDeleted(); // Обновляем список постов
      onClose(); // Закрываем модалку
    } catch (error) {
      console.error("Ошибка удаления поста:", error);
      alert("Не удалось удалить пост");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      label="Удаление поста"
      content={
        <div>
          <p className="text-lg mb-4 text-gray-300">
            Вы уверены, что хотите удалить этот пост? Это действие <span className="font-bold text-red-400">нельзя отменить</span>.
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

export default DeletePostModal;
