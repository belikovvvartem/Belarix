require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

app.use(cors({
  origin: ['https://belarix-agency.com', 'http://127.0.0.1:5500'], 
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.options('/submit', cors());

app.post('/submit', async (req, res) => {
  console.log('Отримано запит на /submit:', req.body);

  const data = req.body;
  let message;

  if (data.type === 'order') {
    message = `
📩 Нова заявка з форми:
👤 Ім’я: ${data.name}
📞 Телефон: ${data.tel}
📧 Email: ${data.email}
🏢 Компанія/Бренд: ${data.brend}
💼 Послуга: ${data.service}
💰 Бюджет: ${data.budget}
📲 Як зв’язатися: ${data.contact}
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

  const token = process.env.TOKEN;
  const chatId = process.env.CHAT_ID;

  if (!token || !chatId) {
    console.error('Помилка: TOKEN або CHAT_ID не встановлені');
    return res.status(500).json({ error: 'Серверна помилка: відсутні налаштування Telegram' });
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message })
    });

    if (response.ok) {
      console.log('Повідомлення успішно надіслано до Telegram');
      res.status(200).json({ message: 'Заявка успішно надіслана' });
    } else {
      console.error('Помилка відправки до Telegram:', await response.text());
      res.status(500).json({ error: 'Помилка при відправленні заявки' });
    }
  } catch (error) {
    console.error('Помилка мережі:', error);
    res.status(500).json({ error: 'Помилка мережі при відправленні заявки' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});