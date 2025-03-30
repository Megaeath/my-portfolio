import React, { Component } from "react";

class Certificate extends Component {
  render() {
    const { sharedBasicInfo } = this.props;

    let sectionName = "Certificates"; // Default section name
    let certificates = [];

    if (sharedBasicInfo) {
      const certs = sharedBasicInfo.cert;
      certificates = certs.map((cert) => (
        <div
          className="col-6 col-md-4 col-lg-2" // Adjusted column size for 5 items in a row
          key={cert.title}
          style={{ cursor: "pointer", marginBottom: "20px" }}
        >
          <a
            href={cert.url} // Redirect to the certificate URL on click
            target="_blank" // Open in a new tab
            rel="noopener noreferrer" // Security for external links
            title={cert.title} // Show the certificate title on hover
            className="portfolio-item d-block"
          >
            <div className="foto">
              <div>
                <img
                  src={process.env.PUBLIC_URL + "/images/cert/" + cert.icon} // Display the certificate logo
                  alt={cert.title}
                  className="certificate-image" // Apply consistent styling
                  style={{
                    width: "100%", // Make the image responsive
                    height: "auto",
                    maxWidth: "120px", // Limit the maximum width of the icon
                    margin: "0 auto",
                  }}
                />
                {/* <span className="project-date">{cert.title}</span>
                <br /> */}
                <p className="project-title-settings mt-3">{cert.title}</p>
              </div>
            </div>
          </a>
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
            <div className="row mx-auto justify-content-center">{certificates}</div>
          </div>
        </div>
      </section>
    );
  }
}

export default Certificate;