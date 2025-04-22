'use client';

import Link from 'next/link';
import { FaTelegramPlane, FaDiscord, FaTwitter, FaGithub, FaSteam, FaVk } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className=" text-gray-300 py-10 mt-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Логотип и описание */}
        <div className='flex'>
          <img src={`${process.env.NEXT_PUBLIC_API_HOST}/media/logos/logo.png`}
            alt="CISMATCH Logo" className="w-20 h-20 mb-3" />
          <p className="text-xs text-gray-600 ml-4">
          <b>CISMATCH</b> - Ищи тиммейтов, вступай в команды, следи за киберспортивными новостями, участвуй в розыгрышах, мониторь сервера и выгодно продавай скины. Добро пожаловать в комьюнити CS2!
          </p>
        </div>

        {/* Навигация */}
        <div>
          <h3 className="text-white font-semibold mb-3">Навигация</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition">Главная</Link></li>
            <li><Link href="/buying" className="hover:text-white transition">Скупка</Link></li>
            <li><Link href="/raffles" className="hover:text-white transition">Раздачи</Link></li>
            <li><Link href="/servers" className="hover:text-white transition">Сервера</Link></li>
          </ul>
        </div>

        {/* Поддержка */}
        <div>
          <h3 className="text-white font-semibold mb-3">Поддержка</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
            {/*<li><Link href="/support" className="hover:text-white transition">Контакты</Link></li>*/}
            <li><Link href="/terms" className="hover:text-white transition">Условия</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition">Политика конфиденциальности</Link></li>
          </ul>
        </div>

        {/* Социальные сети */}
        <div>
          <h3 className="text-white font-semibold mb-3">Мы в соцсетях</h3>
          <div className="flex gap-4 text-xl text-gray-400">
            <a href="https://t.me/cismatch" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaTelegramPlane /></a>
            <a href="https://discord.gg/yourserver" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaDiscord /></a>
            <a href="https://steamcommunity.com/groups/cismatch" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaSteam /></a>
            <a href="https://vk.com/cismatch" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaVk /></a>
          </div>
        </div>
      </div>

      {/* Нижняя часть */}
      <div className="mt-10 text-center text-xs text-gray-500 border-t border-gray-800 pt-6">
        © {new Date().getFullYear()} CISMatch. Все права защищены.
        <div>Мельников Алексей Денисович ИНН 780513833110</div>
        <div>info@cismatch.ru</div>
      </div>
    </footer>
  );
}
