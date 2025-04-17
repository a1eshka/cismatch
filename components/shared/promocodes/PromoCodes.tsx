'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';
import apiService from '@/app/services/apiService';

interface PromoCodeActivationProps {
  userId: string; // ID пользователя
}

const PromoCodeActivation = ({ userId }: PromoCodeActivationProps) => {
  const [code, setCode] = useState(''); // Состояние для хранения промокода
  const [isLoading, setIsLoading] = useState(false); // Состояние для отображения загрузки

  // Функция для активации промокода
  const activatePromoCode = async (code: string, userId: string) => {
    // Создаем объект FormData
    const formData = new FormData();
    formData.append('code', code);
    formData.append('userId', userId);

    try {
      // Отправляем запрос на сервер
      const response = await apiService.post('/api/auth/promocode/activate/', formData);

      // Обрабатываем ответ
      if (response.success) {
        toast.success('Промокод успешно активирован!');
        return response.data; // Возвращаем данные, если нужно
      } else {
        toast.error(response.error || 'Ошибка при активации промокода');
      }
    } catch (error) {
      console.error('Ошибка при активации промокода:', error);
      toast.error('Внутренняя ошибка сервера');
    }
  };

  // Обработчик активации промокода
  const handleActivate = async () => {
    if (!code) {
      toast.error('Введите промокод');
      return;
    }

    setIsLoading(true); // Включаем состояние загрузки

    try {
      // Вызываем функцию активации промокода
      await activatePromoCode(code, userId);
    } finally {
      setIsLoading(false); // Выключаем состояние загрузки
    }
  };

  return (
    <>
    <div className="flex flex-col gap-2 bg-gray-700/20 p-4 rounded-xl mb-6 relative">
    {/* Картинка в правом углу */}
    <div className="absolute right-0 -top-10">
      <img
        src={`${process.env.NEXT_PUBLIC_API_HOST}/media/icons/crown-promo.png`} // Укажите путь к вашей картинке
        alt="Promo Code Image"
        width={184} // Ширина картинки
        height={184} // Высота картинки
        className="rounded-tr-xl rounded-bl-xl -rotate-12 transform transition-all duration-300 hover:scale-110" // Закругление углов
      />
    </div>

    {/* Поле ввода и кнопка */}
    <input
      type="text"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Введите промокод"
      className="p-2 rounded-lg bg-gray-900 border border-gray-700 w-3/4 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none"
    />
    <Button onClick={handleActivate} disabled={isLoading} className="w-3/4 hover:bg-gray-800">
      {isLoading ? 'Активация...' : 'Активировать'}
    </Button>
  </div>
  </>
  );
};

export default PromoCodeActivation;