export type BaseEntity = {
  id?: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
};

export type ResponseBase<T> = {
  status: boolean;
  data: T;
  message: string;
};
