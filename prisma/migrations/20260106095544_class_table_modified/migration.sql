/*
  Warnings:

  - The `section` column on the `classes` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "classes" DROP COLUMN "section",
ADD COLUMN     "section" "ClassSection" NOT NULL DEFAULT 'Morning';

-- CreateIndex
CREATE INDEX "classes_name_section_idx" ON "classes"("name", "section");
