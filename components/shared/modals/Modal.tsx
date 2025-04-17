'use client';

import { CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ModalProps {
  label: string;
  close: () => void;
  content: React.ReactElement;
  isOpen: boolean;
}

const Modal: React.FC<ModalProps> = ({ label, content, isOpen, close }) => {
  const [showModal, setShowModal] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  // Обновление состояния showModal при изменении пропса isOpen
  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setIsAnimating(true); // Начинаем анимацию появления
    } else {
      setIsAnimating(false); // Начинаем анимацию исчезновения
      setTimeout(() => {
        setShowModal(false); // Удаляем модальное окно из DOM после завершения анимации
      }, 300); // Задержка должна соответствовать длительности анимации
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false); // Начинаем анимацию исчезновения
    setTimeout(() => {
      setShowModal(false); // Удаляем модальное окно из DOM после завершения анимации
      close(); // Вызываем функцию close для выполнения действий
    }, 300); // Задержка должна соответствовать длительности анимации
  };

  if (!showModal) return null;

  return (
    <div className="flex items-center justify-center fixed inset-0 z-50 bg-black/60">
      <div className="relative w-[90%] max-w-[600px] my-6 mx-auto">
        <div className={`${isAnimating ? 'modal-enter' : 'modal-exit'}`}>
          <div className="w-full bg-gray-800 rounded-xl relative flex flex-col shadow-lg my-5">
            <header className="h-[60px] flex items-center p-6 rounded-t justify-between border-b-2 border-gray-700">
              <h2 className="text-lg font-bold">{label}</h2>
              <div onClick={handleClose} className="p-3 hover:bg-gray-500/50 rounded-full cursor-pointer">
                <CircleX size={25} />
              </div>
            </header>

            {/* Контент с прокруткой */}
            <section
              className="px-6 pt-5 pb-5 overflow-y-auto max-h-[calc(100vh-120px)]"
              style={{
                scrollbarWidth: 'thin', // Firefox
                scrollbarColor: 'hsl(217.5, 14.4%, 10.74%) transparent',
              }}
            >
              {content}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;