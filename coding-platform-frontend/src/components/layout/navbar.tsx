'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/problems', label: '문제' },
  { href: '/dashboard', label: '대시보드' },
  { href: '/submissions', label: '내 제출' },
];

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 px-2 py-1 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40">
            CODE
          </div>
          <span className="text-lg tracking-tight text-white">Real-World Platform</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-100 sm:flex">
          {links.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition hover:text-white',
                  isActive ? 'text-white' : 'text-slate-400',
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-10 w-32 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.role}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/problems')}
                className="hidden text-sm text-white sm:flex"
              >
                문제 풀기
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="text-sm text-slate-900"
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>
                로그인
              </Button>
              <Button size="sm" onClick={() => router.push('/register')}>
                회원가입
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
