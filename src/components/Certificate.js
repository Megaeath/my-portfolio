import React, { Component } from "react";
import CertificateModal from "./CertificateModal";

class Certificate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailsModalShow: false, // Controls the modal visibility
      selectedCert: null, // Holds the currently selected certificate
    };
  }

  detailsModalShow = (cert) => {
    console.log("Opening modal with data:", cert); // Debugging log
    this.setState({ detailsModalShow: true, selectedCert: cert });
  };

  detailsModalClose = () => {
    console.log("Closing modal"); // Debugging log
    this.setState({ detailsModalShow: false, selectedCert: null }); // Reset selectedCert
  };

  render() {
    const { sharedBasicInfo } = this.props;
    const { detailsModalShow, selectedCert } = this.state;

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
          <span className="portfolio-item d-block">
            <div className="foto" /**onClick={() => this.detailsModalShow(cert)}**/>
              <div>
                <img
                  src={process.env.PUBLIC_URL + "/images/cert/" + cert.icon} // Display the certificate logo
                  alt={cert.title}
                  className="certificate-image" // Apply consistent styling
                  style={{
                    width: "100%", // Make the image responsive
                    height: "auto",
                    maxWidth: "150px", // Limit the maximum width of the icon
                    margin: "0 auto",
                  }}
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
            <div className="row mx-auto justify-content-center">{certificates}</div>
          </div>
          {detailsModalShow && (
            <CertificateModal
              show={detailsModalShow}
              onHide={this.detailsModalClose}
              data={selectedCert} // Pass the selected certificate directly
            />
          )}
        </div>
      </section>
    );
  }
}

export default Certificate;