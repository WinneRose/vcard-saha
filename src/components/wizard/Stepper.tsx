import clsx from "clsx";
import { Check } from "lucide-react";

type Props = {
  steps: string[];
  current: number;
  onJump?: (index: number) => void;
};

export function Stepper({ steps, current, onJump }: Props) {
  return (
    <ol className="flex items-center gap-2">
      {steps.map((label, idx) => {
        const isActive = idx === current;
        const isDone = idx < current;
        const clickable = onJump && idx <= current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onJump?.(idx)}
              className={clsx(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition",
                isActive
                  ? "bg-brand-red text-white shadow-sm ring-4 ring-brand-red/20"
                  : isDone
                  ? "bg-brand-blue text-white"
                  : "bg-slate-200 text-slate-500",
                clickable && "cursor-pointer",
              )}
              aria-current={isActive ? "step" : undefined}
              aria-label={label}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : idx + 1}
            </button>
            {idx < steps.length - 1 && (
              <div className={clsx("h-0.5 flex-1 rounded-full", idx < current ? "bg-brand-blue" : "bg-slate-200")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
