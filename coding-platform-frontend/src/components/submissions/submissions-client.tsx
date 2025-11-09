'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { fetchSubmissions } from '@/lib/api';
import { Submission } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

export const SubmissionsClient = () => {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    setError(null);
    try {
      const data = await fetchSubmissions(token);
      setSubmissions(data);
    } catch (err) {
      setError('제출 목록을 불러오지 못했습니다.');
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  if (!token) {
    return (
      <div className="rounded-3xl border border-dashed border-white/20 p-10 text-center text-slate-300">
        제출을 보려면 먼저 로그인하세요.
      </div>
    );
  }

  return (
    <div className="rounded-[36px] border border-white/10 bg-slate-950/50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">내 제출 기록</h2>
          <p className="text-sm text-slate-400">Ktor 백엔드에서 가져온 최신 상태</p>
        </div>
        <Button variant="secondary" onClick={load} disabled={!token || refreshing}>
          {refreshing ? '새로고침 중...' : '새로고침'}
        </Button>
      </div>
      {error && (
        <p className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      )}
      <div className="mt-6 overflow-x-auto rounded-3xl border border-white/5">
        <table className="min-w-full text-left text-sm text-slate-200">
          <thead className="bg-white/5 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-4 py-3">제출 ID</th>
              <th className="px-4 py-3">문제 ID</th>
              <th className="px-4 py-3">상태</th>
              <th className="px-4 py-3">점수</th>
              <th className="px-4 py-3">업데이트</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-mono text-xs text-indigo-200">{submission.id}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{submission.problemId}</td>
                <td className="px-4 py-3 text-xs text-white">{submission.status}</td>
                <td className="px-4 py-3">{submission.score}</td>
                <td className="px-4 py-3 text-slate-400">{formatDateTime(submission.updatedAt)}</td>
              </tr>
            ))}
            {!submissions.length && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  제출 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
