import React from "react";
import { render, screen } from "@testing-library/react";
import $ from "jquery";
import App from "./App";

jest.mock("jquery", () => ({
  ajax: jest.fn(),
}));

beforeEach(() => {
  $.ajax.mockReset();
  window.IntersectionObserver = jest.fn(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

test("renders the portfolio navigation and work section without crashing", async () => {
  $.ajax.mockImplementation(({ url, success }) => {
    if (url === "portfolio_shared_data.json") {
      success({
        basic_info: {
          name: "MR.Auii",
          titles: ["AI-Driven Solution Architect"],
          image: "myProfile.png",
          social: [],
          cert: [],
        },
        skills: {
          icons: [],
        },
      });
      return;
    }

    success({
      basic_info: {
        description_header: "AI-First Solution Architect",
        description: "English about copy",
        section_name: {
          about: "About me",
          projects: "Side Projects",
          skills: "Expertise",
          experience: "Experience",
          graduate: "Graduation",
        },
      },
      projects: [
        {
          title: "TestMyKid Student App",
          startDate: "2026",
          description: "Student-facing learning experience.",
          images: ["images/portfolio/testmykid/student-highlight.png"],
          url: "https://testmykid-27ac8.web.app/student/",
          technologies: [],
        },
      ],
      experience: [],
      graduate: [],
    });
  });

  render(<App />);

  expect(await screen.findByText("About")).toBeInTheDocument();
  expect(screen.getByText("Work")).toBeInTheDocument();
  expect(await screen.findByText("TestMyKid Student App")).toBeInTheDocument();
});
