/*
  Warnings:

  - The `relationToMain` column on the `ApiVariable` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ApiVariable" DROP COLUMN "relationToMain",
ADD COLUMN     "relationToMain" UUID;

-- AddForeignKey
ALTER TABLE "ApiVariable" ADD CONSTRAINT "ApiVariable_relationToMain_fkey" FOREIGN KEY ("relationToMain") REFERENCES "ApiVariable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
