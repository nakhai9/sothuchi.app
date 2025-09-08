import { BaseEntity } from './common';

export type CategoryModel = {
  name: string;
  iconName?: string;
} & BaseEntity;
