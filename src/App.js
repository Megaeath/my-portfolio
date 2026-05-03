import React, { Component } from "react";
import $ from "jquery";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Certificate from "./components/Certificate";
import Graduation from "./components/Graduation";
import LanguageToggle from "./components/LanguageToggle";
import {
  DEFAULT_LANGUAGE,
  getLocalizedValue,
  readStoredLanguage,
  writeStoredLanguage,
} from "./utils/language";

function localizeField(value, language) {
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.prototype.hasOwnProperty.call(value, "en") &&
    Object.prototype.hasOwnProperty.call(value, "th")
  ) {
    return getLocalizedValue(value, language);
  }

  return value;
}

function localizeSharedBasicInfo(basicInfo, language) {
  if (!basicInfo) {
    return basicInfo;
  }

  return {
    ...basicInfo,
    titles: basicInfo.titles?.map((title) => localizeField(title, language)),
  };
}

function localizeResumeBasicInfo(basicInfo, language) {
  if (!basicInfo) {
    return basicInfo;
  }

  return {
    ...basicInfo,
    description_header: localizeField(basicInfo.description_header, language),
    description: localizeField(basicInfo.description, language),
    section_name: basicInfo.section_name
      ? {
          ...basicInfo.section_name,
          about: localizeField(basicInfo.section_name.about, language),
          projects: localizeField(basicInfo.section_name.projects, language),
          skills: localizeField(basicInfo.section_name.skills, language),
          experience: localizeField(basicInfo.section_name.experience, language),
          graduate: localizeField(basicInfo.section_name.graduate, language),
        }
      : basicInfo.section_name,
  };
}

function localizeProjects(projects, language) {
  return projects?.map((project) => ({
    ...project,
    title: localizeField(project.title, language),
    description: localizeField(project.description, language),
  }));
}

function localizeExperience(experience, language) {
  return experience?.map((item) => ({
    ...item,
    title: localizeField(item.title, language),
    description: item.description?.map((line) => localizeField(line, language)),
  }));
}

function localizeSkills(skills, language) {
  if (!skills) {
    return skills;
  }

  return {
    ...skills,
    icons: skills.icons?.map((skill) => ({
      ...skill,
      name: localizeField(skill.name, language),
    })),
  };
}

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      resumeData: {},
      sharedData: {},
      language: DEFAULT_LANGUAGE,
    };
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  componentDidMount() {
    this.setState({ language: readStoredLanguage() });
    this.loadSharedData();
    this.loadResumeData();
    this.initScrollReveal();
  }

  initScrollReveal() {
    const observerOptions = { 
      threshold: [0, 0.1, 0.5, 0.9, 1],
      rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const { target, isIntersecting, boundingClientRect } = entry;
        
        if (isIntersecting) {
          target.classList.add("active");
          target.classList.remove("past");
        } else {
          // If the element is above the viewport (it's "past")
          if (boundingClientRect.top < 0) {
            target.classList.add("past");
            target.classList.remove("active");
          } else {
            // It's below the viewport (reset to incoming state)
            target.classList.remove("active");
            target.classList.remove("past");
          }
        }
      });
    }, observerOptions);

    const observeElements = () => {
      document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    };

    setTimeout(observeElements, 500);
  }

  loadResumeData() {
    $.ajax({
      url: `res_primaryLanguage.json`,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function (xhr, status, err) { console.error(err); },
    });
  }

  loadSharedData() {
    $.ajax({
      url: `portfolio_shared_data.json`,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ sharedData: data });
        if (data.basic_info) document.title = data.basic_info.name;
      }.bind(this),
      error: function (xhr, status, err) { console.error(err); },
    });
  }

  handleLanguageChange(language) {
    writeStoredLanguage(language);
    this.setState({ language });
  }

  render() {
    const { language, resumeData: resumeDataState, sharedData: sharedDataState } = this.state;
    const sharedData = localizeSharedBasicInfo(sharedDataState.basic_info, language);
    const resumeBasicInfo = localizeResumeBasicInfo(resumeDataState.basic_info, language);
    const resumeData = {
      ...resumeDataState,
      basic_info: resumeBasicInfo,
      experience: localizeExperience(resumeDataState.experience, language),
      graduate: resumeDataState.graduate,
      projects: localizeProjects(resumeDataState.projects, language),
    };
    const navLabels = resumeBasicInfo?.section_name
      ? {
          about: resumeBasicInfo.section_name.about,
          experience: resumeBasicInfo.section_name.experience,
          skills: resumeBasicInfo.section_name.skills,
          projects: resumeBasicInfo.section_name.projects,
        }
      : null;

    return (
      <div className="app-shell">
        <nav className="nav">
          <div className="container nav-container">
            <div className="nav-logo">{sharedData?.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div className="nav-links">
                <a href="#about">{navLabels?.about}</a>
                <a href="#experience">{navLabels?.experience}</a>
                <a href="#skills">{navLabels?.skills}</a>
                <a href="#projects">{navLabels?.projects}</a>
              </div>
              <LanguageToggle
                currentLanguage={language}
                onChange={this.handleLanguageChange}
              />
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Header sharedData={sharedData} />
          <About resumeBasicInfo={resumeData.basic_info} sharedBasicInfo={sharedData} />
          <Experience resumeExperience={resumeData.experience} resumeBasicInfo={resumeData.basic_info} />
          <Skills sharedSkills={localizeSkills(sharedDataState.skills, language)} resumeBasicInfo={resumeData.basic_info} />
          <Certificate sharedBasicInfo={sharedData} />
          <Graduation resumeGraduate={resumeData.graduate} resumeBasicInfo={resumeData.basic_info} />
          <Projects resumeProjects={resumeData.projects} resumeBasicInfo={resumeData.basic_info} />
        </main>

        <Footer sharedBasicInfo={sharedData} />
      </div>
    );
  }
}

export default App;
