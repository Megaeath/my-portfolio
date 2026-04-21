import React, { Component } from "react";
import $ from "jquery";
import "./App.scss";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Graduation from "./components/Graduation";
import Certificate from "./components/Certificate";
class App extends Component {

  constructor(props) {
    super();
    this.state = {
      foo: "bar",
      resumeData: {},
      sharedData: {},
    };
    this.sectionObserver = null;
  }

  applyPickedLanguage() {

    this.loadResumeFromPath(`res_primaryLanguage.json`);
  }

  swapCurrentlyActiveLanguage(oppositeLangIconId) {
    var pickedLangIconId = window.$primaryLanguageIconId;
    document
      .getElementById(oppositeLangIconId)
      .removeAttribute("filter", "brightness(40%)");
    document
      .getElementById(pickedLangIconId)
      .setAttribute("filter", "brightness(40%)");
  }

  componentDidMount() {
    this.loadSharedData();
    this.applyPickedLanguage(
    );
    this.initSectionReveal();
  }

  componentWillUnmount() {
    if (this.sectionObserver) {
      this.sectionObserver.disconnect();
      this.sectionObserver = null;
    }
  }

  initSectionReveal() {
    const sections = document.querySelectorAll(".fx-section");

    if (!sections.length) {
      return;
    }

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    sections.forEach((section) => this.sectionObserver.observe(section));
  }

  loadResumeFromPath(path) {
    $.ajax({
      url: path,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ resumeData: data });
      }.bind(this),
      error: function (xhr, status, err) {
        alert(err);
      },
    });
  }

  loadSharedData() {
    $.ajax({
      url: `portfolio_shared_data.json`,
      dataType: "json",
      cache: false,
      success: function (data) {
        this.setState({ sharedData: data });
        document.title = `${this.state.sharedData.basic_info.name}`;
      }.bind(this),
      error: function (xhr, status, err) {
        alert(err);
      },
    });
  }

  render() {
    return (
      <div className="app-shell">
        <div className="cyber-grid" />
        <div className="aurora-band" />
        <div className="noise-overlay" />
        <div className="floating-shapes">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={`shape-${index}`} className="shape-dot" />
          ))}
        </div>
        <div className="bg-orb orb-1" />
        <div className="bg-orb orb-2" />
        <div className="bg-orb orb-3" />
        <Header sharedData={this.state.sharedData.basic_info} />

        <main className="content-shell">
          <About
            resumeBasicInfo={this.state.resumeData.basic_info}
            sharedBasicInfo={this.state.sharedData.basic_info}
          />
          <Certificate sharedBasicInfo={this.state.sharedData.basic_info} />
          <Experience
            resumeExperience={this.state.resumeData.experience}
            resumeBasicInfo={this.state.resumeData.basic_info}
          />
          <Graduation
            resumeGraduate={this.state.resumeData.graduate}
            resumeBasicInfo={this.state.resumeData.basic_info}
          />
          <Skills
            sharedSkills={this.state.sharedData.skills}
            resumeBasicInfo={this.state.resumeData.basic_info}
          />
          <Projects
            resumeProjects={this.state.resumeData.projects}
            resumeBasicInfo={this.state.resumeData.basic_info}
          />
        </main>
        <Footer sharedBasicInfo={this.state.sharedData.basic_info} />
      </div>
    );
  }
}

export default App;
