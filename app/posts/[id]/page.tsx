import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import apiService from '@/app/services/apiService';
import AddComment from '@/components/shared/comments/Comment';
import CommentsList from '@/components/shared/comments/CommentsList';
import { Title } from '@/components/shared/title';
import { Container } from '@/components/shared/Conatiner';
import { UserRound } from 'lucide-react';
import Link from 'next/link';

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
  type?: {
     title: string;
   }
  author: {
    id: string;
    name: string;
    steam_avatar?: string;
    avatar_url?: string;
  };
}
export async function generateMetadata({ params }: any ) {
  const postId = params.id;
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/post/${postId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': '',
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.log('❌ Status meta:', res.status);
    throw new Error('Post fetch failed');
  }
  
  const post: Post = await res.json();
  return {
    title: `CISMatch - ${post.title}`,
    description: `${post.body}`,
    keywords: 'поиск тиммейтов CS2, найти команду CS2, набор в команду CS2, игроки для CS2, тиммейты для матча, CS2 ранги, турниры CS2, киберспорт CS2, клан CS2, партнеры для CS2, играть в CS2, команда для Faceit, поиск сокомандников CS2, новости CS2, обновление CS2, CS2 патч, последние изменения CS2,',
  };
}
const PostsPageDetail = async ({ params }: any) => {
  // Получаем postId из params
  const postId = params.id;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/post/${postId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': '',
    },
    cache: 'no-store',
  });
  
  if (!res.ok) {
    console.log('❌ Status:', res.status);
    throw new Error('Post fetch failed');
  }
  
  const post: Post = await res.json();

  return (
    <Container className="flex flex-col my-10">
      <div className="flex justify-center">
        <div className="w-[calc(100%-10px)] sm:w-[calc(100%-10px)] md:w-3/4 main-block-bg mb-10 p-7 rounded-xl mx-[5px] md:mx-0">
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
            <Link href={`/profile/${post.author.id}`} className="hover:text-gray-400 ml-1">
                            {post.author.name}
                        </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[calc(100%-10px)] sm:w-[calc(100%-10px)] md:w-3/4 main-block-bg mb-10 p-7 rounded-xl mx-[5px] md:mx-0">
          <AddComment postId={post.id} />
          <CommentsList postId={post.id} />
        </div>
      </div>
    </Container>
  );
};

export default PostsPageDetail;