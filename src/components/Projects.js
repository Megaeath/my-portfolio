import React, { Component } from "react";
import SideProjectArticleModal from "./SideProjectArticleModal";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeArticleProject: null,
    };

    this.openArticle = this.openArticle.bind(this);
    this.closeArticle = this.closeArticle.bind(this);
  }

  openArticle(project) {
    this.setState({ activeArticleProject: project });
  }

  closeArticle() {
    this.setState({ activeArticleProject: null });
  }

  renderProjectCard(project) {
    const imageSrc = [process.env.PUBLIC_URL, project.images[0]].filter(Boolean).join("/");
    const hasArticle = Boolean(project.article);
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
          {hasArticle ? <span className="project-article-tag">{project.article.ctaLabel || "Read case study"}</span> : null}
        </div>
      </>
    );

    if (hasArticle) {
      return (
        <button
          key={project.title}
          type="button"
          className="project-card project-card-button reveal"
          onClick={() => this.openArticle(project)}
        >
          {cardContent}
        </button>
      );
    }

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
    const { activeArticleProject } = this.state;

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

        <SideProjectArticleModal
          show={Boolean(activeArticleProject)}
          onHide={this.closeArticle}
          project={activeArticleProject}
        />
      </section>
    );
  }
}

export default Projects;
