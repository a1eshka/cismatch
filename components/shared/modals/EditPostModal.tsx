'use client';

import Image from 'next/image';
import Modal from './Modal';
import { useState, ChangeEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleX, OctagonAlert } from 'lucide-react';
import apiService from '@/app/services/apiService';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import EditPostTypeSelector from '../EditTypes';
import EditStatusSelector from '../selectros/EditStatusSelector';
import EditRoleSelector from '../selectros/EditRoleSelector';
import { getUserId } from '@/app/lib/actions';

interface EditPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        id: string;
        title: string;
        body: string;
        type?: { id: number | string; title: string } | null;
        status?: string;
        role?: string;
        imageUrl?: string;
        image_url?:string;
    } | null;
    selectedType?: string;
    onPostUpdated: () => Promise<void>;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, onClose, post, onPostUpdated }) => {
    const [errors, setErrors] = useState<string[]>([]);
    const [dataTitle, setDataTitle] = useState('');
    const [dataBody, setDataBody] = useState('');
    const [dataType, setDataType] = useState('');
    const [dataStatus, setDataStatus] = useState('');
    const [dataRole, setDataRole] = useState('');
    const [dataImages, setDataImages] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (post) {
            setDataTitle(post.title);
            setDataBody(post.body);
            setDataType(post.type.id || '');
            setDataStatus(post.status?.id || '');
            setDataRole(post.role?.id || '');
            setPreviewImage(post.imageUrl || null);
        }
    }, [post]);

    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const tmpImage = event.target.files[0];
            setDataImages(tmpImage);
            setPreviewImage(URL.createObjectURL(tmpImage));
        }
    };
        // Функция для удаления изображения
    const handleDeleteImage = () => {
        console.log('Кнопка для удаления изображения была нажата');
        setPreviewImage(null);
        console.log('Preview image set to null', previewImage);
        setDataImages(null);
    };
    const handleUpdate = async () => {
        if (!post) return;
    
        if (!dataTitle || !dataBody || !dataType) {
            setErrors(['Заполните все обязательные поля']);
            return;
        }
    
        const formData = new FormData();
        console.log('datatitle', dataTitle)
        formData.append('title', dataTitle);
        formData.append('body', dataBody);
        formData.append('type', dataType); // <-- Преобразуем в строку, если это объект
        if (dataStatus) formData.append('status', dataStatus);
        if (dataRole) formData.append('role', dataRole);
    // Если изображение было удалено (dataImages == null), отправляем пустое значение
        if (!dataImages && !previewImage && post.image_url) {
            formData.append('images', ''); // Пустое значение для удаления изображения
        } else if (dataImages) {
            formData.append('images', dataImages); // Отправляем новое изображение
        }
    
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]); // Лог всех значений
        }
    
        try {
            const response = await apiService.putFormData(`/api/post/update/${post.id}/`, formData);
            toast.success('Пост успешно обновлён!');
            const userId = await getUserId();
            mutate(`/api/posts/user/?user_id=${userId}`);
            onPostUpdated();
            onClose();
        } catch (error) {
            toast.error('Не удалось обновить пост');
        }
    };
    
    return (
        <Modal
            isOpen={isOpen}
            close={onClose}
            label="Редактировать пост"
            content={
                <>
                    <EditPostTypeSelector 
                    selectedType={dataType} />
                    <div className="pt-3 pb-6 space-y-4">
                        <Input
                            className="bg-gray-900 border-0"
                            type="text"
                            value={dataTitle}
                            onChange={(e) => setDataTitle(e.target.value)}
                            placeholder="Название поста"
                        />
                        <Textarea
                            className="bg-gray-900 border-0"
                            value={dataBody}
                            onChange={(e) => setDataBody(e.target.value)}
                            placeholder="Описание поста"
                        />

                        {parseInt(dataType, 10) === 2 && (
                            <>  
                                <EditStatusSelector onSelect={setDataStatus} selectedStatus={dataStatus} />
                                <EditRoleSelector onSelect={setDataRole} selectedRole={dataRole} />
                            </>
                        )}

                        <div className="pt-3 pb-6 space-y-4">
                            <div className="flex items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="flex flex-col items-center justify-center w-full h-23 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer text-gray-500 bg-gray-900 hover:bg-gray-700"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Нажмите для загрузки</span> или перетащите файл.
                                        </p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG или GIF (Макс. 1 фото)</p>
                                    </div>
                                    <input id="dropzone-file" type="file" accept="image/*" onChange={setImage} className="hidden" />
                                </label>
                            </div>

                            {(previewImage || post.image_url) && (
    <div className="w-[100px] h-[50px] relative">
        <Image
            fill
            alt="Uploaded image"
            src={previewImage || post.image_url} // Используем previewImage, если оно есть, иначе image_url из базы данных
            className="w-full h-full object-cover rounded-xl"
        />
        <button
            type="button"
            onClick={handleDeleteImage} // Вызываем функцию удаления

            className="absolute top-0 right-0 text-red-600 p-1 rounded-full cursor-pointer hover:bg-red-600/50"
        >
            <CircleX size={16} />
        </button>
    </div>
)}
                        </div>

                        {errors.map((error, index) => (
                            <Alert variant="destructive" className="mb-2" key={index}>
                                <OctagonAlert className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        ))}

                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                        </Button>
                    </div>
                </>
            }
        />
    );
};

export default EditPostModal;
