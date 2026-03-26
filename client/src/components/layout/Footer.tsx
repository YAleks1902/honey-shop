import { Link } from 'react-router-dom';
import { ROUTES, CONTACT_INFO } from '@/constants';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Products */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Продукция</h3>
            <ul className="space-y-2">
              <li><Link to={`${ROUTES.CATALOG}?category=med`} className="text-sm text-gray-500 hover:text-[#F5A623]">Мёд</Link></li>
              <li><Link to={`${ROUTES.CATALOG}?category=orehi`} className="text-sm text-gray-500 hover:text-[#F5A623]">Орехи</Link></li>
              <li><Link to={`${ROUTES.CATALOG}?category=produkty-pchelovodstva`} className="text-sm text-gray-500 hover:text-[#F5A623]">Продукты пчеловодства</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Компания</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-500 hover:text-[#F5A623]">О нас</Link></li>
              <li><Link to="/contacts" className="text-sm text-gray-500 hover:text-[#F5A623]">Контакты</Link></li>
              <li><Link to="/vacancies" className="text-sm text-gray-500 hover:text-[#F5A623]">Вакансии</Link></li>
              <li><Link to="/partners" className="text-sm text-gray-500 hover:text-[#F5A623]">Наши партнёры</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Политика конфиденциальности</h3>
            <ul className="space-y-2">
              <li><Link to="/delivery" className="text-sm text-gray-500 hover:text-[#F5A623]">Доставка и оплата</Link></li>
              <li><Link to="/cooperation" className="text-sm text-gray-500 hover:text-[#F5A623]">Сотрудничество</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-500 hover:text-[#F5A623]">FAQ</Link></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{CONTACT_INFO.address}</h3>
            <ul className="space-y-2">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-gray-500 hover:text-[#F5A623]">
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Phone */}
          <div>
            <p className="mb-1 text-xs text-gray-400">Бесплатный звонок по России</p>
            <a href={`tel:${CONTACT_INFO.phone}`} className="text-base font-semibold text-gray-900 hover:text-[#F5A623]">
              {CONTACT_INFO.phone}
            </a>
            <p className="mt-2 text-xs text-gray-400">Принимаем звонки</p>
            <p className="text-xs text-gray-400">с ПН по ПТ, с 9 до 20 по Москве</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-gray-400">
            © 2021 «Мёд из села Кадымка» Все права защищены.
          </p>
          <div className="flex items-center gap-3">
            <PaymentIcons />
          </div>
        </div>
      </div>
    </footer>
  );
}

function PaymentIcons() {
  const icons = ['VISA', 'MC', 'GPay', 'SBP', 'Apple Pay', 'МИР'];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {icons.map((icon) => (
        <span key={icon} className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-500">
          {icon}
        </span>
      ))}
    </div>
  );
}
