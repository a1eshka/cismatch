'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/shared/Conatiner';
import { Input } from '@/components/ui/input';
import { BadgeRussianRuble, BriefcaseBusiness, CirclePlus, CircleUserRound, Download, ExternalLink, FileText, LogOut, Server, Settings, Trash2 } from 'lucide-react';
import PaymentButton from '@/components/shared/PaymentButton';
import { useSearchParams, useParams, useRouter, usePathname } from 'next/navigation';
import PaymentModal from '@/components/shared/modals/PaymentModal';
import { getUserId } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';
import { useRef } from 'react';
import Posts from '@/components/shared/profile/ProfilePosts';
import Servers from '@/components/shared/profile/ProfileServers';
import Sidebar from '@/components/shared/profile/ProfileSidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import OrdersList from '@/components/shared/profile/OrdersList';
import Head from 'next/head';
import SeoHead from '@/components/shared/navigation/SeoHead';

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
    const { id: profileId } = useParams();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [trade_url, setTrade_url] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [wonRaffles, setWonRaffles] = useState<any[]>([]);
    const editProfileRef = useRef<HTMLButtonElement | null>(null);
    const isOwnProfile = currentUserId === profileId;
    const [activeTab, setActiveTab] = useState('profile');
    const searchParams = useSearchParams(); // Используем useSearchParams
    const tabFromUrl = searchParams.get('tab'); // Получаем параметр tab из URL
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);

            // Убираем ?tab=servers из URL
            const newUrl = pathname; // Убираем параметры, оставляя только путь
            router.replace(newUrl, { scroll: false });
        }
    }, [tabFromUrl, pathname, router]);

    useEffect(() => {
        if (window.location.hash === "#edit-profile") {
            setTimeout(() => {
                if (editProfileRef.current) {
                    editProfileRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                history.replaceState(null, document.title, window.location.pathname);
            }, 600); // Даем небольшую задержку, чтобы DOM успел отрендериться
        };

        const fetchProfile = async () => {
            try {
                const userId = await getUserId();
                setCurrentUserId(userId);

                const response = await apiService.get(`/api/auth/user/${profileId}/`);
                if (response && response.data) {
                    setUserProfile(response.data);
                    setName(response.data.name);
                    setEmail(response.data.email);
                    setTrade_url(response.data.trade_url || '');
                } else {
                    setError('Failed to fetch user profile');
                }
            } catch (err) {
                setError('Failed to load profile data.');
            }
        };
        const fetchWonRaffles = async () => {
            try {
                const userId = await getUserId(); // Получаем ID текущего пользователя
                const response = await apiService.get(`/api/raffles/`);

                if (response && response.data) {
                    const raffles = response.data;
                    const wonRaffles = raffles.filter((raffle: any) => raffle.winner_id === profileId);
                    setWonRaffles(wonRaffles);
                }
            } catch (err) {
                console.error('Ошибка при загрузке выигранных розыгрышей:', err);
            }
        };

        fetchWonRaffles();
        fetchProfile();
    }, [profileId]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleLinkSteam = () => {
        window.location.href = 'http://localhost:8000/auth/login/steam/';
    };
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


    const handleShowProfile = () => {
        setActiveTab('profile');
    };
    const handleShowServers = () => {
        setActiveTab('servers');
    };
    const handleShowPosts = () => {
        setActiveTab('posts');
    };
    const handleShowOrders = () => {
        setActiveTab('orders');
    };
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

            if (response && response.message) {
                setUserProfile((prev) => ({
                    ...prev,
                    background_profile_url: null,
                }));
                toast.success('Фоновое изображение успешно удалено');
            }
        } catch (error) {
            console.error('Ошибка при удалении фонового изображения:', error);
            toast.error('Не удалось удалить фоновое изображение');
        }
    };

    // Отображение загрузки
    if (!userProfile) {
        return (
            <Container className="flex justify-center items-center h-screen">
                <div role="status">
                    <svg aria-hidden="true" className="w-20 h-20 mt-5 text-gray-300/50 animate-spin dark:text-gray-600 fill-gray-600/50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </Container>
        );
    }
    return (
        <>
   <SeoHead
        title={`CISMatch - Профиль игрока ${userProfile.name}`}
        description=""
        keywords=""
      />
            <div className="flex">
                {isOwnProfile && (
                    <Sidebar
                        activeTab={activeTab}
                        handleShowProfile={handleShowProfile}
                        handleShowPosts={handleShowPosts}
                        handleShowServers={handleShowServers}
                        handleShowOrders={handleShowOrders}
                        isOwnProfile={isOwnProfile}
                    />
                )}
                <main className="flex-1 md:ml-10">
                    <Container className="flex flex-col my-10 px-4 sm:px-0">
                        <div
                            className={`w-full sm:w-3/4 mb-10 p-4 sm:p-7 rounded-xl ${!userProfile?.background_profile_url && 'main-block-bg'}`}
                            style={{
                                backgroundImage: userProfile?.background_profile_url
                                    ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9)), url(${userProfile.background_profile_url})`
                                    : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className='flex justify-between items-center'>
                                <h1 className="text-2xl font-bold mb-4">Профиль пользователя</h1>
                                {isOwnProfile && (
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
                                        {userProfile?.background_profile_url && (
                                            <div onClick={handleDeleteBackground} className="bg-red-600/30 text-red-600 hover:bg-red-900 w-max p-2 rounded-lg" title="Удалить фоновое изображение">
                                                <Trash2 />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row items-center mb-8">
                                <img
                                    src={userProfile?.steam_avatar || userProfile?.avatar_url || `${process.env.NEXT_PUBLIC_API_HOST}/media/logos/logo.png`}
                                    alt={`${userProfile?.name}'s avatar`}
                                    className="w-24 h-24 rounded-full mb-4 sm:mb-0 sm:mr-4"
                                />
                                <div className="sm:mr-8 mb-4 sm:mb-0">
                                    {isEditing ? (
                                        <>
                                        {/*
                                            <Input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="bg-gray-700 border-0 mb-2"
                                            /> */}
                                            <h2 className="text-xl font-semibold">{userProfile?.name}</h2>
                                            <Input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-gray-600/30  border-0"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-xl font-semibold">{userProfile?.name}</h2>
                                            <p className="text-gray-400">{userProfile?.email}</p>
                                        </>
                                    )}
                                </div>

                                {isOwnProfile && (
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col mr-2">
                                            <h3 className="text-lg font-medium">Баланс:</h3>
                                            <p className="text-xl font-bold">{userProfile?.balance} ₽</p>
                                        </div>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className='bg-green-600/30 text-green-600 p-3 rounded-md hover:bg-green-600/40 transition-colors cursor-pointer' onClick={openModal}>
                                                        <CirclePlus className='hover:scale-110 transition-transform' />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent>Пополнить баланс</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <PaymentModal isOpen={isModalOpen} onClose={closeModal} />
                                    </div>
                                )}
                            </div>
                        </div>
                        {activeTab === 'profile' && (
                            <>
                                <div className="w-full sm:w-3/4 main-block-bg mb-10 p-4 sm:p-7 rounded-xl">
                                    <h3 className="text-lg font-medium mb-4">Выигранные розыгрыши</h3>
                                    {wonRaffles.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-6">
                                            {wonRaffles.map((raffle) => (
                                                <div
                                                    key={raffle.id}
                                                    className={`bg-gray-800/30 p-4 rounded-lg ${raffle.price_in_tickets <= 10
                                                        ? 'border-l-4 border-gray-500/50'
                                                        : raffle.price_in_tickets <= 30
                                                            ? 'border-l-4 border-blue-500/50'
                                                            : raffle.price_in_tickets <= 40
                                                                ? 'border-l-4 border-blue-700/50'
                                                                : raffle.price_in_tickets <= 60
                                                                    ? 'border-l-4 border-purple-500/50'
                                                                    : 'border-l-4 border-red-500/50'
                                                        }`}
                                                >
                                                    <img src={raffle.image_url} alt={raffle.skin_name} className="w-full h-20 object-contain mb-2 hover:scale-110" />
                                                    <h4 className="text-xs font-light">{raffle.skin_name}</h4>
                                                    <p className="text-gray-400 text-xs font-light">Дата выигрыша: {new Date(raffle.end_time).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        isOwnProfile ? (
                                            <p className="text-gray-400">Вы ещё ничего не выиграли.</p>) : (
                                            <p className="text-gray-400">Пользователь ещё ничего не выиграл.</p>
                                        )
                                    )}
                                </div>
                                {/* Блок с Trade URL и кнопками редактирования */}
                                <div className="w-full sm:w-3/4 main-block-bg mb-10 p-4 sm:p-7 rounded-xl">
                                    <div className="mb-2">
                                        <h3 className="text-sm font-medium">Steam ID:</h3>
                                        {userProfile?.steam_id ? (
                                            <div className='flex items-center'>
                                                {userProfile?.steam_id}
                                                <div className='ml-2 hover:text-gray-500' title='Перейти'><a href={`https://steamcommunity.com/profiles/${userProfile.steam_id}`} target="_blank"><ExternalLink /></a></div>
                                            </div>
                                        ) : (
                                            isOwnProfile ? (
                                                <Button
                                                    onClick={handleLinkSteam}
                                                    className="bg-gray-700 rounded-lg mt-2 hover:bg-gray-500"
                                                ><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50"
                                                style={{fill: '#FFFFFF'}} className='w-6 mr-1'>
                                    <path d="M 25 3 C 13.59 3 4.209375 11.680781 3.109375 22.800781 L 14.300781 28.529297 C 15.430781 27.579297 16.9 27 18.5 27 L 18.550781 27 C 18.940781 26.4 19.389375 25.649141 19.859375 24.869141 C 20.839375 23.259141 21.939531 21.439062 23.019531 20.039062 C 23.259531 15.569063 26.97 12 31.5 12 C 36.19 12 40 15.81 40 20.5 C 40 25.03 36.430937 28.740469 31.960938 28.980469 C 30.560938 30.060469 28.750859 31.160859 27.130859 32.130859 C 26.350859 32.610859 25.6 33.059219 25 33.449219 L 25 33.5 C 25 37.09 22.09 40 18.5 40 C 14.91 40 12 37.09 12 33.5 C 12 33.33 12.009531 33.17 12.019531 33 L 3.2792969 28.519531 C 4.9692969 38.999531 14.05 47 25 47 C 37.15 47 47 37.15 47 25 C 47 12.85 37.15 3 25 3 z M 31.5 14 C 27.92 14 25 16.92 25 20.5 C 25 24.08 27.92 27 31.5 27 C 35.08 27 38 24.08 38 20.5 C 38 16.92 35.08 14 31.5 14 z M 31.5 16 C 33.99 16 36 18.01 36 20.5 C 36 22.99 33.99 25 31.5 25 C 29.01 25 27 22.99 27 20.5 C 27 18.01 29.01 16 31.5 16 z M 18.5 29 C 17.71 29 16.960313 29.200312 16.320312 29.570312 L 19.640625 31.269531 C 20.870625 31.899531 21.350469 33.410625 20.730469 34.640625 C 20.280469 35.500625 19.41 36 18.5 36 C 18.11 36 17.729375 35.910469 17.359375 35.730469 L 14.029297 34.019531 C 14.289297 36.259531 16.19 38 18.5 38 C 20.99 38 23 35.99 23 33.5 C 23 31.01 20.99 29 18.5 29 z"></path>
                                    </svg>
                                                    Привязать Steam
                                                </Button>
                                            ) : (
                                                <span>Не привязан</span>
                                            )
                                        )}
                                    </div>
                                    {isOwnProfile && (
                                        <div>
                                            {isEditing ? (
                                                <>
                                                    <h3 className="text-lg font-medium">Trade URL:</h3>
                                                    <Input
                                                        type="text"
                                                        value={trade_url}
                                                        placeholder='Trade Url'
                                                        onChange={(e) => setTrade_url(e.target.value)}
                                                        className="bg-gray-600/30 border-0"
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-sm font-medium -mb-2 ">Trade URL:</h3>
                                                    {userProfile?.steam_id ? (
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
                                                    <p className="bg-gray-800/30 p-2 sm:w-max overflow-hidden rounded-md mt-2 sm:text-ellipsis font-light text-sm">
                                                        {userProfile?.trade_url ? userProfile.trade_url : 'Не добавлен'}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    {isOwnProfile && (
                                        <div className="mt-6">
                                            {isEditing ? (
                                                <>
                                                    <Button onClick={handleSave} className="bg-green-600/20 text-green-500 hover:bg-green-800/60 mr-2">
                                                        Сохранить
                                                    </Button>
                                                    <Button onClick={() => setIsEditing(false)} className="bg-red-600/20 text-red-500 hover:bg-red-800/60">
                                                        Отмена
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button ref={editProfileRef} onClick={() => setIsEditing(true)} className="bg-gray-600/30 text-gray-500 hover:bg-gray-800">
                                                    Изменить профиль
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {activeTab === 'servers' && <Servers />}
                        {activeTab === 'posts' && <Posts />}
                        {activeTab === 'orders' && <OrdersList />}
                        
                    </Container>
                </main>
            </div>
        </>
        );
};

export default ProfilePage;
