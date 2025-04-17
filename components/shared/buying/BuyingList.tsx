'use client';

import { useEffect, useState } from "react";

import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import useLoginModal from "@/app/hooks/useLoginModal";
import { Container } from '@/components/shared/Conatiner';
import { ArrowDownNarrowWide, ArrowUpWideNarrow, ShoppingCart } from "lucide-react";
import { getUserId } from "@/app/lib/actions";
import apiService from "@/app/services/apiService";

interface Item {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: string;
    color: string;
    market_hash_name: string;
    stickers: string[];
    keychains: string[];
}

const POSTS_PER_PAGE = 21;

const InventoryPage = () => {
    const [inventory, setInventory] = useState<Item[]>([]);
    const [visibleItems, setVisibleItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const loginModal = useLoginModal();
    // Функция сортировки


    // Функция для получения userId
    const fetchUserId = async () => {
        try {
            const id = await getUserId();
            if (id) {
                setUserId(id);  // Устанавливаем userId в состояние
            } else {
                //toast.error("Пожалуйста, авторизуйтесь.");
            }
        } catch (error) {
            toast.error("Ошибка при получении userId.");
        }
    };

    const sortInventory = (order: "asc" | "desc") => {
        const sortedItems = [...inventory].sort((a, b) => {
            const priceA = parseFloat(a.price.replace(" ₽", "")) || 0;
            const priceB = parseFloat(b.price.replace(" ₽", "")) || 0;
            return order === "asc" ? priceA - priceB : priceB - priceA;
        });

        setInventory(sortedItems);
        setVisibleItems(sortedItems.slice(0, page * POSTS_PER_PAGE));
        setSortOrder(order);
    };

    const fetchItemPrices = async (marketHashNames: string[]) => {
        try {
            const data = JSON.stringify({ market_hash_names: marketHashNames });
            const response = await apiService.post("/api/auth/inventory/steam/prices/", data);
            return response.prices || {};
        } catch (error) {
            console.error("Ошибка при получении цен:", error);
            throw error;
        }
    };

    const fetchInventory = async () => {
        try {
            setIsLoading(true);
            const userId = await getUserId();
            if (!userId) throw new Error('Пользователь не авторизован');

            const response = await apiService.get(`/api/auth/user/${userId}/inventory/`);
            console.log('response', response)
            const { assets = [], descriptions = [] } = response;
            if (!Array.isArray(assets) || !Array.isArray(descriptions)) {
                throw new Error('Некорректная структура данных');
            }

            const descriptionMap: Record<string, any> = {};
            descriptions.forEach((desc) => {
                descriptionMap[desc.classid] = desc;
            });

            const filteredAssets = assets.filter((asset) => {
                const desc = descriptionMap[asset.classid];
                return desc && desc.marketable === 1;
            });

            const uniqueMarketHashNames = [...new Set(filteredAssets.map((asset) => descriptionMap[asset.classid]?.market_hash_name))];
            const priceData = await fetchItemPrices(uniqueMarketHashNames);
            const getConditionFromDescription = (description: string) => {
                if (description.includes("Прямо с завода")) return "FN";
                if (description.includes("Немного поношенное")) return "MW";
                if (description.includes("Поношенное")) return "WW";
                if (description.includes("После полевых испытаний")) return "FT";
                if (description.includes("Закалённое в боях")) return "BS";
                return " ";
            };

            const formattedInventory: Item[] = filteredAssets.map((asset) => {
                const desc = descriptionMap[asset.classid];
                if (!desc) return null;

                const description = desc.descriptions?.find((d: any) => d.name === "exterior_wear")?.value?.replace("Износ:", "").trim() || " ";
                const condition = getConditionFromDescription(description);

                return {
                    id: asset.assetid,
                    name: desc.name || "Неизвестный предмет",
                    description: condition,
                    image_url: desc.icon_url ? `https://steamcommunity-a.akamaihd.net/economy/image/${desc.icon_url}` : "",
                    price: priceData[desc.market_hash_name]?.price
                        ? `${(parseFloat(priceData[desc.market_hash_name].price) / 100).toFixed(2)} ₽`
                        : "Цена неизвестна",
                    color: `#${desc.tags?.find((tag: any) => tag.category === "Rarity")?.color || "FFFFFF"}`,
                    market_hash_name: desc.market_hash_name,
                    stickers: asset.stickers ? asset.stickers.map((sticker: any) => sticker.sticker_id) : [],
                    keychains: asset.keychains ? asset.keychains.map((keychain: any) => keychain.keychain_id) : [],
                };
            }).filter((item) => item !== null) as Item[];

            // Группируем предметы с учетом наклеек и брелков
            const groupedItems = formattedInventory.reduce((acc: any, item: Item) => {
                const hasStickersOrKeychains = item.stickers.length > 0 || item.keychains.length > 0;

                if (hasStickersOrKeychains) {
                    // Если есть наклейки или брелки, предмет всегда уникальный
                    acc[item.id] = { ...item, quantity: 1 };
                } else {
                    // Если нет наклеек и брелков, группируем по market_hash_name
                    const key = item.market_hash_name;
                    if (!acc[key]) {
                        acc[key] = { ...item, quantity: 0 };
                    }
                    acc[key].quantity += 1;
                }

                return acc;
            }, {});

            // Преобразуем объект обратно в массив
            const finalInventory = Object.values(groupedItems);
            setInventory(finalInventory);
            setVisibleItems(finalInventory.slice(0, POSTS_PER_PAGE));
        } catch (err: any) {
            //toast.error(`Ошибка загрузки: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUserId();  // Получаем userId при монтировании компонента
    }, []);
    const loadMoreItems = () => {
        const nextPage = page + 1;
        const nextItems = inventory.slice(0, nextPage * POSTS_PER_PAGE);
        setVisibleItems(nextItems);
        setPage(nextPage);
    };
    const getTradeUrl = async () => {
        try {
            const response = await apiService.get(`/api/auth/user/${userId}`);
            return response.data.trade_url; // Предполагаем, что API возвращает { trade_url: "..." }
        } catch (error) {
            toast.error("Не удалось получить Trade URL");
            return null;
        }
    };
    const handleSellItem = async (itemId: string, skinName: string, offerPrice: string, imageUrl: string,) => {
        try {
            toast.info("Создается трейд оффер. Создание может происходить до нескольких минут!");
            const userId = await getUserId(); // Получаем userId асинхронно

            if (!userId) {
                toast.error("Не удалось определить пользователя");
                return;
            }
            const tradeUrl = await getTradeUrl(); // Получаем trade_url перед отправкой
            if (!tradeUrl) {
                toast.error("Trade URL не найден");
                return;
            }
            const data = JSON.stringify({ user_id: userId, asset_id: itemId, skin_name: skinName, trade_url: tradeUrl, offer_price: parseFloat(offerPrice.replace(" ₽", "")), image_url: imageUrl });
            const response = await apiService.post("/api/auth/sell-item/", (data));
            if (response.success) {
                toast.success("Трейд-оффер отправлен!");
            } else {
                throw new Error("Ошибка при отправке трейда");
            }
        } catch (error: any) {
            toast.error(error.message || "Ошибка при отправке");
        }
    };


    useEffect(() => {
        fetchInventory();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 200 &&
                visibleItems.length < inventory.length
            ) {
                loadMoreItems();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [visibleItems, inventory]);
    if (isLoading && visibleItems.length === 0) {
        return (
            <Container className="flex justify-center items-center h-screen">
                <div role="status">
                    <svg aria-hidden="true" className="w-20 h-20 mt-5 text-gray-300/50 animate-spin dark:text-gray-600 fill-gray-600/50" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            </Container>
        );
    }
    return (
        <>
        <Container className="flex flex-col my-10 px-4 sm:px-0">
            <div>
                <div className="bg-gray-600/10 p-4 rounded-xl mb-4 relative">
                    <div className="flex flex-col space-y-2 w-1/2">
                        <div className="text-2xl font-bold">Скупка предметов CS2 – выгодно, быстро, безопасно!</div>
                        <div className="text-sm font-light text-gray-400">Хотите продать скины из Counter-Strike 2 (CS2) по выгодной цене? Мы предлагаем моментальный выкуп предметов Steam с мгновенными выплатами на удобные платежные системы.</div>
                    </div>

                    <img
                        src={`${process.env.NEXT_PUBLIC_API_HOST}/media/weapons/voi.png`} // Укажите путь к вашей картинке
                        alt="Promo Code Image"
                        width={484} // Ширина картинки
                        height={484} // Высота картинки
                        className="absolute -bottom-4 right-0 mb-4 mr-4 rotate-12 filter grayscale transition-all duration-300 hover:grayscale-0" // Отступ от текста
                    />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mb-4">
                    <div className="relative bg-gradient-to-b from-gray-600/30 to-gray-800/10 p-4 rounded-xl hover:bg-gray-600/20 transform transition-all duration-300 hover:scale-105">Авторизуйтесь.
                        <p className="text-xs text-gray-400/50 font-extralight mt-1">Добавьте в свою учетную запись ссылку на трейд, чтобы система могла загрузить ваш инвентарь и предложить лучшие цены на скины CS2.</p>
                        <div className="absolute bottom-0 right-2 text-5xl font-semibold text-gray-500/20">1</div>
                    </div>
                    <div className="relative bg-gradient-to-b from-gray-600/30 to-gray-800/10 p-4 rounded-xl hover:bg-gray-600/20 transform transition-all duration-300 hover:scale-105">Выберите предмет для продажи.
                        <p className="text-xs text-gray-400/50 font-extralight mt-1">Выберите ножи, перчатки, кейсы, наклейки или другое оружие CS2 – наша система оценит их стоимость в реальном времени.</p>
                        <div className="absolute bottom-0 right-2 text-5xl font-semibold text-gray-500/20">2</div>
                    </div>
                    <div className="relative bg-gradient-to-b from-gray-600/30 to-gray-800/10 p-4 rounded-xl hover:bg-gray-600/20 transform transition-all duration-300 hover:scale-105">Примите трейд.
                        <p className="text-xs text-gray-400/50 font-extralight mt-1">После подтверждения сделки наш бот отправит вам трейд-предложение. Все операции проходят безопасно и без скрытых комиссий.</p>
                        <div className="absolute bottom-0 right-2 text-5xl font-semibold text-gray-500/20">3</div>
                    </div>
                    <div className="relative bg-gradient-to-b from-gray-600/30 to-gray-800/10 p-4 rounded-xl hover:bg-gray-600/20 transform transition-all duration-300 hover:scale-105">Получите деньги.
                        <p className="text-xs text-gray-400/50 font-extralight mt-1">После успешного обмена - средства поступят на указанный Вами счет.</p>
                        <div className="absolute bottom-0 right-2 text-5xl font-semibold text-gray-500/20">4</div>
                    </div>
                </div>
            </div>
            <h1 className="text-xl font-bold mb-4">Ваш инвентарь</h1>
            <div className="flex gap-2 mb-4">
                <Button variant="outline" onClick={() => sortInventory("asc")}>
                    Цена <ArrowUpWideNarrow />
                </Button>
                <Button variant="outline" onClick={() => sortInventory("desc")}>
                    Цена <ArrowDownNarrowWide />
                </Button>
            </div>
            {visibleItems.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-7 gap-6">
                    {visibleItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative p-4 rounded-lg group overflow-visible transform transition-all duration-300 hover:scale-105"  // Эффект увеличения
                            style={{
                                background: `linear-gradient(to top, ${item.color}35 5%, ${item.color}10 30%, transparent 80%)`,
                            }}
                        >
                            {/* Затенение фона внутри блока, не выходящее за границы закруглений */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />

                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-24 object-cover"
                                loading="lazy"
                            />

                            {/* Иконка корзины, показывается при наведении */}
                            <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-green-500/10 p-2 rounded-xl ">
                                    <button onClick={() => handleSellItem(item.id, item.name, item.price, item.image_url)} title='Продать нам'>
                                        <ShoppingCart size={32} className="text-green-500 hover:text-green-700" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm font-bold">{item.price}</p>
                            <h3 className="text-xs font-light text-gray-400 line-clamp-3">{item.name}</h3>
                            {item.quantity > 1 && (
                                <span className="absolute top-2 -right-2 bg-green-500/20 text-green-500 text-xs rounded-full px-2 py-1">
                                    {item.quantity}x
                                </span>
                            )}
                            {item.description && item.description.trim() !== "" && (
                                <span className="absolute bottom-2 right-2 bg-gray-500/20 text-gray-400 text-xs font-light rounded-lg px-1 py-1">
                                    {item.description}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-gray-400">Ваш инвентарь пуст или не добавлена ссылка на обмен.
                    <div>
                        {userId ? (
                            <a
                                href={`/profile/${userId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Добавить ссылку на обмен.
                            </a>
                        ) : (
                            <button
                                onClick={() => loginModal.open()} // Перенаправление на страницу авторизации
                                className="text-blue-500 hover:underline"
                            >
                                Войти для добавления ссылки
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Container>
        </>);
};

export default InventoryPage;
