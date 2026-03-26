import SEO from '@/components/shared/SEO';
import { Truck, Store, Warehouse, CreditCard, Smartphone, Banknote } from 'lucide-react';

const DELIVERY = [
  {
    icon: Truck,
    title: 'Курьерская доставка',
    price: '300 ₽',
    desc: 'Доставка по Москве и Московской области. Срок доставки 1–2 рабочих дня. При заказе от 3 000 ₽ — бесплатно.',
    detail: 'Курьер позвонит за 1 час до прибытия. Доставка ежедневно с 10:00 до 22:00.',
  },
  {
    icon: Warehouse,
    title: 'Самовывоз со склада',
    price: 'Бесплатно',
    desc: 'Получите заказ на нашем складе в удобное время. Адрес склада: г. Москва, ул. Складская, 12.',
    detail: 'Режим работы: Пн–Пт 9:00–18:00, Сб 10:00–15:00. Заказ хранится 7 дней.',
  },
  {
    icon: Store,
    title: 'Самовывоз из магазина',
    price: 'Бесплатно',
    desc: 'Заберите заказ в нашем фирменном магазине. Адрес: г. Москва, Арбат, 15, ТЦ "Мёдовый".',
    detail: 'Режим работы: Ежедневно 10:00–21:00. Вы можете попробовать мёд перед покупкой.',
  },
];

const PAYMENT = [
  { icon: CreditCard, title: 'Банковская карта', desc: 'Оплата картой Visa, Mastercard, МИР онлайн или при получении.' },
  { icon: Smartphone, title: 'QIWI / Электронные кошельки', desc: 'Оплата через QIWI, ЮMoney и другие электронные кошельки.' },
  { icon: Banknote, title: 'Наличными', desc: 'Оплата наличными при получении (курьер или самовывоз).' },
];

const FAQ = [
  { q: 'Куда вы доставляете?', a: 'Курьерская доставка действует по Москве и МО. В другие регионы — через транспортные компании (СДЭК, Почта России). Стоимость рассчитывается при оформлении заказа.' },
  { q: 'Можно ли вернуть товар?', a: 'Да, в течение 14 дней с момента получения, если товар не был вскрыт и находится в товарном виде. Свяжитесь с нами для оформления возврата.' },
  { q: 'Как хранить мёд?', a: 'Хранить в прохладном тёмном месте при температуре 5–20°C. Не допускать попадания прямых солнечных лучей. Срок хранения — 2 года.' },
  { q: 'Мёд засахарился — это нормально?', a: 'Да! Кристаллизация — признак натурального мёда. Чтобы растворить кристаллы, нагрейте мёд на водяной бане при температуре не выше 40°C.' },
];

export default function DeliveryPage() {
  return (
    <>
      <SEO title="Доставка и оплата" description="Условия доставки и оплаты при заказе мёда из Кадымки. Курьером, самовывоз со склада или из магазина." />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Доставка и оплата</h1>
        <p className="mb-12 text-gray-500">Выберите удобный способ получения и оплаты заказа</p>

        {/* Delivery */}
        <section className="mb-14">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Способы доставки</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {DELIVERY.map((d) => (
              <div key={d.title} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
                  <d.icon size={22} className="text-[#F5A623]" />
                </div>
                <div className="mb-1 flex items-baseline justify-between">
                  <h3 className="font-semibold text-gray-900">{d.title}</h3>
                  <span className="text-sm font-bold text-[#F5A623]">{d.price}</span>
                </div>
                <p className="mb-3 text-sm text-gray-600">{d.desc}</p>
                <p className="text-xs text-gray-400">{d.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Payment */}
        <section className="mb-14">
          <h2 className="mb-6 text-xl font-bold text-gray-900">Способы оплаты</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {PAYMENT.map((p) => (
              <div key={p.title} className="rounded-xl border bg-white p-5 shadow-sm flex gap-4">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-amber-50">
                  <p.icon size={18} className="text-[#F5A623]" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900 text-sm">{p.title}</h3>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="mb-6 text-xl font-bold text-gray-900">Частые вопросы</h2>
          <div className="space-y-3">
            {FAQ.map((item) => (
              <details key={item.q} className="group rounded-xl border bg-white shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-gray-900 marker:hidden">
                  {item.q}
                  <span className="ml-3 shrink-0 text-[#F5A623] transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="border-t px-5 pb-5 pt-3 text-sm text-gray-600 leading-relaxed">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
