import { ArrowLeft, ArrowRight, Loader2, Share2 } from "lucide-react";

type Props = {
  isFirst: boolean;
  isLast: boolean;
  canAdvance: boolean;
  busy?: boolean;
  onBack: () => void;
  onNext: () => void;
};

export function StepActions({ isFirst, isLast, canAdvance, busy, onBack, onNext }: Props) {
  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-xl lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      <div className="mx-auto flex max-w-2xl items-center gap-2 lg:max-w-none">
        <button
          type="button"
          onClick={onBack}
          disabled={isFirst || busy}
          className="inline-flex h-12 items-center gap-1.5 rounded-2xl bg-brand-mist px-4 text-sm font-medium text-brand-navy hover:bg-brand-blue/10 active:scale-[0.98] disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canAdvance || busy}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-red text-base font-semibold text-white shadow-md hover:bg-brand-redDark active:scale-[0.98] disabled:opacity-50"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isLast ? (
            <Share2 className="h-5 w-5" />
          ) : (
            <ArrowRight className="h-5 w-5" />
          )}
          {isLast ? "Profili Yayınla" : "İleri"}
        </button>
      </div>
    </div>
  );
}
