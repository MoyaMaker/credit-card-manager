import { NextResponse } from "next/server";

import pool from "@/app/lib/db";

/**
 * Get cad balance
 * @route GET /api/balance
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
        {
          status: 400,
        }
      );
    }

    const query = `SELECT cr.card_name, cr.card_number,
      ROUND(CAST(SUM(CASE WHEN t.transaction_type = 'purchase' AND DATE_PART('year', t.date) = ${year} AND DATE_PART('month', t.date) = ${month} THEN t.amount WHEN t.transaction_type = 'payment' AND DATE_PART('year', t.date) = ${year} AND DATE_PART('month', t.date) = ${month} THEN (t.amount * -1) ELSE 0 END) AS numeric), 2) AS balance_month,
      ROUND(CAST(SUM(CASE WHEN t.transaction_type = 'purchase' THEN t.amount WHEN t.transaction_type = 'payment' THEN (t.amount * -1) ELSE 0 END) AS numeric), 2) AS balance_total,
      cr.credit_limit - SUM(CASE WHEN t.transaction_type = 'purchase' THEN t.amount WHEN t.transaction_type = 'payment' THEN (t.amount * -1) ELSE 0 END) AS available_credit
      FROM transactions t
      LEFT JOIN credit_cards cr ON cr.id = t.credit_card_id
      WHERE t.credit_card_id = '${creditCardId}'
      GROUP BY cr.id
    `;

    const result = await client.query(query);

    const balance = {
      cardName: result.rows[0]["card_name"],
      cardNumber: result.rows[0]["card_number"],
      balanceMonth: Number(result.rows[0]["balance_month"]),
      balanceTotal: Number(result.rows[0]["balance_total"]),
      availableCredit: Number(result.rows[0]["available_credit"]),
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
