import useSWR from "swr";
import apiService from "@/app/services/apiService";

// Получатель данных
const fetcher = async (url: string) => {
    const response = await apiService.get(url);
    return response; // <-- Убедись, что здесь возвращаются только данные
};

export const useDailyGrenades = () => {
    const { data, error, isLoading } = useSWR("/api/grenade/", fetcher);

    // Логирование ошибки и данных для диагностики
    if (error) {
        console.error("Ошибка при загрузке данных:", error);
    }

    return {
        flash: data?.flash || null,
        smoke: data?.smoke || null,
        isLoading,
        isError: error,
    };
};
