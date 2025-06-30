const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Налаштування CORS для дозволу запитів із фронтенду
app.use(cors({
  origin: ['https://belarix-agency.com', 'http://127.0.0.1:5500'], // Дозволяємо запити з продакшену та локально
  methods: ['GET', 'POST', 'OPTIONS'], // Дозволені методи
  allowedHeaders: ['Content-Type'] // Дозволені заголовки
}));

// Парсинг JSON-тіл запитів
app.use(express.json());

// Обробка OPTIONS-запитів для маршруту /submit (хоча cors middleware робить це автоматично)
app.options('/submit', cors());

// Маршрут для обробки POST-запитів на /submit
app.post('/submit', async (req, res) => {
  console.log('Отримано запит на /submit:', req.body); // Лог для дебагу

  const data = req.body;
  let message;

  // Формування повідомлення залежно від типу заявки
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

  // Отримання токена та ID чату з змінних оточення
  const token = process.env.TOKEN || '8149869073:AAFJphgZbpW8vvOhVMOkrXu57u53egI0Yos';
  const chatId = process.env.CHAT_ID || '1113969494';
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

// Запуск сервера
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});