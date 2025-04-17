import apiService from '@/app/services/apiService';
import React, { useEffect, useState } from 'react';

interface Role {
    id: string;
    title: string;
}

interface RoleSelectorProps {
    onSelect: (value: string) => void; // Функция для передачи выбранного значения
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelect }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await apiService.get('/api/role/'); // URL вашего API
                setRoles(response.data);
            } catch (error) {
                console.error('Ошибка при получении ролей', error);
                setErrors(['Не удалось загрузить роли']);
            }
        };

        fetchRoles();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedRole(value);
        onSelect(value); // Передаем выбранное значение
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
            <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">
                Выберите роль:
            </label>
            <select
                id="role"
                value={selectedRole}
                onChange={handleChange}
                className="block w-full p-2 text-gray-500 bg-gray-900 text-sm rounded-md"
            >
                <option value="" disabled>Выберите роль</option>
                {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                        {role.title}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default RoleSelector;