import Link from 'next/link';

import { Problem } from '@/lib/types';
import { cn, difficultyBadgeColor, languageColor } from '@/lib/utils';

export const ProblemCard = ({ problem }: { problem: Problem }) => (
  <Link
    href={`/problems/${problem.slug}`}
    className="group flex flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 transition hover:border-indigo-400/60 hover:bg-white/10"
  >
    <div className="flex items-center justify-between">
      <span
        className={cn(
          'rounded-full px-3 py-1 text-xs font-semibold',
          difficultyBadgeColor(problem.difficulty),
        )}
      >
        {problem.difficulty}
      </span>
      <span className={cn('text-sm font-semibold', languageColor(problem.language))}>
        {problem.language}
      </span>
    </div>
    <h3 className="mt-4 text-xl font-semibold text-white">{problem.title}</h3>
    <p className="mt-2 line-clamp-3 text-sm text-slate-300">{problem.description}</p>
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
    <div className="mt-6 flex items-center justify-between text-sm text-slate-300">
      <span>시작하기 →</span>
      <span className="text-slate-500">slug: {problem.slug}</span>
    </div>
  </Link>
);
