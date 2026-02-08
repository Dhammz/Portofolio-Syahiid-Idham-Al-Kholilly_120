const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("[data-nav]");
const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

const setTheme = (theme) => {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", "true");
      themeToggle.textContent = "Mode Terang";
    }
    return;
  }

  root.removeAttribute("data-theme");
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", "false");
    themeToggle.textContent = "Mode Gelap";
  }
};

const storedTheme = localStorage.getItem("theme");
const normalizedTheme =
  storedTheme === "dark" ? "dark" : storedTheme === "colorblind" ? "colorblind" : storedTheme === "light" ? "colorblind" : null;
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(normalizedTheme ?? (prefersDark ? "dark" : "colorblind"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const nextTheme = isDark ? "colorblind" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  });
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const year = document.querySelector("[data-year]");
if (year) {
  year.textContent = new Date().getFullYear();
}

const backTop = document.querySelector(".back-top");
if (backTop) {
  backTop.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");
const linkById = new Map(Array.from(navLinks).map((link) => {
  const id = link.getAttribute("href")?.replace("#", "");
  return [id, link];
}));

if (sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const current = linkById.get(entry.target.id);
          if (current) {
            current.classList.add("active");
          }
        }
      });
    },
    {
      rootMargin: "-40% 0px -55% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}
