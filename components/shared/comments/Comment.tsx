'use client';
import { useState } from 'react';
import apiService from '@/app/services/apiService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { OctagonAlert } from 'lucide-react';
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
import useLoginModal from '@/app/hooks/useLoginModal';
import { getUserId } from '@/app/lib/actions';

const AddComment = ({ postId }: { postId: string }) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [commentBody, setCommentBody] = useState('');
  const loginModal = useLoginModal();

  const resetForm = () => {
    setCommentBody('');
    setErrors([]);
  };

  const submitComment = async () => {
    const userId = await getUserId();
    if (!userId) {
      loginModal.open();
      toast.info('Для добавления комментария необходимо авторизоваться');
      return;
    }

    if (!commentBody.trim()) {
      setErrors(['Комментарий не может быть пустым.']);
      return;
    }

    try {
      const response = await apiService.post(`/api/comments/create/${postId}`, {
        text: commentBody,
        post_id: postId
      });

      if (response.success) {
        toast.success('Комментарий успешно добавлен!');
        resetForm();
        mutate(`/api/post/${postId}/comments`);
      } else {
        const tmpErrors = Object.values(response.errors || {}).map((error: any) => error);
        setErrors(tmpErrors);
      }
    } catch (error) {
      setErrors(['Ошибка при добавлении комментария.']);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center px-3 py-2 rounded-lg bg-gray-800">
        <textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          rows={3}
          className="block p-2.5 w-full text-sm bg-gray-900 rounded-lg focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Ваш комментарий..."
        />
        <button
          onClick={submitComment}
          type="button"
          className="inline-flex ml-2 justify-center p-2 text-green-600 rounded-full cursor-pointer hover:bg-gray-700"
        >
          <svg
            className="w-6 h-6 rotate-90"
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
        <Alert key={index} variant="destructive" className="mt-2">
          <OctagonAlert className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default AddComment;