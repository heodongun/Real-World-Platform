import type { Metadata } from 'next';

import { AuthForm } from '@/components/auth/auth-form';

export const metadata: Metadata = {
  title: '회원가입 · Real-World Coding Platform',
};

export default function RegisterPage() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center">
      <div className="flex-1 space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">GET STARTED</p>
        <h1 className="text-4xl font-semibold text-white">실무형 과제를 지금 시작하세요</h1>
        <p className="text-slate-300">
          회원가입 후에는 장바구니 서비스와 같은 실제 비즈니스 로직 문제를 풀고 Docker 기반 테스트
          결과를 즉시 받아볼 수 있습니다.
        </p>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          • 관리자(`admin@example.com / AdminPass123!`) 계정으로 로그인하면 새 문제를 API로 등록할 수
          있습니다.
          <br />• 일반 사용자로는 제출, 실행, 대시보드 조회 기능이 제공됩니다.
        </div>
      </div>
      <div className="flex-1">
        <AuthForm mode="register" />
      </div>
    </section>
  );
}
