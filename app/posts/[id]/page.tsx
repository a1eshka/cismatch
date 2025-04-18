
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import apiService from '@/app/services/apiService';
import AddComment from '@/components/shared/comments/Comment';
import CommentsList from '@/components/shared/comments/CommentsList';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/Conatiner';
import { UserRound } from 'lucide-react';
import { Metadata } from 'next';

const PostsPageDetail = async ({ params }: { params: { id: string } }) => {
  // Асинхронно загружаем данные поста
  const post = await apiService.get(`/api/post/${params.id}`);

  return (
    <Container className="flex flex-col my-10">
      <div className="flex justify-center">
        <div className="w-3/4 main-block-bg mb-10 p-7 rounded-xl">
          {post.status?.title ? (

            <div className="flex">
              <Badge variant="outline" className="text-white mr-2">{post.type?.title}</Badge>
              {post.status?.title && <Badge variant="outline" className="text-white mr-2">{post.status?.title}</Badge>}
              {post.role?.title && <Badge variant="outline" className="text-white">{post.role?.title}</Badge>}
            </div>

          ) : (
            ' '
          )}

          <Title text={post.title} size="md" className="font-extrabold mb-4" />
          <div className="text-gray-200 whitespace-pre-line">{post.body}</div>
          {post.image_url ? (
            <img className="rounded-lg mt-5" src={post.image_url} alt="Post image" />
          ) : (
            ''
          )}
          <div className="flex items-center mt-4">
            <Avatar>
              <AvatarImage
                src={post.author.steam_avatar ? post.author.steam_avatar : post.author.avatar_url}
                alt={post.author.name}
              />
              <AvatarFallback className="bg-gray-300 text-gray-800"><UserRound /></AvatarFallback>
            </Avatar>
            <div className="text-sm ml-2">{post.author.name}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-3/4 main-block-bg p-7 rounded-xl">
          <AddComment postId={post.id} />
          <CommentsList postId={post.id} />
        </div>
      </div>
    </Container>
  );
};

export default PostsPageDetail;