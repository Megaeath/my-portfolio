import React, { Component } from "react";

class Graduation extends Component {
  render() {
    if (this.props.resumeGraduate && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.graduate;
      var sectionTitle = this.props.resumeBasicInfo.section_title.graduate;
      var work = this.props.resumeGraduate.map((work, i) => (
        <div key={i} className="exp-item reveal">
          <div className="exp-date">{work.years}</div>
          <div className="exp-content">
            <span className="exp-company">{work.company}</span>
            <h3>{work.title}</h3>
            <div className="pill-grid" style={{ marginTop: '1.25rem' }}>
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
      <section id="graduation">
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

export default Graduation;
