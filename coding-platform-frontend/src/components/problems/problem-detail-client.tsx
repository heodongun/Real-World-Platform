'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CodeEditor } from '@/components/editor/code-editor';
import { ApiError } from '@/lib/config';
import { executeCode, fetchSubmissions, submitSolution } from '@/lib/api';
import { ExecutionResult, Problem, Submission } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';

interface Props {
  problem: Problem;
}

const defaultFileName = (language: Problem['language']) => {
  switch (language) {
    case 'PYTHON':
      return 'main.py';
    case 'JAVA':
      return 'Main.java';
    default:
      return 'Main.kt';
  }
};

const defaultTestCommand = (language: Problem['language']) => {
  switch (language) {
    case 'PYTHON':
      return 'python main.py';
    case 'JAVA':
      return 'javac Main.java && java Main';
    default:
      return 'kotlinc Main.kt -include-runtime -d main.jar && java -jar main.jar';
  }
};

const statusColor = (status: Submission['status']) => {
  switch (status) {
    case 'COMPLETED':
      return 'text-emerald-300';
    case 'FAILED':
      return 'text-rose-300';
    case 'RUNNING':
      return 'text-amber-300';
    default:
      return 'text-slate-300';
  }
};

export const ProblemDetailClient = ({ problem }: Props) => {
  const { token, user } = useAuth();
  const [code, setCode] = useState(problem.starterCode ?? '');
  const [fileName, setFileName] = useState(defaultFileName(problem.language));
  const [testCommand, setTestCommand] = useState(defaultTestCommand(problem.language));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executeError, setExecuteError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!token) return;
    setRefreshing(true);
    try {
      const list = await fetchSubmissions(token);
      setSubmissions(list.filter((submission) => submission.problemId === problem.id));
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  }, [problem.id, token]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const handleSubmit = async () => {
    if (!token) {
      setError('제출하려면 로그인이 필요합니다.');
      return;
    }
    if (!code.trim()) {
      setError('코드 내용을 입력하세요.');
      return;
    }
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      await submitSolution(token, {
        problemId: problem.id,
        files: { [fileName]: code },
      });
      setMessage('코드 평가가 시작되었습니다. 아래 제출 목록에서 상태를 확인하세요.');
      await loadSubmissions();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.payload?.error ?? err.message : '제출 중 오류가 발생했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!token) {
      setExecuteError('즉시 실행하려면 먼저 로그인하세요.');
      return;
    }
    if (!code.trim()) {
      setExecuteError('코드 내용을 입력하세요.');
      return;
    }
    if (!testCommand.trim()) {
      setExecuteError('실행 명령을 입력하세요.');
      return;
    }
    setExecuting(true);
    setExecuteError(null);
    try {
      const response = await executeCode(token, {
        language: problem.language,
        files: { [fileName]: code },
        testCommand,
      });
      setExecutionResult(response.data);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.payload?.error ?? err.message : '실행 중 오류가 발생했습니다.';
      setExecuteError(message);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[32px] border border-white/10 bg-slate-900/40 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-400">로그인한 사용자만 제출할 수 있습니다.</p>
            <p className="text-base text-slate-200">
              {user ? `${user.name} 님, 코드를 작성해 주세요.` : '현재 비회원 상태입니다.'}
            </p>
          </div>
          <Input
            value={fileName}
            onChange={(event) => setFileName(event.target.value)}
            className="bg-white/10 text-sm sm:w-60"
          />
        </div>
        <div className="mt-6">
          <CodeEditor value={code} onChange={setCode} language={problem.language} />
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleSubmit} loading={loading}>
            제출하기
          </Button>
          <Button variant="secondary" onClick={loadSubmissions} disabled={!token || refreshing}>
            {refreshing ? '새로고침 중...' : '제출 새로고침'}
          </Button>
        </div>
        {message && (
          <p className="mt-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </p>
        )}
        {error && (
          <p className="mt-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        )}
      </div>

      <div className="rounded-[32px] border border-white/10 bg-slate-900/40 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">즉시 실행 (Sandbox)</h3>
            <p className="text-sm text-slate-400">
              `/api/execute` 엔드포인트와 연결되어 코드를 바로 실행합니다.
            </p>
          </div>
          <Input
            value={testCommand}
            onChange={(event) => setTestCommand(event.target.value)}
            className="bg-white/10 text-xs sm:w-96"
            placeholder="python main.py"
          />
        </div>
        <div className="mt-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-slate-400">
          언어별 추천 명령 /
          <span className="ml-2 text-slate-200">
            {problem.language === 'PYTHON' && 'python main.py'}
            {problem.language === 'JAVA' && 'javac Main.java && java Main'}
            {problem.language === 'KOTLIN' &&
              'kotlinc Main.kt -include-runtime -d main.jar && java -jar main.jar'}
          </span>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleExecute} loading={executing}>
            즉시 실행
          </Button>
          <Button variant="secondary" onClick={() => setExecutionResult(null)} disabled={!executionResult}>
            결과 초기화
          </Button>
        </div>
        {executeError && (
          <p className="mt-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {executeError}
          </p>
        )}
        {executionResult && (
          <div className="mt-6 space-y-3 rounded-3xl border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs text-slate-500">{executionResult.executionId}</span>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                {executionResult.status}
              </span>
              <span className="text-slate-400">exit {executionResult.exitCode}</span>
              <span className="text-slate-400">
                {executionResult.executionTime}ms · {Math.round(executionResult.memoryUsed / 1024)} KB
              </span>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">stdout</p>
              <pre className="mt-1 max-h-60 overflow-auto rounded-2xl border border-white/10 bg-black/70 p-4 text-xs text-emerald-200">
                {executionResult.output || '(no output)'}
              </pre>
            </div>
            {executionResult.error ? (
              <div>
                <p className="text-xs uppercase text-rose-300">stderr</p>
                <pre className="mt-1 max-h-60 overflow-auto rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-100">
                  {executionResult.error}
                </pre>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">내 제출 기록</h3>
          <p className="text-sm text-slate-400">최신 10건만 표시됩니다.</p>
        </div>
        {token ? (
          submissions.length ? (
            <div className="mt-4 divide-y divide-white/5">
              {submissions.slice(0, 10).map((submission) => (
                <div
                  key={submission.id}
                  className="flex flex-col gap-2 py-4 text-sm text-slate-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-white">{submission.id}</p>
                    <p className="text-xs text-slate-400">{formatDateTime(submission.updatedAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className={statusColor(submission.status)}>{submission.status}</span>
                    <span className="text-slate-400">
                      점수 {submission.score ?? 0}
                      {submission.feedback ? ` / ${submission.feedback.passedTests} 테스트 통과` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">
              아직 제출 기록이 없습니다. starter code를 수정해서 제출해 보세요.
            </p>
          )
        ) : (
          <p className="mt-4 text-sm text-slate-400">로그인 후 제출 기록을 확인할 수 있습니다.</p>
        )}
      </div>
    </div>
  );
};
