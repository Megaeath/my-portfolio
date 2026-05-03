import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import $ from "jquery";
import App from "./App";

jest.mock("jquery", () => ({
  ajax: jest.fn(),
}));

const resumeData = {
  basic_info: {
    description_header: { en: "AI-Forward Solution Architect", th: "สถาปนิกโซลูชันที่ขับเคลื่อนด้วยแนวคิด AI" },
    description: { en: "English about copy", th: "ข้อความเกี่ยวกับผมภาษาไทย" },
    section_name: {
      about: { en: "About me", th: "เกี่ยวกับผม" },
      projects: { en: "Side Projects", th: "โปรเจกต์ส่วนตัว" },
      skills: { en: "Expertise", th: "ความเชี่ยวชาญ" },
      experience: { en: "Experience", th: "ประสบการณ์" },
      graduate: { en: "Education", th: "การศึกษา" }
    }
  },
  projects: [
    {
      title: { en: "TestMyKid Student App", th: "แอปนักเรียน TestMyKid" },
      startDate: "2026",
      description: { en: "English project copy", th: "ข้อความโปรเจกต์ภาษาไทย" },
      images: ["images/portfolio/testmykid/student-highlight.png"],
      url: "https://testmykid-27ac8.web.app/student/",
      technologies: []
    }
  ],
  experience: [
    {
      company: "TTB Bank",
      title: { en: "Senior Technical Lead", th: "Senior Technical Lead" },
      years: "May 2025 - Present",
      technologies: ["AI/LLM"],
      description: [
        { en: "English experience bullet", th: "รายละเอียดประสบการณ์ภาษาไทย" }
      ]
    }
  ],
  graduate: []
};

const sharedData = {
  basic_info: {
    name: "MR.Auii",
    image: "myProfile.png",
    titles: [
      { en: "AI-Driven Solution Architect", th: "Solution Architect ที่ขับเคลื่อนด้วย AI" }
    ],
    social: [],
    cert: [],
    hero: {
      label: { en: "AI-First Architecture", th: "สถาปัตยกรรมที่ให้ AI เป็นแกนหลัก" },
      summary: { en: "English hero summary", th: "สรุปส่วนหัวภาษาไทย" },
      cta: {
        experience: { en: "Explore Experience", th: "ดูประสบการณ์" },
        projects: { en: "Side Projects", th: "ดูโปรเจกต์ส่วนตัว" }
      }
    },
    footer: {
      tagline: { en: "Built for impact.", th: "สร้างขึ้นเพื่อให้เกิดผลลัพธ์จริง" }
    }
  },
  skills: {
    icons: [
      { name: { en: "Generative AI", th: "Generative AI" }, class: "fas fa-brain", level: "95" }
    ]
  }
};

beforeEach(() => {
  $.ajax.mockReset();
  window.localStorage.clear();
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
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
