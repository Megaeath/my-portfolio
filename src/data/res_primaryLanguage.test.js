import fs from "fs";
import path from "path";

const resumePath = path.resolve(__dirname, "../../public/res_primaryLanguage.json");
const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf8"));

test("keeps TestMyKid as the first side project with a screenshot thumbnail", () => {
  expect(resumeData.projects[0]).toMatchObject({
    title: {
      en: "TestMyKid Student App",
      th: "แอปนักเรียน TestMyKid",
    },
    startDate: "2026",
    url: "https://testmykid-27ac8.web.app/student/",
  });

  expect(resumeData.projects[0].images[0]).toBe(
    "images/portfolio/testmykid/student-highlight.png"
  );

  expect(
    fs.existsSync(
      path.resolve(__dirname, "../../public", resumeData.projects[0].images[0])
    )
  ).toBe(true);
});
