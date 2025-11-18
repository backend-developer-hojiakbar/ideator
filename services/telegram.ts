// WARNING: Per user request, bot credentials are embedded in frontend. Do not use in production.
const TELEGRAM_BOT_TOKEN = '8183514547:AAF_c52N2iu0hVeY7B6c2Oma4pmDbB8eHAs';
// If your group is a supergroup, chat id usually starts with -100
const TELEGRAM_GROUP_ID = '-1003367409153';

export type TopupMessagePayload = {
  transaction_id: number;
  amount: string | number;
  cashback: string | number;
  promo_bonus: string | number;
  userPhone?: string;
  userName?: string;
  receiptFile?: File | null;
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
  const keyboard = {
    inline_keyboard: [[
      { text: 'Tasdiqlayman ✅', callback_data: `approve:${payload.transaction_id}` },
      { text: 'Rad etish ❌', callback_data: `reject:${payload.transaction_id}` },
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
      return true;
    } else {
      const res = await fetch(`${apiBase}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: TELEGRAM_GROUP_ID, text: caption, reply_markup: keyboard }),
      });
      if (!res.ok) throw new Error(await res.text());
      return true;
    }
  } catch (e) {
    console.error('Telegram send failed', e);
    return false;
  }
}
