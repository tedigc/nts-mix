import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 1,
  padding: 20,
  display: 'inline-block',
  backgroundColor: '#8787d8'
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered : { opacity: 1 },
  // exiting : { opacity: 1 },
  // exited  : { opacity: 0 }
};

const Fade = ({ in: inProp }) => {
  console.log(inProp)
  return (
  <CSSTransition in={inProp} timeout={duration}>
    {(state) => {
      console.log(state);
      return (
      <div style={{
        ...defaultStyle,
        ...transitionStyles[state]
      }}>
        {Math.random() * 10}
      </div>
      )}
    }
  </CSSTransition>
)};

class Test extends Component {

  state = {
    show : false
  }

  handleToggle() {
    this.setState(({ show }) => ({
      show: !show
    }));
  }

  render() {
    let { show } = this.state;
    return (
      <div>
        <button onClick={() => this.handleToggle()}>
          CLICK TO TOGGLE
        </button>
        <div>
          <Fade in={true} />
        </div>
      </div>
    );
  }

}

export default Test;