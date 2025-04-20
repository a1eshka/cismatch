'use client';
import apiService from '@/app/services/apiService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useSWR from 'swr';
import { UserRound } from 'lucide-react';

const fetcher = (url: string) => apiService.get(url).then(res => res.data);

interface Comment {
  id: number | string;
  text: string;
  created_at: string;
  formatted_date: string;
  formatted_time: string;
  author: {
    name: string;
    steam_avatar?: string;
    avatar_url?: string;
  };
}

const CommentsList = ({ postId }: { postId: string }) => {
  const { data: comments, error, isLoading } = useSWR<Comment[]>(`/api/post/${postId}/comments`, fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center mt-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-gray-500 mt-4">
        Не удалось загрузить комментарии
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        Пока нет комментариев. Будьте первым!
      </div>
    );
  }

  const isToday = (dateString: string) => {
    const [day, month, year] = dateString.split('.').map(Number);
    const commentDate = new Date(year, month - 1, day);
    const today = new Date();
    
    return (
      today.getFullYear() === commentDate.getFullYear() &&
      today.getMonth() === commentDate.getMonth() &&
      today.getDate() === commentDate.getDate()
    );
  };

  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Комментарии ({comments.length})</h3>
      
      {sortedComments.map((comment) => (
        <div key={comment.id} className="p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={comment.author.steam_avatar || comment.author.avatar_url}
                alt={comment.author.name}
              />
              <AvatarFallback className="bg-gray-600">
                <UserRound className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-gray-300">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-gray-400 ml-2">
                {isToday(comment.formatted_date) 
                  ? 'сегодня' 
                  : comment.formatted_date} в {comment.formatted_time}
              </span>
            </div>
          </div>
          <div className="mt-2 text-gray-200 whitespace-pre-line">
            {comment.text}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;