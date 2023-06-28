import { NextResponse } from "next/server";

import pool from "@/app/lib/db";
import {
  type ICreditCard,
  creditCardDatabaseMap,
  creditCardSchema,
} from "../../lib/interfaces/creditCard";
import {
  CREDIT_CARD_DB_TABLE_NAME,
  TRANSACTIONS_DB_TABLE_NAME,
} from "@/app/lib/const";

/**
 * Get credit cards
 * @route GET /api/credit-cards
 */
export async function GET() {
  const client = await pool.connect();

  try {
    const query = `SELECT
      cc.${creditCardDatabaseMap.id},
      cc.${creditCardDatabaseMap.cardName},
      cc.${creditCardDatabaseMap.cardNumber},
      cc.${creditCardDatabaseMap.statementDate},
      cc.${creditCardDatabaseMap.creditLimit},
      SUM(CASE WHEN t.amount IS NOT NULL THEN t.amount ELSE 0 END) AS ${creditCardDatabaseMap.balance},
      cc.credit_limit - SUM(CASE WHEN t.amount IS NOT NULL THEN t.amount ELSE 0 END) AS ${creditCardDatabaseMap.creditAvailable}
      FROM ${CREDIT_CARD_DB_TABLE_NAME} cc
      LEFT JOIN ${TRANSACTIONS_DB_TABLE_NAME} t
      ON cc.id = t.credit_card_id
      GROUP BY cc.id
    `;

    const result = await client.query(query);

    const creditCardsList: ICreditCard[] = result.rows.map(
      (row: { [x: string]: any }) => ({
        id: row[creditCardDatabaseMap.id],
        // @ts-ignore
        cardName: row[creditCardDatabaseMap.cardName],
        cardNumber: row[creditCardDatabaseMap.cardNumber],
        statementDate: row[creditCardDatabaseMap.statementDate],
        creditLimit: row[creditCardDatabaseMap.creditLimit],
        balance: row[creditCardDatabaseMap.balance!],
        creditAvailable: row[creditCardDatabaseMap.creditAvailable!],
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
 * @param {number} creditLimit.body.required - Credit limit for credit card
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

    const query = `INSERT INTO ${CREDIT_CARD_DB_TABLE_NAME} 
      (${creditCardDatabaseMap.cardName},
        ${creditCardDatabaseMap.cardNumber},
        ${creditCardDatabaseMap.statementDate},
        ${creditCardDatabaseMap.creditLimit}) 
      VALUES 
        ('${body.cardName}',
        '${body.cardNumber}',
        ${body.statementDate},
        ${body.creditLimit})`;

    const result = await client.query(query);

    return NextResponse.json({ body: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error creando la tarjeta de crédito:", error);
  } finally {
    client.release();
  }
}
