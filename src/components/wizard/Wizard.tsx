"use client";

import { useMemo, useState } from "react";
import type { Profile } from "@/types/profile";
import { Stepper } from "./Stepper";
import { StepActions } from "./StepActions";
import { IdentityStep } from "./steps/IdentityStep";
import { ContactStep } from "./steps/ContactStep";
import { ProfileStep } from "./steps/ProfileStep";
import { PublishStep } from "./steps/PublishStep";

type Props = {
  profile: Profile;
  onChange: (next: Profile) => void;
  slugInput: string;
  onSlugInputChange: (v: string) => void;
  onPublish: () => void;
  publishing: boolean;
  publishLabel?: string;
  finalStepLabel?: string;
};

const STEP_LABELS = ["Kim?", "İletişim", "Profil", "Yayınla"];

export function Wizard({
  profile,
  onChange,
  slugInput,
  onSlugInputChange,
  onPublish,
  publishing,
  publishLabel = "Profili Yayınla",
  finalStepLabel = "Yayınla",
}: Props) {
  const [step, setStep] = useState(0);

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    onChange({ ...profile, [key]: value });
  };

  const canAdvance = useMemo(() => {
    if (step === 0) return profile.fullName.trim().length > 0;
    return true;
  }, [step, profile.fullName]);

  const isLast = step === STEP_LABELS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onPublish();
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJump = (i: number) => {
    if (i <= step) setStep(i);
  };

  const labels = useMemo(() => {
    const copy = [...STEP_LABELS];
    copy[copy.length - 1] = finalStepLabel;
    return copy;
  }, [finalStepLabel]);

  return (
    <div className="rounded-3xl bg-white p-5 ring-1 ring-slate-200/80 sm:p-6">
      <Stepper steps={labels} current={step} onJump={handleJump} />

      <div className="mt-5 mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold text-brand-navy sm:text-2xl">{labels[step]}</h2>
        <p className="text-xs text-slate-400">
          {step + 1} / {labels.length}
        </p>
      </div>

      <div className="min-h-[280px] pb-24 lg:pb-4">
        {step === 0 && <IdentityStep profile={profile} set={set} />}
        {step === 1 && <ContactStep profile={profile} set={set} />}
        {step === 2 && <ProfileStep profile={profile} set={set} onChange={onChange} />}
        {step === 3 && (
          <PublishStep profile={profile} set={set} slugInput={slugInput} onSlugInputChange={onSlugInputChange} />
        )}
      </div>

      <div className="mt-4 hidden lg:block">
        <DesktopActions
          isFirst={step === 0}
          isLast={isLast}
          canAdvance={canAdvance}
          busy={publishing}
          onBack={handleBack}
          onNext={handleNext}
          publishLabel={publishLabel}
        />
      </div>

      <div className="lg:hidden">
        <StepActions
          isFirst={step === 0}
          isLast={isLast}
          canAdvance={canAdvance}
          busy={publishing}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

function DesktopActions({
  isFirst,
  isLast,
  canAdvance,
  busy,
  onBack,
  onNext,
  publishLabel,
}: {
  isFirst: boolean;
  isLast: boolean;
  canAdvance: boolean;
  busy: boolean;
  onBack: () => void;
  onNext: () => void;
  publishLabel: string;
}) {
  return (
    <div className="flex items-center gap-2 border-t border-slate-100 pt-4">
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst || busy}
        className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-brand-mist px-4 text-sm font-medium text-brand-navy hover:bg-brand-blue/10 active:scale-[0.98] disabled:opacity-40"
      >
        Geri
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canAdvance || busy}
        className="ml-auto inline-flex h-10 items-center gap-2 rounded-xl bg-brand-red px-5 text-sm font-semibold text-white hover:bg-brand-redDark active:scale-[0.98] disabled:opacity-50"
      >
        {busy ? "..." : isLast ? publishLabel : "İleri"}
      </button>
    </div>
  );
}
