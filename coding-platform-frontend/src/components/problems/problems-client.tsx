'use client';

import { useMemo, useState } from 'react';
import { Problem } from '@/lib/types';
import { ProblemCard } from '@/components/problems/problem-card';

interface Props {
  problems: Problem[];
}

const difficultyFilters = ['ALL', 'EASY', 'MEDIUM', 'HARD'] as const;
const languageFilters = ['ALL', 'KOTLIN', 'JAVA', 'PYTHON'] as const;

export const ProblemsClient = ({ problems }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [difficulty, setDifficulty] = useState<(typeof difficultyFilters)[number]>('ALL');
  const [language, setLanguage] = useState<(typeof languageFilters)[number]>('ALL');

  const filtered = useMemo(() => {
    return problems.filter((problem) => {
      const matchesKeyword =
        !keyword ||
        problem.title.toLowerCase().includes(keyword.toLowerCase()) ||
        problem.description.toLowerCase().includes(keyword.toLowerCase());
      const matchesDifficulty = difficulty === 'ALL' || problem.difficulty === difficulty;
      const matchesLanguage = language === 'ALL' || problem.language === language;
      return matchesKeyword && matchesDifficulty && matchesLanguage;
    });
  }, [difficulty, keyword, language, problems]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <input
          placeholder="문제 검색 (제목, 설명)"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none"
        />
        <select
          value={difficulty}
          onChange={(event) =>
            setDifficulty(event.target.value as (typeof difficultyFilters)[number])
          }
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-indigo-300 focus:outline-none"
        >
          {difficultyFilters.map((d) => (
            <option key={d} value={d} className="bg-slate-900 text-white">
              {d === 'ALL' ? '모든 난이도' : d}
            </option>
          ))}
        </select>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value as (typeof languageFilters)[number])}
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-indigo-300 focus:outline-none"
        >
          {languageFilters.map((l) => (
            <option key={l} value={l} className="bg-slate-900 text-white">
              {l === 'ALL' ? '모든 언어' : l}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        총 {filtered.length}개의 문제가 조건에 맞습니다.
      </p>

      {filtered.length ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {filtered.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-3xl border border-dashed border-white/20 p-10 text-center text-slate-400">
          조건에 맞는 문제가 없습니다. 필터를 조정하거나 새로운 문제를 등록하세요.
        </div>
      )}
    </div>
  );
};
