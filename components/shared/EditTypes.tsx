import apiService from '@/app/services/apiService';
import { ClipboardPlus, SearchCheck } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PostType {
    id: string;
    title: string;
}

interface EditPostTypeSelectorProps {
    selectedType: string; // Пропс, который указывает выбранный тип
}

const EditPostTypeSelector: React.FC<EditPostTypeSelectorProps> = ({ selectedType }) => {
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const fetchPostTypes = async () => {
            try {
                const response = await apiService.get('/api/types/'); // URL вашего API
                setPostTypes(response.data);
            } catch (error) {
                setErrors(['Не удалось загрузить типы постов']);
            }
        };

        fetchPostTypes();
    }, []);

    useEffect(() => {
    }, [selectedType]);

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
            value={type.id}
            checked={selectedType === type.id} // Если selectedType совпадает с type.id, эта кнопка будет активной
            className="hidden peer"
            onChange={() => {}} // Просто предотвращаем изменения
        />
<label
                            htmlFor={type.id}
                            className="inline-flex items-center  w-full p-5 border-2 text-gray-500 bg-gray-900 border border-gray-500 rounded-lg cursor-point peer-checked:border-green-600 peer-checked:text-white dark:text-gray-400 dark:bg-gray-800 "
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

export default EditPostTypeSelector;
