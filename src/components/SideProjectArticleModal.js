import React from "react";
import { Modal } from "react-bootstrap";

function SideProjectArticleModal({ show, onHide, project }) {
  const article = project?.article;

  if (!article) {
    return null;
  }

  const coverImageSrc = [process.env.PUBLIC_URL, article.coverImage || project.images?.[0]]
    .filter(Boolean)
    .join("/");

  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="side-project-article-title"
      dialogClassName="side-article-modal-dialog"
      className="side-article-modal"
    >
      <button type="button" className="side-article-close" onClick={onHide} aria-label="Close article modal">
        <i className="fas fa-times" aria-hidden="true" />
      </button>

      <Modal.Body className="side-article-modal-body">
        <article className="side-article-content">
          <header className="side-article-header">
            <span className="side-article-kicker">{project.startDate}</span>
            <h2 id="side-project-article-title">{project.title}</h2>
            {article.subtitle ? <p className="side-article-subtitle">{article.subtitle}</p> : null}
            {article.readTime ? <p className="side-article-meta">{article.readTime}</p> : null}
          </header>

          {coverImageSrc ? (
            <figure className="side-article-cover">
              <img src={coverImageSrc} alt={project.title} />
              {article.coverCaption ? <figcaption>{article.coverCaption}</figcaption> : null}
            </figure>
          ) : null}

          {article.highlights?.length ? (
            <section className="side-article-section">
              <h3>{article.highlightTitle || "Project Highlights"}</h3>
              <div className="side-article-highlight-grid">
                {article.highlights.map((item) => (
                  <div className="side-article-highlight" key={`${item.label}-${item.value}`}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {article.sections?.map((section) => (
            <section className="side-article-section" key={section.heading}>
              <h3>{section.heading}</h3>
              {section.paragraphs?.map((paragraph, index) => (
                <p key={`${section.heading}-paragraph-${index}`}>{paragraph}</p>
              ))}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((bullet, index) => (
                    <li key={`${section.heading}-bullet-${index}`}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {article.outcomes?.length ? (
            <section className="side-article-section">
              <h3>{article.outcomesTitle || "Operational Outcomes"}</h3>
              <ol>
                {article.outcomes.map((outcome, index) => (
                  <li key={`outcome-${index}`}>{outcome}</li>
                ))}
              </ol>
            </section>
          ) : null}

          {project.url ? (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="side-article-link">
              {article.visitProjectLabel || "Visit project"}
              <i className="fas fa-external-link-alt" aria-hidden="true" />
            </a>
          ) : null}
        </article>
      </Modal.Body>
    </Modal>
  );
}

export default SideProjectArticleModal;