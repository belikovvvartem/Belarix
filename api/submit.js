// Vercel Serverless Function
// Розмісти цей файл у корені проєкту за шляхом /api/submit.js
// Vercel сам перетворить його на ендпоінт https://ваш-домен.vercel.app/api/submit

// В налаштуваннях проєкту на Vercel (Settings -> Environment Variables) додай:
//   TG_BOT_TOKEN  — токен твого Telegram-бота
//   TG_CHAT_ID    — id чату/каналу, куди слати заявки

const ALLOWED_ORIGINS = [
    'https://belarix-agency.com',
    'http://127.0.0.1:5500',
    'http://localhost:5500'
  ];
  
  export default async function handler(req, res) {
    const origin = req.headers.origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Метод не дозволений' });
    }
  
    const data = req.body;
    let message;
  
    if (data.type === 'order') {
      message = `
  📩 Нова заявка з форми:
  👤 Ім'я: ${data.name}
  📞 Телефон: ${data.tel}
  📧 Email: ${data.email}
  🏢 Компанія/Бренд: ${data.brend}
  💼 Послуга: ${data.service}
  💰 Бюджет: ${data.budget}
  📲 Як зв'язатися: ${data.contact}
  📝 Коментар: ${data.comment}
      `;
    } else if (data.type === 'consultation') {
      message = `
  📩 Нова заявка на консультацію:
  📞 Телефон: ${data.tel}
      `;
    } else {
      console.log('Невідомий тип заявки:', data.type);
      return res.status(400).json({ error: 'Невідомий тип заявки' });
    }
  
    const token = process.env.TG_BOT_TOKEN;
    const chatId = process.env.TG_CHAT_ID;
  
    if (!token || !chatId) {
      console.error('Помилка: TG_BOT_TOKEN або TG_CHAT_ID не встановлені у Vercel Environment Variables');
      return res.status(500).json({ error: 'Серверна помилка: відсутні налаштування Telegram' });
    }
  
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
    try {
      // Node.js runtime на Vercel має вбудований fetch, node-fetch не потрібен
      const tgResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
  
      if (tgResponse.ok) {
        console.log('Повідомлення успішно надіслано до Telegram');
        return res.status(200).json({ message: 'Заявка успішно надіслана' });
      } else {
        const errText = await tgResponse.text();
        console.error('Помилка відправки до Telegram:', errText);
        return res.status(500).json({ error: 'Помилка при відправленні заявки' });
      }
    } catch (error) {
      console.error('Помилка мережі:', error);
      return res.status(500).json({ error: 'Помилка мережі при відправленні заявки' });
    }
  }