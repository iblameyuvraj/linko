import type { StaticImageData } from "next/image";

export type Integration = {
  name: string;
  description: string;
  icon: string | StaticImageData;
};

export type IntegrationsType = Integration[];
