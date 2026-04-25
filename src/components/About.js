import React, { Component } from "react";

class About extends Component {
  render() {
    if (this.props.resumeBasicInfo) {
      var sectionName = this.props.resumeBasicInfo.section_name.about;
      var hello = this.props.resumeBasicInfo.description_header;
      var about = this.props.resumeBasicInfo.description;
    }

    return (
      <section id="about" className="reveal">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{sectionName}</span>
            <h2 className="section-title">{hello}</h2>
          </div>
          <div style={{ maxWidth: '850px' }}>
            <p className="about-text">
              {about}
            </p>
          </div>
        </div>
      </section>
    );
  }
}

export default About;
