import React from 'react';
import fontset from './fontset.js';

import styles from './styles/styles.scss';
import Chip8Emulator from './emulator.js';

export default class Emulator extends React.Component {

  constructor() {
    super();

    this.fetchRom.bind(this);

    this.state = {
      emulator: null
    };
  }

  componentWillMount() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  componentDidMount() {
    const emulator = new Chip8Emulator(this._canvasEl);

    this.setState((prevState) => {
      return {
        emulator: emulator
      } 
    });
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyDown);
  }

  onKeyDown(event) {
    this.state.emulator.onKeyDown(event.key);
  }

  onKeyUp(event) {
    this.state.emulator.onKeyUp(event.key);
  }

  async fetchRom() {
    const response = await fetch("http://localhost:8080/roms/BRIX");
    const arrayBuffer = await response.arrayBuffer();
    const binaryData = new Uint8Array(arrayBuffer);
    return binaryData;
  }

  render() {
    return (
      <div>
        <canvas id="emulator_view" width="640px" height="320px" ref={(c) => this._canvasEl = c} />
        <button 
          onClick={async () => {
            const program = await this.fetchRom();
            this.state.emulator.loadProgram(program);
            this.state.emulator.start();
          }
        }>Load Maze</button>
      </div>
    );
  }
}

