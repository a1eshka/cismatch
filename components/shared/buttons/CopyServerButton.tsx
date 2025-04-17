import React, { useState } from 'react';
import { Copy, CopyCheck } from 'lucide-react'; // Импортируем иконку копирования
import { toast } from 'react-toastify';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CopyButton = ({ textToCopy }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(textToCopy); // Копируем текст в буфер обмена
            setIsCopied(true);
            toast.success('Адрес сервера скопирован!');
            setTimeout(() => setIsCopied(false), 2000); // Сбрасываем состояние через 2 секунды
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={handleCopy}>
                        {/* Иконка копирования */}
                        {isCopied ? <CopyCheck className='text-green-500' /> : <Copy className='text-gray-400 hover:text-gray-600' />}

                    </button>
                </TooltipTrigger>
                <TooltipContent>Скопировать</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default CopyButton;