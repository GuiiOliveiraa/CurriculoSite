const text = [
  "Criando interfaces de alto impacto",
  "Focado em desempenho e experiência",
  "Projetos com visual profissional"
];

const typingElement = document.getElementById("typing");
let index = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  if (!typingElement) {
    return;
  }

  const currentText = text[index];

  if (isDeleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typingElement.textContent = currentText.substring(0, charIndex);

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(type, 1100);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    index = (index + 1) % text.length;
  }

  setTimeout(type, isDeleting ? 45 : 85);
}

type();

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -30px 0px"
  }
);

revealElements.forEach((element, idx) => {
  element.style.setProperty("--delay", `${idx * 80}ms`);
  observer.observe(element);
});
