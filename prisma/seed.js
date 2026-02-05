const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // ROLES
  const adminRole = await prisma.role.upsert({
    where: { nome: "Admin" },
    update: {},
    create: { nome: "Admin" },
  });

  const tecnicoRole = await prisma.role.upsert({
    where: { nome: "Tecnico" },
    update: {},
    create: { nome: "Tecnico" },
  });

  const visualizadorRole = await prisma.role.upsert({
    where: { nome: "Visualizador" },
    update: {},
    create: { nome: "Visualizador" },
  });

  // USUÁRIO ADMIN
  const senhaHash = await bcrypt.hash("admin123", 10);

  await prisma.usuario.upsert({
    where: { email: "admin@licenca.com" },
    update: {},
    create: {
      nome: "Administrador_unitario",
      email: "admin@licenca.com",
      senha: senhaHash,
      roleId: adminRole.id,
    },
  });

  console.log("✅ Seed finalizado com sucesso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
