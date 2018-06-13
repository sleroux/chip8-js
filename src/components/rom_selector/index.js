import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.scss';

const availableRoms = [
  "15PUZZLE",
  "BLINKY",
  "BRIX",
  "BLITZ",
  "CONNECT4",
  "GUESS",
  "HIDDEN",
  "INVADERS",
  "KALEID",
  "MAZE",
  "MERLIN",
  "MISSLE",
  "PONG",
  "PONG2",
  "PUZZLE",
  "SYZYGY",
  "TANK",
  "TETRIS",
  "TICTAC",
  "UFO",
  "VBRIX",
  "VERS",
  "WIPEOFF"
];

export default class ROMSelector extends React.Component {
  static propTypes = {
    onLoadRom: PropTypes.func.isRequired
  }

  state = {
    selectedRom: availableRoms[0]
  }

  onChangeSelection = (e) => {
    const romName = e.target.value;
    this.setState((prevState) => {
      return {
        ...prevState,
        selectedRom: romName
      };
    });
  }

  render() {
    return (
      <div className="rom_selector">
        <p className="select_a_rom" >select a rom</p>
        <div className="rom_option_button">
          <select className="rom_selection" value={this.state.selectedRom} onChange={this.onChangeSelection} >
            {
              availableRoms.map(rom => <option key={rom} value={rom}>{rom}</option>)
            }
          </select>
          <button className="rom_load_button" onClick={() => { this.props.onLoadRom(this.state.selectedRom) }}>load</button>
        </div>
      </div>
    );
  }
}

