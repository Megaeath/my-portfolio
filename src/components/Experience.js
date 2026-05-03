import React, { Component } from "react";

class Experience extends Component {
  render() {
    if (this.props.resumeExperience && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.experience;
      var sectionTitle = this.props.resumeBasicInfo.section_title.experience;
      var work = this.props.resumeExperience.map((work, i) => (
        <div key={i} className="exp-item reveal">
          <div className="exp-date">{work.years}</div>
          <div className="exp-content">
            <span className="exp-company">{work.company}</span>
            <h3>{work.title}</h3>
            <div className="exp-description">
              <ul>
                {work.description.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="pill-grid" style={{ marginTop: '1.5rem' }}>
              {work.technologies.map((tech, index) => (
                <span key={index} className="pill" style={{ fontSize: '0.8rem' }}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ));
    }

    return (
      <section id="experience">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">{sectionName}</span>
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
          <div className="exp-list">
            {work}
          </div>
        </div>
      </section>
    );
  }
}

export default Experience;
