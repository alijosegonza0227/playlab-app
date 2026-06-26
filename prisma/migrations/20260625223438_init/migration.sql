-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('FOOD', 'SNACK', 'PIZZA', 'KIDS_MENU', 'GROUP_PLATTER', 'DESSERT', 'DRINK', 'COCKTAIL', 'BABY_MENU', 'DECORATION', 'ADDITION');

-- CreateEnum
CREATE TYPE "TimeRateDuration" AS ENUM ('MIN_30', 'HOUR_1', 'HOUR_2', 'UNLIMITED');

-- CreateEnum
CREATE TYPE "PromotionDay" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "PromotionRuleType" AS ENUM ('PERCENT_OFF', 'BUY_X_GET_Y', 'FIXED_COMBO_PRICE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('CART', 'PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('DELIVERY', 'PARK_VISIT', 'BIRTHDAY_PARTY');

-- CreateEnum
CREATE TYPE "OrderLineType" AS ENUM ('PRODUCT', 'PARK_VISIT_SLOT', 'BIRTHDAY_PARTY_COMPONENT');

-- CreateEnum
CREATE TYPE "BirthdayComponentType" AS ENUM ('TIME_RATE', 'FOOD_ITEM', 'DECORATION_ITEM', 'PRIVATE_SPACE');

-- CreateEnum
CREATE TYPE "ReservationType" AS ENUM ('STANDARD', 'PEDIATRICIAN_REFERRAL', 'BIRTHDAY');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PaymentKind" AS ENUM ('FULL', 'DEPOSIT', 'BALANCE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'DECLINED', 'VOIDED', 'ERROR');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('ADMIN', 'STAFF');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeRate" (
    "id" TEXT NOT NULL,
    "duration" "TimeRateDuration" NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "extraAdultCents" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TimeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dayOfWeek" "PromotionDay",
    "ruleType" "PromotionRuleType" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "details" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'CART',
    "fulfillmentTypes" "FulfillmentType"[],
    "deliveryAddress" TEXT,
    "subtotalCents" INTEGER NOT NULL DEFAULT 0,
    "discountCents" INTEGER NOT NULL DEFAULT 0,
    "totalCents" INTEGER NOT NULL DEFAULT 0,
    "amountPaidCents" INTEGER NOT NULL DEFAULT 0,
    "amountDueCents" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderLineItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "lineType" "OrderLineType" NOT NULL,
    "productId" TEXT,
    "timeRateId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPriceCents" INTEGER NOT NULL,
    "childrenCount" INTEGER,
    "extraAdultsCount" INTEGER,
    "birthdayComponentType" "BirthdayComponentType",
    "partyGroupId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "reservationType" "ReservationType" NOT NULL DEFAULT 'STANDARD',
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "partySize" INTEGER NOT NULL,
    "referralCodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "clinicName" TEXT NOT NULL,
    "doctorName" TEXT,
    "requiresPayment" BOOLEAN NOT NULL DEFAULT true,
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" "PaymentKind" NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "wompiTransactionId" TEXT,
    "wompiReference" TEXT NOT NULL,
    "paymentMethodType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentSource" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "wompiPaymentSourceId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "maskedIdentifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WompiWebhookEvent" (
    "id" TEXT NOT NULL,
    "wompiEventId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WompiWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffUser" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL DEFAULT 'STAFF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TimeRate_duration_key" ON "TimeRate"("duration");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_wompiTransactionId_key" ON "Payment"("wompiTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_wompiReference_key" ON "Payment"("wompiReference");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentSource_wompiPaymentSourceId_key" ON "PaymentSource"("wompiPaymentSourceId");

-- CreateIndex
CREATE UNIQUE INDEX "WompiWebhookEvent_wompiEventId_key" ON "WompiWebhookEvent"("wompiEventId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_email_key" ON "StaffUser"("email");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderLineItem" ADD CONSTRAINT "OrderLineItem_timeRateId_fkey" FOREIGN KEY ("timeRateId") REFERENCES "TimeRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentSource" ADD CONSTRAINT "PaymentSource_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
