import { Tier, Handedness, Audience } from "../../../../generated/prisma";

export interface CarrySetAttributes {
  golfsetname: string;
  description: string;
  tier: Tier;
  handedness: Handedness;
  audience: Audience;
  price: number | string; // arrives as a string from multipart forms
  availability?: boolean ;
  urls?: string[];
}

export interface CarrySetResponseAttributes {
  data: CarrySetAttributes;
}
