import BuyingList from "@/components/shared/buying/BuyingList";



export const metadata = {
  title: 'CISMatch - Скупка скинов CS2. Быстрая продажа скинов за деньги.',
  description: 'Удобная и безопасная скупка скинов CS2. Продавай скины быстро и выгодно. Получи реальные деньги за покупку и продажу скинов и предметов CS2 из Steam.',
  keywords: 'cs2 скупка, продажа скинов CS2, скупка скинов CS2, продать скин CS2, CS2 скины за деньги, обмен скинов CS2'
};

export default function Buyings() {
  return (
    <>
      <BuyingList />
    </>
  );
}