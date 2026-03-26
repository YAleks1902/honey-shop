import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuthStore } from './authStore';
import { useLogin, useRegister, useForgotPassword } from './useAuth';

const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(1, 'Введите пароль'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Пароли не совпадают', path: ['confirmPassword'] });

const forgotSchema = z.object({ email: z.string().email('Некорректный email') });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;
type ForgotData = z.infer<typeof forgotSchema>;

function LoginForm({ onForgot }: { onForgot: () => void }) {
  const { mutate, isPending, error } = useLogin();
  const { closeModal } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginData) => {
    mutate(data, { onSuccess: () => closeModal() });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input label="Email:" {...register('email')} error={errors.email?.message} />
      <Input label="Пароль:" type="password" {...register('password')} error={errors.password?.message} />
      <label className="flex items-center gap-2 text-sm text-gray-500">
        <input type="checkbox" {...register('rememberMe')} className="accent-[#F5A623]" />
        Запомнить меня
      </label>
      {error && <p className="text-sm text-red-500">{(error as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Ошибка входа'}</p>}
      <Button type="submit" loading={isPending} size="lg" className="w-full">
        Войти
      </Button>
      <button type="button" onClick={onForgot} className="text-center text-sm text-[#F5A623] hover:underline">
        Напомнить пароль
      </button>
    </form>
  );
}

function RegisterForm() {
  const { mutate, isPending, error } = useRegister();
  const { setModalTab } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = (data: RegisterData) => {
    mutate(data, { onSuccess: () => setModalTab('success') });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input label="Email:" {...register('email')} error={errors.email?.message} />
      <Input label="Пароль:" type="password" {...register('password')} error={errors.password?.message} />
      <Input label="Повторите пароль:" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} />
      <p className="text-xs text-gray-400 text-center">
        Нажав кнопку регистрации, вы соглашаетесь на обработку данных и{' '}
        <a href="/privacy" className="text-[#F5A623] hover:underline">политику конфиденциальности</a>
      </p>
      {error && <p className="text-sm text-red-500">{(error as { response?: { data?: { error?: string } } }).response?.data?.error ?? 'Ошибка регистрации'}</p>}
      <Button type="submit" loading={isPending} size="lg" className="w-full">
        Зарегистрироваться
      </Button>
    </form>
  );
}

function ForgotForm({ onBack }: { onBack: () => void }) {
  const { mutate, isPending, isSuccess } = useForgotPassword();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotData>({ resolver: zodResolver(forgotSchema) });

  const onSubmit = (data: ForgotData) => mutate(data);

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-6 py-4">
        <p className="text-center text-sm text-gray-500">
          Ссылка на восстановление пароля появится на вашей почте
        </p>
        <Button type="button" onClick={onBack}>Назад</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <h3 className="text-center text-base text-gray-700">Восстановление пароля</h3>
      <Input label="Email:" {...register('email')} error={errors.email?.message} />
      <p className="text-xs text-gray-400 text-center">Ссылка на восстановление пароля появится на вашей почте</p>
      <div className="flex gap-3">
        <Button type="submit" loading={isPending} size="lg" className="flex-1">
          Сбросить пароль
        </Button>
        <Button type="button" variant="outline" size="lg" className="flex-1">
          Выслать повторно
        </Button>
      </div>
    </form>
  );
}

function SuccessView() {
  const { closeModal } = useAuthStore();
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <p className="text-center text-lg text-gray-700">
        Письмо с подтверждением<br />регистрации отправлено на почту.
      </p>
      <Button onClick={closeModal} size="lg">
        Проверить почту
      </Button>
    </div>
  );
}

export default function AuthModal() {
  const { modalOpen, modalTab, closeModal, setModalTab } = useAuthStore();

  return (
    <Modal open={modalOpen} onClose={closeModal} title="Личный кабинет">
      {modalTab === 'forgot' ? (
        <ForgotForm onBack={() => setModalTab('login')} />
      ) : modalTab === 'success' ? (
        <SuccessView />
      ) : (
        <>
          <div className="mb-8 flex justify-center gap-8">
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setModalTab(tab)}
                className={`border-b-2 pb-1 text-sm transition-colors ${
                  modalTab === tab
                    ? 'border-gray-900 text-gray-900 font-medium'
                    : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {tab === 'login' ? 'Вход' : 'Регистрация'}
              </button>
            ))}
          </div>
          {modalTab === 'login' ? (
            <LoginForm onForgot={() => setModalTab('forgot')} />
          ) : (
            <RegisterForm />
          )}
        </>
      )}
    </Modal>
  );
}
