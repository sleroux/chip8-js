import React from 'react';
import PropTypes from 'prop-types';
import styles from './ROMSelector.scss';

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

  renderROMOption(rom) {
    return <option key={rom} value={rom}>{rom}</option>;
  }

  render() {
    return (
      <div className={styles.rom_selector}>
        <p className={styles.select_a_row} >select a rom</p>
        <div className={styles.rom_option_button}>
          <select className={styles.rom_selection} value={this.state.selectedRom} onChange={this.onChangeSelection} >
            {
              availableRoms.map(this.renderROMOption)
            }
          </select>
          <button className={styles.rom_load_button} onClick={() => { this.props.onLoadRom(this.state.selectedRom) }}>load</button>
        </div>
      </div>
    );
  }
}
