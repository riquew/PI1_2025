export default function initMenuMobile() {
    const btn = document.querySelector(".mobile-button");
    const menu = document.querySelector(".navbar-nav");
  
    if (btn && menu) {
      btn.addEventListener("click", () => {
        menu.classList.toggle("ativo");
      });
    }
  }