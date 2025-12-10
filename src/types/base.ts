export type BaseEntity = {
  id?: number | string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

export type ResponseBase<T> = {
  code: number;
  statusCode: number;
  data: T;
  message: string | string[];
};

export type DropdownOption = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};
