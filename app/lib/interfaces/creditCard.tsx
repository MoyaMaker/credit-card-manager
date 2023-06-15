import Joi from "joi";

export interface ICreditCard {
  id: string;
  cardName?: string;
  cardNumber: string;
  statementDate: number;
  paymentDueDate: number;
  interestRate: number;
  creditLimit: number;
  balance: number;
  availableCredit: number;
}

// TODO: paymentDueDate must has a default value using statementDate | Joi.string().default(defaultValue)
export const creditCardSchema = Joi.object<ICreditCard>({
  id: Joi.string(),
  cardName: Joi.string(),
  cardNumber: Joi.string().min(4).required(),
  statementDate: Joi.number().min(1).max(31).required(),
  paymentDueDate: Joi.number().min(1).max(31).required(),
  interestRate: Joi.number().required(),
  creditLimit: Joi.number().required(),
  balance: Joi.number().required(),
  availableCredit: Joi.number().required(),
});

export const creditCardDatabaseMap: { [K in keyof ICreditCard]: string } = {
  id: "id",
  cardName: "card_name",
  cardNumber: "card_number",
  statementDate: "statement_date",
  paymentDueDate: "payment_due_date",
  interestRate: "interest_rate",
  creditLimit: "credit_limit",
  balance: "balance",
  availableCredit: "available_credit",
};
