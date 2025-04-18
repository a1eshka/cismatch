'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/app/services/apiService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OctagonAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import { Textarea } from '@/components/ui/textarea';
import useSWR, { mutate } from 'swr';
import useLoginModal from '@/app/hooks/useLoginModal'; // Импортируем хук для модального окна авторизации
import { getUserId } from '@/app/lib/actions'; // Импортируем функцию для проверки авторизации

const AddComment = ({ postId }: { postId: string }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const loginModal = useLoginModal(); // Хук для управления модальным окном авторизации

  const resetForm = () => {
    setCommentBody('');
    setErrors([]);
  };

  const submitComment = async () => {
    // Проверяем, авторизован ли пользователь
    const userId = await getUserId();
    if (!userId) {
      loginModal.open(); // Открываем модальное окно авторизации
      return;
    }

    if (commentBody) {
      const formData = new FormData();
      formData.append('text', commentBody);
      formData.append('post_id', postId);

      try {
        const response = await apiService.post(`/api/comments/create/${postId}`, formData);
        if (response.success) {
          toast.success('Комментарий успешно добавлен!');
          resetForm();
          // Обновляем данные комментариев
          mutate(`/api/post/${postId}/comments`);
        } else {
          const tmpErrors: string[] = Object.values(response.errors || {}).map((error: any) => error);
          setErrors(tmpErrors);
        }
      } catch (error) {
        setErrors(['Ошибка при добавлении комментария.']);
      }
    } else {
      setErrors(['Комментарий не может быть пустым.']);
    }
  };

  return (
    <>
      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-800 dark:bg-gray-700">
        <textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          rows="1"
          className="block p-2.5 rows-1 w-full text-sm bg-gray-900 rounded-lg focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ваш комментарий..."
        ></textarea>
        <button
          onClick={submitComment}
          type="submit"
          className="inline-flex ml-1 justify-center p-2 text-green-600 rounded-full cursor-pointer hover:text-gray-400 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <svg
            className="w-6 h-6 rotate-90 rtl:-rotate-90"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 20"
          >
            <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
          </svg>
          <span className="sr-only">Отправить</span>
        </button>
      </div>
      {errors.map((error, index) => (
        <Alert variant="destructive" className="mb-2" key={index}>
          <OctagonAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}
    </>
  );
};

export default AddComment;