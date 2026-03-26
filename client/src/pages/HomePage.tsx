import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useFeaturedProducts } from '@/features/products/useProducts';
import ProductCard from '@/components/shared/ProductCard';
import SEO from '@/components/shared/SEO';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants';
import { Review } from '@/types';

const SAMPLE_REVIEWS: Review[] = [
  { id: '1', authorName: 'Андрей Петров', authorCity: 'г.Москва', comment: 'Первый раз заказал мёд для своей семьи. В итоге все были довольны, мёд безумно вкусный. Буду заказывать и советовать своим друзьям. Огромное спасибо за подарочный набор.', createdAt: '' },
  { id: '2', authorName: 'Мария Иванова', authorCity: 'г.Санкт-Петербург', comment: 'Когда найдёшь товар по душе, остаётся оставить его в этой заметке, чтобы помнить мёд и вернуться к нему снова.', createdAt: '' },
  { id: '3', authorName: 'Сергей Козлов', authorCity: 'г.Казань', comment: 'Отличный мёд, заказываю уже третий раз. Качество стабильно высокое. Семья очень довольна.', createdAt: '' },
  { id: '4', authorName: 'Анна Смирнова', authorCity: 'г.Екатеринбург', comment: 'Прекрасный продукт. Рекомендую всем любителям натурального мёда!', createdAt: '' },
];

export default function HomePage() {
  const { data: featured, isLoading } = useFeaturedProducts();
  const [reviewPage, setReviewPage] = useState(0);
  const [email, setEmail] = useState('');

  const reviewsPerPage = 2;
  const totalPages = Math.ceil(SAMPLE_REVIEWS.length / reviewsPerPage);
  const visibleReviews = SAMPLE_REVIEWS.slice(reviewPage * reviewsPerPage, reviewPage * reviewsPerPage + reviewsPerPage);

  return (
    <>
      <SEO />
      <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 to-white py-16 md:py-24 overflow-hidden">
        <div className="container">
          <div className="flex items-center justify-between gap-8">
            <div className="max-w-xl">
              <h1 className="text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
                Натуральный мёд<br />из села Кадымка
              </h1>
              <p className="mt-4 text-gray-500">
                Товары, отличающиеся богатым вкусом мёда. Планомерное развитие позволяет выполнять важные планы.
              </p>
              <Link to={ROUTES.CATALOG}>
                <Button size="lg" className="mt-6">
                  Смотреть все
                </Button>
              </Link>
            </div>
            <div className="hidden md:block shrink-0">
              <img
                src="/hero-honey.png"
                alt="Мёд"
                className="w-72 lg:w-96 drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="py-12">
        <div className="container">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-16">
            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&q=80"
                alt="Натуральный мёд"
                className="aspect-video w-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                Вкусный<br />Полезный<br />Мёд
              </h2>
              <p className="mt-4 text-gray-500">
                Полезный и вкусный мёд. Богат на витамины и какой-то текст далее.
              </p>
              <p className="mt-3 text-sm text-gray-400">
                А описание того, что нас вдохновляет, помогает понять нашу миссию и ценности.
              </p>
              <Link to={ROUTES.CATALOG}>
                <Button variant="outline" className="mt-6">
                  Подробнее
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="py-10 bg-amber-50/50">
        <div className="container">
          <div className="mb-8">
            <img
              src="/banner-tovary-nedeli.png"
              alt="Товары недели"
              className="w-full rounded-lg"
            />
          </div>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {(featured ?? []).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Отзывы</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setReviewPage((p) => Math.max(0, p - 1))}
                className="flex h-10 w-10 items-center justify-center border border-gray-300 rounded hover:border-[#F5A623] transition-colors"
                aria-label="Предыдущие отзывы"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setReviewPage((p) => Math.min(totalPages - 1, p + 1))}
                className="flex h-10 w-10 items-center justify-center border border-gray-300 rounded hover:border-[#F5A623] transition-colors"
                aria-label="Следующие отзывы"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleReviews.map((review) => (
              <div key={review.id} className="rounded border border-gray-100 bg-gray-50 p-6">
                <p className="text-sm font-medium text-gray-900">{review.authorName}, {review.authorCity}</p>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-amber-50 py-12">
        <div className="container">
          <div className="mx-auto max-w-md text-center">
            <h2 className="text-lg font-semibold text-gray-900">Будьте в курсе товаров</h2>
            <p className="mt-2 text-sm text-gray-500">
              Получайте актуальные новости первыми, чтобы не пропустить интересные предложения
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
              className="mt-4 flex flex-col gap-2 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email"
                className="flex-1 rounded border border-gray-300 px-4 py-2 text-sm focus:border-[#F5A623] focus:outline-none"
              />
              <button
                type="submit"
                className="rounded bg-[#F5A623] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#d4890a] transition-colors sm:px-4"
                aria-label="Подписаться"
              >
                <span className="sm:hidden">Подписаться</span>
                <ChevronRight size={16} className="hidden sm:block" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
