import React, { Component } from "react";

class Skills extends Component {
  render() {
    if (this.props.sharedSkills && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.skills;
      var sectionTitle = this.props.resumeBasicInfo.section_title.skills;
      var skills = this.props.sharedSkills.icons.map((skill, i) => (
        <div key={i} className="pill reveal" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 2rem' }}>
          <i className={skill.class} style={{ fontSize: '1.5rem' }}></i>
          <span>{skill.name}</span>
        </div>
      ));
    }

    return (
      <section id="skills" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">{sectionName}</span>
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
          <div className="pill-grid">
            {skills}
          </div>
        </div>
      </section>
    );
  }
}

export default Skills;
