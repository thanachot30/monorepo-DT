/*
  Warnings:

  - The `dataMarking` column on the `ApiVariable` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ApiVariable" DROP COLUMN "dataMarking",
ADD COLUMN     "dataMarking" JSONB;
