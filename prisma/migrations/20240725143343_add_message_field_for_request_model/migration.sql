/*
  Warnings:

  - Added the required column `message` to the `request` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "request" ADD COLUMN     "message" TEXT NOT NULL;
