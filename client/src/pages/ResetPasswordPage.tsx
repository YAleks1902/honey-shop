import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import SEO from '@/components/shared/SEO';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError('Пароли не совпадают'); return; }
    if (password.length < 6) { setError('Пароль должен быть не менее 6 символов'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { error?: string } } };
      setError(apiErr?.response?.data?.error ?? 'Ссылка недействительна или устарела');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <div>
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-gray-600 mb-4">Недействительная ссылка для сброса пароля.</p>
          <Link to="/" className="text-[#F5A623] hover:underline">На главную</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Сброс пароля" />
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-xl font-bold text-gray-900 text-center">Новый пароль</h1>

          {success ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl">✓</div>
              <p className="font-medium text-gray-900">Пароль изменён!</p>
              <p className="mt-1 text-sm text-gray-500">Через несколько секунд вы будете перенаправлены на главную страницу.</p>
              <Link to="/" className="mt-4 inline-block text-sm text-[#F5A623] hover:underline">На главную</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Новый пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Минимум 6 символов"
                required
              />
              <Input
                label="Подтвердите пароль"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" loading={loading} className="w-full">Сохранить пароль</Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
