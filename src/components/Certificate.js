import React, { Component } from "react";

class Certificate extends Component {
  render() {
    if (this.props.sharedBasicInfo) {
      var sectionName = this.props.sharedBasicInfo.certificates.label;
      var sectionTitle = this.props.sharedBasicInfo.certificates.title;
      var certificates = this.props.sharedBasicInfo.cert.map((cert) => (
        <a 
          key={cert.title} 
          href={cert.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="reveal cert-item"
        >
          <img 
            src={process.env.PUBLIC_URL + "/images/cert/" + cert.icon} 
            alt={cert.title} 
          />
          <span>{cert.title}</span>
        </a>
      ));
    }

    return (
      <section id="certificates">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">{sectionName}</span>
            <h2 className="section-title">{sectionTitle}</h2>
          </div>
          <div className="cert-grid">
            {certificates}
          </div>
        </div>
      </section>
    );
  }
}

export default Certificate;
