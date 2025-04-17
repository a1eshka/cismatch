'use client';

import Modal from './Modal'; // Импортируем ваш компонент Modal
import { Button } from '@/components/ui/button'; // Импортируем кнопку

interface ConfirmPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  price: number;
  skinName: string;
}

const ConfirmPurchaseModal: React.FC<ConfirmPurchaseModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  price,
  skinName,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      close={onClose}
      label="Подтверждение покупки"
      content={
        <div>
          <p className="text-lg mb-4">
          {price === 0 
            ? <>Вы уверены, что хотите участвовать в розыгрыше скина <span className="font-bold">{skinName}</span>?</>
            :
            <>Вы уверены, что хотите купить тикет на розыгрыш скина <span className="font-bold">{skinName}</span> за{' '}
            <span className="font-bold text-green-500">{price}₽</span>?</> }
          </p>
          <div className="flex justify-end gap-3">
            <Button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white"
            >
              Отмена
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Подтвердить
            </Button>
          </div>
        </div>
      }
    />
  );
};

export default ConfirmPurchaseModal;