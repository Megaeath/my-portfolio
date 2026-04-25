import React, { Component } from "react";

class Projects extends Component {
  render() {
    if (this.props.resumeProjects && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.projects;
      var projects = this.props.resumeProjects.map((project) => (
        <div key={project.title} className="project-card reveal">
          <div className="project-image">
            <img src={project.images[0]} alt={project.title} />
          </div>
          <div className="project-info">
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase' }}>
              {project.startDate}
            </span>
            <h3 style={{ marginTop: '0.5rem' }}>{project.title}</h3>
            <p style={{ marginTop: '1rem' }}>{project.description}</p>
          </div>
        </div>
      ));
    }

    return (
      <section id="projects">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">{sectionName}</span>
            <h2 className="section-title">Selected Engineering Work</h2>
          </div>
          <div className="project-grid">
            {projects}
          </div>
        </div>
      </section>
    );
  }
}

export default Projects;
