import { NextResponse } from "next/server";

import pool from "@/app/lib/db";
import {
  CREDIT_CARD_DB_TABLE_NAME,
  TRANSACTIONS_DB_TABLE_NAME,
} from "@/app/lib/const";

/**
 * Get cad balance
 * @route GET /api/balance
 */
export async function GET(request: Request) {
  const client = await pool.connect();

  try {
    const { searchParams } = new URL(request.url);
    const creditCardId = searchParams.get("creditCardId");

    if (!creditCardId) {
      return NextResponse.json(
        {
          error: "Faltó el query param de id de tarjeta de crédito",
        },
        {
          status: 400,
        }
      );
    }

    const query = `SELECT cc.credit_limit, SUM(t.amount) AS balance, cc.credit_limit - SUM(t.amount) AS credit_available 
      FROM ${CREDIT_CARD_DB_TABLE_NAME} cc
      LEFT JOIN ${TRANSACTIONS_DB_TABLE_NAME} t
      ON cc.id = t.credit_card_id
      WHERE cc.id = '${creditCardId}'
      GROUP by cc.id
    `;

    const result = await client.query(query);

    const balance = {
      creditLimit: result.rows[0]["credit_limit"],
      balance: result.rows[0]["balance"],
      creditAvailable: Number(result.rows[0]["credit_available"]),
    };

    return NextResponse.json(balance, {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, s-maxage=1200, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error obteniendo balance:", error);
  } finally {
    client.release();
  }
}
