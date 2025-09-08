import { CategoryModel } from '@/types/category';
import { ResponseBase } from '@/types/common';

import { httpService } from './httpService';

const baseURL = "api/v1/categories";

export const getCategories = async (): Promise<CategoryModel[] | undefined> => {
  try {
    const { data } = await httpService.get<ResponseBase<CategoryModel[]>>(
      baseURL
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};
