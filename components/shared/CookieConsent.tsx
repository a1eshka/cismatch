'use client';
import React, { useState, useEffect } from "react";

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже подтверждение
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true); // Показываем уведомление, если подтверждения нет
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false); // Скрываем уведомление после подтверждения
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/80 text-white p-4 shadow-lg flex flex-col sm:flex-row items-center justify-center gap-4 z-50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🍪</span>
        <p className="text-sm text-gray-700">
          Мы используем cookies для улучшения вашего опыта. Продолжая
          использовать сайт, вы соглашаетесь с нашей{" "}
          <a
            href="/privacy-policy"
            className="text-gray-500 hover:text-gray-600 underline"
          >
            Политикой конфиденциальности
          </a>
          .
        </p>
      </div>
      <button
        onClick={handleAccept}
        className="bg-gray-500 hover:bg-gray-600 text-white text-xs px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
      >
        Принимаю
      </button>
    </div>
  );
};

export default CookieConsent;