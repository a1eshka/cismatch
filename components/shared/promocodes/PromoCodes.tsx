'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import apiService from '@/app/services/apiService';

interface PromoCodeActivationProps {
  userId: string | null; // изменили тип на string | null
}

const PromoCodeActivation = ({ userId }: PromoCodeActivationProps) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activatePromoCode = async (code: string, userId: string) => {
    const formData = new FormData();
    formData.append('code', code);
    formData.append('userId', userId);

    try {
      const response = await apiService.post('/api/auth/promocode/activate/', formData);

      if (response.success) {
        toast.success('Промокод успешно активирован!');
        return response.data;
      } else {
        toast.error(response.error || 'Ошибка при активации промокода');
      }
    } catch (error) {
      toast.error('Внутренняя ошибка сервера');
    }
  };

  const handleActivate = async () => {
    if (!userId) {
      toast.error('Необходимо авторизоваться');
      return;
    }

    if (!code) {
      toast.error('Введите промокод');
      return;
    }

    setIsLoading(true);

    try {
      await activatePromoCode(code, userId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-700/20 p-4 rounded-xl mb-6 relative">
      <div className="absolute right-0 -top-10">
        <img
          src={`${process.env.NEXT_PUBLIC_API_HOST}/media/icons/crown-promo.png`}
          alt="Promo Code Image"
          width={184}
          height={184}
          className="rounded-tr-xl rounded-bl-xl -rotate-12 transform transition-all duration-300 hover:scale-110"
        />
      </div>

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
  );
};

export default PromoCodeActivation;
