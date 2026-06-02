const fallbackTyping = [
  "Criando interfaces de alto impacto",
  "Focado em desempenho e experiência",
  "Projetos com visual profissional"
];

const iconMap = {
  html: "fa-brands fa-html5",
  css: "fa-brands fa-css3-alt",
  javascript: "fa-brands fa-js",
  python: "fa-brands fa-python",
  git: "fa-brands fa-git-alt",
  github: "fa-brands fa-github",
  n8n: "fa-solid fa-diagram-project",
  api: "fa-solid fa-plug",
  apis: "fa-solid fa-plug",
  automacao: "fa-solid fa-gears",
  inteligencia_artificial: "fa-solid fa-wand-magic-sparkles",
  qa: "fa-solid fa-vial-circle-check",
  cloud: "fa-solid fa-cloud",
  banco_de_dados: "fa-solid fa-database",
  integracoes: "fa-solid fa-code-branch"
};

function initApp() {
  loadCvData()
    .then(cv => {
      if (cv) {
        renderCv(cv);
      }

      const typingTexts = cv?.profile?.typing?.length
        ? cv.profile.typing
        : fallbackTyping;
      initTyping(typingTexts);
      initReveal();
    })
    .catch(error => {
      console.warn("Não foi possível carregar o currículo vivo.", error);
      initTyping(fallbackTyping);
      initReveal();
    });
}

async function loadCvData() {
  const response = await fetch("data/cv.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Falha ao carregar data/cv.json (${response.status})`);
  }
  return response.json();
}

function renderCv(cv) {
  const profile = cv.profile || {};

  setText("profile-title", profile.title);
  setText("profile-name", profile.name);
  setText("profile-summary", profile.summary);
  setText("about-text", profile.about);

  renderHeroTags(profile.hero_tags || []);
  renderHighlights(cv.highlights || []);
  renderSkills(cv.skills || []);
  renderTechnologies([...(cv.technologies || []), ...(cv.tools || [])]);
  renderProjects(cv.projects || []);
  renderExperiences(cv.experiences || []);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element.textContent = value;
  }
}

function renderHeroTags(tags) {
  const container = document.getElementById("hero-tags");
  if (!container || !tags.length) {
    return;
  }

  clearElement(container);
  tags.forEach(tag => {
    const item = document.createElement("span");
    item.append(createIcon(tag.icon, "fa-solid fa-check"), document.createTextNode(tag.label));
    container.appendChild(item);
  });
}

function renderHighlights(highlights) {
  const grid = document.getElementById("highlights-grid");
  if (!grid || !highlights.length) {
    return;
  }

  clearElement(grid);
  highlights.forEach(highlight => {
    const card = document.createElement("article");
    card.className = "info-card";
    card.appendChild(createIcon(iconFor(highlight, "fa-solid fa-lightbulb")));
    card.appendChild(createTitle(highlight.name, "h3"));
    card.appendChild(createParagraph(highlight.description));
    grid.appendChild(card);
  });
}

function renderSkills(skills) {
  const grid = document.getElementById("skills-grid");
  if (!grid || !skills.length) {
    return;
  }

  clearElement(grid);
  skills.forEach(skill => {
    const card = document.createElement("article");
    card.className = "skill-card";
    card.appendChild(createIcon(iconFor(skill, "fa-solid fa-code")));
    card.appendChild(createParagraph(skill.name));

    if (skill.category) {
      const category = document.createElement("small");
      category.textContent = skill.category;
      card.appendChild(category);
    }

    grid.appendChild(card);
  });
}

function renderTechnologies(items) {
  const grid = document.getElementById("technologies-grid");
  if (!grid) {
    return;
  }

  const technologies = uniqueByName(items);
  if (!technologies.length) {
    grid.closest(".section")?.setAttribute("hidden", "");
    return;
  }

  clearElement(grid);
  technologies.forEach(item => {
    const card = document.createElement("article");
    card.className = "tech-card";

    const top = document.createElement("div");
    top.className = "tech-top";
    top.appendChild(createTitle(item.name, "h3"));

    if (item.category) {
      const category = document.createElement("span");
      category.textContent = item.category;
      top.appendChild(category);
    }

    card.appendChild(top);
    if (item.description) {
      card.appendChild(createParagraph(item.description));
    }

    grid.appendChild(card);
  });
}

