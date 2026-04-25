import React, { Component } from "react";

class Footer extends Component {
  render() {
    if (this.props.sharedBasicInfo) {
      var name = this.props.sharedBasicInfo.name;
      var networks = this.props.sharedBasicInfo.social.map(function (network) {
        return (
          <a key={network.name} href={network.url} target="_blank" rel="noopener noreferrer">
            <i className={network.class}></i>
          </a>
        );
      });
    }

    return (
      <footer className="footer">
        <div className="container">
          <div className="footer-social">
            {networks}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            &copy; {new Date().getFullYear()} {name}. Built for impact.
          </p>
        </div>
      </footer>
    );
  }
}

export default Footer;
