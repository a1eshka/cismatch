'use client';
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { Container } from '@/components/shared/Conatiner';
import { Clock, Crown, Ticket, User, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import ConfirmPurchaseModal from '@/components/shared/modals/BuyTicketModal';
import PromoCodeInput from '@/components/shared/promocodes/PromoCodes';
import Link from 'next/link';
import CheckTasks from '@/components/shared/buttons/CheckTasks';
import useLoginModal from '@/app/hooks/useLoginModal';
import { getUserId } from '@/app/lib/actions';
import apiService from '@/app/services/apiService';

interface Raffle {
    id: number;
    skin_id: number;
    skin_name: string;
    skin_description: string;
    image_url: string;
    price_in_tickets: number;
    total_tickets: number;
    remaining_tickets: number;
    start_time: string;
    end_time: string;
    is_drawn: boolean;
    winner: string | null;
    winner_id: string | null;
    winner_steam_avatar: string | null;
    user_tickets: number | null;
}

interface UserInfo {
    balance: number;
}
interface RaffleCardProps {
    raffle: Raffle;
    handleBuyClick: (raffle: Raffle) => void;
    userId: string | null;
    loginModal: () => void;
    currentTime: number; // Предположительно это Date.now()
}

const RafflesPage = () => {
    const [activeRaffles, setActiveRaffles] = useState<Raffle[]>([]);
    const [completedRaffles, setCompletedRaffles] = useState<Raffle[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [userBalance, setUserBalance] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState<number>(Date.now());
    const [userId, setUserId] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [selectedRaffle, setSelectedRaffle] = useState<Raffle | null>(null);
    const loginModal = useLoginModal();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedUserId = await getUserId();
                if (fetchedUserId) {
                    setUserId(fetchedUserId);

                    const result: UserInfo = await apiService.get(`/api/auth/user/${fetchedUserId}`);
                    setUserBalance(result.balance);
                } else {
                    //console.warn('User is not logged in');
                }
            } catch (err) {
                //console.error('Error fetching user data:', err);
                setError('Failed to load user data.');
            }
        };

        const fetchRaffles = async () => {
            try {
                const result = await apiService.get('/api/raffles/');
                if (result && Array.isArray(result.data)) {
                    const rafflesWithTickets = await Promise.all(
                        result.data.map(async (raffle: Raffle) => {
                            let userTickets = 0;

                            if (userId) {
                                try {
                                    const ticketCountResponse = await apiService.get(`/api/raffles/tickets/count/${userId}/${raffle.id}/`);
                                    userTickets = ticketCountResponse.ticket_count || 0;
                                } catch (err) {
                                    //console.error('Error fetching ticket count:', err);
                                    userTickets = 0;
                                }
                            }

                            return { ...raffle, user_tickets: userTickets };
                        })
                    );

                    const now = Date.now();
                    const active = rafflesWithTickets.filter(raffle => new Date(raffle.end_time).getTime() > now);
                    const completed = rafflesWithTickets.filter(raffle => new Date(raffle.end_time).getTime() <= now);

                    setActiveRaffles(active);
                    setCompletedRaffles(completed);
                } else {
                    setError('Invalid raffle data format');
                }
            } catch (err) {
                //console.error('Error fetching raffles:', err);
                setError('Failed to load raffles.');
            }
        };

        fetchData();
        fetchRaffles();
    }, [userId]);

    const formatTimeLeft = (timeLeft: number) => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        const formatNumber = (num: number) => String(num).padStart(2, '0');

        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    };

    const getRaffleTimeInfo = (start_time: string, end_time: string) => {
        const now = currentTime;
        const start = new Date(start_time).getTime();
        const end = new Date(end_time).getTime();

        if (now < start) {
            return `Начало: ${new Date(start_time).toLocaleString()}`;
        } else if (now < end) {
            const timeLeft = Math.floor((end - now) / 1000);
            return formatTimeLeft(timeLeft);
        } else {
            return 'Розыгрыш завершен';
        }
    };

    const handleBuyClick = (raffle: Raffle) => {
        if (!userId) {
            loginModal.open();
            return;
        }
        setSelectedRaffle(raffle);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmPurchase = async () => {
        if (selectedRaffle) {
            await handleBuyTicket(selectedRaffle.id, selectedRaffle.skin_id, selectedRaffle.price_in_tickets);
            setIsConfirmModalOpen(false);
        }
    };

    const handleBuyTicket = async (raffleId: number, skinId: number, price: number) => {
        if (userBalance === null || userBalance < price) {
            toast.error('Not enough balance to purchase ticket.');
            return;
        }

        try {
            const result = await apiService.post(`/api/raffles/tickets/buy/${skinId}/`, { price });

            if (result && result.message === 'Ticket purchased successfully') {
                setUserBalance((prevBalance) => (prevBalance !== null ? prevBalance - price : null));
                setActiveRaffles((prevRaffles) =>
                    prevRaffles.map((raffle) =>
                        raffle.id === raffleId
                            ? {
                                ...raffle,
                                remaining_tickets: result.remaining_tickets,
                                user_tickets: (raffle.user_tickets || 0) + 1,
                            }
                            : raffle
                    )
                );
                toast.success('Тикет успешно куплен!');
            } else {
                toast.error(result.message || 'Недостаточно средств для покупки!');
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
                toast.error('Недостаточно средств для покупки!');
            } else {
                //console.error('Error buying ticket:', err);
                toast.error('Failed to buy ticket');
            }
        }
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="bg-gray-900 min-h-screen py-8">
            <Container className="max-w-[915px] mx-auto">
                <PromoCodeInput userId={userId} />
                {userId ? <CheckTasks /> : ''}
                <h1 className="text-2xl font-bold text-center text-white mb-6">Активные розыгрыши</h1>
                <div className='flex flex-col md:flex-row items-center mb-8 gap-4 px-4 md:px-0'>
                    {/* Шаг 1 */}
                    <div className='bg-gray-600/20 border border-gray-700 text-gray-400 text-xs p-3 rounded-xl w-full md:w-auto hover:bg-gray-600/30 transform transition-all duration-300 hover:scale-105'>
                        <div className="flex items-center justify-center w-8 h-8 border-2 border-green-500 rounded-2xl mb-2 font-bold text-gray-200">1</div>
                        Пополните баланс, чтобы купить тикеты для участия в раздачах.
                    </div>

                    {/* Шаг 2 */}
                    <div className='bg-gray-600/20 border border-gray-700 text-gray-400 text-xs p-3 rounded-xl w-full md:w-auto hover:bg-gray-600/30 transform transition-all duration-300 hover:scale-105'>
                        <div className="flex items-center justify-center w-8 h-8 border-2 border-green-500 rounded-2xl mb-2 font-bold text-gray-200">2</div>
                        Выберите любую раздачу содержащую интересующий скин.
                    </div>

                    {/* Шаг 3 */}
                    <div className='bg-gray-600/20 border border-gray-700 text-gray-400 text-xs p-3 rounded-xl w-full md:w-auto hover:bg-gray-600/30 transform transition-all duration-300 hover:scale-105'>
                        <div className="flex items-center justify-center w-8 h-8 border-2 border-green-500 rounded-2xl mb-2 font-bold text-gray-200">3</div>
                        Купите некоторое количество тикетов к раздаче, чтобы повысить свои шансы.
                    </div>

                    {/* Шаг 4 */}
                    <div className='bg-gray-600/20 border border-gray-700 text-gray-400 text-xs p-3 rounded-xl w-full md:w-auto hover:bg-gray-600/30 transform transition-all duration-300 hover:scale-105'>
                        <div className="flex items-center justify-center w-8 h-8 border-2 border-green-500 rounded-2xl mb-2 font-bold text-gray-200">4</div>
                        Ожидайте автоматического подведения итогов.
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-0">
                    {activeRaffles.map((raffle) => (
                        <RaffleCard
                            key={raffle.id}
                            raffle={raffle}
                            handleBuyClick={handleBuyClick}
                            userId={userId}
                            loginModal={loginModal.open}
                            currentTime={currentTime}
                        />
                    ))}
                </div>

                {completedRaffles.length > 0 && (
                    <div className="mt-8">
                        <Button
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full bg-gray-700/50 hover:bg-gray-700/70 text-white "
                        >
                            {showHistory ? 'Скрыть историю розыгрышей' : 'Показать историю розыгрышей'}
                        </Button>
                        {showHistory && (
                            <div className=" max-w-[900px] grid grid-cols-1 md:grid-cols-3 mt-6 gap-6 px-4 sm:px-0">
                                {completedRaffles.map((raffle) => (
                                    <RaffleCard
                                        key={raffle.id}
                                        raffle={raffle}
                                        handleBuyClick={handleBuyClick}
                                        userId={userId}
                                        loginModal={loginModal.open}
                                        currentTime={currentTime}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </Container>

            <ConfirmPurchaseModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmPurchase}
                price={selectedRaffle?.price_in_tickets || 0}
                skinName={selectedRaffle?.skin_name || ''}
            />
        </div>
    );
};

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, handleBuyClick, userId, loginModal, currentTime }) => {
    const getRaffleTimeInfo = (start_time: string, end_time: string) => {
        const now = currentTime;
        const start = new Date(start_time).getTime();
        const end = new Date(end_time).getTime();

        if (now < start) {
            return `Начало: ${new Date(start_time).toLocaleString()}`;
        } else if (now < end) {
            const timeLeft = Math.floor((end - now) / 1000);
            return formatTimeLeft(timeLeft);
        } else {
            return 'Розыгрыш завершен';
        }
    };

    const formatTimeLeft = (timeLeft: number) => {
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        const formatNumber = (num: number) => String(num).padStart(2, '0');

        return `${formatNumber(hours)}:${formatNumber(minutes)}:${formatNumber(seconds)}`;
    };

    return (
        <div
            className={`relative w-[300px] bg-gray-300 rounded-lg shadow-lg overflow-hidden mx-auto transition-all duration-300 
        ${raffle.is_drawn ? 'grayscale opacity-60 hover:grayscale-0 hover:opacity-100' : ''}`
            }
        >

            {/* Верхняя часть - изображение скина */}
            <div className="relative h-[120px] rounded-t-lg flex items-center justify-center p-2
  before:content-[''] before:absolute before:left-[-14px] before:bottom-[-12px] before:w-[24px] before:h-[24px] before:bg-gray-900 before:rounded-full before:border-2 before:border-gray-600 before:z-20
  after:content-[''] after:absolute after:right-[-14px] after:bottom-[-12px] after:w-[24px] after:h-[24px] after:bg-gray-900 after:rounded-full after:border-2 after:border-gray-600 after:z-20">
                {/* Фон с картинкой, который будет поверх всех других фонов */}
                <div className="absolute inset-0 -top-40 -right-40 z-10" style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_API_HOST}/media/logos/card-fon-raffle.png)`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1 }}></div>
                {/* Градиентное свечение за изображением */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-[100px] h-[100px] bg-gray-200 opacity-50 rounded-full blur-2xl"></div>
                </div>
                <img src={raffle.image_url} alt={raffle.skin_name} className="max-h-48 max-w-full object-contain transform transition-all duration-300 hover:scale-110 relative z-10" style={{
                    filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.4))' // тень для изображения
                }} />
                <div
                    className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${raffle.price_in_tickets <= 10
                        ? 'bg-gray-400 from-gray-500'
                        : raffle.price_in_tickets <= 30
                            ? 'bg-blue-400 from-blue-700'
                            : raffle.price_in_tickets <= 40
                                ? 'bg-blue-500 from-blue-800'
                                : raffle.price_in_tickets <= 60
                                    ? 'bg-purple-500 from-purple-800'
                                    : 'bg-red-500 from-red-700'
                        } to-transparent`}
                ></div>
                {raffle.skin_description ? <div className='absolute bottom-0 text-white/40 z-10 text-sm'>{raffle.skin_description}</div> : ''}
            </div>

            {/* Нижняя часть - информация о розыгрыше */}
            <div className="p-4 border-2 border-gray-600 border-dashed border-b-0 border-l-0 border-r-0  rounded-b-lg">

                {/* Название скина */}
                <div className="text-lg font-semibold text-center mb-2 text-gray-600">{raffle.skin_name}</div>

                {/* Таймер */}
                <div className="flex justify-center items-center text-gray-500 text-sm mb-2 min-w-[80px]">
                    <Clock size={16} className="mr-2" />
                    <span>{getRaffleTimeInfo(raffle.start_time, raffle.end_time)}</span>
                </div>

                {/* Прогресс розыгрыша */}
                {!raffle.is_drawn && (
                    <div className="w-full bg-green-300 rounded-full h-2 mb-2">
                        <div className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${((raffle.total_tickets - raffle.remaining_tickets) / raffle.total_tickets) * 100}%` }}>
                        </div>
                    </div>
                )}

                {/* Количество оставшихся билетов */}
                {!raffle.is_drawn && (
                    <div className="text-sm text-gray-600 text-center mb-2">
                        Осталось билетов: {raffle.remaining_tickets} / {raffle.total_tickets}
                    </div>
                )}

                {/* Мои билеты */}
                <div className="flex items-center justify-center bg-gray-700/20 p-2 rounded-lg mb-2">
                    <Ticket size={20} className="mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">Мои билеты: {raffle.user_tickets || 0}</span>
                </div>

                {/* Победитель */}
                {raffle.is_drawn && raffle.winner && (
                    <Link href={`/profile/${raffle.winner_id}`}>
                        <div className="flex items-center p-2 rounded-lg mb-2 text-green-500 bg-green-100 border border-green-500">
                            <Crown size={18} className="text-green-500 mr-2" />
                            <div className="flex items-center">
                                Победитель:
                                {raffle.winner_steam_avatar && (
                                    <img
                                        src={raffle.winner_steam_avatar || `${process.env.NEXT_PUBLIC_API_HOST}/media/logos/logo.png`}
                                        alt={`${raffle.winner} avatar`}
                                        className="w-6 h-6 ml-2 rounded-xl object-cover"
                                    />
                                )}
                                <span className="text-green-500 font-bold ml-1">{raffle.winner}</span>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Кнопка покупки */}
                {!raffle.is_drawn && (
                    <button
                        className={`w-full py-2 rounded-md text-white font-bold text-sm transition 
        ${raffle.price_in_tickets === 0 && raffle.user_tickets === 1
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600 transform transition-all duration-300 hover:scale-105'}`}
                        disabled={raffle.price_in_tickets === 0 && raffle.user_tickets === 1}
                        onClick={() => handleBuyClick(raffle)}
                    >
                        {raffle.price_in_tickets === 0
                            ? (raffle.user_tickets === 1
                                ? 'Вы уже участвуете'
                                : 'Участвовать')
                            : `Купить за ${raffle.price_in_tickets} ₽`}
                    </button>
                )}

            </div>
        </div>

    );
};

export default RafflesPage;