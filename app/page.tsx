"use client";

import { FormEvent, Fragment, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Months } from "./lib/const";
import { ICreditCard } from "./lib/interfaces/creditCard";
import { ITransaction, transactionTypeMap } from "./lib/interfaces/transaction";
import Button from "./components/button";
import Modal from "./components/modal";
import Dropdown from "./components/dropdown";
import CreditCard from "./components/creditCard";
import { getCreditCards } from "./lib/services/creditCards";
import {
  getTransactionsById,
  postTransaction,
} from "./lib/services/transactions";

export default function Home() {
  const today = new Date();

  const yearsArray = Array.from(
    { length: 30 },
    (_, index) => today.getFullYear() - index
  );

  const [monthModalState, setMonthModalState] = useState(false);
  const [monthIndex, setMonthIndex] = useState(today.getMonth());

  const [fullYearModalState, setFullYearModalState] = useState(false);
  const [fullYear, setFullYear] = useState(today.getFullYear());

  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  const [cards, setCards] = useState<ICreditCard[]>();
  const [transactions, setTransactions] = useState<ITransaction[]>();

  const [cardModalState, setCardModalState] = useState(false);
  const [cardSelected, setCardSelected] = useState<ICreditCard>();

  const [formTransactionModalState, setFormTransactionModalState] =
    useState(false);

  useEffect(() => {
    getCards();
  }, []);

  useEffect(() => {
    if (cards && !cardSelected) {
      setCardSelected(cards[0]);
    }

    if (cardSelected) {
      getTransactions();
    }

    if (!cardSelected && cards?.length == 0) {
      setIsLoadingTransactions(false);
    }
  }, [monthIndex, fullYear, cardSelected, cards]);

  const getCards = async () => {
    try {
      const response = await getCreditCards();

      const jsonData = await response.json();

      setIsLoadingCards(false);

      setCards(jsonData);
    } catch (error) {
      console.error("Error obteniendo tarjetas", error);
    }
  };

  const getTransactions = async () => {
    setIsLoadingTransactions(true);

    const response = await getTransactionsById(
      cardSelected!.id,
      fullYear,
      monthIndex + 1
    );

    const jsonData = await response.json();

    setIsLoadingTransactions(false);

    setTransactions(jsonData);
  };

  const handlePostTransaction = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const data: ITransaction = {
      // @ts-ignore
      creditCardId: cardSelected.id,
      // @ts-ignore
      date: event.target.date.value,
      // @ts-ignore
      concept: event.target.concept.value,
      // @ts-ignore
      amount: event.target.amount.value,
      // @ts-ignore
      transactionType: event.target.transactionType.value,
    };

    const response = await postTransaction(data);

    console.log(response);

    if (response.ok) {
      event.currentTarget.reset();

      setFormTransactionModalState(false);
    }
  };

  return (
    <>
      <section className="flex justify-between">
        <h1 className="font-bold text-2xl leading-6">
          Control de tarjetas de crédito
        </h1>

        <Button
          onClick={() => {
            if (cardSelected) {
              setFormTransactionModalState(true);
            }
          }}
        >
          Nueva transacción
        </Button>
      </section>

      <section className="flex gap-2 my-6">
        {isLoadingCards && (
          <>
            <Button>
              <span className="text-transparent bg-slate-400 animate-pulse rounded-lg">{`**** **** **** ****`}</span>
            </Button>

            <Button>
              <span className="text-transparent bg-slate-400 animate-pulse rounded-lg">
                000000
              </span>
            </Button>
            <Button>
              <span className="text-transparent bg-slate-400 animate-pulse rounded-lg">
                000000
              </span>
            </Button>
          </>
        )}

        {!isLoadingCards && !cardSelected && (
          <Button>No hay tarjetas registradas</Button>
        )}

        {cardSelected && (
          <>
            <Button onClick={() => setCardModalState(true)}>
              {`**** **** **** ${cardSelected.cardNumber}`}
            </Button>

            <Button onClick={() => setFullYearModalState(true)}>
              {fullYear}
            </Button>

            <Button onClick={() => setMonthModalState(true)}>
              {Months[monthIndex]}
            </Button>
          </>
        )}
      </section>

      {/* Tabla de transacciones */}
      <section className="grid gap-4">
        {/* Not transactions */}
        {!isLoadingTransactions && transactions && transactions.length == 0 && (
          <div className="my-8 text-gray-400 text-center">
            No hay registros de transacciones
          </div>
        )}

        {/* Not cards registered */}
        {!isLoadingCards && !cardSelected && cards?.length === 0 && (
          <div className="my-8 text-gray-400 text-center">
            <div>Debes registrar un tarjeta para registrar transacciones</div>
            <Link href="/tarjetas" className="underline my-2 inline-block">
              Ir a tarjetas
            </Link>
          </div>
        )}

        {/* Loading transactions */}
        {isLoadingTransactions && (
          <>
            <div className="grid grid-cols-4 rounded-lg shadow-md p-4 border">
              <span className="w-24 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <span className="w-32 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <span className="w-16 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <div className="flex justify-end">
                <span className="w-16 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              </div>
            </div>
            <div className="grid grid-cols-4 rounded-lg shadow-md p-4 border">
              <span className="w-24 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <span className="w-32 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <span className="w-16 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <div className="flex justify-end">
                <span className="w-16 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              </div>
            </div>
            <div className="grid grid-cols-4 rounded-lg shadow-md p-4 border">
              <span className="w-24 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <span className="w-32 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <span className="w-16 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              <div className="flex justify-end">
                <span className="w-16 h-6 bg-slate-400 animate-pulse rounded-lg"></span>
              </div>
            </div>
          </>
        )}

        {/* Show transactions */}
        {!isLoadingTransactions &&
          transactions &&
          transactions.length > 0 &&
          transactions.map((transaction: ITransaction) => {
            const tDate = new Date(transaction.date);

            return (
              <div
                key={"transaction" + transaction.id}
                className="grid grid-cols-4 items-center rounded-lg shadow-md px-4 border"
              >
                <span>{`${tDate.getDate()} ${
                  Months[tDate.getMonth()]
                } ${tDate.getFullYear()}`}</span>
                <span>{transaction.concept}</span>
                <span>
                  {transaction.amount.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </span>
                <div className="flex justify-end">
                  <Dropdown
                    buttonAppearance="rounded"
                    buttonContent={
                      <Image
                        src="/assets/icons/more_fill.svg"
                        alt="Opciones"
                        width={24}
                        height={24}
                      />
                    }
                    dropdownAlign="right"
                    dropdownContent={
                      <>
                        <Button appearance="flat" className="w-full text-left">
                          Editar
                        </Button>
                        <Button appearance="flat" className="w-full text-left">
                          Eliminar
                        </Button>
                      </>
                    }
                  />
                </div>
              </div>
            );
          })}

        {!isLoadingTransactions && transactions && transactions.length > 0 && (
          <div className="my-8 text-gray-400 text-center">
            Has llegado al final de la lista
          </div>
        )}
      </section>

      <Modal
        isOpen={cardModalState}
        aria-roledescription="Ventana flotante para elegir una tarjeta de crédito"
        onClose={() => setCardModalState(false)}
      >
        <h3 className="font-bold text-xl leading-6">Selecciona una tarjeta</h3>

        <div className="grid md:grid-cols-[repeat(2,18.75rem)] items-center gap-4 my-8">
          {cards &&
            cards.map((card: ICreditCard) => (
              <button
                key={"card" + card.id}
                onClick={() => {
                  setCardSelected(card);
                  setCardModalState(false);
                }}
              >
                <CreditCard key={card.id}>
                  <span className="font-medium text-lg">{card.cardName}</span>
                  <span className="font-bold text-3xl">
                    {card.availableCredit.toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </span>

                  <span className="font-medium text-sm">{`**** **** **** ${card.cardNumber}`}</span>
                </CreditCard>
              </button>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={fullYearModalState}
        dialogClassName="max-w-lg"
        onClose={() => setFullYearModalState(false)}
        aria-roledescription="Ventana flotante para elegir un año"
      >
        <div className="flex justify-center items-center mb-8">
          <h3 className="font-bold text-xl leading-6">Selecciona un año</h3>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {yearsArray.map((year) => (
            <Button
              key={year}
              appearance="flat"
              onClick={() => {
                setFullYear(year);
                setFullYearModalState(false);
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={monthModalState}
        onClose={() => setMonthModalState(false)}
        aria-roledescription="Ventana flotante para elegir un mes"
      >
        <div className="flex flex-col justify-center items-center gap-6">
          <Button
            className="font-medium !text-2xl"
            appearance="flat"
            onClick={() => {
              setMonthModalState(false);

              setFullYearModalState(true);
            }}
          >
            {fullYear}
          </Button>

          <div className="grid grid-cols-3 gap-2">
            {Months.map((month, index) => (
              <Button
                key={month}
                appearance="flat"
                onClick={() => {
                  setMonthIndex(index);
                  setMonthModalState(false);
                }}
              >
                {month}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={formTransactionModalState}
        onClose={() => setFormTransactionModalState(false)}
        aria-roledescription="Ventana flotante para registrar una transacción"
      >
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={handlePostTransaction}
        >
          <div className="col-span-full">
            <h3 className="font-bold text-xl leading-6">Transacción</h3>
          </div>

          <fieldset className="col-span-full flex flex-col gap-2">
            <label className="font-normal text-lg leading-5">
              Tipo de transacción
            </label>

            <div className="flex gap-2">
              {Object.keys(transactionTypeMap).map((transactionType, index) => (
                <Fragment key={"transactionType" + transactionType + index}>
                  <input
                    type="radio"
                    id={transactionType}
                    name="transactionType"
                    value={transactionType}
                    className={`peer/${transactionType}`}
                  />
                  <label
                    htmlFor={transactionType}
                    className="text-lg leading-5"
                  >
                    {/* @ts-ignore */}
                    {transactionTypeMap[transactionType]}
                  </label>
                </Fragment>
              ))}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="concept" className="font-normal text-lg leading-5">
              Concepto
            </label>
            <input
              type="text"
              id="concept"
              name="concept"
              className="border border-black p-2 rounded-lg font-normal text-lg leading-5"
            />
          </fieldset>

          <fieldset className="flex flex-col gap-2 group">
            <label htmlFor="amount" className="font-normal text-lg leading-5">
              Importe
            </label>

            <div className="flex items-center justify-center">
              <span className="font-medium text-lg leading-5 p-2 border border-black rounded-l-lg group-focus-within:ring-1 ring-black">
                $
              </span>
              <input
                type="text"
                name="amount"
                id="amount"
                className="border border-black p-2 rounded-r-lg font-normal text-lg leading-5 focus:outline-none focus:ring-1 ring-black"
                placeholder="0.00"
              />
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-2">
            <label htmlFor="date" className="font-normal text-lg leading-5">
              Fecha
            </label>
            <input
              type="date"
              name="date"
              id="date"
              className="border border-black p-2 rounded-lg font-normal text-lg leading-5"
              defaultValue={`${today.getFullYear()}-${
                today.getMonth() + 1 < 10 ? "0" : ""
              }${today.getMonth() + 1}-${
                today.getDate() < 10 ? "0" : ""
              }${today.getDate()}`}
            />
          </fieldset>

          <div className="col-span-full flex">
            <Button type="submit" className="flex-1 font-bold !text-2xl">
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
