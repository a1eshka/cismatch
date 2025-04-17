
import RaffleList from "@/components/shared/raffles/RaffleList";



export const metadata = {
  title: 'CISMatch - Розыгрыши CS2. Ежедневные раздачи скинов и бонусы',
  description: 'Участвуй в розыгрышах скинов CS2 каждый день, выполняй задания и пополняй баланс. Бесплатные призы и акции!',
  keywords: 'розыгрыши CS2, раздачи скинов CS2, бесплатные скины CS2, задания CS2, бонусы CS2, акции CS2'
};

export default function Raffles() {
  return (
    <>
      <RaffleList />
    </>
  );
}