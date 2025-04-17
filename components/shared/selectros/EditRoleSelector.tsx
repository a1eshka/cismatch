import apiService from '@/app/services/apiService';
import React, { useEffect, useState } from 'react';

interface Role {
    id: string;
    title: string;
}

interface EditRoleSelectorProps {
    onSelect: (value: string) => void; // Функция для передачи выбранного значения
    selectedRole?: string; // ✅ Переданный выбранный id роли
}

const EditRoleSelector: React.FC<EditRoleSelectorProps> = ({ onSelect, selectedRole }) => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string>(selectedRole || ''); // ✅ Используем переданное значение
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

    // ✅ Если `selectedRole` изменился — обновляем локальный state
    useEffect(() => {
        if (selectedRole) {
            setSelectedRoleId(selectedRole);
        }
    }, [selectedRole]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        setSelectedRoleId(value);
        onSelect(value); // ✅ Передаем только id
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
                value={selectedRoleId}
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

export default EditRoleSelector;
