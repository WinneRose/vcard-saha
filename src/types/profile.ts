export type SocialPlatform = "linkedin" | "github" | "twitter" | "website";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type Profile = {
  fullName: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  photoDataUrl: string;
  cvFileDataUrl: string;
  cvFileName: string;
  socials: SocialLink[];
};

export const emptyProfile: Profile = {
  fullName: "",
  title: "",
  organization: "",
  email: "",
  phone: "",
  address: "",
  bio: "",
  photoDataUrl: "",
  cvFileDataUrl: "",
  cvFileName: "",
  socials: [
    { platform: "linkedin", url: "" },
    { platform: "github", url: "" },
    { platform: "twitter", url: "" },
    { platform: "website", url: "" },
  ],
};

export const MAX_CV_BYTES = 3_000_000;
