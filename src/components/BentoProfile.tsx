import type { Profile } from "@/types/profile";
import { buildVCard } from "@/lib/vcard";
import { HeroCard } from "./bento/HeroCard";
import { BioCard } from "./bento/BioCard";
import { ContactCard } from "./bento/ContactCard";
import { SocialCard } from "./bento/SocialCard";
import { QRCard } from "./bento/QRCard";
import { CVCard } from "./bento/CVCard";

type Props = {
  profile: Profile;
  profileUrl?: string;
};

export function BentoProfile({ profile, profileUrl }: Props) {
  const visibleSocials = profile.socials.filter((s) => s.url.trim());
  const qrPayload = profileUrl || buildVCard(profile, { includePhoto: false });

  return (
    <div className="grid auto-rows-[minmax(120px,auto)] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-6">
      <HeroCard
        className="col-span-2 row-span-2 md:col-span-4"
        fullName={profile.fullName}
        title={profile.title}
        organization={profile.organization}
        photoDataUrl={profile.photoDataUrl}
      />
      <ContactCard
        className="col-span-2 md:col-span-2 md:row-span-2"
        email={profile.email}
        phone={profile.phone}
        address={profile.address}
      />
      <BioCard className="col-span-2 md:col-span-3" bio={profile.bio} />
      <CVCard
        className="col-span-2 md:col-span-3"
        cvFileDataUrl={profile.cvFileDataUrl}
        cvFileName={profile.cvFileName}
      />
      {visibleSocials.map((s) => (
        <SocialCard key={s.platform} className="col-span-2 md:col-span-2" link={s} />
      ))}
      <QRCard className="col-span-2 md:col-span-3" value={qrPayload} isUrl={Boolean(profileUrl)} url={profileUrl} />
    </div>
  );
}
