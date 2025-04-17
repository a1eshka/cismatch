
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import apiService from '@/app/services/apiService';
import AddComment from '@/components/shared/comments/Comment';
import CommentsList from '@/components/shared/comments/CommentsList';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/Conatiner';
import { UserRound } from 'lucide-react';
import { type Metadata, type ResolvingMetadata } from 'next';
import { type GetStaticPropsContext } from 'next';

interface PostPageProps {
  params: { id: string }
}

interface Post {
  id: string;
  title: string;
  body: string;
  image_url?: string;
  status?: {
    title: string;
  };
  role?:{
    title: string;
  };
  author: {
    name?: string;
    steam_avatar?: string;
    avatar_url?: string;
  };
}


// ✅ Генерация метаданных
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const postId = params.id;
  const response = await apiService.get(`/api/post/${postId}`);
  const post: Post = response.data ?? response;

  const description =
    post.body.length > 160 ? post.body.slice(0, 157) + '...' : post.body;

  return {
    title: `CISMatch — ${post.title}`,
    description,
    keywords:
      'поиск тиммейтов CS2, найти команду CS2, новости cs2, ищу команду, ищу тиммейта faceit, найти тиммейта, найти команду кс',
  };
}

// ✅ Основная страница
export default async function PostsPageDetail({ params }: PostPageProps) {
  const postId = params.id;
  const response = await apiService.get(`/api/post/${postId}`);
  const post: Post = response.data ?? response;

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
