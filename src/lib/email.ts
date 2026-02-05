import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // porta 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // ← ADICIONE ESTA LINHA (apenas dev)
  },
});

export async function enviarEmail({
  para,
  assunto,
  html,
}: {
  para: string;
  assunto: string;
  html: string;
}) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: para,
    subject: assunto,
    html,
  });
}