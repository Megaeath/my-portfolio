import React, { Component } from "react";
import { Modal } from "react-bootstrap";

class CertificateModal extends Component {
    render() {
        const { data } = this.props;

        if (!data || Object.keys(data).length === 0) {
            console.warn("CertificateModal: No data provided or data is empty."); // Debugging log
            return null; // Return null if no data is provided
        }

        const { title, original } = data;

        console.log("CertificateModal received data:", data); // Debugging log
        console.log("Title:", title); // Debugging log
        console.log("Original:", original); // Debugging log

        return (
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className="modal-inside"
            >
                <span onClick={this.props.onHide} className="modal-close">
                    <i className="fas fa-times fa-3x close-icon"></i>
                </span>
                <div className="col-md-12">
                    <div className="col-md-10 mx-auto" style={{ paddingBottom: "50px" }}>
                        <h3 style={{ padding: "5px 5px 0 5px" }}>{title}</h3>
                        <div
                            style={{
                                position: "relative", // Make the parent container relative
                                textAlign: "center",
                                height: "500px",
                                overflow: "auto",
                            }}
                        >
                            {/* Transparent overlay div */}
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "transparent", // Transparent background
                                    zIndex: 1, // Ensure it is above the iframe
                                }}
                                onContextMenu={(e) => e.preventDefault()} // Disable right-click on the overlay
                            ></div>

                            {/* The iframe */}
                            <iframe
                                src={
                                    process.env.PUBLIC_URL +
                                    "/pdf/" +
                                    original +
                                    "#toolbar=0&navpanes=0&scrollbar=0&view=Fit"
                                } // Path to the PDF
                                title={title}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "none",
                                    pointerEvents: "none", // Prevent interaction with the iframe
                                }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default CertificateModal;