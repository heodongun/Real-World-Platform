import type { Metadata } from 'next';

import { SubmissionsClient } from '@/components/submissions/submissions-client';

export const metadata: Metadata = {
  title: '내 제출 · Real-World Coding Platform',
};

export default function SubmissionsPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-sm font-semibold text-indigo-300">SUBMISSIONS</p>
        <h1 className="text-4xl font-semibold text-white">실시간 제출 현황</h1>
        <p className="text-slate-300">
          Redis 큐를 통해 실행 중인 제출부터 완료된 제출까지 모두 확인할 수 있습니다. JWT 토큰으로 인증된
          사용자만 접근할 수 있습니다.
        </p>
      </div>
      <div className="mt-10">
        <SubmissionsClient />
      </div>
    </section>
  );
}
