import Joi from "joi";

export interface ITransaction {
  id?: string;
  concept: string;
  date: string;
  amount: number;
  creditCardId: string;
}

export type TransactionType = "purchase" | "payment";

export const transactionTypeMap: Record<TransactionType, string> = {
  purchase: "Compra",
  payment: "Pago",
};

export const transactionTypeMapEnglish: Record<TransactionType, string> = {
  purchase: "purchase",
  payment: "payment",
};

export const transactionSchema = Joi.object<ITransaction>({
  id: Joi.string(),
  concept: Joi.string().required(),
  date: Joi.string().required(),
  amount: Joi.number().required(),
  creditCardId: Joi.string().required(),
});

export const transactionDatabaseMap: { [K in keyof ITransaction]: string } = {
  id: "id",
  concept: "concept",
  date: "date",
  amount: "amount",
  creditCardId: "credit_card_id",
};
