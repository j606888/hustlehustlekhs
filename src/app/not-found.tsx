import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="text-2xl font-bold text-ink-900">找不到這個頁面</h1>
      <p className="text-ink-500 max-w-sm">
        你要找的頁面不存在，可能已被移除或連結有誤。
      </p>
      <Button asChild size="lg">
        <Link href="/">回到首頁</Link>
      </Button>
    </div>
  );
}
