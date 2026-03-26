import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

async function send(to: string, subject: string, html: string) {
  if (!env.SMTP_USER) {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log('[EMAIL] SMTP not configured — email not sent (set SMTP_USER/SMTP_PASS in .env)');
    return;
  }
  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}

export async function sendOrderConfirmation(to: string, orderDetails: {
  orderId: string;
  items: Array<{ name: string; volume?: string; quantity: number; priceCents: number }>;
  totalCents: number;
  deliveryCents: number;
  shippingMethod: string;
}) {
  const itemRows = orderDetails.items.map((item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.name}${item.volume ? ` (${item.volume})` : ''}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${Math.round(item.priceCents / 100)} ₽</td>
    </tr>`).join('');

  const shippingLabels: Record<string, string> = {
    courier: 'Курьерская доставка',
    warehouse: 'Самовывоз со склада',
    store: 'Самовывоз из магазина',
  };

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#F5A623;padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">Мёд из Кадымки</h1>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#333;">Ваш заказ принят! ✓</h2>
        <p>Спасибо за покупку. Ваш заказ <strong>#${orderDetails.orderId.slice(0, 8).toUpperCase()}</strong> успешно оформлен.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <thead>
            <tr style="background:#f9f9f9;">
              <th style="padding:8px;text-align:left;font-size:12px;color:#999;text-transform:uppercase;">Товар</th>
              <th style="padding:8px;text-align:center;font-size:12px;color:#999;text-transform:uppercase;">Кол-во</th>
              <th style="padding:8px;text-align:right;font-size:12px;color:#999;text-transform:uppercase;">Сумма</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>
        <div style="text-align:right;margin-top:16px;">
          <p style="margin:4px 0;color:#666;">Доставка: <strong>${orderDetails.deliveryCents === 0 ? 'Бесплатно' : Math.round(orderDetails.deliveryCents / 100) + ' ₽'}</strong></p>
          <p style="margin:4px 0;font-size:18px;font-weight:bold;">Итого: ${Math.round(orderDetails.totalCents / 100)} ₽</p>
        </div>
        <div style="margin-top:24px;padding:16px;background:#f9f9f9;border-radius:4px;">
          <p style="margin:0;color:#666;">Способ доставки: <strong>${shippingLabels[orderDetails.shippingMethod] ?? orderDetails.shippingMethod}</strong></p>
        </div>
        <p style="margin-top:24px;color:#666;">Если у вас есть вопросы, свяжитесь с нами: <a href="mailto:info@kadmed.ru" style="color:#F5A623;">info@kadmed.ru</a></p>
      </div>
      <div style="background:#f9f9f9;padding:16px;text-align:center;font-size:12px;color:#999;">
        © 2021 Мёд из села Кадымка. Все права защищены.
      </div>
    </div>`;

  await send(to, 'Ваш заказ принят — Мёд из Кадымки', html);
}

export async function sendPasswordReset(to: string, resetUrl: string) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333;">
      <div style="background:#F5A623;padding:24px;text-align:center;">
        <h1 style="color:white;margin:0;font-size:24px;">Мёд из Кадымки</h1>
      </div>
      <div style="padding:32px;">
        <h2>Восстановление пароля</h2>
        <p>Мы получили запрос на сброс пароля для вашего аккаунта.</p>
        <p>Нажмите на кнопку ниже, чтобы создать новый пароль. Ссылка действительна 1 час.</p>
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetUrl}" style="background:#F5A623;color:white;padding:14px 28px;text-decoration:none;border-radius:4px;font-weight:bold;display:inline-block;">
            Сбросить пароль
          </a>
        </div>
        <p style="color:#999;font-size:13px;">Если вы не запрашивали сброс пароля — просто проигнорируйте это письмо.</p>
        <p style="color:#999;font-size:13px;">Или скопируйте эту ссылку в браузер: ${resetUrl}</p>
      </div>
    </div>`;

  await send(to, 'Восстановление пароля — Мёд из Кадымки', html);
}
