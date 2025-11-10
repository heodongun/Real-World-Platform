'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError } from '@/lib/config';
import { requestVerificationCode } from '@/lib/api';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const router = useRouter();
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', verificationCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeMessage, setCodeMessage] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        if (!form.verificationCode.trim()) {
          setError('인증 코드를 입력해주세요.');
          setLoading(false);
          return;
        }
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          verificationCode: form.verificationCode,
        });
      } else {
        await login({ email: form.email, password: form.password });
      }
      router.push('/problems');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.payload?.error ?? err.message : '요청에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!form.email.trim()) {
      setCodeMessage('이메일을 먼저 입력해주세요.');
      return;
    }
    setCodeLoading(true);
    setCodeMessage(null);
    try {
      await requestVerificationCode(form.email.trim());
      setCodeMessage('인증 코드가 이메일로 발송되었습니다.');
    } catch (err) {
      const message =
        err instanceof ApiError ? err.payload?.error ?? err.message : '코드 발송에 실패했습니다.';
      setCodeMessage(message);
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl shadow-slate-900/30 backdrop-blur"
    >
      <h1 className="text-3xl font-semibold text-white">
        {isRegister ? '계정을 생성하세요' : '다시 만나서 반가워요'}
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        {isRegister ? '동료와 함께 실무형 문제를 풀어보세요.' : 'JWT 토큰은 자동으로 저장됩니다.'}
      </p>

      <div className="mt-8 space-y-4">
        {isRegister && (
          <div>
            <label className="text-sm text-white/80">이름</label>
            <Input
              name="name"
              placeholder="홍길동"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </div>
        )}
        <div>
          <label className="text-sm text-white/80">이메일</label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </div>
        <div>
          <label className="text-sm text-white/80">비밀번호</label>
          <Input
            type="password"
            name="password"
            placeholder="********"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </div>
        {isRegister && (
          <div>
            <label className="text-sm text-white/80">인증 코드</label>
            <div className="mt-2 flex items-center gap-3">
              <Input
                name="verificationCode"
                placeholder="6자리 코드"
                value={form.verificationCode}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, verificationCode: event.target.value }))
                }
                required
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleSendCode}
                loading={codeLoading}
              >
                코드발송
              </Button>
            </div>
            {codeMessage && (
              <p className="mt-2 text-xs text-slate-300">
                {codeMessage}
              </p>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-500/50 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      )}

      <Button type="submit" className="mt-6 w-full" loading={loading}>
        {isRegister ? '회원가입' : '로그인'}
      </Button>

      <p className="mt-4 text-center text-sm text-slate-400">
        {isRegister ? '이미 계정이 있나요?' : '아직 계정이 없나요?'}{' '}
        <Link href={isRegister ? '/login' : '/register'} className="text-indigo-300">
          {isRegister ? '로그인' : '회원가입'}
        </Link>
      </p>
    </form>
  );
};
