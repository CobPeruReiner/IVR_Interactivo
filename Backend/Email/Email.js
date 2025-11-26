import { transporter } from "./mailer.js";

export class Email {
  constructor(to) {
    this.to = to;
    this.from = `"CyC Cobranzas Perú · Soporte" <${process.env.MAIL_FROM}>`;
  }

  async sendResetPassword({ name, url }) {
    console.log(" ======= SEND RESET PASSWORD =======");
    console.log(name, url);

    const empresa = "CyC Cobranzas Perú";
    const anio = new Date().getFullYear();

    const html = `
      <div style="font-family: Arial; max-width: 600px; margin:auto;">
        <h2 style="color:#09c">Hola ${name}</h2>
        <p>Solicitaste restablecer tu contraseña en <b>${empresa}</b>.</p>

        <a href="${url}" style="
          display:inline-block;
          padding:10px 20px;
          background:#09c;
          color:white;
          border-radius:6px;
          text-decoration:none;
          font-weight:bold;
        ">
          Crear nueva contraseña
        </a>

        <p style="margin-top:15px">
          Este enlace expira en 15 minutos.
        </p>

        <hr />
        <small>© ${empresa} - ${anio}</small>
      </div>
    `;

    const text = `Hola ${name}, entra aquí para cambiar tu contraseña: ${url}`;

    return transporter.sendMail({
      from: this.from,
      to: this.to,
      subject: "Recuperación de contraseña",
      html,
      text,
    });
  }
}
