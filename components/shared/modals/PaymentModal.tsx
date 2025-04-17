'use client';

import { useState } from "react";
import Modal from "./Modal"; // Используем твой компонент Modal
import apiService from "@/app/services/apiService";
import { getUserId } from "@/app/lib/actions";
import { toast } from "react-toastify"; // Добавляем уведомления
import { Coins, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false); // Состояние чекбокса

  const MIN_AMOUNT = 100; // Минимальная сумма пополнения

  const handlePayment = async () => {
    // Проверка минимальной суммы
    if (!amount || parseFloat(amount) < MIN_AMOUNT) {
      setError(`Минимальная сумма пополнения: ${MIN_AMOUNT} рублей`);
      return;
    }

    // Проверка, если чекбокс не отмечен
    if (!isAgreementChecked) {
      toast.error("Вы должны принять лицензионное соглашение, чтобы продолжить.");
      return;
    }

    setLoading(true);

    // Получаем userId асинхронно
    const userId = await getUserId();

    if (!userId) {
      alert("Не удалось получить ID пользователя");
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.post("/api/auth/create-payment/", JSON.stringify({
        amount: amount,
        description: "Пополнение баланса",
        userId: userId,
      }));

      setLoading(false);

      if (response.confirmation_url) {
        window.location.href = response.confirmation_url;
      } else {
        alert(response.error || "Ошибка оплаты");
      }
    } catch (error) {
      setLoading(false);
      alert("Произошла ошибка при создании платежа");
    }
  };

  const handleClose = () => {
    setAmount(""); // Сброс значений
    setError(null);
    setIsAgreementChecked(false);
    onClose(); // Закрытие модального окна
  };

  return (
    <Modal 
      label="Пополнение баланса" 
      isOpen={isOpen} 
      close={handleClose} 
      content={
        <div className="flex flex-col space-y-7">
          {/* Блок с двумя полями в одной строке */}
          <div className="flex space-x-4 items-center">
            <div className="flex flex-col w-1/2 relative">
              <label htmlFor="amount" className="text-sm text-gray-400 mb-2">Введите сумму</label>
              <div className="flex items-center bg-gray-900 rounded">
                <Coins className="text-gray-500/30 mr-2 ml-2" size={20} />
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Сумма"
                className="p-2 rounded font-semibold bg-gray-900 border-0 outline-none focus:ring-0 focus:outline-none"
                min={MIN_AMOUNT} // Установка минимального значения
                
              />
              <span className="absolute right-2 top-9 text-gray-500 text-lg">₽</span>
            </div>
            <div className="text-xs text-gray-500">Минимальная сумма пополнения: 100₽</div>
            </div>
            <div className="flex flex-col w-1/2 mb-5">
              <label className="text-sm text-gray-400 mb-2">Вы получите</label>
              <div className="font-semibold">{amount} ₽</div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Чекбокс с соглашением */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreementCheckbox"
              checked={isAgreementChecked}
              onChange={(e) => setIsAgreementChecked(e.target.checked)}
              className="cursor-pointer"
            />
            <label htmlFor="agreementCheckbox" className="text-xs text-gray-300">
              Я прочитал и согласен с{" "}
              <a href="/terms" target="_blank" className="text-blue-500">условиями лицензионного соглашения</a>
            </label>
          </div>


          {/* Кнопки */}
          <div className="flex justify-between w-full items-center mb-2">
            <div className="flex space-x-2">
            <img src={`${process.env.NEXT_PUBLIC_API_HOST}/media/payments/mir.svg`}
            className="filter grayscale transition-all duration-200 hover:filter-none" 
            width={40} // Ширина картинки
            />
            <img src={`${process.env.NEXT_PUBLIC_API_HOST}/media/payments/sbp.svg`}
            className="filter grayscale transition-all duration-200 hover:filter-none" 
            width={40} // Ширина картинки
            />
            <img src={`${process.env.NEXT_PUBLIC_API_HOST}/media/payments/mastercard.svg`}
            className="filter grayscale transition-all duration-200 hover:filter-none" 
            width={40} // Ширина картинки
            />
            <img src={`${process.env.NEXT_PUBLIC_API_HOST}/media/payments/visa.svg`}
            className="filter grayscale transition-all duration-200 hover:filter-none" 
            width={40} // Ширина картинки
            />
            </div>
            <div className="flex space-x-2">
            <button onClick={handleClose} className="px-4 py-2 bg-gray-300/20 text-gray-400 hover:bg-gray-300/30 rounded">Отмена</button>
            <button
    onClick={handlePayment}
    disabled={loading || !isAgreementChecked} // Блокируем, если чекбокс не отмечен
    className={`px-4 py-2 rounded transition-colors ${
      isAgreementChecked ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : "bg-gray-300/20 text-gray-400 cursor-not-allowed"
    }`}
  >
    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Оплатить"}
  </button>
  </div>
          </div>
        </div>
      }
    />
  );
}
