import type { Metadata } from 'next';

import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: '로그인 · Real-World Coding Platform',
};

export default function LoginPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">WELCOME BACK</p>
        <h1 className="text-4xl font-semibold text-white">다시 문제를 이어서 풀어보세요</h1>
        <p className="text-slate-300">
          로그인하면 이전 제출과 대시보드, 리더보드 기록을 한눈에 확인할 수 있습니다.
        </p>
        <ul className="space-y-3 text-sm text-slate-400">
          <li>• JWT 토큰을 안전하게 저장하고 자동으로 갱신합니다.</li>
          <li>• PostgreSQL + Redis 기반 백엔드와 즉시 연결됩니다.</li>
          <li>• 제출 내역을 실시간으로 추적할 수 있습니다.</li>
        </ul>
      </div>
      <div className="flex-1">
        <AuthForm mode="login" />
      </div>
    </section>
  );
}
