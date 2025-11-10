import Link from 'next/link';

import { ProblemCard } from '@/components/problems/problem-card';
import { fetchDashboardStats, fetchHealth, fetchLeaderboard, fetchProblems } from '@/lib/api';

const quickLinks = [
  { label: '문제집', href: '/problems' },
  { label: '대시보드', href: '/dashboard' },
  { label: '제출 현황', href: '/submissions' },
];

export default async function HomePage() {
  const [problems, stats, leaderboard, health] = await Promise.all([
    fetchProblems().catch(() => []),
    fetchDashboardStats().catch(() => null),
    fetchLeaderboard().catch(() => []),
    fetchHealth().catch(() => ({ status: 'UNKNOWN' })),
  ]);

  const featuredProblems = problems.slice(0, 4);
  const topPlayers = leaderboard.slice(0, 5);

  const statCards = [
    { label: '등록 문제', value: stats ? stats.totalProblems.toLocaleString() : '--' },
    { label: '누적 제출', value: stats ? stats.totalSubmissions.toLocaleString() : '--' },
    {
      label: '평균 통과율',
      value: stats ? `${Math.round(stats.successRate * 100)}%` : '--',
    },
    { label: '활성 사용자', value: stats ? stats.totalUsers.toLocaleString() : '--' },
  ];

  return (
    <div className="bg-transparent">
      <section className="border-b border-white/5 bg-slate-950/30">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-300">ONLINE JUDGE</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                실무형 문제를 빠르게 검증하는
                <br />
                정돈된 코딩 플랫폼
              </h1>
              <p className="mt-4 text-base text-slate-300">
                구름, 백준처럼 익숙한 인터페이스에 Docker 기반 실행 엔진을 얹었습니다. 바로 로그인해 문제
                풀고, 제출하고, 결과를 확인하세요.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/register"
                className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110"
              >
                회원가입
              </Link>
              <Link
                href="/problems"
                className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/50"
              >
                문제 바로가기
              </Link>
              <Link
                href="/dashboard"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80"
              >
                운영 현황 보기
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-slate-950/60 px-5 py-4 text-white"
                >
                  <p className="text-xs uppercase tracking-wide text-slate-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-[32px] border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">서비스 상태</p>
                <p className="text-xs text-slate-400">/health · /api/dashboard · /api/leaderboard</p>
              </div>
              <span
                className={`text-sm font-semibold ${
                  health?.status === 'OK' ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {health?.status ?? 'UNKNOWN'}
              </span>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 text-sm text-slate-200">
              Docker compose로 기동한 백엔드와 바로 연결되어 있습니다. 장애 발생 시 이 영역이 즉시 알려줍니다.
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">빠른 이동</p>
              <div className="mt-3 grid gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between rounded-2xl border border-white/5 px-4 py-3 text-sm text-slate-200 hover:border-indigo-400"
                  >
                    {link.label}
                    <span className="text-xs text-slate-500">↗</span>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">상위 사용자</p>
              <div className="mt-3 space-y-2">
                {topPlayers.length ? (
                  topPlayers.map((player, index) => (
                    <div
                      key={player.userId}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-sm"
                    >
                      <div>
                        <p className="font-semibold text-white">
                          #{index + 1} {player.name}
                        </p>
                        <p className="text-xs text-slate-500">{player.userId}</p>
                      </div>
                      <p className="text-base font-semibold text-indigo-300">{player.score}</p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-center text-xs text-slate-400">
                    아직 리더보드 데이터가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            <div className="flex-1 space-y-3">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">운영 중인 기능</p>
              <h2 className="text-3xl font-semibold text-white">실제 서비스 흐름 그대로</h2>
              <p className="text-sm text-slate-300">
                회원가입 → 로그인 → 문제 탐색 → 제출 → 채점 → 리더보드 업데이트까지 모든 과정을 한 곳에서
                제공합니다. DB는 PostgreSQL, 캐시는 Redis, 채점은 Docker 실행기로 동작합니다.
              </p>
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              {[
                { title: '문제집', body: '프로덕션 이슈 기반 실무형 문제와 테스트 코드 제공' },
                { title: '코드 실행', body: '언어별 컨테이너에서 격리 실행, 로그/결과 즉시 수집' },
                { title: '대시보드', body: 'Prometheus 지표를 요약해 가시적으로 표출' },
                { title: '리더보드', body: '사용자별 누적 점수/성공률 집계' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">PROBLEM SET</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">오늘의 추천 문제</h2>
            </div>
            <Link href="/problems" className="text-sm text-indigo-300">
              전체 보기 →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {featuredProblems.length ? (
              featuredProblems.map((problem) => <ProblemCard key={problem.id} problem={problem} />)
            ) : (
              <div className="rounded-3xl border border-dashed border-white/15 p-10 text-center text-slate-400">
                등록된 문제가 없습니다. 관리자 계정으로 문제를 먼저 추가해 주세요.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
