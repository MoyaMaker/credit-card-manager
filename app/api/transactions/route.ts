import { NextResponse } from "next/server";

import pool from "@/app/lib/db";
import {
  ITransaction,
  transactionDatabaseMap,
  transactionSchema,
} from "@/app/lib/interfaces/transaction";

const TABLE_NAME = "transactions";

interface GetParams {
  params: { creditCardId: string };
}

/**
 * Get all transactions
 * @route GET /api/transactions
 */
export async function GET(request: Request) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const creditCardId = searchParams.get("creditCardId");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    if (!creditCardId) {
      return NextResponse.json(
        {
          error: "Faltó el query param de id de tarjeta de crédito",
        },
        { status: 400 }
      );
    }

    const query = `SELECT ${transactionDatabaseMap.id}, ${transactionDatabaseMap.creditCardId}, ${transactionDatabaseMap.concept}, ${transactionDatabaseMap.date}, ${transactionDatabaseMap.amount}, ${transactionDatabaseMap.transactionType} 
      FROM ${TABLE_NAME} 
      WHERE ${transactionDatabaseMap.creditCardId} = '${creditCardId}'
      AND DATE_PART('year', date) = ${year}
	    AND DATE_PART('month', date) = ${month}
      ORDER BY date DESC;
    `;

    const result = await client.query(query);

    const transactionsList: ITransaction[] = result.rows.map(
      (row: { [x: string]: any }) => ({
        // @ts-ignore
        id: row[transactionDatabaseMap.id],
        creditCardId: row[transactionDatabaseMap.creditCardId],
        concept: row[transactionDatabaseMap.concept],
        date: row[transactionDatabaseMap.date],
        amount: row[transactionDatabaseMap.amount],
        transactionType: row[transactionDatabaseMap.transactionType],
      })
    );

    return NextResponse.json(transactionsList, {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error obteniendo transacciones:", error);
  } finally {
    client.release();
  }
}

/**
 * Register the new transactions
 * @route POST /api/transactions
 * @param {string} id.body.required - Id transaction
 * @param {string} creditCardId.body.required - Credit card parent for the transaction
 * @param {string} date.body.required - Date of transaction, format must be ISO string
 * @param {string} concept.body.required - Concept for transaction
 * @param {number} amount.body.required - Transaction amount
 * @param {TransactionType} transactionType.body.required - Transaction type: "purchase" | "payment" | "cash_advance"
 * @returns {Object} 200 - Transaction created successfully
 * @returns {Error} 400 - Bad request, missing body or some field of Transaction
 * @return {Error} 500 - Internal Error Server
 * TODO: Error for authorization
 */
export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body: ITransaction = await request.json();

    const bodyValidated = transactionSchema.validate(body);

    if (bodyValidated.error) {
      return NextResponse.json(
        {
          error: "Datos de transacción contienen un error",
          errorMessage: bodyValidated.error.message,
        },
        { status: 400 }
      );
    }

    const query = `INSERT INTO ${TABLE_NAME} (
      ${transactionDatabaseMap.creditCardId},
      ${transactionDatabaseMap.concept},
      ${transactionDatabaseMap.amount},
      ${transactionDatabaseMap.date},
      ${transactionDatabaseMap.transactionType}
    ) VALUES ('${body.creditCardId}', '${body.concept}', ${body.amount}, '${body.date}', '${body.transactionType}')`;

    const result = await client.query(query);

    return NextResponse.json({ body: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Error en el endpoint de '/api/transaction':", error);

    return NextResponse.json(
      { error: `Ha ocurrido un error inesperado: ${error}` },
      { status: 500 }
    );
  }
}
