import React from 'react';
import Link from 'next/link';

const Social = () => {
  return (
    <div>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Telegram */}
          <Link href="https://t.me/cismatch">
            <div className="flex flex-col items-center justify-center text-center bg-gray-800/30 backdrop-blur-md rounded-xl p-4 hover:border-gray-700/70 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 relative overflow-hidden group h-full">
              {/* Неоновое свечение */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Текст */}
              <div className="text-xs">Мы в Telegram</div>
              {/* Иконка */}
              <img
                src={`${process.env.NEXT_PUBLIC_API_HOST}/media/social/telegram.png`}
                alt="Telegram"
                className="w-24 absolute -right-8 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              />
              {/* Подсветка снизу */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>

          {/* TeamSpeak */}
          <Link href="as">
            <div className="flex flex-col items-center justify-center text-center bg-gray-800/30 backdrop-blur-md rounded-xl p-4 hover:border-gray-700/70 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 relative overflow-hidden group h-full">
              {/* Неоновое свечение */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Текст */}
              <div className="text-xs">Мы в TeamSpeak</div>
              {/* Иконка */}
              <img
                src={`${process.env.NEXT_PUBLIC_API_HOST}/media/social/teamspeak.png`}
                alt="TeamSpeak"
                className="w-20 absolute -right-8 opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              />
              {/* Подсветка снизу */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>

          {/* ВКонтакте */}
          <Link href="https://vk.com/cismatch">
            <div className="flex flex-col items-center justify-center text-center bg-gray-800/30 backdrop-blur-md rounded-xl p-4 hover:border-gray-700/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden group h-full">
              {/* Неоновое свечение */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Текст */}
              <div className="text-xs">Мы в VK</div>
              {/* Иконка */}
              <img
                src={`${process.env.NEXT_PUBLIC_API_HOST}/media/social/vk.png`}
                alt="VK"
                className="w-24 absolute -right-8  opacity-30 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
              />
              {/* Подсветка снизу */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Social;
