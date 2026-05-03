import React from "react";
import { act, fireEvent, render, screen, wait as waitFor, within } from "@testing-library/react";
import $ from "jquery";
import App from "./App";
import Header from "./components/Header";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certificate from "./components/Certificate";
import Graduation from "./components/Graduation";
import Footer from "./components/Footer";

jest.mock("jquery", () => ({
  ajax: jest.fn(),
}));

jest.mock("./components/Header", () => {
  const React = require("react");
  const ActualHeader = jest.requireActual("./components/Header").default;
  return jest.fn((props) => <ActualHeader {...props} />);
});

jest.mock("./components/About", () => {
  const React = require("react");
  const ActualAbout = jest.requireActual("./components/About").default;
  return jest.fn((props) => <ActualAbout {...props} />);
});

jest.mock("./components/Experience", () => {
  const React = require("react");
  const ActualExperience = jest.requireActual("./components/Experience").default;
  return jest.fn((props) => <ActualExperience {...props} />);
});

jest.mock("./components/Projects", () => {
  const React = require("react");
  const ActualProjects = jest.requireActual("./components/Projects").default;
  return jest.fn((props) => <ActualProjects {...props} />);
});

jest.mock("./components/Skills", () => {
  const React = require("react");
  const ActualSkills = jest.requireActual("./components/Skills").default;
  return jest.fn((props) => <ActualSkills {...props} />);
});

jest.mock("./components/Certificate", () => {
  const React = require("react");
  const ActualCertificate = jest.requireActual("./components/Certificate").default;
  return jest.fn((props) => <ActualCertificate {...props} />);
});

jest.mock("./components/Graduation", () => {
  const React = require("react");
  const ActualGraduation = jest.requireActual("./components/Graduation").default;
  return jest.fn((props) => <ActualGraduation {...props} />);
});

jest.mock("./components/Footer", () => {
  const React = require("react");
  const ActualFooter = jest.requireActual("./components/Footer").default;
  return jest.fn((props) => <ActualFooter {...props} />);
});

const resumeData = {
  basic_info: {
    description_header: { en: "AI-Forward Solution Architect", th: "สถาปนิกโซลูชันที่ขับเคลื่อนด้วยแนวคิด AI" },
    description: { en: "English about copy", th: "ข้อความเกี่ยวกับผมภาษาไทย" },
    section_name: {
      about: { en: "About me", th: "เกี่ยวกับผม" },
      projects: { en: "Side Projects", th: "โปรเจกต์ส่วนตัว" },
      skills: { en: "Expertise", th: "ความเชี่ยวชาญ" },
      experience: { en: "Experience", th: "ประสบการณ์" },
      graduate: { en: "Education", th: "การศึกษา" },
    },
    section_title: {
      projects: { en: "Selected Engineering Work", th: "ผลงานวิศวกรรมที่คัดสรร" },
      skills: { en: "Technical Expertise", th: "ความเชี่ยวชาญทางเทคนิค" },
      experience: { en: "Professional Trajectory", th: "เส้นทางสายอาชีพ" },
      graduate: { en: "Academic Foundation", th: "พื้นฐานทางการศึกษา" },
    },
  },
  projects: [
    {
      title: { en: "TestMyKid Student App", th: "แอปนักเรียน TestMyKid" },
      startDate: "2026",
      description: { en: "English project copy", th: "ข้อความโปรเจกต์ภาษาไทย" },
      images: ["images/portfolio/testmykid/student-highlight.png"],
      url: "https://testmykid-27ac8.web.app/student/",
      technologies: [],
    },
  ],
  experience: [
    {
      company: "TTB Bank",
      title: { en: "Senior Technical Lead", th: "Senior Technical Lead" },
      years: "May 2025 - Present",
      technologies: ["AI/LLM"],
      description: [{ en: "English experience bullet", th: "รายละเอียดประสบการณ์ภาษาไทย" }],
    },
  ],
  graduate: [
    {
      company: "AWS Certification",
      title: { en: "AWS Cloud Practitioner", th: "AWS Cloud Practitioner" },
      years: "01.2021 - present",
      technologies: ["AWS"],
    },
    {
      company: "King Mongkut's University Of Technology North Bangkok",
      title: { en: "Master's degree", th: "ปริญญาโท" },
      years: "01.2010 - 03.2012",
      technologies: ["Information Technology"],
    },
  ],
};

