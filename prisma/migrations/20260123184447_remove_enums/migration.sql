/*
  Warnings:

  - Added the required column `updatedAt` to the `Licenca` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Licenca" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "ano" INTEGER,
    "tipo" TEXT NOT NULL,
    "dataEmissao" DATETIME,
    "dataValidade" DATETIME,
    "alertaDias" INTEGER NOT NULL DEFAULT 180,
    "orgao" TEXT,
    "atividade" TEXT,
    "etapa" TEXT,
    "status" TEXT NOT NULL,
    "empreendimentoId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Licenca_empreendimentoId_fkey" FOREIGN KEY ("empreendimentoId") REFERENCES "Empreendimento" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Licenca" ("alertaDias", "ano", "atividade", "createdAt", "dataEmissao", "dataValidade", "empreendimentoId", "etapa", "id", "numero", "orgao", "status", "tipo") SELECT "alertaDias", "ano", "atividade", "createdAt", "dataEmissao", "dataValidade", "empreendimentoId", "etapa", "id", "numero", "orgao", "status", "tipo" FROM "Licenca";
DROP TABLE "Licenca";
ALTER TABLE "new_Licenca" RENAME TO "Licenca";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
