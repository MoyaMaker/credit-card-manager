import { NextResponse } from "next/server";

import pool from "@/app/lib/db";
import {
  type ICreditCard,
  creditCardDatabaseMap,
  creditCardSchema,
} from "../../lib/interfaces/creditCard";

const TABLE_NAME = "credit_cards";

/**
 * Get credit cards
 * @route GET /api/credit-cards
 */
export async function GET() {
  const client = await pool.connect();

  try {
    const query = `SELECT
      ${creditCardDatabaseMap.id},
      ${creditCardDatabaseMap.cardName},
      ${creditCardDatabaseMap.cardNumber},
      ${creditCardDatabaseMap.statementDate},
      ${creditCardDatabaseMap.paymentDueDate},
      ${creditCardDatabaseMap.interestRate},
      ${creditCardDatabaseMap.creditLimit},
      ${creditCardDatabaseMap.balance},
      ${creditCardDatabaseMap.availableCredit}
      FROM ${TABLE_NAME}`;

    const result = await client.query(query);

    const creditCardsList: ICreditCard[] = result.rows.map(
      (row: { [x: string]: any }) => ({
        id: row[creditCardDatabaseMap.id],
        // @ts-ignore
        cardName: row[creditCardDatabaseMap.cardName],
        cardNumber: row[creditCardDatabaseMap.cardNumber],
        statementDate: row[creditCardDatabaseMap.statementDate],
        paymentDueDate: row[creditCardDatabaseMap.paymentDueDate],
        interestRate: row[creditCardDatabaseMap.interestRate],
        creditLimit: row[creditCardDatabaseMap.creditLimit],
        balance: row[creditCardDatabaseMap.balance],
        availableCredit: row[creditCardDatabaseMap.availableCredit],
      })
    );

    return NextResponse.json(creditCardsList, {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error obteniendo tarjetas de crédito:", error);
  } finally {
    client.release();
  }
}

/**
 * Register the new credit card
 * @route POST /api/credit-cards
 * @param {string} id.body.required - Id Credit card
 * @param {string} cardName.body.required - Card name for credit card
 * @param {string} cardNumber.body.required - Card number for credit card
 * @param {number} statementDate.body.required - Date for statement card
 * @param {number} paymentDueDate.body.required - Date for payment due date
 * @param {number} interestRate.body.required - Interest rate for credit card
 * @param {number} creditLimit.body.required - Credit limit for credit card
 * @param {number} balance.body.required - Balance of credit card
 * @param {number} availableCredit.body.required - Available credit of credit card
 */
export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body: ICreditCard = await request.json();

    const bodyValidated = creditCardSchema.validate(body);

    if (bodyValidated.error) {
      console.error(bodyValidated.error);

      return NextResponse.json(
        {
          error: "Datos de tarjeta contienen un error",
          errorMessage: bodyValidated.error.message,
        },
        { status: 400 }
      );
    }

    const query = `INSERT INTO ${TABLE_NAME} 
      (${creditCardDatabaseMap.cardName},
        ${creditCardDatabaseMap.cardNumber},
        ${creditCardDatabaseMap.statementDate},
        ${creditCardDatabaseMap.paymentDueDate},
        ${creditCardDatabaseMap.interestRate},
        ${creditCardDatabaseMap.creditLimit},
        ${creditCardDatabaseMap.balance},
        ${creditCardDatabaseMap.availableCredit}) 
      VALUES 
        ('${body.cardName}',
        '${body.cardNumber}',
        ${body.statementDate},
        ${body.paymentDueDate},
        ${body.interestRate},
        ${body.creditLimit},
        ${body.balance},
        ${body.availableCredit})`;

    const result = await client.query(query);

    return NextResponse.json({ body: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error creando la tarjeta de crédito:", error);
  } finally {
    client.release();
  }
}
