type Category = {
  id: number;
  name: string;
  icon: string;
  type: "income" | "expense";
  value: string;
};
export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Drink",
    icon: "https://www.svgrepo.com/show/427614/cafe-coffee-cup-2.svg",
    type: "expense",
    value: "drink",
  },
  {
    id: 2,
    name: "Food",
    icon: "https://www.svgrepo.com/show/184628/fast-food-burger.svg",
    type: "expense",
    value: "food",
  },
  {
    id: 3,
    name: "Wifi & Internet",
    icon: "https://www.svgrepo.com/show/191821/wifi-router.svg",
    type: "expense",
    value: "internet",
  },
  {
    id: 4,
    name: "Entertainment",
    icon: "https://www.svgrepo.com/show/191838/bowling-fun.svg",
    type: "expense",
    value: "entertainment",
  },
  {
    id: 5,
    name: "Beauty",
    icon: "https://www.svgrepo.com/show/191882/hairdresser-comb.svg",
    type: "expense",
    value: "beauty",
  },
  {
    id: 6,
    name: "Fitness & Gym",
    icon: "https://www.svgrepo.com/show/191879/dumbbell-gym.svg",
    type: "expense",
    value: "fitness",
  },
  {
    id: 7,
    name: "Travel",
    icon: "https://www.svgrepo.com/show/191885/map.svg",
    type: "expense",
    value: "travel",
  },
  {
    id: 8,
    name: "Fuel",
    icon: "https://www.svgrepo.com/show/258597/gas-station-fuel.svg",
    type: "expense",
    value: "fuel",
  },
  {
    id: 9,
    name: "Gifts",
    icon: "https://www.svgrepo.com/show/419392/gift-present-valentines.svg",
    type: "expense",
    value: "gifts",
  },
  {
    id: 10,
    name: "Shopping",
    icon: "https://www.svgrepo.com/show/184621/shopping-bag-supermarket.svg",
    type: "expense",
    value: "shopping",
  },
  {
    id: 11,
    name: "Salary",
    icon: "https://www.svgrepo.com/show/293548/transaction-money.svg",
    type: "income",
    value: "salary",
  },
  {
    id: 12,
    name: "Health care",
    icon: "https://www.svgrepo.com/show/186949/pill.svg",
    type: "expense",
    value: "health",
  },
  {
    id: 13,
    name: "Rent & Housing",
    icon: "https://www.svgrepo.com/show/191911/rent.svg",
    type: "expense",
    value: "rent_housing",
  },
  {
    id: 14,
    name: "Repair",
    icon: "https://www.svgrepo.com/show/228375/repair-wrench.svg",
    type: "expense",
    value: "repair",
  },
  {
    id: 16,
    name: "Electronics",
    icon: "https://www.svgrepo.com/show/258576/battery.svg",
    type: "expense",
    value: "electronics",
  },
  {
    id: 17,
    name: "Water",
    icon: "https://www.svgrepo.com/show/190855/water-drop-water.svg",
    type: "expense",
    value: "water",
  },
  {
    id: 19,
    name: "Loan",
    icon: "https://www.svgrepo.com/show/228095/loan.svg",
    type: "expense",
    value: "loan",
  },
  {
    id: 20,
    name: "Debt",
    icon: "https://www.svgrepo.com/show/235127/money.svg",
    type: "income",
    value: "debt",
  },
  {
    id: 21,
    name: "Tips or Donation",
    icon: "https://www.svgrepo.com/show/281132/money-cash.svg",
    type: "income",
    value: "tips_or_donation",
  },
  {
    id: 22,
    name: "Saving",
    icon: "https://www.svgrepo.com/show/301523/piggy-bank.svg",
    type: "income",
    value: "saving",
  },
  {
    id: 23,
    name: "Transfer In",
    icon: "https://www.svgrepo.com/show/293320/transactions-transaction.svg",
    type: "income",
    value: "transfer_in",
  },
  {
    id: 24,
    name: "Transfer Out",
    icon: "https://www.svgrepo.com/show/293318/transactions-transaction.svg",
    type: "expense",
    value: "transfer_out",
  },
  {
    id: 9998,
    name: "Income Default",
    icon: "https://www.svgrepo.com/show/230377/money-bag-money.svg",
    type: "income",
    value: "income_default",
  },
  {
    id: 9999,
    name: "Expense Default",
    icon: "https://www.svgrepo.com/show/382237/help-question-question-mark.svg",
    type: "expense",
    value: "expense_default",
  },
];

export const USER_CURRENCY = "VND";

export const UNKNOWN_CATEGORY_ICON =
  "https://www.svgrepo.com/show/390423/check-faq-help-information-mark-question.svg";

export const AVATAR_PLACEHOLDER =
  "https://cdn-icons-png.flaticon.com/512/906/906265.png";
