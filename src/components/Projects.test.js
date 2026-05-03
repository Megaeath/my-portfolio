import React from "react";
import { render, screen } from "@testing-library/react";
import Projects from "./Projects";

const resumeBasicInfo = {
  section_name: {
    projects: "Side Projects",
  },
};

const resumeProjects = [
  {
    title: "Linked Project",
    startDate: "2026",
    description: "Opens an external project URL.",
    images: ["images/portfolio/testmykid/student-highlight.png"],
    url: "https://example.com/project",
  },
  {
    title: "Plain Project",
    startDate: "2025",
    description: "Does not expose a project URL.",
    images: ["images/portfolio/animal-shelter/p1.jpg"],
    url: "",
  },
];

test("renders linked project cards as anchors and plain project cards as static content", () => {
  const { container } = render(
    <Projects
      resumeBasicInfo={resumeBasicInfo}
      resumeProjects={resumeProjects}
    />
  );

  const linkedCard = screen.getByRole("link", { name: /linked project/i });
  expect(linkedCard).toHaveAttribute("href", "https://example.com/project");
  expect(linkedCard).toHaveAttribute("target", "_blank");
  expect(linkedCard).toHaveAttribute("rel", "noopener noreferrer");

  const plainTitle = screen.getByText("Plain Project");
  const plainCard = plainTitle.closest(".project-card");
  expect(plainCard.tagName).toBe("DIV");
  expect(container.querySelectorAll("a.project-card")).toHaveLength(1);
});

test("prefixes project image paths with PUBLIC_URL for hosted deployments", () => {
  const originalPublicUrl = process.env.PUBLIC_URL;
  process.env.PUBLIC_URL = "/my-portfolio";

  render(
    <Projects
      resumeBasicInfo={resumeBasicInfo}
      resumeProjects={resumeProjects}
    />
  );

  const linkedImage = screen.getByAltText("Linked Project");
  expect(linkedImage).toHaveAttribute(
    "src",
    "/my-portfolio/images/portfolio/testmykid/student-highlight.png"
  );

  process.env.PUBLIC_URL = originalPublicUrl;
});
