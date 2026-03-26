import SEO from '@/components/shared/SEO';

const TEAM = [
  { name: 'Алексей Петров', role: 'Главный пчеловод', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80' },
  { name: 'Мария Петрова', role: 'Технолог производства', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80' },
  { name: 'Сергей Иванов', role: 'Менеджер по продажам', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80' },
];

const VALUES = [
  { emoji: '🌿', title: 'Натуральность', desc: 'Никаких добавок и консервантов. Только чистый мёд с наших пасек.' },
  { emoji: '🐝', title: 'Забота о пчёлах', desc: 'Мы следим за здоровьем и благополучием наших пчелиных семей.' },
  { emoji: '📦', title: 'Прозрачность', desc: 'Каждая партия проходит лабораторный контроль качества с сертификатом.' },
  { emoji: '🤝', title: 'Честность', desc: 'Справедливые цены напрямую от производителя без посредников.' },
];

export default function AboutPage() {
  return (
    <>
      <SEO title="О нас" description="Узнайте историю пасеки в селе Кадымка и познакомьтесь с нашей командой." />

      {/* Hero */}
      <section className="relative overflow-hidden bg-amber-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-[#F5A623]">Наша история</p>
              <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Мёд из Кадымки — с душой и любовью</h1>
              <p className="mb-6 text-lg text-gray-600 leading-relaxed">
                Наша пасека основана в 2005 году в живописном селе Кадымка. За 20 лет мы выросли
                из маленькой семейной пасеки в одного из крупнейших производителей натурального мёда
                в Поволжье.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Сегодня наши 200 ульев расположены на экологически чистых лугах вдали от промышленных
                предприятий. Каждый год мы собираем более 5 тонн натурального мёда разных сортов.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1471943311424-646960669fbc?w=700&q=80"
                alt="Пасека Кадымка"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-white rounded-xl shadow-md p-4 md:-bottom-4 md:-left-4">
                <p className="text-3xl font-bold text-[#F5A623]">20+</p>
                <p className="text-xs text-gray-500">лет на рынке</p>
              </div>
              <div className="absolute top-2 right-2 bg-white rounded-xl shadow-md p-4 md:-top-4 md:-right-4">
                <p className="text-3xl font-bold text-[#F5A623]">200</p>
                <p className="text-xs text-gray-500">ульев</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Наши ценности</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border bg-white p-6 text-center shadow-sm">
                <div className="mb-3 text-4xl">{v.emoji}</div>
                <h3 className="mb-2 font-semibold text-gray-900">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">Наша команда</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {TEAM.map((member) => (
              <div key={member.name} className="text-center">
                <img src={member.img} alt={member.name} className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-md" />
                <p className="font-semibold text-gray-900">{member.name}</p>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 text-center sm:grid-cols-4">
            {[
              { value: '2005', label: 'год основания' },
              { value: '5+ т', label: 'мёда в год' },
              { value: '8+', label: 'сортов мёда' },
              { value: '10 000+', label: 'довольных клиентов' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-[#F5A623]">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
