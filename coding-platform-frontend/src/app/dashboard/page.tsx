import type { Metadata } from 'next';

import { fetchDashboardStats, fetchHealth, fetchLeaderboard } from '@/lib/api';
import { DashboardStats } from '@/lib/types';

export const metadata: Metadata = {
  title: '대시보드 · Real-World Coding Platform',
};

const statLabelMap: Array<{ key: keyof DashboardStats; label: string }> = [
  { key: 'totalUsers', label: '전체 사용자' },
  { key: 'totalProblems', label: '문제 수' },
  { key: 'totalSubmissions', label: '제출 수' },
  { key: 'successRate', label: '테스트 통과율' },
];

export default async function DashboardPage() {
  const [stats, leaderboard, health] = await Promise.all([
    fetchDashboardStats().catch(() => null),
    fetchLeaderboard().catch(() => []),
    fetchHealth().catch(() => ({ status: 'UNREACHABLE' })),
  ]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
          PLATFORM METRICS
        </p>
        <h1 className="text-4xl font-semibold text-white">운영 현황 대시보드</h1>
        <p className="text-slate-300">
          백엔드 `/api/dashboard/stats`, `/api/leaderboard`, `/health` 엔드포인트를 직접 호출해 표시합니다.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statLabelMap.map(({ key, label }) => {
          const value = stats ? stats[key] : null;
          const display =
            typeof value === 'number'
              ? key === 'successRate'
                ? `${Math.round((value as number) * 100)}%`
                : value.toLocaleString()
              : '--';
          return (
            <div
              key={key}
              className="rounded-3xl border border-white/10 bg-slate-900/50 p-6 shadow-lg shadow-indigo-950/20"
            >
              <p className="text-sm text-slate-400">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{display}</p>
              <p className="mt-2 text-xs text-slate-500">실시간 API 데이터</p>
            </div>
          );
        })}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">리더보드</h2>
            <p className="text-sm text-slate-400">상위 10명</p>
          </div>
          <div className="mt-6 space-y-3">
            {leaderboard.length ? (
              leaderboard.slice(0, 10).map((entry, index) => (
                <div
                  key={entry.userId}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-3 text-sm text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-white">{entry.name}</p>
                      <p className="text-xs text-slate-500">{entry.userId}</p>
                    </div>
                  </div>
                  <span className="text-lg font-semibold text-indigo-300">{entry.score}</span>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-sm text-slate-400">
                리더보드 데이터가 없습니다. 먼저 문제를 등록하고 제출을 완료하세요.
              </p>
            )}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-6">
          <p className="text-sm font-semibold text-indigo-300">API HEALTH</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">{health.status}</h3>
          <p className="mt-2 text-sm text-slate-400">/health 엔드포인트 응답</p>
          <div className="mt-6 text-xs text-slate-500">
            마지막 확인: <span className="text-slate-300">실시간 동기화</span>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
            성공적인 연결 여부를 한눈에 보여주며, 문제가 있으면 백엔드 컨테이너 상태를 점검해야 합니다.
          </div>
        </div>
      </div>
    </section>
  );
}
