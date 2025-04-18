import apiService from '@/app/services/apiService';
import { useState } from 'react';

const ToggleMembershipButton = ({ teamId, initialIsMember }: { teamId: string; initialIsMember: boolean }) => {
    const [isMember, setIsMember] = useState(initialIsMember);
    const [loading, setLoading] = useState(false);

    const handleToggleMembership = async () => {
        setLoading(true);
        try {
            const response = await apiService.post(`/api/teams/${teamId}/join-team/`, {});
            if (response.status === 200 || response.status === 201) {
                setIsMember(!isMember); // Переключаем состояние членства
                alert(response.data.message); // Показываем сообщение пользователю
            }
        } catch (error) {
            console.error('Ошибка при изменении членства:', error);
            alert('Произошла ошибка. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={handleToggleMembership} disabled={loading}>
            {loading ? 'Загрузка...' : (isMember ? 'Выйти из команды' : 'Вступить в команду')}
        </button>
    );
};

export default ToggleMembershipButton;