"use client";

import { useState } from "react";
import type { Profile } from "@/types/profile";
import { CVUpload } from "@/components/CVUpload";
import { PdfViewer } from "@/components/PdfViewer";
import { Accordion } from "@/components/Accordion";
import { TextArea } from "../fields";

type Props = {
  profile: Profile;
  set: <K extends keyof Profile>(key: K, value: Profile[K]) => void;
  onChange: (next: Profile) => void;
};

export function ProfileStep({ profile, set, onChange }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false);
  return (
    <div className="space-y-5">
      <TextArea
        label="Hakkında"
        value={profile.bio}
        onChange={(v) => set("bio", v)}
        placeholder="Kendinizden kısaca bahsedin..."
      />

      <Accordion
        title="CV / Özgeçmiş (PDF)"
        description={profile.cvFileName ? `Yüklü: ${profile.cvFileName}` : "Opsiyonel — max 3 MB"}
        defaultOpen={Boolean(profile.cvFileDataUrl)}
      >
        <CVUpload
          cvFileDataUrl={profile.cvFileDataUrl}
          cvFileName={profile.cvFileName}
          onChange={({ cvFileDataUrl, cvFileName }) => onChange({ ...profile, cvFileDataUrl, cvFileName })}
          onPreview={() => setPreviewOpen(true)}
        />
      </Accordion>

      <PdfViewer
        open={previewOpen}
        src={profile.cvFileDataUrl}
        fileName={profile.cvFileName}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
