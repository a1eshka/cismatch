'use client';

import React, { useEffect, useState } from 'react';
import { getUserId } from '../lib/actions'; // Получение userId
import apiService from '../services/apiService'; // Сервис API
import { toast } from 'react-toastify'; // Для уведомлений
import { Button } from '@/components/ui/button'; // Ваш компонент кнопки
import { Container } from '@/components/shared/Conatiner';
import { Input } from '@/components/ui/input';
import { CirclePlus, Download, ExternalLink, Trash2 } from 'lucide-react';
import PaymentButton from '@/components/shared/PaymentButton';
import { useSearchParams } from 'next/navigation';
import PaymentModal from '@/components/shared/modals/PaymentModal';

interface UserProfile {
    id: string;
    name: string;
    email: string;
    steam_id: string | null;
    avatar_url: string;
    trade_url: string | null;
    background_profile_url: string | null;
    steam_avatar: string | null;
    balance: number;
}

const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [trade_url, setTrade_url] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    const openModal = () => {
        setIsModalOpen(true); // Открываем модальное окно
      };
    
      const closeModal = () => {
        setIsModalOpen(false); // Закрываем модальное окно
      };

    // Функция для получения данных пользователя
    const fetchProfile = async () => {
        try {
            const userId = await getUserId();
            if (!userId) {
                setError('User not logged in');
                return;
            }

            const response = await apiService.get(`/api/auth/user/${userId}/`);
            if (response && response.data) {
                setUserProfile(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setTrade_url(response.data.trade_url || '');
            } else {
                setError('Failed to fetch user profile');
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to load profile data.');
        }
    };
    const handleLinkSteam = () => {
        window.location.href = 'http://localhost:8000/auth/login/steam/';
    };
    // Загружаем данные пользователя при монтировании компонента
    useEffect(() => {
        fetchProfile();
    }, []);
    const searchParams = useSearchParams();
    const status = searchParams.get("status");

    useEffect(() => {
        // Проверяем, есть ли в URL параметр status=success
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
    
        if (status === 'success') {
          // Удаляем параметр status=success через 5 секунд
          setTimeout(() => {
            // Создаем новый URL без параметра status
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.delete('status');
            
            // Используем history.replaceState, чтобы обновить URL без перезагрузки страницы
            window.history.replaceState({}, '', currentUrl.toString());
          }, 5000); // Задержка 5 секунд
        }
      }, []);

    useEffect(() => {
        if (status === "success") {
            toast.success("Баланс успешно пополнен!");
        }
    }, [status]);
    // Функция для сохранения изменений
    const handleSave = async () => {
        try {
            const userId = await getUserId();
            if (!userId) {
                setError('User not logged in');
                return;
            }

            // Отправляем PUT-запрос
            const response = await apiService.put(`/api/auth/user/${userId}/`, {
                name,
                email,
                trade_url,
            });

            if (response && response.data) {
                setUserProfile(response.data);
                setIsEditing(false);
                toast.success('Профиль успешно обновлен');
            } else {
                setError('Failed to update user profile');
            }
        } catch (err) {
            console.error('Error updating user profile:', err);
            setError('Failed to update profile data.');
        }
    };

    // Функция для загрузки фонового изображения
    const handleBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('background', file);

        try {
            const userId = await getUserId();
            const response = await apiService.postFormData(
                `/api/auth/user/${userId}/upload-background/`,
                formData
            );

            if (response?.background_profile_url) {
                setUserProfile(prev => {
                    if (!prev) return null; // Обработка случая, когда prev === null
                    
                    return {
                        ...prev,
                        background_profile_url: response.background_profile_url
                    };
                });
                toast.success('Фоновое изображение успешно обновлено');
            }
        } catch (error) {
            console.error('Ошибка при загрузке фонового изображения:', error);
            toast.error('Не удалось загрузить фоновое изображение');
        }
    };

    // Функция для удаления фонового изображения
    const handleDeleteBackground = async () => {
        try {
            const userId = await getUserId();
            const response = await apiService.delete(`/api/auth/user/${userId}/delete-background/`);

            if (response?.message) {
                setUserProfile(prev => {
                    if (!prev) return null; // Обработка случая, когда prev === null
                    
                    return {
                        ...prev,
                        background_profile_url: null
                    };
                });
                toast.success('Фоновое изображение успешно удалено');
            }
        } catch (error) {
            console.error('Ошибка при удалении фонового изображения:', error);
            toast.error('Не удалось удалить фоновое изображение');
        }
    };

    // Отображение ошибки
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Отображение загрузки
    if (!userProfile) {
        return (
            <Container className="flex justify-center items-center h-screen">
                <div role="status">
                    <svg aria-hidden="true" className="w-20 h-20 mt-5 text-gray-300/50 animate-spin dark:text-gray-600 fill-gray-600/50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </Container>
        );
    }

    return (
        <Container className="flex flex-col my-10 px-4 sm:px-0">
            {/* Блок с фоновым изображением */}
            <div
                className={`w-full sm:w-3/4 mb-10 p-4 sm:p-7 rounded-xl ${
                    !userProfile.background_profile_url && 'main-block-bg'
                }`}
                style={{
                    backgroundImage: userProfile.background_profile_url
                        ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${userProfile.background_profile_url})`
                        : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className='flex justify-between items-center'>
                    <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
                    {/* Кнопка для загрузки фонового изображения */}
                    <div className="flex">
                        <input
                            type="file"
                            id="background-upload"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleBackgroundUpload}
                        />
                        <label htmlFor="background-upload">
                            <div className="bg-gray-600/50 text-white mr-2 hover:bg-gray-800 w-max p-2 rounded-lg" title="Загрузить фоновое изображение">
                                <Download />
                            </div>
                        </label>
                        {userProfile.background_profile_url && (
                            <div onClick={handleDeleteBackground} className="bg-red-600/30 text-red-600 hover:bg-red-900 w-max p-2 rounded-lg">
                                <Trash2 />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center mb-8">
                    <img
                        src={userProfile?.steam_avatar || userProfile?.avatar_url || `${process.env.NEXT_PUBLIC_API_HOST}/media/logos/logo.png`}
                        alt={`${userProfile.name}'s avatar`}
                        className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-4"
                    />
                    <div className="sm:mr-8 mb-4 sm:mb-0">
                        {isEditing ? (
                            <>
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-gray-700 border-0 mb-2"
                                />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-gray-700 border-0"
                                />
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                                <p className="text-gray-400">{userProfile.email}</p>
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center justify-between"> {/* Основной контейнер */}
                        <div className="flex flex-col mr-2"> {/* Контейнер для заголовка и суммы */}
                            <h3 className="text-lg font-medium">Баланс:</h3> {/* Заголовок */}
                            <p className="text-xl font-bold">{userProfile.balance} ₽</p> {/* Сумма баланса */}
                        </div>
                        <div className='bg-green-600/30 text-green-600 p-3 rounded-md hover:bg-green-600/40 transition-colors cursor-pointer' title="Пополнить баланс"
        onClick={openModal}>
                            <CirclePlus className='hover:scale-110 transition-transform' /> {/* Иконка "+" */}

                        </div>
                        <PaymentModal isOpen={isModalOpen} onClose={closeModal} />
                    </div>
                </div>
            </div>

            {/* Блок с Trade URL и кнопками редактирования */}
            <div className="w-full sm:w-3/4 main-block-bg mb-10 p-4 sm:p-7 rounded-xl">
            <div className="mb-2">
                <h3 className="text-lg font-medium">Steam ID:</h3>
                {userProfile.steam_id ? (
                    <div className='flex items-center'>
                        {userProfile.steam_id}
                        <div className='ml-2 hover:text-gray-500' title='Перейти'><a href={`https://steamcommunity.com/profiles/${userProfile.steam_id}`} target="_blank"><ExternalLink /></a></div>
                    </div>
                ) : (
                    <Button onClick={handleLinkSteam} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                            Привязать Steam
                        </Button>
                )}
            </div>
                <div>
                    {isEditing ? (
                        <>
                            <h3 className="text-lg font-medium">Trade URL:</h3>
                            <Input
                                type="text"
                                value={trade_url}
                                placeholder='Trade Url'
                                onChange={(e) => setTrade_url(e.target.value)}
                                className="bg-gray-600 border-0"
                            />
                        </>
                    ) : (
                        <>
                            <h3 className="text-lg font-medium -mb-2">Trade URL:</h3>
                            {userProfile.steam_id ? (
                                <a
                                    href={`https://steamcommunity.com/profiles/${userProfile.steam_id}/tradeoffers/privacy#trade_offer_access_url`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline text-xs"
                                >
                                    Узнать ссылку на обмен
                                </a>
                            ) : (
                                ''
                            )}
                            <p className="bg-gray-800 p-2 sm:w-max overflow-hidden rounded-md mt-2 sm:text-ellipsis">
                                {userProfile.trade_url ? userProfile.trade_url : 'Не добавлен'}
                            </p>
                        </>
                    )}
                </div>
                <div className="mt-6">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-800 mr-2">
                                Сохранить
                            </Button>
                            <Button onClick={() => setIsEditing(false)} className="bg-red-600 text-white hover:bg-red-800">
                                Отмена
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)} className="bg-gray-600/30 text-gray-500 hover:bg-gray-800">
                            Изменить профиль
                        </Button>
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ProfilePage;