function renderProjects(projects) {
  const grid = document.getElementById("projects-grid");
  if (!grid || !projects.length) {
    return;
  }

  clearElement(grid);
  projects.forEach(project => {
    const card = document.createElement("article");
    card.className = "project-card";

    const top = document.createElement("div");
    top.className = "project-top";
    top.appendChild(createTitle(project.name, "h3"));

    if (project.category) {
      const category = document.createElement("span");
      category.textContent = project.category;
      top.appendChild(category);
    }

    card.appendChild(top);
    card.appendChild(createParagraph(project.description));

    const technologies = uniqueStrings(project.technologies || []);
    if (technologies.length) {
      const tags = document.createElement("div");
      tags.className = "project-tags";
      technologies.forEach(technology => {
        const tag = document.createElement("span");
        tag.textContent = technology;
        tags.appendChild(tag);
      });
      card.appendChild(tags);
    }

    const links = createLinks(project.links || []);
    if (links) {
      card.appendChild(links);
    }

    grid.appendChild(card);
  });
}

function renderExperiences(experiences) {
  const section = document.getElementById("experience");
  const grid = document.getElementById("experiences-grid");
  if (!section || !grid) {
    return;
  }

  if (!experiences.length) {
    section.setAttribute("hidden", "");
    return;
  }

  section.removeAttribute("hidden");
  clearElement(grid);

  experiences.forEach(experience => {
    const card = document.createElement("article");
    card.className = "experience-card";

    if (experience.category) {
      const category = document.createElement("span");
      category.textContent = experience.category;
      card.appendChild(category);
    }

    card.appendChild(createTitle(experience.name, "h3"));
    card.appendChild(createParagraph(experience.description));
    grid.appendChild(card);
  });
}

function createLinks(links) {
  const validLinks = links.filter(link => isSafeUrl(link.url));
  if (!validLinks.length) {
    return null;
  }

  const container = document.createElement("div");
  container.className = "links";

  validLinks.forEach(link => {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.append(
      createIcon(linkIcon(link.label), "fa-solid fa-link"),
      document.createTextNode(` ${link.label || "Link"}`)
    );
    container.appendChild(anchor);
  });

  return container;
}

function createTitle(text, tagName) {
  const title = document.createElement(tagName);
  title.textContent = text || "Sem título";
  return title;
}

function createParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text || "";
  return paragraph;
}

function createIcon(icon, fallback = "fa-solid fa-circle") {
  const element = document.createElement("i");
  element.className = safeIcon(icon, fallback);
  element.setAttribute("aria-hidden", "true");
  return element;
}

function iconFor(item, fallback) {
  const explicitIcon = safeIcon(item.icon, "");
  if (explicitIcon) {
    return explicitIcon;
  }

  const key = normalizeKey(item.name || item.category || "");
  return iconMap[key] || fallback;
}

function linkIcon(label = "") {
  const key = normalizeKey(label);
  if (key.includes("github")) {
    return "fa-brands fa-github";
  }
  if (key.includes("demo")) {
    return "fa-solid fa-arrow-up-right-from-square";
  }
  return "fa-solid fa-link";
}

function safeIcon(icon, fallback) {
  if (typeof icon === "string" && /^fa-(solid|regular|brands) fa-[a-z0-9-]+$/i.test(icon)) {
    return icon;
  }
  return fallback;
}

function isSafeUrl(url) {
  return typeof url === "string" && /^(https?:\/\/|mailto:)/i.test(url);
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function uniqueByName(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = normalizeKey(item.name || "");
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function uniqueStrings(items) {
  const seen = new Set();
  return items.filter(item => {
    const key = normalizeKey(item);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function normalizeKey(text) {
  return String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function initTyping(texts) {
  const typingElement = document.getElementById("typing");
  if (!typingElement || !texts.length) {
    return;
  }

  let index = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = texts[index];

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
      index = (index + 1) % texts.length;
    }

    setTimeout(type, isDeleting ? 45 : 85);
  }

  type();
}

function initReveal() {
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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
