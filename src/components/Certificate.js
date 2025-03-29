import React, { Component } from "react";
import ProjectDetailsModal from "./ProjectDetailsModal";

class Certificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deps: {}, // Holds the data for the modal
      detailsModalShow: false, // Controls the modal visibility
    };
  }

  render() {
    const detailsModalShow = (data) => {
      this.setState({ detailsModalShow: true, deps: data });
    };

    const detailsModalClose = () => this.setState({ detailsModalShow: false });

    let sectionName = "Certificates"; // Default section name
    let certificates = [];

    if (this.props.sharedBasicInfo) {
      const certs = this.props.sharedBasicInfo.cert;
      certificates = certs.map((cert) => (
        <div
          className="col-sm-12 col-md-6 col-lg-4"
          key={cert.title}
          style={{ cursor: "pointer" }}
        >
          <span className="portfolio-item d-block">
            <div className="foto" onClick={() => detailsModalShow(cert)}>
              <div>
                <img
                  src={"images/cert/" + cert.icon} // Correct path for certification images
                  alt={cert.title}
                  className="certificate-image" // Apply consistent styling
                />
                <span className="project-date">{cert.title}</span>
                <br />
                <p className="project-title-settings mt-3">{cert.title}</p>
              </div>
            </div>
          </span>
        </div>
      ));
    }

    return (
      <section id="certificates">
        <div className="col-md-12">
          <h1 className="section-title" style={{ color: "white" }}>
            <span>{sectionName}</span>
          </h1>
          <div className="col-md-12 mx-auto">
            <div className="row mx-auto">{certificates}</div>
          </div>
          <ProjectDetailsModal
            show={this.state.detailsModalShow}
            onHide={detailsModalClose}
            data={this.state.deps}
          />
        </div>
      </section>
    );
  }
}

export default Certificate;