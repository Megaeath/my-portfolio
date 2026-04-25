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

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      resumeData: {},
      sharedData: {},
    };
  }

  componentDidMount() {
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

  render() {
    const sharedData = this.state.sharedData.basic_info;
    const resumeData = this.state.resumeData;

    return (
      <div className="app-shell">
        <nav className="nav">
          <div className="container nav-container">
            <div className="nav-logo">{sharedData?.name}</div>
            <div className="nav-links">
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#skills">Expertise</a>
              <a href="#projects">Work</a>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Header sharedData={sharedData} />
          <About resumeBasicInfo={resumeData.basic_info} sharedBasicInfo={sharedData} />
          <Experience resumeExperience={resumeData.experience} resumeBasicInfo={resumeData.basic_info} />
          <Skills sharedSkills={this.state.sharedData.skills} resumeBasicInfo={resumeData.basic_info} />
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
