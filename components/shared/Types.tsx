import apiService from '@/app/services/apiService';
import { ClipboardPlus, SearchCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PostType {
    id: string;
    title: string;
}

interface PostTypeSelectorProps {
    onSelect: (value: string) => void; // Функция для передачи выбранного значения
    
}

const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({ onSelect }) => {
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const fetchPostTypes = async () => {
            try {
                const response = await apiService.get('/api/types/'); // URL вашего API
                setPostTypes(response.data);
            } catch (error) {
                console.error('Ошибка при получении типов постов', error);
                setErrors(['Не удалось загрузить типы постов']);
            }
        };

        fetchPostTypes();
    }, []);
    

    return (
        <div>
            {errors.map((error, index) => (
                <div key={index} className="alert alert-danger">
                    {error}
                </div>
            ))}
            <ul className="grid w-full gap-6 md:grid-cols-2">
                {postTypes.map((type) => (
                    <li key={type.id}>
                        <input
                            type="radio"
                            id={type.id}
                            name="postType"
                            title={type.title}
                            value={type.id}
                            className="hidden peer"
                            onChange={() => onSelect(type.id)} // Передаем выбранное значение
                        />
                        <label
                            htmlFor={type.id}
                            className="inline-flex items-center  w-full p-5 border-2 text-gray-500 bg-gray-900 border border-gray-500 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-green-600 peer-checked:text-white hover:text-gray-900 hover:bg-gray-700 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                             {type.id == '2' ? (
                                <SearchCheck size={36} className='mr-3'/>
                            ) : (
                                <ClipboardPlus size={36} className='mr-3'/>
                            )}
                            <div className="block">
                                <div id={type.id} className="w-full text-lg font-semibold">{type.title}</div>
                                <div className="w-full text-xs">{type.id == '1' ? 'Пост с новостью / мемы' : 'Поиск команды / игрока' }</div>
                            </div>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default PostTypeSelector;