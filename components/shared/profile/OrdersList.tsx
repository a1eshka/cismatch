import { getUserId } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Order {
    id: number;
    skin_name: string;
    offer_price: string;
    status: string;
    image_url: string | null;
    trade_offer_id: string | null;
}

const OrdersList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [processingOrder, setProcessingOrder] = useState<number | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const userId = await getUserId();
            const response = await apiService.get(`/api/auth/user/buying-orders/?user_id=${userId}`);
            if (response.data) {
                setOrders(response.data);
            }
        } catch (error) {
            console.error('Ошибка при получении постов:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handlePayout = async (orderId: number) => {
        setProcessingOrder(orderId);
        try {
            const userId = await getUserId();
            const response = await apiService.post("/api/auth/create-payout/", JSON.stringify({
                user_id: userId,
                order_id: orderId,
            }));
            toast.success('Деньги отправлены')
            if (response.data.payment_url) {
                window.location.href = response.data.payment_url; // Перенаправляем на YooKassa
            } else {
                alert("Ошибка: Ссылка на выплату не получена");
            }
        } catch (error) {
            alert("Ошибка при создании выплаты!");
        } finally {
            setProcessingOrder(null);
        }
    };

    if (isLoading) return <p className="text-gray-500">Загрузка...</p>;
    if (error) return <p className="text-red-500">Ошибка: {error}</p>;
    const STATUS_TRANSLATIONS: Record<string, string> = {
        pending: "⏳ Создание трейда",
        approved: "📦 Трейд отправлен",
        accepted: "✅ Трейд принят",
        bought: "💰 Выкуплено",
        paid: "💳 Оплачено",
        rejected: "❌ Отклонено",
    };
    return (
        <div className="w-full sm:w-3/4 main-block-bg mb-10 p-4 sm:p-7 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Мои ордеры</h3>
            
            {orders.length === 0 ? (
                <p className="text-gray-400">Нет активных ордеров.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className={`p-2 border rounded-lg border-gray-700 bg-gray-900 hover:bg-gray-800 transition-all 
                                ${order.status === "rejected" ? "filter grayscale opacity-60" : ""}
                                ${order.status === "accepted" ? "bg-gradient-to-r from-green-500/20 to-transparent" : ""}
                                ${order.status === "approved" ? "bg-gradient-to-r from-yellow-500/20 to-transparent" : ""}
                                `}
                        >
                            <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-white/80 border-gray-500/40 font-extralight mb-2">
                                {STATUS_TRANSLATIONS[order.status] || "🔍 Неизвестно"}
                            </Badge>
                            {order.trade_offer_id ? 
                            <p className="text-xs text-gray-400">id: {order.trade_offer_id} </p> : ''}
                            </div>
                            <div className="flex items-center space-x-4">
                                {order.image_url && (
                                    <img src={order.image_url} alt={order.skin_name} className="w-12 h-10 rounded-lg" />
                                )}
                                <div>
                                    <p className="text-white font-semibold mb-1">{order.skin_name}</p>
                                    <p className="text-green-500 bg-green-500/10 rounded-md w-max p-1 font-bold text-xs">{order.offer_price} ₽</p>
                                </div>
                            </div>
                            {/* Кнопка "Получить деньги", если статус accepted */}
                            {order.status === "accepted" && (
                                <button
                                    onClick={() => handlePayout(order.id)}
                                    disabled={processingOrder === order.id}
                                    className="mt-3 w-full text-white bg-green-500 hover:bg-green-600 transition-all px-3 py-1 rounded-md"
                                >
                                    {processingOrder === order.id ? "Обрабатывается..." : "💸 Получить деньги"}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersList;
