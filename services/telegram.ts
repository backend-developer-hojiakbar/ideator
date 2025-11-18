// WARNING: Per user request, bot credentials are embedded in frontend. Do not use in production.
const TELEGRAM_BOT_TOKEN = '8183514547:AAF_c52N2iu0hVeY7B6c2Oma4pmDbB8eHAs';
// If your group is a supergroup, chat id usually starts with -100
const TELEGRAM_GROUP_ID = '-1003367409153';
import { API_BASE } from './api';

export type TopupMessagePayload = {
  transaction_id: number;
  amount: string | number;
  cashback: string | number;
  promo_bonus: string | number;
  userPhone?: string;
  userName?: string;
  receiptFile?: File | null;
  approve_token?: string;
};

function buildCaption(p: TopupMessagePayload) {
  const amount = p.amount;
  const cashback = p.cashback;
  const promo = p.promo_bonus;
  const phone = p.userPhone || '-';
  const name = p.userName || '-';
  return (
    "Yangi to'lov so'rovi\n" +
    `ID: ${p.transaction_id}\n` +
    `Foydalanuvchi: ${phone} (${name})\n` +
    `Miqdor: ${amount} so'm\n` +
    `Cashback: ${cashback} so'm\n` +
    `Promo bonus: ${promo} so'm\n` +
    `Holat: Kutilmoqda\n`
  );
}

export async function sendTopupToTelegram(payload: TopupMessagePayload) {
  const apiBase = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
  // Build approve/reject URLs on backend (no webhook required)
  const backendRoot = API_BASE.replace(/\/?api$/, '');
  const approveUrl = `${backendRoot}/api/approve-topup/?tx=${payload.transaction_id}&token=${payload.approve_token || ''}`;
  const rejectUrl = `${backendRoot}/api/reject-topup/?tx=${payload.transaction_id}&token=${payload.approve_token || ''}`;
  const keyboard = {
    inline_keyboard: [[
      { text: 'Tasdiqlayman ✅', url: approveUrl },
      { text: 'Rad etish ❌', url: rejectUrl },
    ]],
  };
  const caption = buildCaption(payload);
  try {
    if (payload.receiptFile) {
      const fd = new FormData();
      fd.append('chat_id', TELEGRAM_GROUP_ID);
      fd.append('caption', caption);
      fd.append('reply_markup', JSON.stringify(keyboard));
      fd.append('photo', payload.receiptFile);
      const res = await fetch(`${apiBase}/sendPhoto`, { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const msg = data?.result;
      if (msg?.message_id && msg?.chat?.id) {
        await fetch(`${API_BASE}/register-topup-message/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx: payload.transaction_id, chat_id: String(msg.chat.id), message_id: msg.message_id }),
        }).catch(() => {});
      }
      return true;
    } else {
      const res = await fetch(`${apiBase}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_GROUP_ID, text: caption, reply_markup: keyboard }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const msg = data?.result;
      if (msg?.message_id && msg?.chat?.id) {
        await fetch(`${API_BASE}/register-topup-message/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx: payload.transaction_id, chat_id: String(msg.chat.id), message_id: msg.message_id }),
        }).catch(() => {});
      }
      return true;
    }
  } catch (e) {
    console.error('Telegram send failed', e);
    return false;
  }
}
