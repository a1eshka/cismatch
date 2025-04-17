'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Button } from '@/components/ui/button';
import apiService from '@/app/services/apiService';
import { toast } from 'react-toastify';

interface BoostServerModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverId: string;
}

const BoostServerModal: React.FC<BoostServerModalProps> = ({ isOpen, onClose, serverId }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<{ days: number, price: number } | null>(null);

    const options = [
        { days: 1, price: 40 },
        { days: 7, price: 140 },
        { days: 14, price: 280 },
        { days: 30, price: 410 },
    ];

    const handlePayment = async () => {
        if (!selectedOption) {
            toast.error("Выберите вариант поднятия!");
            return;
        }

        setIsLoading(true);
        try {
            const response = await apiService.post("/api/auth/create-payment-server/", JSON.stringify({
                amount: selectedOption.price,
                description: `Поднятие сервера на ${selectedOption.days} дней`,
                serverId,
                days: selectedOption.days,
              }));

            if (response.confirmation_url) {
                window.location.href = response.confirmation_url;
            }
        } catch (error) {
            console.error("Ошибка при создании платежа:", error);
            toast.error("Не удалось создать платеж.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            close={onClose}
            label="Поднятие сервера"
            content={
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Выберите вариант поднятия сервера:</h2>

                    <div className="grid grid-cols-2 gap-3">
                        {options.map((option) => (
                            <button
                                key={option.days}
                                className={`relative w-full px-4 py-3 rounded-lg text-center border text-sm font-medium transition text-gray-200 overflow-hidden ${selectedOption?.days === option.days ? 'border-green-500 bg-green-500' : 'border-gray-500/70 bg-gray-700/50 hover:bg-gray-500/50'
                                    }`}
                                onClick={() => setSelectedOption(option)}
                            >
                                {/* Фон внутри кнопки, справа */}
                                <div
                                    className="absolute inset-y-0 left-20 w-56 h-full opacity-5"
                                    style={{
                                        backgroundImage: `url(${process.env.NEXT_PUBLIC_API_HOST}/media/logos/card-fon-raffle.png)`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'left',
                                    }}
                                ></div>

                                Поднять на {option.days} {option.days === 1 ? 'день' : 'дней'} <br />
                                <span className="text-lg font-bold">{option.price} руб.</span>
                            </button>
                        ))}
                    </div>


                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            onClick={onClose}
                            className="bg-gray-500/20 hover:bg-gray-600/20 text-gray-500"
                            disabled={isLoading}
                        >
                            Отмена
                        </Button>

                        <Button
                            onClick={handlePayment}
                            className="bg-green-500 hover:bg-green-600 text-white"
                            disabled={isLoading || !selectedOption}
                        >
                            {isLoading ? "Перенаправление..." : "Оплатить"}
                        </Button>
                    </div>
                </div>
            }
        />
    );
};

export default BoostServerModal;
