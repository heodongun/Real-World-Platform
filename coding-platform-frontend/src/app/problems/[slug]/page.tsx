import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProblemDetailClient } from '@/components/problems/problem-detail-client';
import { fetchProblem } from '@/lib/api';
import { difficultyBadgeColor, languageColor } from '@/lib/utils';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const problem = await fetchProblem(slug).catch(() => null);
  if (!problem) {
    return { title: '문제를 찾을 수 없습니다.' };
  }
  return {
    title: `${problem.title} · Real-World Coding Platform`,
    description: problem.description.slice(0, 140),
  };
}

export default async function ProblemDetailPage({ params }: Props) {
  const { slug } = await params;
  const problem = await fetchProblem(slug).catch(() => null);
  if (!problem) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent p-8">
        <div className="flex flex-wrap items-center gap-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyBadgeColor(
              problem.difficulty,
            )}`}
          >
            {problem.difficulty}
          </span>
          <span className={`text-sm font-semibold ${languageColor(problem.language)}`}>
            {problem.language}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-white">{problem.title}</h1>
        <p className="mt-2 text-sm text-slate-400">slug / id: {problem.slug}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-sm leading-relaxed text-slate-100">
          <pre className="whitespace-pre-wrap text-sm text-slate-100">{problem.description}</pre>
        </div>
      </div>

      <div className="mt-10">
        <ProblemDetailClient problem={problem} />
      </div>
    </section>
  );
}
