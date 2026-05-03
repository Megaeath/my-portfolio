import React, { Component } from "react";

class Projects extends Component {
  renderProjectCard(project) {
    const imageSrc = [process.env.PUBLIC_URL, project.images[0]].filter(Boolean).join("/");
    const cardContent = (
      <>
        <div className="project-image">
          <img src={imageSrc} alt={project.title} />
        </div>
        <div className="project-info">
          <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "var(--accent)", textTransform: "uppercase" }}>
            {project.startDate}
          </span>
          <h3 style={{ marginTop: "0.5rem" }}>{project.title}</h3>
          <p style={{ marginTop: "1rem" }}>{project.description}</p>
        </div>
      </>
    );

    if (project.url) {
      return (
        <a
          key={project.title}
          className="project-card reveal"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cardContent}
        </a>
      );
    }

    return (
      <div key={project.title} className="project-card reveal">
        {cardContent}
      </div>
    );
  }

  render() {
    if (this.props.resumeProjects && this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.projects;
      var sectionTitle = this.props.resumeBasicInfo.section_title?.projects || sectionName;
      var projects = this.props.resumeProjects.map((project) => this.renderProjectCard(project));
    }

    return (
      <section id="projects">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">{sectionName}</span>
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
          <div className="project-grid">{projects}</div>
        </div>
      </section>
    );
  }
}

export default Projects;
