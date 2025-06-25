// прокрутка
const links = document.querySelectorAll('a[href^="#"]');
const headerOffset = 80;

links.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").slice(1);
    const targetEl = document.getElementById(targetId);
    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top,
      behavior: "smooth"
    });
  });
});

// кнопка яка переносить на сторінку для замовлення
document.querySelectorAll('[id^="order"]').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'order.html';
    });
});
