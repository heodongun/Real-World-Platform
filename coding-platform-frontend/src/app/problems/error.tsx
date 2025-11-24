'use client';

import { Button } from '@/components/ui/button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-lg text-slate-300">문제를 불러오는 중 에러가 발생했습니다.</p>
      <Button className="mt-6" size="sm" variant="secondary" onClick={reset}>
        다시 시도
      </Button>
    </div>
  );
}
