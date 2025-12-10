import { format } from 'date-fns';
import {
  upperFirst,
  words,
} from 'lodash';

import { USER_CURRENCY } from './constants/categories';

export const Utils = {
  file: {
    convertFileToBase64: (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve((reader.result as string).split(",")[1] as string);
        reader.onerror = (error) => reject(error);
      });
    },
  },
  share: {},
  currency: {
    format: (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: USER_CURRENCY,
      }).format(amount);
    },
  },
  text: {
    getInitial: (text: string) => {
      const parts = words(text);
      return parts.map((p) => upperFirst(p[0])).join("");
    },
  },
  date: {
    format: (date: Date | null | undefined, formatString?: string) => {
      if (!date) return "N/A";
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "N/A";
      const fs = formatString ? formatString : "dd/MM/yyyy";
      return format(dateObj, fs);
    },
  },
};
