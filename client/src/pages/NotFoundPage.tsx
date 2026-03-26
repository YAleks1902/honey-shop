import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-gray-200">404</h1>
      <p className="mt-4 text-xl text-gray-600">Страница не найдена</p>
      <p className="mt-2 text-sm text-gray-400">Страница, которую вы ищете, не существует или была перемещена.</p>
      <Link to={ROUTES.HOME}>
        <Button className="mt-6">На главную</Button>
      </Link>
    </div>
  );
}
