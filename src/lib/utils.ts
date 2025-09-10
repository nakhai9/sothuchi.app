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
        currency: "VND",
      }).format(amount);
    },
  },
};
