'use client';

import useSWR from 'swr';
import { FaComment } from 'react-icons/fa';
import apiService from '@/app/services/apiService';

const fetcher = (url: string) => apiService.get(url).then(res => res.data);

interface Props {
  postId: string;
}

const CommentsCount: React.FC<Props> = ({ postId }) => {
  const { data: comments, error, isLoading } = useSWR(`/api/post/${postId}/comments`, fetcher);

  if (error) return null;
  if (isLoading || !comments) return null;

  return (
    <div className="flex -mt-2 text-gray-500/40 text-xs mr-3 items-center">
      <FaComment className="mr-1" />
      {comments.length}
    </div>
  );
};

export default CommentsCount;
