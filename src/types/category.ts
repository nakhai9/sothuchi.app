import { BaseEntity } from "./base";

export type CategoryModel = {
  name: string;
  iconName?: string;
} & BaseEntity;
