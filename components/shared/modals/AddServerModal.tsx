// components/AddServerModal.tsx
'use client';

import { useState } from 'react';
import Modal from './Modal'; // Импортируем ваш компонент Modal
import AddServerForm from '../servers/AddServerForm';
import { CirclePlus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const AddServerModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSuccess = () => {
        handleCloseModal(); // Закрываем модальное окно после успешного добавления
        // Дополнительные действия, если нужно
    };

    return (
        <>
        <div>
            <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
            <button
                onClick={handleOpenModal}
                className='flex items-center'
            >
                <div className='bg-green-600/20 text-green-600 p-2 ml-2 mb-2 rounded-md hover:bg-green-600/40 transition-colors cursor-pointer'>
                            <CirclePlus className='hover:scale-110 transition-transform' /> {/* Иконка "+" */}
                </div>
            </button>
            </TooltipTrigger>
    <TooltipContent className='font-normal'>Добавить сервер</TooltipContent>
  </Tooltip>
  </TooltipProvider>
            <Modal
                label="Добавить новый сервер"
                content={<AddServerForm onSuccess={handleSuccess} />}
                isOpen={isModalOpen}
                close={handleCloseModal}
            />
        </div>
        </>
    );
};

export default AddServerModal;