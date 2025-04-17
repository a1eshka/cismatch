'use client'; // Убедись, что используешь 'use client' для клиентских компонентов

import { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // Импортируем иконку крестика
import Link from 'next/link';
import { MiniNewsType } from './MiniNewsList';

interface MiniNewsProps {
  mininew: MiniNewsType;
}

const MiniNewsListItem: React.FC<MiniNewsProps> = ({ mininew }) => {
  const [isVisible, setIsVisible] = useState(true); // Состояние видимости блока

  // Функция для скрытия блока
  const handleClose = () => {
    setIsVisible(false);
    const now = new Date().getTime();
    localStorage.setItem(`mininewsHidden_${mininew.id}`, now.toString()); // Сохраняем время скрытия
  };

  // Проверка, истекло ли время скрытия
  useEffect(() => {
    const hiddenTime = localStorage.getItem(`mininewsHidden_${mininew.id}`);
    if (hiddenTime) {
      const now = new Date().getTime();
      const hiddenDuration = now - parseInt(hiddenTime, 10);
      const thirtyMinutes = 30 * 60 * 1000; // 30 минут в миллисекундах

      if (hiddenDuration >= thirtyMinutes) {
        localStorage.removeItem(`mininewsHidden_${mininew.id}`); // Удаляем запись из localStorage
        setIsVisible(true); // Показываем блок
      } else {
        setIsVisible(false); // Блок остается скрытым
      }
    }
  }, [mininew.id]);

  // Если блок скрыт или не опубликован, не рендерим его
  if (!isVisible || !mininew.published) {
    return null;
  }

  return (
    <div className="relative mb-4">
{mininew.url ? (
  <Link href={mininew.url}>
    <div className="relative flex items-center justify-center bg-yellow-500/10 text-yellow-500 mt-4 -mb-4 rounded-xl p-3 border border-yellow-500/20 hover:border-yellow-600 transition-all duration-300 cursor-pointer">
      <div className="text-center select-text">{mininew.title}</div>
      <div className="absolute left-10 top-1/2 transform -translate-y-1/2"></div>
    </div>
  </Link>
) : (
  <div className="relative flex items-center justify-center bg-yellow-500/10 text-yellow-500 mt-4 -mb-4 rounded-xl p-3 border border-yellow-500/20 transition-all duration-300">
    <div className="text-center select-text">{mininew.title}</div>
    <div className="absolute left-10 top-1/2 transform -translate-y-1/2"></div>
  </div>
)}

      {/* Крестик по правому краю */}
      <button
        onClick={handleClose}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 bg-yellow-800/30 rounded-full hover:bg-yellow-800/50 transition-colors duration-300"
        aria-label="Закрыть"
      >
        <X className="w-4 h-4 text-yellow-500" /> {/* Иконка крестика */}
      </button>
    </div>
  );
};

export default MiniNewsListItem;