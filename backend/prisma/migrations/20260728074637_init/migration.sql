-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CHECK_IN', 'TRIAGE_STARTED', 'TRIAGE_COMPLETE', 'ALERT');

-- CreateEnum
CREATE TYPE "Severity" AS ENUM ('NORMAL', 'HIGH');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "patientRef" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "severity" "Severity" NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
