import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CISMatch - FAQ",
  description:
    "Ответы на самые популярные вопросы пользователей платформы CISMatch.",
};
const faqData = [
    {
      question: 'Как найти тиммейтов для CS2?',
      answer:
        'На нашей платформе ты можешь легко найти напарников по игре. Просто зарегистрируйся, создай пост с информацией о себе, своём уровне игры и предпочтениях — и другие игроки смогут откликнуться. Также ты можешь просматривать существующие посты и находить себе команду по интересам или скиллу.',
    },
    {
      question: 'Как работает раздел "Скупка скинов"?',
      answer:
        'Скупка скинов — это безопасная и удобная возможность продать свои CS2-предметы за реальные деньги. Мы предлагаем честные цены и моментальные выплаты. Просто авторизуйся через Steam, выбери предметы, которые хочешь продать, и получи моментальное предложение. Продажа проходит через проверенного бота, а оплата — на твою удобную платёжную систему.',
    },
    {
      question: 'Как работает мониторинг серверов?',
      answer:
        'Мы отображаем активные CS2-сервера в реальном времени: ты видишь карту, количество игроков, пинг и даже текущие режимы. Добавляй свои сервера в мониторинг, продвигай их и следи за активностью прямо с сайта. Удобный фильтр поможет быстро найти нужный режим или регион.',
    },
    {
      question: 'Что такое "Раздачи"?',
      answer:
        'Раздачи — это регулярные розыгрыши скинов и внутриигровых предметов среди наших пользователей. Участвовать просто: проявляй активность, следи за анонсами в Telegram и Discord, и не пропусти шанс выиграть редкие скины. Все розыгрыши проходят честно и прозрачно.',
    },
  ];

export default function FaqSection() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12 text-white">
      <h2 className="text-3xl font-bold text-center text-white mb-8 ">
        Часто задаваемые вопросы
      </h2>
      <Accordion type="single" collapsible className="space-y-4">
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border border-gray-700 bg-zinc-900 rounded-xl overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-4 text-left text-lg font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-gray-300">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
