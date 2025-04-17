import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Импортируем наш шаблон Modal.tsx
import apiService from '@/app/services/apiService';


interface Bank {
  bank_id: string;
  name: string;
}

interface PayoutModalProps {
  isOpen: boolean;
  close: () => void;
  onSubmit: (bankId: string, phone: string) => void;
}

const PayoutModal = ({ isOpen, close, onSubmit }: PayoutModalProps) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/api/auth/get-sbp-banks/');
        setBanks(response.data.banks);
      } catch (error) {
        console.error('Ошибка при загрузке банков:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchBanks();
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedBank || !phone) {
      alert('Пожалуйста, выберите банк и введите номер телефона!');
      return;
    }
    onSubmit(selectedBank, phone);
    close();
  };

  const modalContent = (
    <div>
      {loading ? (
        <p className="text-white">Загрузка банков...</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="text-white block mb-2">Выберите банк</label>
            <select
              value={selectedBank || ''}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
            >
              <option value="" disabled>
                Выберите банк
              </option>
              {banks.map((bank) => (
                <option key={bank.bank_id} value={bank.bank_id}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-white block mb-2">Введите номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              placeholder="Ваш номер телефона"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              onClick={close}
              className="p-2 bg-gray-500 text-white rounded-md"
            >
              Закрыть
            </button>
            <button
              onClick={handleSubmit}
              className="p-2 bg-blue-500 text-white rounded-md"
            >
              Отправить
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Modal
      label="Запросить выплату"
      isOpen={isOpen}
      close={close}
      content={modalContent}
    />
  );
};

export default PayoutModal;
