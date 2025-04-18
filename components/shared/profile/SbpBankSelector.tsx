import apiService from "@/app/services/apiService";
import { useEffect, useState } from "react";


interface Bank {
    id: string;
    name: string;
    logo?: string;
  }
  
  interface SbpBankSelectorProps {
    onSelect: (bank: Bank) => void;
  }

const SbpBankSelector: React.FC<SbpBankSelectorProps> = ({ onSelect }) => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string>("");

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
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const bank = banks.find((b) => b.id === e.target.value);
        if (bank) {
          setSelectedId(bank.id);
          onSelect(bank);
        }
      };

    return (
        <div>
            <h2 className="text-white">Выберите банк для выплаты:</h2>
            {loading ? (
                <p className="text-gray-500">Загрузка банков...</p>
            ) : (
                <select
                    className="p-2 border rounded bg-gray-900 text-white"
                    onChange={handleChange}
                    value={selectedId}
                >
                    <option value="">Выберите банк</option>
                    {banks.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                            {bank.name}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default SbpBankSelector;
