import React from 'react';
import Emulator from './components/emulator';
import ROMSelector from './components/rom_selector';

import { hot } from 'react-hot-loader';

import styles from './styles.scss';
import KeyboardLayout from './components/keyboard_layout';

const production = true;

class App extends React.Component {

  state = {
    selectedRom: null
  }

  constructor(props) {
    super(props);
  }

  onLoadRom = async (romName) => {
    const urlRoot = production ? "https://sleroux.github.com/chip8-js" : "http://localhost:8080";
    const romUrl = urlRoot + "/roms/" + romName;
    const response = await fetch(romUrl);
    const arrayBuffer = await response.arrayBuffer();
    const romData = new Uint8Array(arrayBuffer);

    this.setState((prevState) => {
      return {
        ...prevState,
        selectedRom: romData
      };
    });
  }

  render() {
    return (
      <div className="app-container">
        <h1 className="title">..chip 8 emulator..</h1>
        <Emulator selectedRom={this.state.selectedRom} />
        <ROMSelector onLoadRom={this.onLoadRom} />
        <KeyboardLayout />
      </div>
    );
  }
}

export default hot(module)(App);
