import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/features/auth/authStore';
import { useProfile, useUpdateAddress } from '@/features/auth/useAuth';
import AccountSidebar from '@/components/layout/AccountSidebar';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/constants';

type FormData = {
  country: string;
  city: string;
  address: string;
  phone: string;
  courierComment: string;
};

export default function AddressPage() {
  const { user, isLoggedIn } = useAuthStore();
  const { data: profile } = useProfile(isLoggedIn);
  const { mutate, isPending, isSuccess } = useUpdateAddress();

  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    if (profile) {
      reset({
        country: profile.country ?? '',
        city: profile.city ?? '',
        address: profile.address ?? '',
        phone: profile.phone ?? '',
        courierComment: profile.courierComment ?? '',
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
          <h2 className="mb-1 text-sm text-gray-500">
            Контактные данные для быстрого оформления заказа.
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Input label="Страна:" {...register('country')} />
              <Input label="Телефон:" {...register('phone')} />
              <Input label="Город:" {...register('city')} />
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-700">Комментарий для курьера:</label>
                <textarea
                  {...register('courierComment')}
                  rows={4}
                  className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#F5A623] focus:outline-none resize-none"
                  placeholder="Пожалуйста, доставка до 13:00."
                />
              </div>
              <Input label="Адрес:" {...register('address')} />
            </div>

            {isSuccess && (
              <p className="mt-3 text-sm text-green-600">Адрес сохранён</p>
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
