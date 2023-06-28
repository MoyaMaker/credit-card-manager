import Joi from "joi";

export interface ICreditCard {
  id: string;
  cardName?: string;
  cardNumber: string;
  statementDate: number;
  creditLimit: number;
  balance?: number;
  creditAvailable?: number;
}

export const creditCardSchema = Joi.object<ICreditCard>({
  id: Joi.string(),
  cardName: Joi.string(),
  cardNumber: Joi.string().min(4).required(),
  statementDate: Joi.number().min(1).max(31).required(),
  creditLimit: Joi.number().required(),
});

export const creditCardDatabaseMap: { [K in keyof ICreditCard]: string } = {
  id: "id",
  cardName: "card_name",
  cardNumber: "card_number",
  statementDate: "statement_date",
  creditLimit: "credit_limit",
  balance: "balance",
  creditAvailable: "credit_available",
};
