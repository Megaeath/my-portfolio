import React, { Component } from "react";
import Typical from "react-typical";
import Switch from "react-switch";

class Header extends Component {
  titles = [];

  constructor() {
    super();
    this.state = { checked: false };
    this.onThemeSwitchChange = this.onThemeSwitchChange.bind(this);
  }

  onThemeSwitchChange(checked) {
    this.setState({ checked });
    this.setTheme();
  }

  setTheme() {
    var dataThemeAttribute = "data-theme";
    var body = document.body;
    var newTheme =
      body.getAttribute(dataThemeAttribute) === "dark" ? "light" : "dark";
    body.setAttribute(dataThemeAttribute, newTheme);
  }

  render() {
    let name = "";
    let social = [];
    if (this.props.sharedData) {
      name = this.props.sharedData.name;
      social = this.props.sharedData.social || [];
      this.titles = this.props.sharedData.titles.map(x => [ x.toUpperCase(), 1500 ] ).flat();
    }

    const websiteLink = social.find((item) => item.name === "website");
    const linkedinLink = social.find((item) => item.name === "linkedin");

    const HeaderTitleTypeAnimation = React.memo( () => {
      return <Typical className="title-styles" steps={this.titles} loop={50} />
    }, (props, prevProp) => true);

    return (
      <header id="home" className="hero fx-section" style={{ minHeight: window.innerHeight - 120, display: "block" }}>
        <div className="row aligner" style={{ height: "100%" }}>
          <div className="col-md-12">
            <div className="hero-card">
              <div className="hero-beam hero-beam-a" />
              <div className="hero-beam hero-beam-b" />
              <div className="hero-icon-wrap cat-pod">
                <span className="cat-shadow" />
                <span className="iconify header-icon cat-walk" data-icon="game-icons:cat" data-inline="false"></span>
                <span className="iconify cat-paw paw-1" data-icon="mdi:paw" data-inline="false"></span>
                <span className="iconify cat-paw paw-2" data-icon="mdi:paw" data-inline="false"></span>
                <span className="iconify cat-paw paw-3" data-icon="mdi:paw" data-inline="false"></span>
              </div>

              <h1 className="mb-0 hero-name glitch" data-text={name}>
                <Typical steps={[name]} wrapper="p" />
              </h1>
              <p className="hero-intro">I build reliable systems, cloud-first platforms, and delightful digital products.</p>
              <div className="title-container">
                <HeaderTitleTypeAnimation />
              </div>

              <div className="hero-actions">
                {websiteLink ? (
                  <a href={websiteLink.url} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-primary">
                    View Website
                  </a>
                ) : null}
                {linkedinLink ? (
                  <a href={linkedinLink.url} target="_blank" rel="noopener noreferrer" className="hero-btn hero-btn-ghost">
                    LinkedIn
                  </a>
                ) : null}
              </div>

              <div className="theme-switch-wrap">
                <Switch
                  checked={this.state.checked}
                  onChange={this.onThemeSwitchChange}
                  offColor="#baaa80"
                  onColor="#353535"
                  className="react-switch mx-auto"
                  width={90}
                  height={40}
                  uncheckedIcon={
                    <span
                      className="iconify"
                      data-icon="f7:moon-zzz-fill"
                      data-inline="false"
                      style={{
                        display: "block",
                        height: "100%",
                        fontSize: 25,
                        textAlign: "end",
                        marginLeft: "20px",
                        color: "#353239",
                      }}
                    ></span>
                  }
                  checkedIcon={
                    <span
                      className="iconify"
                      data-icon="emojione-v1:sun-with-face"
                      data-inline="false"
                      style={{
                        display: "block",
                        height: "100%",
                        fontSize: 25,
                        textAlign: "end",
                        marginLeft: "10px",
                        color: "#353239",
                      }}
                    ></span>
                  }
                  id="icon-switch"
                />
              </div>

              <div className="hero-marquee" aria-hidden="true">
                <div className="hero-marquee-track">
                  <span>React</span>
                  <span>Cloud</span>
                  <span>Node.js</span>
                  <span>DevOps</span>
                  <span>UI Motion</span>
                  <span>System Design</span>
                  <span>React</span>
                  <span>Cloud</span>
                  <span>Node.js</span>
                  <span>DevOps</span>
                  <span>UI Motion</span>
                  <span>System Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
