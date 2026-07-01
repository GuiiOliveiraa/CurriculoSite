const appState = {
  cv: null,
  language: localStorage.getItem("language") || "pt",
  typingTimer: null,
};

const TRANSLATIONS = {
  pt: {
    documentTitle: "Portfólio | Guilherme Oliveira",
    documentDescription: "Portfólio de Guilherme Oliveira - Desenvolvedor Full Stack especializado em aplicações web modernas e automação com IA",
    htmlLang: "pt-br",
    nav: {
      about: "Sobre",
      skills: "Habilidades",
      technologies: "Tecnologias",
      projects: "Projetos",
      experience: "Experiências",
      contact: "Contato",
    },
    aria: {
      themeToggle: "Alternar tema",
      languageToggle: "Selecionar idioma",
      email: "Enviar email para Guilherme Oliveira",
      github: "GitHub de Guilherme Oliveira",
      linkedin: "LinkedIn de Guilherme Oliveira",
      photo: "Foto de perfil de Guilherme Oliveira",
    },
    hero: {
      headingPrefix: "Olá, eu sou",
      tags: ["Interfaces modernas", "Performance", "Código limpo"],
      typing: ["Interfaces modernas", "Performance otimizada", "Código limpo e organizado"],
      projectsButton: "Ver projetos",
      contactButton: "Contato",
    },
    sections: {
      about: "Sobre mim",
      highlights: "Destaques",
      skills: "Habilidades",
      technologies: "Tecnologias e ferramentas",
      technologiesIntro: "Stacks, APIs, ferramentas e integrações consolidadas a partir do histórico de aprendizados e projetos.",
      projects: "Projetos",
      experience: "Experiências",
      experienceIntro: "Experiências profissionais e aprendizados relevantes gerados a partir das anotações do currículo vivo.",
      contact: "Contato",
    },
    contactTitles: {
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    footer: "© 2026 - Guilherme Oliveira",
    badgePrefix: "⚡ Atualizado via IA em",
    locale: "pt-BR",
  },
  en: {
    documentTitle: "Portfolio | Guilherme Oliveira",
    documentDescription: "Portfolio of Guilherme Oliveira - Full Stack Developer focused on modern web applications and AI automation",
    htmlLang: "en",
    nav: {
      about: "About",
      skills: "Skills",
      technologies: "Technologies",
      projects: "Projects",
      experience: "Experience",
      contact: "Contact",
    },
    aria: {
      themeToggle: "Toggle theme",
      languageToggle: "Select language",
      email: "Send email to Guilherme Oliveira",
      github: "Guilherme Oliveira GitHub",
      linkedin: "Guilherme Oliveira LinkedIn",
      photo: "Profile photo of Guilherme Oliveira",
    },
    hero: {
      headingPrefix: "Hi, I'm",
      tags: ["Modern interfaces", "Performance", "Clean code"],
      typing: ["Modern interfaces", "Optimized performance", "Clean and organized code"],
      projectsButton: "View projects",
      contactButton: "Contact",
    },
    sections: {
      about: "About me",
      highlights: "Highlights",
      skills: "Skills",
      technologies: "Technologies and tools",
      technologiesIntro: "Stacks, APIs, tools, and integrations consolidated from learning history and real projects.",
      projects: "Projects",
      experience: "Experience",
      experienceIntro: "Professional experience and relevant learnings generated from the living resume notes.",
      contact: "Contact",
    },
    contactTitles: {
      email: "Email",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    footer: "© 2026 - Guilherme Oliveira",
    badgePrefix: "⚡ AI-updated on",
    locale: "en-US",
  },
};

const CONTENT_TRANSLATIONS = {
  "Desenvolvedor Full Stack": "Full Stack Developer",
  "Desenvolvo soluções completas, criando aplicações e interfaces integradas a um back-end eficiente, com foco em performance, organização e entrega de produtos robustos e profissionais.": "I build end-to-end solutions, creating applications and interfaces connected to efficient back-end systems with a strong focus on performance, organization, and delivering robust professional products.",
  "Desenvolvedor focado em aprendizado prático, construção de projetos reais e evolução constante. Busco soluções eficientes, com design agradável e boa usabilidade.": "Developer focused on practical learning, building real projects, and continuous growth. I aim for efficient solutions with thoughtful design and strong usability.",
  "Resolução de problemas": "Problem solving",
  "Planejamento técnico para transformar ideias em resultados.": "Technical planning that turns ideas into concrete results.",
  "Boas práticas": "Best practices",
  "Organização de código e versionamento com foco em evolução.": "Code organization and version control with long-term evolution in mind.",
  "Foco no usuário": "User focus",
  "Interfaces intuitivas, legíveis e com boa apresentação.": "Interfaces that are intuitive, readable, and well presented.",
  "Currículo Vivo com IA": "AI-Powered Living Resume",
  "Full-Stack": "Full Stack",
  "Loja Virtual com Conversão": "Conversion-Focused Online Store",
  "Front-End": "Front End",
  "Sistema de Cotação de Moedas": "Currency Exchange Tracking System",
  "Back-End": "Back End",
  "Sistema que atualiza automaticamente o portfólio através de anotações em Markdown. Pipeline: knowledge/ → Gemini IA → cv.json estruturado → Deploy automático via GitHub Actions. Demonstra automação, IA e CI/CD em produção.": "A system that automatically updates the portfolio through Markdown notes. Pipeline: knowledge/ → Gemini AI → structured cv.json → automatic deploy with GitHub Actions. It showcases automation, AI, and production-ready CI/CD.",
  "Interface de e-commerce com navegação dinâmica, filtros interativos de produtos e integração direta com WhatsApp para conversão de vendas. Desenvolvido com HTML, CSS e JavaScript vanilla.": "An e-commerce interface with dynamic navigation, interactive product filters, and direct WhatsApp integration for sales conversion. Built with HTML, CSS, and vanilla JavaScript.",
  "Aplicação backend que consulta cotações de moedas em tempo real via APIs externas e envia automaticamente relatórios em HTML para e-mail. Implementa variáveis de ambiente para segurança e logging estruturado.": "A backend application that fetches real-time currency exchange rates from external APIs and automatically sends HTML email reports. It uses environment variables for security and structured logging.",
  "Aprendizado Prático em Desenvolvimento Full Stack": "Hands-on Full Stack Development Learning",
  "Projetos Pessoais": "Personal Projects",
  "Construção de aplicações reais, desde frontend até backend, com foco em boas práticas, performance e escalabilidade. Experiência com ciência de dados, automação e integração de APIs.": "Building real applications from front end to back end with a focus on best practices, performance, and scalability. Experience includes data work, automation, and API integrations.",
  "Pipeline de IA com Gemini": "Gemini AI pipeline",
  "GitHub Actions para deploy automático": "GitHub Actions for automatic deployment",
  "Separação de dados e template": "Separation between data and template",
  "Dark mode com localStorage": "Dark mode with localStorage",
  "Filtros dinâmicos em tempo real": "Real-time dynamic filters",
  "Integração WhatsApp API": "WhatsApp API integration",
  "Responsivo mobile-first": "Mobile-first responsive design",
  "Performance otimizada": "Optimized performance",
  "Consumo de APIs externas": "External API consumption",
  "Envio automático de e-mails HTML": "Automatic HTML email delivery",
  "Variáveis de ambiente (.env)": "Environment variables (.env)",
  "Logging e tratamento de erros": "Logging and error handling",
};

function t(path) {
  return path.split(".").reduce((acc, key) => acc?.[key], TRANSLATIONS[appState.language]) ?? "";
}

function translateContent(value) {
  if (!value || appState.language === "pt") return value;
  return CONTENT_TRANSLATIONS[value] || value;
}

function initThemeToggle() {
  const toggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "light";

  document.documentElement.setAttribute("data-theme", savedTheme);
  updateToggleIcon(savedTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";

      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateToggleIcon(newTheme);
    });
  }
}

