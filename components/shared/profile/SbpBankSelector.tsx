import apiService from "@/app/services/apiService";
import { useEffect, useState } from "react";


const SbpBankSelector = ({ onSelect }) => {
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await apiService.get("/api/auth/get-sbp-banks/");
                setBanks(response.banks);
            } catch (error) {
                console.error("Ошибка при получении списка банков:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBanks();
    }, []);

    return (
        <div>
            <h2 className="text-white">Выберите банк для выплаты:</h2>
            {loading ? (
                <p className="text-gray-500">Загрузка банков...</p>
            ) : (
                <select
                    className="p-2 border rounded bg-gray-900 text-white"
                    onChange={(e) => onSelect(e.target.value)}
                >
                    <option value="">Выберите банк</option>
                    {banks.map((bank) => (
                        <option key={bank.bank_id} value={bank.bank_id}>
                            {bank.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SbpBankSelector;
