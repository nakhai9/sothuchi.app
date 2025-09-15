export type BaseEntity = {
  id?: number;
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