const sharedData = {
  basic_info: {
    name: "MR.Auii",
    image: "myProfile.png",
    titles: [{ en: "AI-Driven Solution Architect", th: "Solution Architect ที่ขับเคลื่อนด้วย AI" }],
    social: [],
    cert: [
      {
        title: {
          en: "Certified Cloud Practitioner",
          th: "ใบรับรอง Certified Cloud Practitioner",
        },
        url: "https://example.com/cert",
        icon: "cert.png",
      },
    ],
    hero: {
      label: { en: "AI-First Architecture", th: "สถาปัตยกรรมที่ให้ AI เป็นแกนหลัก" },
      summary: { en: "English hero summary", th: "สรุปส่วนหัวภาษาไทย" },
      cta: {
        experience: { en: "Explore Experience", th: "ดูประสบการณ์" },
        projects: { en: "Side Projects", th: "ดูโปรเจกต์ส่วนตัว" },
      },
    },
    footer: {
      tagline: { en: "Built for impact.", th: "สร้างขึ้นเพื่อให้เกิดผลลัพธ์จริง" },
    },
    certificates: {
      label: { en: "Certifications", th: "ใบรับรอง" },
      title: { en: "Industry Credentials", th: "ใบรับรองวิชาชีพ" },
    },
  },
  skills: {
    icons: [{ name: { en: "Generative AI", th: "Generative AI" }, class: "fas fa-brain", level: "95" }],
  },
};

let intersectionObserverCallbacks = [];
let intersectionObserverInstances = [];

beforeEach(() => {
  $.ajax.mockReset();
  Header.mockClear();
  About.mockClear();
  Experience.mockClear();
  Projects.mockClear();
  Skills.mockClear();
  Certificate.mockClear();
  Graduation.mockClear();
  Footer.mockClear();
  window.localStorage.clear();
  intersectionObserverCallbacks = [];
  intersectionObserverInstances = [];
  window.IntersectionObserver = jest.fn((callback) => {
    const instance = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    };

    intersectionObserverCallbacks.push(callback);
    intersectionObserverInstances.push(instance);

    return instance;
  });
});

afterEach(() => {
  jest.useRealTimers();
});

test("defaults to english, restores saved language, and persists language changes", async () => {
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  window.localStorage.setItem("portfolio-language", "th");

  render(<App />);

  expect((await screen.findAllByText("เกี่ยวกับผม")).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole("button", { name: "EN" }));

  expect((await screen.findAllByText("About me")).length).toBeGreaterThan(0);
  expect(window.localStorage.getItem("portfolio-language")).toBe("en");
});

test("defaults to english when localStorage is empty", async () => {
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("English hero summary")).toBeInTheDocument();
  });

  expect(screen.queryByText("สรุปส่วนหัวภาษาไทย")).toBeNull();
  expect(window.localStorage.getItem("portfolio-language")).toBeNull();
  expect(screen.getByRole("button", { name: "EN" })).toHaveClass("active");
  expect(screen.getByRole("button", { name: "TH" })).toBeInTheDocument();
});

test("does not fall back to raw section ids before localized nav labels load", async () => {
  jest.useFakeTimers();
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  const { container } = render(<App />);
  const navLinks = container.querySelector(".nav-links");

  await waitFor(() => {
    expect(within(navLinks).getByRole("link", { name: "About me" })).toBeInTheDocument();
  });

  act(() => {
    jest.advanceTimersByTime(500);
  });

  const aboutLink = within(navLinks).getByRole("link", { name: "About me" });
  expect(aboutLink.textContent).toBe("About me");
});

test("highlights the nav link for the section currently marked visible by the observer", async () => {
  jest.useFakeTimers();
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  const { container } = render(<App />);
  const navLinks = container.querySelector(".nav-links");

  await waitFor(() => {
    expect(within(navLinks).getByRole("link", { name: "Side Projects" })).toBeInTheDocument();
  });

  act(() => {
    jest.advanceTimersByTime(500);
  });

  const aboutLink = within(navLinks).getByRole("link", { name: "About me" });
  const projectsLink = within(navLinks).getByRole("link", { name: "Side Projects" });
  const aboutSection = document.getElementById("about");
  const projectsSection = document.getElementById("projects");

  expect(intersectionObserverInstances.length).toBeGreaterThan(0);
  expect(aboutSection).not.toBeNull();
  expect(projectsSection).not.toBeNull();

  act(() => {
    const sectionEntries = [
      {
        target: aboutSection,
        isIntersecting: false,
        boundingClientRect: { top: -24 },
      },
      {
        target: projectsSection,
        isIntersecting: true,
        boundingClientRect: { top: 120 },
      },
    ];

    intersectionObserverCallbacks.forEach((callback) => callback(sectionEntries));
  });

  expect(projectsLink).toHaveClass("active");
  expect(aboutLink).not.toHaveClass("active");
});

