'use client';

import apiService from '@/app/services/apiService';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { mutate } from 'swr';

interface AddServerFormProps {
  onSuccess: (newServer: ServerType) => void;  // Изменим onSuccess, чтобы передавать новый сервер
}

interface ServerType {
  id: string;
  title: string;
}

const AddServerForm: React.FC<AddServerFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    ip: '',
    port: '',
    server_type: '', // ID выбранного типа сервера
    description: '',
    published: true,
    is_paid: false,
    is_boosted: false,
  });

  const [serverTypes, setServerTypes] = useState<ServerType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServerTypes = async () => {
      setIsLoadingTypes(true);
      try {
        const response = await apiService.get('/api/servers/server-types/');
        if (Array.isArray(response)) {
          setServerTypes(response); // Устанавливаем только массив
        } else {
          throw new Error('Некорректный формат данных');
        }
      } catch (err) {
        console.error('Ошибка при загрузке типов серверов:', err);
        setError('Не удалось загрузить типы серверов. Попробуйте позже.');
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchServerTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.ip || !formData.port || !formData.server_type) {
      setError('Все поля обязательны для заполнения!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Валидация данных формы
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('ip', formData.ip);
    formDataToSend.append('port', formData.port);
    formDataToSend.append('server_type', formData.server_type);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('published', formData.published.toString());
    formDataToSend.append('is_paid', formData.is_paid.toString());
    formDataToSend.append('is_boosted', formData.is_boosted.toString());

    try {
      const response = await apiService.post('/api/servers/third-party/create/', formDataToSend);

      if (response?.data) {
        const newServer = response.data; // Сохраняем добавленный сервер
        onSuccess(newServer);
        toast.success('Сервер успешно добавлен!');
        mutate('/api/servers/third-party/');
      } else {
        throw new Error('Не удалось добавить сервер.');
      }
    } catch (err) {
      console.error('Ошибка при добавлении сервера:', err);
      setError('Ошибка при добавлении сервера. Попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className='flex'>
            <div>
                <label className="block text-xs font-light text-gray-300">IP адрес</label>
                <input
                type="text"
                name="ip"
                value={formData.ip}
                onChange={handleChange}
                className="mt-1 block mr-1 p-2 bg-gray-700 border text-lg font-medium border-gray-600 rounded-md text-white"
                required
                />
            </div>
            <div className='flex justify-center items-center mr-1 mt-4 text-lg font-medium'>:</div>
            <div>
                <label className="block text-xs font-light text-gray-300">Порт</label>
                <input
                type="number"
                name="port"
                value={formData.port}
                onChange={handleChange}
                className="mt-1 block w-1/2 p-2 bg-gray-700 border text-lg font-medium border-gray-600 rounded-md text-white"
                required
                />
            </div>
        </div>
      <div>
        <label className="block text-xs font-light text-gray-300">Тип сервера</label>
        <select
          name="server_type"
          value={formData.server_type}
          onChange={handleChange}
          className="mt-1 w-1/2 block p-2 bg-gray-700 border text-base font-normal border-gray-600 rounded-md text-gray-300"
          required
          disabled={isLoadingTypes}
        >
          <option value="">{isLoadingTypes ? 'Загрузка...' : 'Выберите тип сервера'}</option>
          {serverTypes.map(serverType => (
            <option key={serverType.id} value={serverType.id}>
              {serverType.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-light text-gray-300">Описание</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full p-2 bg-gray-700 border text-base font-normal border-gray-600 rounded-md text-white"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || isLoadingTypes}
        className="w-full text-base font-normal bg-green-500/20 text-green-500 py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
      >
        {isLoading ? 'Добавление...' : 'Добавить сервер'}
      </button>
    </form>
  );
};

export default AddServerForm;
