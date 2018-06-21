import fs from 'fs';

import Chip8Emulator from '../chip8.js';
import fontset from '../fontset.js';

const testProgramPath = "/../../../../../roms/MAZE";

test('constructor sets up assigns font set to memory 0x000->0x050', () => {
  const emulator = new Chip8Emulator();
  const memory = emulator.memory;

  for (var i = 0x0; i < 0x050; i++) {
    expect(memory[i]).toBe(fontset[i]);
  }
});

test('load program assigns program to memory 0x200 and up', () => {
  const emulator = new Chip8Emulator();
  const program = fs.readFileSync(__dirname + testProgramPath);
  emulator.loadProgram(program);

  const memory = emulator.memory;

  for (var i = 0x200; i < 0x200 + program.byteLength; i++) {
    expect(memory[i]).toBe(program[i - 0x200]);
  }
});

test('initialize set pc to 0x200', () => {
  const emulator = new Chip8Emulator();
  expect(emulator.pc).toBe(0x200);
});
