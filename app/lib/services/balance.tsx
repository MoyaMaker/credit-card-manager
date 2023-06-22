export const getBalanceById = (
  creditCardId: string,
  year: number,
  month: number
): Promise<Response> => {
  return fetch(
    `/api/balance?creditCardId=${creditCardId}&year=${year}&month=${month}`
  );
};
