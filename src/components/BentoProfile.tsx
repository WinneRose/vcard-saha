import type { Profile } from "@/types/profile";
import { buildVCard } from "@/lib/vcard";
import { HeroCard } from "./bento/HeroCard";
import { BioCard } from "./bento/BioCard";
import { ContactCard } from "./bento/ContactCard";
import { SocialCard } from "./bento/SocialCard";
import { QRCard } from "./bento/QRCard";

type Props = {
  profile: Profile;
};

export function BentoProfile({ profile }: Props) {
  const visibleSocials = profile.socials.filter((s) => s.url.trim());
  const qrPayload = buildVCard(profile, { includePhoto: false });

  return (
    <div className="grid auto-rows-[minmax(96px,auto)] grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
      <HeroCard
        fullName={profile.fullName}
        title={profile.title}
        organization={profile.organization}
        photoDataUrl={profile.photoDataUrl}
      />
      <BioCard bio={profile.bio} />
      <ContactCard email={profile.email} phone={profile.phone} address={profile.address} />
      {visibleSocials.map((s) => (
        <SocialCard key={s.platform} link={s} />
      ))}
      <QRCard value={qrPayload} />
    </div>
  );
}
