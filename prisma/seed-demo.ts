import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import type { TimeRateDuration } from "../src/generated/prisma/client";

async function getProduct(name: string) {
  const product = await prisma.product.findUniqueOrThrow({ where: { name } });
  return product;
}

async function createOrderForCustomer(params: {
  name: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  items: { productName: string; quantity: number }[];
  orderStatus: "PENDING_PAYMENT" | "CONFIRMED" | "COMPLETED";
}) {
  const customer = await prisma.customer.upsert({
    where: { phone: params.phone },
    update: { name: params.name, email: params.email },
    create: { name: params.name, phone: params.phone, email: params.email },
  });

  const products = await Promise.all(
    params.items.map(async (item) => ({ ...item, product: await getProduct(item.productName) }))
  );

  const subtotalCents = products.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: params.orderStatus,
      fulfillmentTypes: ["DELIVERY"],
      deliveryAddress: params.deliveryAddress,
      subtotalCents,
      discountCents: 0,
      totalCents: subtotalCents,
      amountPaidCents: params.orderStatus === "PENDING_PAYMENT" ? 0 : subtotalCents,
      amountDueCents: params.orderStatus === "PENDING_PAYMENT" ? subtotalCents : 0,
      lineItems: {
        create: products.map((item) => ({
          lineType: "PRODUCT",
          productId: item.product.id,
          quantity: item.quantity,
          unitPriceCents: item.product.priceCents,
        })),
      },
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      kind: "FULL",
      amountCents: subtotalCents,
      status: params.orderStatus === "PENDING_PAYMENT" ? "PENDING" : "APPROVED",
      wompiReference: `demo_${order.id}_${Date.now()}`,
      wompiTransactionId: params.orderStatus === "PENDING_PAYMENT" ? null : `demo_txn_${order.id}`,
    },
  });

  return order;
}

async function createReservation(params: {
  name: string;
  phone: string;
  email: string;
  daysFromNow: number;
  hour: number;
  duration: TimeRateDuration;
  children: number;
  extraAdults: number;
  reservationStatus: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "COMPLETED";
}) {
  const customer = await prisma.customer.upsert({
    where: { phone: params.phone },
    update: { name: params.name, email: params.email },
    create: { name: params.name, phone: params.phone, email: params.email },
  });

  const timeRate = await prisma.timeRate.findUniqueOrThrow({ where: { duration: params.duration } });
  const durationMinutes = { MIN_30: 30, HOUR_1: 60, HOUR_2: 120, UNLIMITED: 240 }[params.duration];

  const startsAt = new Date();
  startsAt.setDate(startsAt.getDate() + params.daysFromNow);
  startsAt.setHours(params.hour, 0, 0, 0);
  const endsAt = new Date(startsAt.getTime() + durationMinutes * 60_000);

  const unitPriceCents = params.children * timeRate.priceCents + params.extraAdults * timeRate.extraAdultCents;

  const order = await prisma.order.create({
    data: {
      customerId: customer.id,
      status: "CONFIRMED",
      fulfillmentTypes: ["PARK_VISIT"],
      subtotalCents: unitPriceCents,
      totalCents: unitPriceCents,
      amountPaidCents: unitPriceCents,
      amountDueCents: 0,
    },
  });

  const reservation = await prisma.reservation.create({
    data: {
      orderId: order.id,
      customerId: customer.id,
      reservationType: "STANDARD",
      status: params.reservationStatus,
      startsAt,
      endsAt,
      partySize: params.children + params.extraAdults + 2,
    },
  });

  await prisma.orderLineItem.create({
    data: {
      orderId: order.id,
      lineType: "PARK_VISIT_SLOT",
      timeRateId: timeRate.id,
      reservationId: reservation.id,
      quantity: 1,
      unitPriceCents,
      childrenCount: params.children,
      extraAdultsCount: params.extraAdults,
    },
  });

  await prisma.payment.create({
    data: {
      orderId: order.id,
      kind: "FULL",
      amountCents: unitPriceCents,
      status: "APPROVED",
      wompiReference: `demo_${order.id}_${Date.now()}`,
      wompiTransactionId: `demo_txn_${order.id}`,
    },
  });

  return reservation;
}

async function main() {
  // --- 3 pedidos de domicilio de ejemplo ---
  await createOrderForCustomer({
    name: "María Fernanda Ruiz",
    phone: "3001112233",
    email: "maria.ruiz@example.com",
    deliveryAddress: "Calle 45 #12-34, Barrio Laureles, Medellín",
    items: [
      { productName: "Pizza pepperoni", quantity: 2 },
      { productName: "Coca Cola original", quantity: 1 },
    ],
    orderStatus: "CONFIRMED",
  });

  await createOrderForCustomer({
    name: "Carlos Andrés Gómez",
    phone: "3009998877",
    email: "carlos.gomez@example.com",
    deliveryAddress: "Carrera 10 #5-67, Envigado",
    items: [
      { productName: "Empanaditas x8 unidades", quantity: 1 },
      { productName: "Cerveza Corona", quantity: 2 },
      { productName: "Helado fiestero", quantity: 1 },
    ],
    orderStatus: "PENDING_PAYMENT",
  });

  await createOrderForCustomer({
    name: "Laura Patricia Mejía",
    phone: "3012223344",
    email: "laura.mejia@example.com",
    deliveryAddress: "Calle 33 #8-21, Sabaneta",
    items: [
      { productName: "Papas con cheddar y tocineta", quantity: 1 },
      { productName: "Nuggets con papitas", quantity: 1 },
      { productName: "Soda Bretaña", quantity: 2 },
    ],
    orderStatus: "COMPLETED",
  });

  // --- 3 reservas de visita al parque de ejemplo ---
  await createReservation({
    name: "Juan Pablo Restrepo",
    phone: "3023334455",
    email: "juanp.restrepo@example.com",
    daysFromNow: 1,
    hour: 15,
    duration: "HOUR_1",
    children: 3,
    extraAdults: 1,
    reservationStatus: "PENDING",
  });

  await createReservation({
    name: "Daniela Ocampo",
    phone: "3034445566",
    email: "daniela.ocampo@example.com",
    daysFromNow: 3,
    hour: 11,
    duration: "HOUR_2",
    children: 5,
    extraAdults: 0,
    reservationStatus: "CONFIRMED",
  });

  await createReservation({
    name: "Andrés Felipe Londoño",
    phone: "3045556677",
    email: "andres.londono@example.com",
    daysFromNow: 0,
    hour: 14,
    duration: "UNLIMITED",
    children: 2,
    extraAdults: 2,
    reservationStatus: "CHECKED_IN",
  });

  console.log("Datos de ejemplo creados: 3 pedidos + 3 reservas.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
