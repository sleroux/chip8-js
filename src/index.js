import React from 'react';
import ReactDOM from 'react-dom';
import Emulator from './components/chip8_emulator';

import styles from './styles/styles.scss';

class App extends React.Component {
  render() {
    return (
      <div className="emulator-container">
        <Emulator />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);
