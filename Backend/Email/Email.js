import { transporter } from "./mailer.js";

export class Email {
  constructor(to) {
    this.to = to;
    this.from = `"CyC Cobranzas Perú · Soporte" <${process.env.MAIL_FROM}>`;
  }

  async sendNewPassword({ name, password }) {
    console.log(" ======= SEND NEW PASSWORD =======");

    const empresa = "CyC Cobranzas Perú";
    const anio = new Date().getFullYear();

    const html = `
    <div style="font-family: Arial; max-width: 600px; margin:auto;">
      <h2 style="color:#09c">Hola ${name}</h2>

      <p>Se ha generado una nueva contraseña para tu acceso a <b>${empresa}</b>:</p>

      <div style="
        margin:15px 0;
        padding:12px;
        background:#f4f4f4;
        border-radius:6px;
        font-size:18px;
        font-weight:bold;
        text-align:center;
        letter-spacing:2px;
      ">
        ${password}
      </div>

      <p style="margin-top:10px">
        Te recomendamos cambiarla luego de iniciar sesión.
      </p>

      <hr />
      <small>© ${empresa} - ${anio}</small>
    </div>
  `;

    const text = `Hola ${name}, tu nueva contraseña es: ${password}. Te recomendamos cambiarla al ingresar.`;

    return transporter.sendMail({
      from: this.from,
      to: this.to,
      subject: "Nueva contraseña de acceso",
      html,
      text,
    });
  }
}
