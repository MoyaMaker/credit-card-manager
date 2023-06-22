import Joi from "joi";

export interface ITransaction {
  id?: string;
  concept: string;
  date: string;
  amount: number;
  creditCardId: string;
  transactionType: TransactionType;
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

export const transactionIconMap: Record<TransactionType, string> = {
  purchase: "/assets/icons/arrow_up_fill.svg",
  payment: "/assets/icons/arrow_down_fill.svg",
};

export const transactionSchema = Joi.object<ITransaction>({
  id: Joi.string(),
  concept: Joi.string().required(),
  date: Joi.string().required(),
  amount: Joi.number().required(),
  transactionType: Joi.string()
    .valid("purchase", "payment", "cash_advance")
    .required(),
  creditCardId: Joi.string().required(),
});

export const transactionDatabaseMap: { [K in keyof ITransaction]: string } = {
  id: "id",
  concept: "concept",
  date: "date",
  amount: "amount",
  creditCardId: "credit_card_id",
  transactionType: "transaction_type",
};
