import React, { Component } from "react";

class Header extends Component {
  render() {
    if (this.props.sharedData) {
      var name = this.props.sharedData.name;
      var title = this.props.sharedData.titles[0];
      var profilepic = process.env.PUBLIC_URL + "/images/" + this.props.sharedData.image;
    }

    return (
      <header id="home" className="hero reveal no-arc">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="section-label" style={{ marginBottom: '1.5rem' }}>AI-First Architecture</span>
              <h1>{title}.</h1>
              <p>
                Leading the evolution of enterprise systems through <strong>Generative AI</strong> and <strong>Agentic Frameworks</strong>. I architect intelligent, scalable cloud solutions that bridge the gap between robust backend engineering and the future of AI.
              </p>
              <div className="hero-cta">
                <a href="#experience" className="pill hero-btn-primary">
                  Explore Experience
                </a>
                <a href="#projects" className="pill hero-btn-ghost">
                  Side Projects
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
