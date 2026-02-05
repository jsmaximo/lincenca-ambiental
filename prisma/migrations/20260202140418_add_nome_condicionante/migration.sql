-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Condicionante" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT,
    "numero" INTEGER,
    "descricao" TEXT NOT NULL,
    "prazo" DATETIME,
    "alertaDias" INTEGER NOT NULL DEFAULT 180,
    "status" TEXT NOT NULL,
    "licencaId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Condicionante_licencaId_fkey" FOREIGN KEY ("licencaId") REFERENCES "Licenca" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Condicionante" ("createdAt", "descricao", "id", "licencaId", "numero", "prazo", "status") SELECT "createdAt", "descricao", "id", "licencaId", "numero", "prazo", "status" FROM "Condicionante";
DROP TABLE "Condicionante";
ALTER TABLE "new_Condicionante" RENAME TO "Condicionante";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
