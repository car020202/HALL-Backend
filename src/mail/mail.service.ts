import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST, // Host del servidor SMTP
      port: parseInt(process.env.EMAIL_PORT || '587', 10), // Puerto SMTP
      secure: process.env.EMAIL_SECURE === 'true', // true para 465, false para otros puertos
      auth: {
        user: process.env.EMAIL_USER, // Usuario del correo
        pass: process.env.EMAIL_PASS, // Contraseña o contraseña de aplicación
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: `"HALL App" <${process.env.EMAIL_USER}>`, // Remitente
      to, // Destinatario
      subject, // Asunto
      text, // Contenido del correo
    };

    await this.transporter.sendMail(mailOptions);
  }
}

process.env.EMAIL_PORT = '587';
