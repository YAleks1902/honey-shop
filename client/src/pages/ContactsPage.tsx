import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import SEO from '@/components/shared/SEO';
import Button from '@/components/ui/Button';

const CONTACTS = [
  { icon: MapPin, label: 'Адрес', value: 'г. Москва, Арбат, 15, ТЦ "Мёдовый"' },
  { icon: Phone, label: 'Телефон', value: '+7 (499) 999-99-99', href: 'tel:+74999999999' },
  { icon: Mail, label: 'Email', value: 'info@kadmed.ru', href: 'mailto:info@kadmed.ru' },
  { icon: Clock, label: 'Режим работы', value: 'Пн–Вс: 10:00–21:00' },
];

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <>
      <SEO title="Контакты" description="Свяжитесь с нами удобным способом. Телефон, email, адрес магазина." />

      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Контакты</h1>
        <p className="mb-10 text-gray-500">Мы всегда рады помочь и ответить на ваши вопросы</p>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Info */}
          <div>
            <div className="mb-8 space-y-4">
              {CONTACTS.map((c) => (
                <div key={c.label} className="flex items-start gap-4 rounded-xl border bg-white p-4 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50">
                    <c.icon size={18} className="text-[#F5A623]" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{c.label}</p>
                    {c.href ? (
                      <a href={c.href} className="font-medium text-gray-900 hover:text-[#F5A623]">{c.value}</a>
                    ) : (
                      <p className="font-medium text-gray-900">{c.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="overflow-hidden rounded-xl border shadow-sm">
              <iframe
                title="Карта"
                src="https://www.openstreetmap.org/export/embed.html?bbox=37.5%2C55.7%2C37.7%2C55.8&layer=mapnik"
                className="h-56 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-gray-900">Напишите нам</h2>

            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl">✓</div>
                <p className="font-semibold text-gray-900">Сообщение отправлено!</p>
                <p className="mt-1 text-sm text-gray-500">Мы ответим вам в ближайшее время.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm text-[#F5A623] hover:underline">
                  Написать ещё
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm text-gray-700">Ваше имя *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm focus:border-[#F5A623] focus:outline-none"
                    placeholder="Иван Петров"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm focus:border-[#F5A623] focus:outline-none"
                    placeholder="ivan@example.com"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-700">Сообщение *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    required
                    rows={5}
                    className="w-full rounded border border-gray-200 px-3 py-2.5 text-sm focus:border-[#F5A623] focus:outline-none resize-none"
                    placeholder="Ваш вопрос или пожелание..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send size={16} className="mr-2" /> Отправить сообщение
                </Button>
                <p className="text-xs text-gray-400">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
