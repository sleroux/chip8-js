import React from 'react';
import styles from './KeyboardLayout.scss';

const hexToKeyMap = {
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "Q",
  "5": "W",
  "6": "E",
  "D": "R",
  "7": "A",
  "8": "S",
  "9": "D",
  "E": "F",
  "A": "Z",
  "0": "X",
  "B": "C",
  "F": "V",
};

export default class KeyboardLayout extends React.Component {

  renderKeybinding(k) {
    const keybinding = hexToKeyMap[k];
    return <td key={keybinding}><p>{keybinding}</p></td>;
  }

  renderKeypad(k) {
    return <td key={k}><p>{k}</p></td>
  }

  render() {
    return (
      <div className={styles.key_layout_container}>
        <h2 className={styles.title}>keybindings</h2>
        <table>
          <tbody>
            <tr>
              <td><p>keypad</p></td>
              {
                Object.keys(hexToKeyMap).map(this.renderKeypad)
              }
            </tr>
            <tr>
              <td><p>keyboard</p></td>
              {
                Object.keys(hexToKeyMap).map(this.renderKeybinding)
              }
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
