import React from 'react';
import Chip8Emulator from '../../lib/chip8';

import styles from './styles.scss';

export default class Emulator extends React.Component {
  state = {
    emulator: null
  }

  componentWillMount() {
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);
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

  componentWillReceiveProps = (nextProps) => {
    this.loadRom(nextProps.selectedRom);
  }

  onKeyDown = (e) => {
    this.state.emulator.onKeyDown(e.key);
  }

  onKeyUp = (e) => {
    this.state.emulator.onKeyUp(e.key);
  }

  loadRom = (romData) => {
    this.state.emulator.stop();
    this.state.emulator.reset();
    this.state.emulator.loadProgram(romData);
    this.state.emulator.start();
  }

  render() {
    return (
      <canvas className="emulator_view" width="640px" height="320px" ref={(c) => this._canvasEl = c} />
    );
  }
}

