import React, { Component } from "react";

class Header extends Component {
  render() {
    if (this.props.sharedData) {
      var name = this.props.sharedData.name;
      var title = this.props.sharedData.titles[0];
      var profilepic = process.env.PUBLIC_URL + "/images/" + this.props.sharedData.image;
      var heroLabel = this.props.sharedData.hero.label;
      var heroSummary = this.props.sharedData.hero.summary;
      var heroExperienceCta = this.props.sharedData.hero.cta.experience;
      var heroProjectsCta = this.props.sharedData.hero.cta.projects;
    }

    return (
      <header id="home" className="hero reveal no-arc">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="section-label" style={{ marginBottom: "1.5rem" }}>
                {heroLabel}
              </span>
              <h1>{title}.</h1>
              <p>{heroSummary}</p>
              <div className="hero-cta">
                <a href="#experience" className="pill hero-btn-primary">
                  {heroExperienceCta}
                </a>
                <a href="#projects" className="pill hero-btn-ghost">
                  {heroProjectsCta}
                </a>
              </div>
            </div>
            <div className="hero-image-wrap">
              <img src={profilepic} alt={name} />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
