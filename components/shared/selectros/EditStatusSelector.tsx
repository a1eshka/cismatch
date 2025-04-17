import apiService from '@/app/services/apiService';
import React, { useEffect, useState } from 'react';

interface Status {
    id: string;
    title: string;
}

interface EditStatusSelectorProps {
    selectedStatus: string; // Теперь передаем выбранный статус
    onSelect: (value: string) => void; // Функция для передачи выбранного значения
}

const EditStatusSelector: React.FC<EditStatusSelectorProps> = ({ selectedStatus, onSelect }) => {
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await apiService.get('/api/status/'); // URL вашего API
                setStatuses(response.data);
            } catch (error) {
                setErrors(['Не удалось загрузить статусы']);
            }
        };

        fetchStatuses();
    }, []);

    useEffect(() => {
    }, [selectedStatus]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        onSelect(value);
    };

    return (
        <div>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            )}
            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">
                Выберите статус:
            </label>
            <select
                id="status"
                value={selectedStatus || ""} // Добавили fallback, если пусто
                onChange={handleChange}
                className="block w-full p-2 text-gray-500 bg-gray-900 text-sm rounded-md"
            >
                <option value="">Выберите статус</option>
                {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                        {status.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default EditStatusSelector;
