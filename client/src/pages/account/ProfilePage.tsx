import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/features/auth/authStore';
import { useProfile, useUpdateProfile } from '@/features/auth/useAuth';
import AccountSidebar from '@/components/layout/AccountSidebar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants';

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6).optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, isLoggedIn } = useAuthStore();
  const { data: profile } = useProfile(isLoggedIn);
  const { mutate, isPending, isSuccess, error } = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        email: profile.email,
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: FormData) => mutate(data);

  return (
    <div className="container py-8">
      <div className="mb-6 flex gap-8 border-b border-gray-200 pb-3">
        <Link to={ROUTES.ACCOUNT_ORDERS} className="border-b-2 border-gray-900 pb-3 text-sm font-medium text-gray-900">
          Личный кабинет
        </Link>
        <button onClick={() => useAuthStore.getState().logout()} className="text-sm text-gray-400 hover:text-gray-700">
          Выйти
        </button>
      </div>

      <div className="flex gap-10">
        <AccountSidebar />

        <div className="flex-1">
          <h2 className="mb-6 text-xl font-semibold text-gray-900">
            Привет {user?.firstName ?? user?.email?.split('@')[0] ?? 'USERNAME'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input label="Имя:" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="Текущий пароль:" type="password" {...register('currentPassword')} />
              <Input label="Фамилия:" {...register('lastName')} />
              <Input label="Новый пароль:" type="password" {...register('newPassword')} />
              <Input label="Email:" {...register('email')} error={errors.email?.message} />
            </div>

            {isSuccess && (
              <p className="mt-3 text-sm text-green-600">Изменения сохранены</p>
            )}
            {error && (
              <p className="mt-3 text-sm text-red-500">
                {(error as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Ошибка сохранения'}
              </p>
            )}

            <Button type="submit" variant="outline" className="mt-5" loading={isPending}>
              Сохранить изменения
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
