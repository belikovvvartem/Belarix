document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('name');
    const telInput = document.getElementById('tel');
    const emailInput = document.getElementById('email');
    const errorModal = document.getElementById('errorModal');
    const errorText = document.getElementById('errorText');
    const closeError = document.getElementById('closeError');
  
    const token = '8149869073:AAFJphgZbpW8vvOhVMOkrXu57u53egI0Yos';
    const chatId = '1113969494';
  
    function showError(msg) {
      errorText.textContent = msg;
      errorModal.classList.remove('hidden');
    }
  
    function showSuccess(msg) {
      errorText.textContent = msg;
      errorModal.classList.remove('hidden');
    }
  
    closeError.onclick = () => {
      errorModal.classList.add('hidden');
    };
  
    errorModal.onclick = e => {
      if (e.target === errorModal) {
        errorModal.classList.add('hidden');
      }
    };
  
    function validatePhone(phone) {
      if (!phone.startsWith('+')) return false;
      const digits = phone.slice(1).replace(/\D/g, '');
      if (digits.length < 6) return false;
  
      if (phone.startsWith('+380')) {
        const oper = phone.slice(4, 6);
        const validOperators = ['39','67','68','96','97','98','99','50','66','95'];
        if (!validOperators.includes(oper)) return false;
        if (digits.length !== 12) return false;
      }
      return true;
    }
  
    // --- Для форми order.html ---
    if (window.location.pathname.endsWith('order.html')) {
      telInput.value = '+380';
    } else if (telInput) {
      telInput.value = '+';
    }
  
    if (telInput) {
      telInput.addEventListener('input', () => {
        if (!telInput.value.startsWith('+')) {
          telInput.value = '+' + telInput.value.replace(/\+/g, '');
        }
        telInput.value = '+' + telInput.value.slice(1).replace(/\D/g, '');
      });
    }
  
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        nameInput.value = nameInput.value.replace(/[^а-яА-Яa-zA-Z]/g, '').slice(0, 10);
      });
    }
  
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();
  
        if (!nameInput.value.trim()) {
          showError('Введіть ім’я');
          nameInput.focus();
          return;
        }
        if (nameInput.value.length > 10) {
          showError('Ім’я не може бути довше 10 символів');
          nameInput.focus();
          return;
        }
  
        if (!validatePhone(telInput.value)) {
          showError('Введіть коректний номер телефону');
          telInput.focus();
          return;
        }
  
        if (emailInput.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(emailInput.value.trim())) {
            showError('Введіть коректний email');
            emailInput.focus();
            return;
          }
        }
  
        if (!form.querySelector('input[name="service"]:checked')) {
          showError('Оберіть послугу');
          return;
        }
  
        if (!form.querySelector('input[name="contact"]:checked')) {
          showError('Оберіть спосіб зв’язку');
          return;
        }
  
        const name = nameInput.value.trim();
        const tel = telInput.value;
        const email = emailInput.value.trim() || '-';
        const brend = document.getElementById('brend').value.trim() || '-';
        const comment = document.querySelector('textarea').value.trim() || '-';
  
        const service = form.querySelector('input[name="service"]:checked').nextElementSibling.textContent;
        const budget = form.querySelector('input[name="budget"]:checked')?.nextElementSibling.textContent || '-';
        const contact = form.querySelector('input[name="contact"]:checked').nextElementSibling.textContent;
  
        const message = `
  📩 Нова заявка з форми:
  👤 Ім’я: ${name}
  📞 Телефон: ${tel}
  📧 Email: ${email}
  🏢 Компанія/Бренд: ${brend}
  💼 Послуга: ${service}
  💰 Бюджет: ${budget}
  📲 Як зв’язатися: ${contact}
  📝 Коментар: ${comment}
  `;
  
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ chat_id: chatId, text: message }),
          });
  
          if (res.ok) {
            showSuccess('Заявка успішно надіслана!');
            form.reset();
          } else {
            showError('Помилка при відправленні заявки');
          }
        } catch {
          showError('Помилка мережі при відправленні заявки');
        }
      });
    }
  
    const indexTelInput = document.querySelector('.service-card__input');
    const indexBtn = document.getElementById('submitNumber');
  
    if (indexTelInput && indexBtn) {
      if (!indexTelInput.value.startsWith('+')) {
        indexTelInput.value = '+380';
      }
  
      indexTelInput.addEventListener('input', () => {
        if (!indexTelInput.value.startsWith('+')) {
          indexTelInput.value = '+' + indexTelInput.value.replace(/\+/g, '');
        }
        indexTelInput.value = '+' + indexTelInput.value.slice(1).replace(/\D/g, '');
      });
  
      indexBtn.addEventListener('click', async (e) => {
        e.preventDefault();
  
        const phone = indexTelInput.value.trim();
        if (!validatePhone(phone)) {
          showError('Введіть коректний номер телефону');
          indexTelInput.focus();
          return;
        }
  
        const message = `
  📩 Нова заявка на консультацію:
  📞 Телефон: ${phone}
  `;
  
        const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ chat_id: chatId, text: message }),
          });
  
          if (res.ok) {
            showSuccess('Ваша заявка на консультацію успішно надіслана!');
            indexTelInput.value = '+';
          } else {
            showError('Помилка при відправленні заявки');
          }
        } catch {
          showError('Помилка мережі при відправленні заявки');
        }
      });
    }
  });






// Заборонити відкриття контекстного меню (права кнопка)
document.addEventListener('contextmenu', e => e.preventDefault());

// Заборонити деякі комбінації клавіш для DevTools
document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||                             // F12
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) || // Ctrl+Shift+I/J
    (e.ctrlKey && e.shiftKey && e.key === 'C') ||  // Ctrl+Shift+C
    (e.ctrlKey && e.key === 'U')                    // Ctrl+U (перегляд коду сторінки)
  ) {
    e.preventDefault();
  }
});

// Відключити відкриття консолі через "debugger"
(function() {
  const devtools = () => {
    debugger;
  };
  setInterval(devtools, 1000);
})();

