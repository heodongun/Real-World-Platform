export const Footer = () => (
  <footer className="border-t border-white/5 bg-slate-950/60">
    <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} Real-World Coding Platform</p>
      <p className="text-xs text-slate-500">
        Docker 기반 실무 테스트 환경 · PostgreSQL · Redis · Prometheus
      </p>
    </div>
  </footer>
);
