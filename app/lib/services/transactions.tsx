import { ITransaction } from "../interfaces/transaction";

export const getTransactionsById = (
  creditCardId: string,
  year: number,
  month: number
): Promise<Response> => {
  return fetch(
    `/api/transactions?creditCardId=${creditCardId}&year=${year}&month=${month}`
  );
};

export const postTransaction = (data: ITransaction): Promise<Response> => {
  return fetch("/api/transactions", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
};
