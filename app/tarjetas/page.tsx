"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { ICreditCard } from "../lib/interfaces/creditCard";
import Button from "../components/button";
import CreditCard from "../components/creditCard";
import { getCreditCards } from "../lib/services/creditCards";

export default function Tarjetas() {
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [cards, setCards] = useState<ICreditCard[]>();

  useEffect(() => {
    getCards();
  }, []);

  const getCards = async () => {
    try {
      setIsLoadingCards(true);

      const response = await getCreditCards();

      const jsonData = await response.json();

      setIsLoadingCards(false);

      setCards(jsonData);
    } catch (error) {
      console.error("Error obteniendo tarjetas", error);
    }
  };

  return (
    <>
      <section className="flex justify-between">
        <h1 className="font-bold text-2xl leading-6">Tarjetas</h1>

        <Button>Nueva tarjeta</Button>
      </section>

      {/* Cards grid */}
      <section className="my-8 grid md:grid-cols-[repeat(3,18.75rem)] items-center gap-4 max-w-max mx-auto">
        {!isLoadingCards && cards?.length === 0 && (
          <article className="my-8 text-gray-400 text-center col-span-full">
            No hay tarjetas registradas
          </article>
        )}

        {isLoadingCards && (
          <>
            <CreditCard isLoading={true} />
            <CreditCard isLoading={true} />
            <CreditCard isLoading={true} />
            <CreditCard isLoading={true} />
            <CreditCard isLoading={true} />
            <CreditCard isLoading={true} />
          </>
        )}

        {!isLoadingCards &&
          cards &&
          cards.map((card: ICreditCard) => (
            <CreditCard key={card.id}>
              <section className="flex justify-between w-full">
                <span className="font-medium text-lg">{card.cardName}</span>

                <Button appearance="rounded">
                  <Image
                    src="/assets/icons/more_fill.svg"
                    alt="Opciones"
                    width={24}
                    height={24}
                  />
                </Button>
              </section>
              <span className="font-bold text-3xl">
                {card.creditAvailable!.toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })}
              </span>

              <span className="font-medium text-sm">{`**** **** **** ${card.cardNumber}`}</span>
            </CreditCard>
          ))}
      </section>
    </>
  );
}
