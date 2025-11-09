import type { Metadata } from 'next';

import { ProblemsClient } from '@/components/problems/problems-client';
import { fetchProblems } from '@/lib/api';

export const metadata: Metadata = {
  title: '문제 목록 · Real-World Coding Platform',
};

export default async function ProblemsPage() {
  const problems = await fetchProblems().catch(() => []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold text-indigo-300">PROBLEM SET</p>
        <h1 className="text-4xl font-semibold text-white">실무형 과제 라이브러리</h1>
        <p className="text-slate-300">
          Exposed + PostgreSQL 기반으로 저장된 문제를 불러오며, 관리자 API를 통해 새로운 문제를 바로
          추가할 수 있습니다.
        </p>
      </div>

      <div className="mt-10">
        <ProblemsClient problems={problems} />
      </div>
    </section>
  );
}
