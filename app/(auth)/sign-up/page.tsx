import Link from 'next/link';
import RegisterForm from '@/app/(auth)/sign-up/_components/register-form';

export default function Page() {
  return (
    <div className="p-4 space-y-5">
      <RegisterForm />
      <div className="flex items-center justify-center mt-2 gap-x-2">
        <p className="text-gray-500">
          이미 길라와 연결되셨다면?{' '}
          <Link href="/sign-in" className="font-semibold underline text-primary">
            로그인하기
          </Link>
        </p>
      </div>
    </div>
  );
}
