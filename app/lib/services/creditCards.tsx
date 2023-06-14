export const getCreditCards = (): Promise<Response> => {
  return fetch("/api/credit-cards");
};
