export const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

export const difficultyBadgeColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'HARD':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    default:
      return 'bg-amber-100 text-amber-700 border border-amber-200';
  }
};

export const languageColor = (language: string) => {
  switch (language) {
    case 'PYTHON':
      return 'text-sky-600';
    case 'JAVA':
      return 'text-rose-600';
    default:
      return 'text-indigo-600';
  }
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};
