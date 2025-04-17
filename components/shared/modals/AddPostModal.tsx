'use client';

import Image from 'next/image'
import Modal from './Modal'
import useAddPostModal from '@/app/hooks/useAddPostModal';
import {ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomButton from '../buttons/CustomButton';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PostList from '../PostList';
import apiService from '@/app/services/apiService';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircleX, ClipboardPlus, OctagonAlert, SearchCheck } from 'lucide-react';
import PostTypeSelector from '../Types';
import { toast } from 'react-toastify';
import StatusSelector from '../selectros/StatusSelector';
import RoleSelector from '../selectros/RoleSelector';


const AddPostModal = () => {
    const [errors, setErrors] = useState<string[]>([]);
    const [dataTitle, setDataTitle] = useState('');
    const [dataBody, setDataBody] = useState('');
    const [dataType, setDataType] = useState('');
    const [dataStatus, setDataStatus] = useState('');
    const [statuses, setStatuses] = useState([]); 
    const [dataRole, setDataRole] = useState('');
    const [dataImages, setDataImages] = useState<File | null>(null);


    const addPostModal = useAddPostModal();
    const router = useRouter();

    const resetForm = () => {
        setDataTitle('');
        setDataBody('');
        setDataStatus('');
        setDataRole('');
        setDataType('');
        setDataImages(null);
    };
    const setImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const tmpImage = event.target.files[0];

            setDataImages(tmpImage);
        }
    }
    //submit
    const submitForm = async () => {

        if (
            dataTitle &&
            dataBody &&
            dataType
        ) {
            const formData = new FormData();
            formData.append('title', dataTitle);
            formData.append('body', dataBody);
            formData.append('type', dataType);
            if (dataStatus) {
                formData.append('status', dataStatus);
            }
            if (dataRole) {
                formData.append('role', dataRole);
            }
            if (dataImages) {
                formData.append('images', dataImages);
            }

            const response = await apiService.post('/api/post/create/', formData)
            if (response.success) {
                console.log('SUCCESS')
                toast.success('Пост успешно добавлен!');
                const postId = response.data;
                router.push(`/posts/${postId}/?added=true`);
                addPostModal.close();
                resetForm(); 
            } else {
                console.log('Error');
                toast.error('Возникла непредвиденная ошибка.')
                const tmpErrors: string[] = Object.values(response).map((error: any) => {
                    return error;
                })

                setErrors(tmpErrors)
            }
        }
    }
    const content = (
        <>
        <PostTypeSelector onSelect={setDataType}/>
         <div className='pt-3 pb-6 space-y-4'>
         <Input className=" bg-gray-900 border-0" type="text" value={dataTitle} onChange={(e) => setDataTitle(e.target.value)} placeholder="Название поста" />
         <Textarea className="bg-gray-900 border-0" value={dataBody} onChange={(e) => setDataBody(e.target.value)} placeholder="Описание"/>
        
         {parseInt(dataType as string, 10) === 2 && ( // Поля отображаются только при выборе "Поиска"
                    <>
                        <StatusSelector onSelect={setDataStatus} />
                        <RoleSelector onSelect={setDataRole} />
                    </>
                )}
         <div className='pt-3 pb-6 space-y-4'>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-23 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer text-gray-500 bg-gray-900 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Нажми для загрузки</span> или перетащи в поле.</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (Макс. 1 фото)</p>
                                </div>
                                <input id="dropzone-file" type="file" accept='image/*' onChange={setImage} className="hidden" />
                            </label>
                        </div> 

                        {dataImages && (
                            <div className='w-[100px] h-[50px] relative'>
                                <Image
                                    fill
                                    alt="Uploaded image"
                                    src={URL.createObjectURL(dataImages)}
                                    className='w-full h-full object-cover rounded-xl'
                                />
                                <button
                                    type="button"
                                    onClick={() => setDataImages(null)} // Clear the image
                                    className="absolute top-0 right-0  text-red-600 p-1 rounded-full cursor-pointer hover:bg-red-600/50 focus:outline-none focus:ring-2 focus:ring-red-400"
                                >
                                    <CircleX size={16} />
                                </button>
                            </div>
                        )}
                        
        </div>
        {errors.map((error, index) => {
            return(
                <Alert variant="destructive" className="mb-2"  key={index}>
                               <OctagonAlert className="h-4 w-4"  />
                               <AlertDescription>{error}</AlertDescription>
                            </Alert>
            )
        })}
         <Button onClick={submitForm}>Создать</Button>
        </div>
        </>
           
        )

    return (
        <Modal
                isOpen={addPostModal.isOpen}
                close={addPostModal.close}
                label="Добавить пост"
                content={content}
                
            />
            
        
    )
}

export default AddPostModal;