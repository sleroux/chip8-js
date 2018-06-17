import React from 'react';
import styles from './styles.scss';

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
  render() {
    return (
      <div className="key_layout_container">
        <h2 className="title">keybindings</h2>
        <table>
          <tbody>
            <tr>
              <td><p>keypad</p></td>
              {
                Object.keys(hexToKeyMap).map(k => <td key={k}><p>{k}</p></td>)
              }
            </tr>
            <tr>
              <td><p>keyboard</p></td>
              {
                Object.keys(hexToKeyMap).map((k) => {
                  const key = hexToKeyMap[k];
                  <td key={key}><p>{key}</p></td>
                })
              }
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
