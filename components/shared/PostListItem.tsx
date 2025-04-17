import Link from "next/link";
import { PostType } from "./PostList";
import { Badge } from "../ui/badge";
import { Title } from "./title";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { Eye, UserRound } from "lucide-react";
import { FaComment } from "react-icons/fa";
import CommentsCount from "./comments/CommentsCount";

interface PostProps {
    post: PostType;
}

const PostListItem: React.FC<PostProps> = ({ post }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const handleToggleExpand = () => setIsExpanded(prev => !prev);

    const truncatedBody = post.body.length > 500 ? post.body.substring(0, 500) + '...' : post.body;

    const isToday = (dateString: string) => {
        const [day, month, year] = dateString.split('.').map(Number);
        const postDate = new Date(year, month - 1, day);
        const today = new Date();
        return today.toDateString() === postDate.toDateString();
    };

    return (
        <div className="max-w-[610px] main-block-bg p-5 rounded-xl mb-5 shadow-md">
            <div className="flex">
                <Badge variant="outline" className="text-white mr-2">{post.type?.title}</Badge>
                {post.status?.title && <Badge variant="outline" className="text-white mr-2">{post.status?.title}</Badge>}
                {post.role?.title && <Badge variant="outline" className="text-white">{post.role?.title}</Badge>}
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <Link href={`/posts/${post.id}`}>
                        <Title text={post.title} size="sm" className="mb-1 mt-3 font-bold" />
                    </Link>
                </div>

                <div className="text-gray-300 whitespace-pre-line">{isExpanded ? post.body : truncatedBody}</div>
                {post.body.length > 500 && (
                    <button onClick={handleToggleExpand} className="bg-gray-800 rounded-xl p-2 text-xs mt-2">
                        {isExpanded ? 'Скрыть' : 'Показать полностью'}
                    </button>
                )}

                {post.image_url && <img className="rounded-lg mt-5" src={post.image_url} alt="Post Image" />}

                <div className="flex items-center mt-4 mb-4">
                    <Avatar>
                        <AvatarImage src={post.author.steam_avatar || post.author.avatar_url} alt={post.author.name} />
                        <AvatarFallback className="bg-gray-300 text-gray-800"><UserRound /></AvatarFallback>
                    </Avatar>

                    <div className="flex items-center justify-between w-full">
                        <Link href={`/profile/${post.author.id}`} className="hover:text-gray-400 ml-1">
                            {post.author.name}
                        </Link>
                        <div className="text-sm text-right text-gray-400">
                            {isToday(post.formatted_date) ? 'Сегодня' : post.formatted_date} в {post.formatted_time}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end">
                <CommentsCount postId={post.id} />
                
                <div className="flex -mt-2 text-gray-500/40 text-xs">
                    <Eye className="mr-1" size={15} /> {post.views}
                </div>
                </div>
            </div>
        </div>
    );
};

export default PostListItem;
