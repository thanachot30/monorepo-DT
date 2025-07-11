-- CreateTable
CREATE TABLE "ApiVariable" (
    "id" UUID NOT NULL,
    "strategy" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "variable" JSONB NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "relationToMain" TEXT,
    "dataMarking" TEXT,

    CONSTRAINT "ApiVariable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Balance" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "apiId" UUID NOT NULL,
    "amount" DECIMAL(65,30),
    "asset" TEXT,
    "availBal" DECIMAL(65,30),
    "cashBal" DECIMAL(65,30),
    "email" TEXT,
    "frozenBal" DECIMAL(65,30),
    "orderCalAt" TEXT,
    "strategy" TEXT,
    "usd" DECIMAL(65,30),

    CONSTRAINT "Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailCurPositionFuture" (
    "id" UUID NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "strategy" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "datetimeOpen" TIMESTAMP(3) NOT NULL,
    "asset" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "sizeAmount" DOUBLE PRECISION NOT NULL,
    "openOrderPrice" DOUBLE PRECISION NOT NULL,
    "unlUSDT" DOUBLE PRECISION NOT NULL,
    "unl" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetailCurPositionFuture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailCurrentPositionFuture" (
    "id" UUID NOT NULL,
    "calAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderCalAt" TEXT,
    "datetimeOpen" TIMESTAMP(3),
    "asset" TEXT,
    "sumsizeAmount" DECIMAL(65,30),
    "avgPrice" DECIMAL(65,30),
    "unlUsdt" DECIMAL(65,30),
    "unlPercent" DECIMAL(65,30),
    "apiId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "position" TEXT,

    CONSTRAINT "DetailCurrentPositionFuture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FutureCurrent" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "apiId" UUID NOT NULL,

    CONSTRAINT "FutureCurrent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpotCurrent" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data" JSONB NOT NULL,
    "apiId" UUID NOT NULL,

    CONSTRAINT "SpotCurrent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableBalanceDetail" (
    "id" UUID NOT NULL,
    "strategy" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "usd" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "TableBalanceDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionDetailsFuture" (
    "id" UUID NOT NULL,
    "orderCalAt" TEXT,
    "createdAtOpen" TIMESTAMP(3),
    "createdAtClose" TIMESTAMP(3),
    "asset" TEXT,
    "position" TEXT,
    "sizingAmount" DECIMAL(65,30),
    "operOrderPrice" DECIMAL(65,30),
    "closeOrderPrice" DECIMAL(65,30),
    "totalTradingFee" DECIMAL(65,30),
    "pnlUsdt" DECIMAL(65,30),
    "pnlPercent" DECIMAL(65,30),
    "apiId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "strategy" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionDetailsFuture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionDetailsSpot" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asset" TEXT NOT NULL,
    "sizeAmount" DECIMAL(65,30) NOT NULL,
    "orderPrice" DECIMAL(65,30) NOT NULL,
    "side" TEXT NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,
    "feeAsset" TEXT NOT NULL,
    "feeRate" DECIMAL(65,30) NOT NULL,
    "execType" TEXT NOT NULL,
    "queue" INTEGER NOT NULL,
    "remainAmount" DECIMAL(65,30) NOT NULL,
    "Rpl" DECIMAL(65,30) NOT NULL,
    "avgSellPrice" DECIMAL(65,30) NOT NULL,
    "createdAtSellLast" TIMESTAMP(3),
    "listOrderSell" JSONB NOT NULL,
    "sumSellFee" DECIMAL(65,30) NOT NULL,
    "apiId" UUID NOT NULL,

    CONSTRAINT "TransactionDetailsSpot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "affiliate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDelete" BOOLEAN NOT NULL,
    "createdBy" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet" (
    "user_id" UUID NOT NULL,
    "public_key" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "id" UUID NOT NULL DEFAULT gen_random_uuid()
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "ApiVariable" ADD CONSTRAINT "ApiVariable_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Balance" ADD CONSTRAINT "Balance_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "ApiVariable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FutureCurrent" ADD CONSTRAINT "FutureCurrent_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "ApiVariable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpotCurrent" ADD CONSTRAINT "SpotCurrent_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "ApiVariable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDetailsSpot" ADD CONSTRAINT "TransactionDetailsSpot_apiId_fkey" FOREIGN KEY ("apiId") REFERENCES "ApiVariable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
