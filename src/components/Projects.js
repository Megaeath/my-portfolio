import React, { useState, useRef, useEffect } from "react";
import SideProjectArticleModal from "./SideProjectArticleModal";
import { gsap } from "gsap/dist/gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Projects({ resumeProjects, resumeBasicInfo }) {
  const [activeArticleProject, setActiveArticleProject] = useState(null);
  const triggerRef = useRef(null);
  const trackRef = useRef(null);

  const openArticle = (project) => {
    setActiveArticleProject(project);
  };

  const closeArticle = () => {
    setActiveArticleProject(null);
  };

  useEffect(() => {
    if (!resumeProjects || resumeProjects.length === 0) return;

    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 993px)", () => {
        const track = trackRef.current;
        if (!track) return;
        
        // Calculate scroll amount
        const totalWidth = track.scrollWidth;
        const viewWidth = window.innerWidth;
        // Scroll amount is how much the track overflows the screen width, plus some padding/margin
        const scrollAmount = totalWidth - viewWidth;

        if (scrollAmount > 0) {
          gsap.to(track, {
            x: -scrollAmount,
            ease: "none",
            scrollTrigger: {
              trigger: triggerRef.current,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () => `+=${scrollAmount * 1.2}`,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [resumeProjects]);

  if (!resumeProjects || !resumeBasicInfo) {
    return null;
  }

  const sectionName = resumeBasicInfo.section_name.projects;
  const sectionTitle = resumeBasicInfo.section_title?.projects || sectionName;

  const renderProjectCard = (project) => {
    const imageSrc = [process.env.PUBLIC_URL, project.images[0]].filter(Boolean).join("/");
    const hasArticle = Boolean(project.article);
    const cardContent = (
      <>
        <div className="project-image">
          <img src={imageSrc} alt={project.title} loading="lazy" />
        </div>
        <div className="project-info">
          <span className="project-date">
            {project.startDate}
          </span>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          {hasArticle ? <span className="project-article-tag">{project.article.ctaLabel || "Read case study"}</span> : null}
        </div>
      </>
    );

    if (hasArticle) {
      return (
        <button
          key={project.title}
          type="button"
          className="project-card project-card-button"
          onClick={() => openArticle(project)}
        >
          {cardContent}
        </button>
      );
    }

    if (project.url) {
      return (
        <a
          key={project.title}
          className="project-card"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cardContent}
        </a>
      );
    }

    return (
      <div key={project.title} className="project-card">
        {cardContent}
      </div>
    );
  };

  return (
    <div ref={triggerRef} className="projects-scroll-container" id="projects">
      <div className="projects-sticky-wrapper">
        <div className="container projects-header-container">
          <div className="section-header">
            <span className="section-label">{sectionName}</span>
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
        </div>
        <div ref={trackRef} className="projects-horizontal-track">
          {resumeProjects.map((project) => renderProjectCard(project))}
        </div>
      </div>

      <SideProjectArticleModal
        show={Boolean(activeArticleProject)}
        onHide={closeArticle}
        project={activeArticleProject}
      />
    </div>
  );
}

export default Projects;