function updateToggleIcon(theme) {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const icon = toggle.querySelector("i");
  if (theme === "dark") {
    icon.className = "fa-solid fa-sun";
  } else {
    icon.className = "fa-solid fa-moon";
  }
}

function initLanguageToggle() {
  const languageToggle = document.getElementById("language-toggle");
  if (!languageToggle) return;

  languageToggle.value = appState.language;
  languageToggle.addEventListener("change", (event) => {
    const newLanguage = event.target.value;
    appState.language = newLanguage;
    localStorage.setItem("language", newLanguage);
    renderApp();
  });
}

async function loadCVData() {
  try {
    const response = await fetch("data/cv.json");
    if (!response.ok) throw new Error("Falha ao carregar cv.json");
    return await response.json();
  } catch (error) {
    console.error("Erro ao carregar CV:", error);
    return null;
  }
}

function renderAIBadge(cv) {
  const badgeContainer = document.querySelector(".ai-badge");
  if (!badgeContainer || !cv.lastUpdated) return;

  const lastUpdated = new Date(cv.lastUpdated);
  const dateString = lastUpdated.toLocaleDateString(t("locale"), {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  badgeContainer.textContent = `${t("badgePrefix")} ${dateString}`;
  badgeContainer.style.display = "inline-block";
}

function renderHighlights(cv) {
  const highlightsGrid = document.getElementById("highlights-grid");
  if (!highlightsGrid || !cv.highlights) return;

  highlightsGrid.innerHTML = "";

  cv.highlights.forEach((highlight) => {
    const card = document.createElement("article");
    card.className = "info-card";
    card.innerHTML = `
      <i class="${highlight.icon}"></i>
      <h3>${translateContent(highlight.title)}</h3>
      <p>${translateContent(highlight.description)}</p>
    `;
    highlightsGrid.appendChild(card);
  });
}

function renderSkills(cv) {
  const skillsGrid = document.getElementById("skills-grid");
  if (!skillsGrid || !cv.skills) return;

  skillsGrid.innerHTML = "";

  cv.skills.forEach((skill, index) => {
    const skillCard = document.createElement("article");
    skillCard.className = "skill-card";
    skillCard.style.animationDelay = `${index * 0.05}s`;

    const proficiencyLevel = skill.level || 2;
    let proficiencyDots = "";

    for (let i = 0; i < 3; i += 1) {
      const dotClass = i < proficiencyLevel ? "skill-dot filled" : "skill-dot";
      proficiencyDots += `<span class="${dotClass}"></span>`;
    }

    skillCard.innerHTML = `
      <i class="${skill.icon}"></i>
      <p>${skill.name}</p>
      <div class="skill-level">
        ${proficiencyDots}
      </div>
    `;

    skillsGrid.appendChild(skillCard);
  });
}

function renderTechnologies(cv) {
  const techGrid = document.getElementById("technologies-grid");
  if (!techGrid || !cv.technologies) return;

  techGrid.innerHTML = "";

  cv.technologies.forEach((tech, index) => {
    const techItem = document.createElement("div");
    techItem.className = "tech-item";
    techItem.style.animationDelay = `${index * 0.05}s`;

    techItem.innerHTML = `
      <i class="${tech.icon}"></i>
      <p>${tech.name}</p>
    `;

    techGrid.appendChild(techItem);
  });
}

function renderProjects(cv) {
  const projectsGrid = document.getElementById("projects-grid");
  if (!projectsGrid || !cv.projects) return;

  projectsGrid.innerHTML = "";

  cv.projects.forEach((project, index) => {
    const projectCard = document.createElement("article");
    projectCard.className = "project-card";
    projectCard.style.animationDelay = `${index * 0.05}s`;

    const linksHTML = project.links
      ? project.links
          .map(
            (link) => `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.label}">
            <i class="${link.icon}"></i> ${link.label}
          </a>
        `
          )
          .join("")
      : "";

    projectCard.innerHTML = `
      <div class="project-top">
        <h3>${translateContent(project.name)}</h3>
        <span>${translateContent(project.category)}</span>
      </div>
      <p>${translateContent(project.description)}</p>
      <div class="links">
        ${linksHTML}
      </div>
    `;

    projectsGrid.appendChild(projectCard);
  });
}

function renderExperiences(cv) {
  const experiencesGrid = document.getElementById("experiences-grid");
  const experienceSection = document.getElementById("experience");
  if (!experiencesGrid || !experienceSection) return;

  if (!cv.experiences || cv.experiences.length === 0) {
    experienceSection.setAttribute("hidden", "");
    experiencesGrid.innerHTML = "";
    return;
  }

  experienceSection.removeAttribute("hidden");
  experiencesGrid.innerHTML = "";

  cv.experiences.forEach((exp, index) => {
    const expCard = document.createElement("div");
    expCard.className = "experience-card";
    expCard.style.animationDelay = `${index * 0.05}s`;

    expCard.innerHTML = `
      <div class="role">${translateContent(exp.role || exp.title)}</div>
      <div class="company">${translateContent(exp.company)}</div>
      <div class="description">${translateContent(exp.description || "")}</div>
    `;

    experiencesGrid.appendChild(expCard);
  });
}

function initTypingEffect() {
  const typingElement = document.getElementById("typing");
  if (!typingElement) return;

  const phrases = t("hero.typing");
  let currentPhrase = 0;
  let currentChar = 0;
  let isDeleting = false;

  if (appState.typingTimer) {
    clearTimeout(appState.typingTimer);
  }

  function type() {
    const phrase = phrases[currentPhrase];

    currentChar = isDeleting ? currentChar - 1 : currentChar + 1;
    typingElement.textContent = phrase.substring(0, currentChar);

    if (!isDeleting && currentChar === phrase.length) {
      appState.typingTimer = setTimeout(() => {
        isDeleting = true;
        type();
      }, 3000);
      return;
    }

    if (isDeleting && currentChar === 0) {
      isDeleting = false;
      currentPhrase = (currentPhrase + 1) % phrases.length;
    }

    appState.typingTimer = setTimeout(type, isDeleting ? 50 : 100);
  }

  typingElement.textContent = "";
  type();
}

function initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const revealElement = (element) => {
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
  };

  const elements = Array.from(document.querySelectorAll(".section, .reveal"));
  const observer = typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions)
    : null;

  const checkVisibility = () => {
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 50 && rect.bottom > 0;

      if (isVisible) {
        revealElement(el);
        observer?.unobserve(el);
      }
    });
  };

  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer?.observe(el);
  });

  checkVisibility();
  window.addEventListener("scroll", checkVisibility, { passive: true });
  window.addEventListener("resize", checkVisibility);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function onAnchorClick(e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

function initLogoLink() {
  const logo = document.querySelector(".logo");
  if (logo && !logo.parentElement.href) {
    logo.style.cursor = "pointer";
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function populateProfileData(cv) {
  if (!cv.profile) return;

  const profileNameEl = document.getElementById("profile-name");
  const profileTitleEl = document.getElementById("profile-title");
  const profileSummaryEl = document.getElementById("profile-summary");
  const aboutEl = document.getElementById("about-text");

  if (profileNameEl) profileNameEl.textContent = cv.profile.name;
  if (profileTitleEl) profileTitleEl.textContent = translateContent(cv.profile.title);
  if (profileSummaryEl) profileSummaryEl.textContent = translateContent(cv.profile.summary);
  if (aboutEl) aboutEl.textContent = translateContent(cv.profile.about);
}

function applyStaticTranslations() {
  document.documentElement.lang = t("htmlLang");
  document.title = t("documentTitle");

  const descriptionTag = document.querySelector('meta[name="description"]');
  if (descriptionTag) descriptionTag.setAttribute("content", t("documentDescription"));

  document.getElementById("nav-about").textContent = t("nav.about");
  document.getElementById("nav-skills").textContent = t("nav.skills");
  document.getElementById("nav-technologies").textContent = t("nav.technologies");
  document.getElementById("nav-projects").textContent = t("nav.projects");
  document.getElementById("nav-experience").textContent = t("nav.experience");
  document.getElementById("nav-contact").textContent = t("nav.contact");

  document.getElementById("theme-toggle").setAttribute("aria-label", t("aria.themeToggle"));
  document.getElementById("language-toggle").setAttribute("aria-label", t("aria.languageToggle"));
  document.getElementById("contact-email-link").setAttribute("aria-label", t("aria.email"));
  document.getElementById("contact-github-link").setAttribute("aria-label", t("aria.github"));
  document.getElementById("contact-linkedin-link").setAttribute("aria-label", t("aria.linkedin"));
  document.getElementById("profile-photo").setAttribute("alt", t("aria.photo"));

  document.getElementById("hero-heading").childNodes[0].textContent = `${t("hero.headingPrefix")} `;
  document.getElementById("hero-tag-1").lastChild.textContent = ` ${t("hero.tags.0")}`;
  document.getElementById("hero-tag-2").lastChild.textContent = ` ${t("hero.tags.1")}`;
  document.getElementById("hero-tag-3").lastChild.textContent = ` ${t("hero.tags.2")}`;
  document.getElementById("projects-button").textContent = t("hero.projectsButton");
  document.getElementById("contact-button").textContent = t("hero.contactButton");

  document.getElementById("about-heading").textContent = t("sections.about");
  document.getElementById("highlights-heading").textContent = t("sections.highlights");
  document.getElementById("skills-heading").textContent = t("sections.skills");
  document.getElementById("technologies-heading").textContent = t("sections.technologies");
  document.getElementById("technologies-intro").textContent = t("sections.technologiesIntro");
  document.getElementById("projects-heading").textContent = t("sections.projects");
  document.getElementById("experience-heading").textContent = t("sections.experience");
  document.getElementById("experience-intro").textContent = t("sections.experienceIntro");
  document.getElementById("contact-heading").textContent = t("sections.contact");

  document.getElementById("contact-email-title").textContent = t("contactTitles.email");
  document.getElementById("contact-github-title").textContent = t("contactTitles.github");
  document.getElementById("contact-linkedin-title").textContent = t("contactTitles.linkedin");
  document.getElementById("footer-text").textContent = t("footer");
}

function renderApp() {
  applyStaticTranslations();
  if (!appState.cv) return;

  populateProfileData(appState.cv);
  renderAIBadge(appState.cv);
  renderHighlights(appState.cv);
  renderSkills(appState.cv);
  renderTechnologies(appState.cv);
  renderProjects(appState.cv);
  renderExperiences(appState.cv);
  initTypingEffect();
}

async function init() {
  initThemeToggle();
  initLanguageToggle();

  appState.cv = await loadCVData();
  renderApp();

  initScrollReveal();
  initSmoothScroll();
  initLogoLink();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
