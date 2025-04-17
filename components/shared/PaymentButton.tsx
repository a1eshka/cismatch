"use client";

import { useState } from "react";
import PaymentModal from "./modals/PaymentModal";


export default function PaymentButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        Пополнить баланс
      </button>

      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
