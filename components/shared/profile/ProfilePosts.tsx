'use client';

import { getUserId } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import { Edit2, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import DeletePostModal from '../modals/DeletePostModal';
import EditPostModal from '../modals/EditPostModal';

interface Post {
    id: string;
    title: string;
    body: string;
    type?: { id: number | string; title: string } | null; // ✅ Убедись, что type - это объект с id
    status?: string;
    role?: string;
    imageUrl?: string;
}

const Posts = () => {
    const [userPosts, setUserPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [postToDelete, setPostToDelete] = useState(null);
    const [editingPost, setEditingPost] = useState<Post | null>(null);

    useEffect(() => {
        fetchUserPosts();
    }, []);

    const fetchUserPosts = async () => {
        setIsLoading(true);
        try {
            const id = await getUserId();
            const response = await apiService.get(`/api/posts/user/?user_id=${id}`);
            if (response.data) {
                setUserPosts(response.data);
            }
        } catch (error) {
            console.error('Ошибка при получении постов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openDeleteModal = (postId) => {
        setPostToDelete(postId);
    };

    const closeDeleteModal = () => {
        setPostToDelete(null);
    };

    const openEditModal = (post) => {
        setEditingPost(post);
    };

    const closeEditModal = () => {
        setEditingPost(null);
    };

    return (
        <div className="w-full sm:w-3/4 main-block-bg mb-10 p-4 sm:p-7 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Мои посты</h3>

            {isLoading ? (
                <div className="text-gray-400">Загрузка...</div>
            ) : (
                <div>
                    {userPosts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {userPosts.map((post) => (
                                <div key={post.id} className="bg-gray-800 p-4 rounded-lg relative">
                                    <h4 className="text-lg font-semibold">{post.title}</h4>
                                    <p className="text-gray-400 text-sm">{post.body.length > 100 ? `${post.body.slice(0, 100)}...` : post.body}</p>
                                    <p className="text-gray-300/30 text-xs p-1.5 border border-gray-300/20 w-max rounded-full mt-2">{post.type.title}</p>
                                    <button
                                        onClick={() => openEditModal(post)}
                                        className="mt-3 bg-gray-600/20 hover:bg-gray-700/20 text-gray-600 py-1 px-3 rounded text-sm mr-2"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(post.id)}
                                        className="mt-3 bg-red-600/20 hover:bg-red-700/20 text-red-600 py-1 px-3 rounded text-sm"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">У вас нет постов.</p>
                    )}
                </div>
            )}

            {/* Модальное окно удаления */}
            {postToDelete && (
                <DeletePostModal
                    isOpen={!!postToDelete}
                    onClose={closeDeleteModal}
                    postId={postToDelete}
                    onPostDeleted={fetchUserPosts} // Передаем функцию обновления списка
                />
            )}
            
            {/* Модальное окно редактирования */}
            {editingPost && (
                <EditPostModal
                    isOpen={!!editingPost}
                    onClose={closeEditModal}
                    post={editingPost}
                    selectedType={editingPost?.type?.id ? String(editingPost.type.id) : ''}
                    onPostUpdated={fetchUserPosts} // Передаем функцию обновления списка
                />
            )}
        </div>
    );
};

export default Posts;