test("prefers the topmost intersecting section when multiple nav sections are visible", async () => {
  jest.useFakeTimers();
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  const { container } = render(<App />);
  const navLinks = container.querySelector(".nav-links");

  await waitFor(() => {
    expect(within(navLinks).getByRole("link", { name: "About me" })).toBeInTheDocument();
  });

  act(() => {
    jest.advanceTimersByTime(500);
  });

  const aboutLink = within(navLinks).getByRole("link", { name: "About me" });
  const projectsLink = within(navLinks).getByRole("link", { name: "Side Projects" });
  const aboutSection = document.getElementById("about");
  const projectsSection = document.getElementById("projects");

  act(() => {
    const sectionEntries = [
      {
        target: aboutSection,
        isIntersecting: true,
        boundingClientRect: { top: 32 },
      },
      {
        target: projectsSection,
        isIntersecting: true,
        boundingClientRect: { top: 140 },
      },
    ];

    intersectionObserverCallbacks.forEach((callback) => callback(sectionEntries));
  });

  expect(aboutLink).toHaveClass("active");
  expect(projectsLink).not.toHaveClass("active");
});

function getLastProps(componentMock) {
  return componentMock.mock.calls[componentMock.mock.calls.length - 1][0];
}

test("localizes rendered component props so they receive strings instead of bilingual objects", async () => {
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  window.localStorage.setItem("portfolio-language", "th");

  render(<App />);

  await screen.findAllByText("เกี่ยวกับผม");

  expect(getLastProps(Header).sharedData.titles[0]).toBe("Solution Architect ที่ขับเคลื่อนด้วย AI");
  expect(getLastProps(Certificate).sharedBasicInfo.cert[0].title).toBe(
    "ใบรับรอง Certified Cloud Practitioner"
  );
  expect(getLastProps(Graduation).resumeGraduate[1].title).toBe("ปริญญาโท");
  expect(getLastProps(Projects).resumeProjects[0].title).toBe("แอปนักเรียน TestMyKid");
  expect(getLastProps(Experience).resumeExperience[0].description[0]).toBe(
    "รายละเอียดประสบการณ์ภาษาไทย"
  );
  expect(getLastProps(Skills).sharedSkills.icons[0].name).toBe("Generative AI");
  expect(getLastProps(About).resumeBasicInfo.description_header).toBe(
    "สถาปนิกโซลูชันที่ขับเคลื่อนด้วยแนวคิด AI"
  );
  expect(getLastProps(Footer).sharedBasicInfo.name).toBe("MR.Auii");
  expect(getLastProps(Footer).sharedBasicInfo.footer.tagline).toBe("สร้างขึ้นเพื่อให้เกิดผลลัพธ์จริง");
});

test("switches visible hero, project, experience, and footer copy together", async () => {
  $.ajax.mockImplementation(({ url, success }) => {
    success(url === "res_primaryLanguage.json" ? resumeData : sharedData);
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("AI-Driven Solution Architect.")).toBeInTheDocument();
  });

  expect(screen.getByText("English hero summary")).toBeInTheDocument();
  expect(screen.getByText("English project copy")).toBeInTheDocument();
  expect(screen.getByText("English experience bullet")).toBeInTheDocument();
  expect(screen.getByText(/Built for impact\./)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /TestMyKid Student App/i })).toHaveAttribute(
    "href",
    "https://testmykid-27ac8.web.app/student/"
  );

  fireEvent.click(screen.getByRole("button", { name: "TH" }));

  await waitFor(() => {
    expect(screen.getByText("Solution Architect ที่ขับเคลื่อนด้วย AI.")).toBeInTheDocument();
  });

  expect(screen.getByText("สรุปส่วนหัวภาษาไทย")).toBeInTheDocument();
  expect(screen.getByText("ข้อความโปรเจกต์ภาษาไทย")).toBeInTheDocument();
  expect(screen.getByText("รายละเอียดประสบการณ์ภาษาไทย")).toBeInTheDocument();
  expect(screen.getByText(/สร้างขึ้นเพื่อให้เกิดผลลัพธ์จริง/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /แอปนักเรียน TestMyKid/i })).toHaveAttribute(
    "href",
    "https://testmykid-27ac8.web.app/student/"
  );
});

test("observes certification cards that render after shared data loads", async () => {
  jest.useFakeTimers();

  const observe = jest.fn();
  window.IntersectionObserver = jest.fn(() => ({
    observe,
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  $.ajax.mockImplementation(({ url, success }) => {
    const payload = url === "res_primaryLanguage.json" ? resumeData : sharedData;
    const delay = url === "portfolio_shared_data.json" ? 600 : 0;
    setTimeout(() => success(payload), delay);
  });

  render(<App />);

  act(() => {
    jest.advanceTimersByTime(600);
  });

  const certLink = await screen.findByRole("link", { name: /Certified Cloud Practitioner/i });

  expect(observe).toHaveBeenCalledWith(certLink);

  jest.useRealTimers();
});
