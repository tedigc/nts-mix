import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CopyToClipboard from 'react-copy-to-clipboard';

class CopyButton extends Component {
  onClick = () => {
    const { id } = this.props;
    this.props.notifyCopy(id);
  }

  render() {
    const { mix, url, justCopied } = this.props;
    return (
      <div>
      <CopyToClipboard text={url} onCopy={this.onClick}>
        <button className="copy-button" onClick={this.onClick}>
          <i className="far fa-copy"></i>
          <span className="copy-button-text">
            {mix}
          </span>
          {justCopied && <span className="copy-alert">Copied to clipboard</span>}
        </button>
      </CopyToClipboard>
      </div>
    );
  }
}

CopyButton.propTypes = {
  id: PropTypes.number.isRequired,
  mix: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  justCopied: PropTypes.bool.isRequired,
  notifyCopy: PropTypes.func.isRequired,
};
export default CopyButton;
