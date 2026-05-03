import fs from "fs";
import path from "path";

const resumePath = path.resolve(__dirname, "../../public/res_primaryLanguage.json");
const sharedPath = path.resolve(__dirname, "../../public/portfolio_shared_data.json");

const resumeData = JSON.parse(fs.readFileSync(resumePath, "utf8"));
const sharedData = JSON.parse(fs.readFileSync(sharedPath, "utf8"));

function expectLocalizedValue(value, label) {
  expect(value).toEqual(
    expect.objectContaining({
      en: expect.any(String),
      th: expect.any(String),
    })
  );

  expect(value.en.length).toBeGreaterThan(0);
  expect(value.th.length).toBeGreaterThan(0);
}

test("stores portfolio copy as explicit english and thai values", () => {
  expectLocalizedValue(resumeData.basic_info.description_header, "about heading");
  expectLocalizedValue(resumeData.basic_info.description, "about body");
  expectLocalizedValue(resumeData.basic_info.section_name.about, "about label");
  expectLocalizedValue(resumeData.basic_info.section_name.projects, "projects label");
  expectLocalizedValue(resumeData.projects[0].title, "project title");
  expectLocalizedValue(resumeData.projects[0].description, "project description");
  expectLocalizedValue(resumeData.experience[0].title, "experience title");
  expectLocalizedValue(resumeData.experience[0].description[0], "experience bullet");
  expectLocalizedValue(sharedData.basic_info.titles[0], "hero rotating title");
  expectLocalizedValue(sharedData.basic_info.hero.label, "hero label");
  expectLocalizedValue(sharedData.basic_info.hero.summary, "hero summary");
  expectLocalizedValue(sharedData.basic_info.hero.cta.experience, "hero experience CTA");
  expectLocalizedValue(sharedData.basic_info.footer.tagline, "footer tagline");
  expectLocalizedValue(sharedData.skills.icons[0].name, "skill name");
  expectLocalizedValue(sharedData.basic_info.cert[0].title, "certificate title");
});
