import Chip8Emulator from '../client/components/chip8_emulator/emulator.js';
import fontset from '../client/components/chip8_emulator/fontset.js';

test('opcode 0x00E0 clears the screen', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x00;
  emulator.memory[pc + 1] = 0xE0;

  for (var y = 0; y < emulator.screenHeight; y++) {
    for (var x = 0; x < emulator.screenWidth; x++) {
      emulator.gfx[x + (y * emulator.screenWidth)] = 1;
    }
  }
  expect(emulator.drawFlag).toBeFalsy();

  emulator.emulateCycle();

  for (var y = 0; y < emulator.screenHeight; y++) {
    for (var x = 0; x < emulator.screenWidth; x++) {
      expect(emulator.gfx[x + (y * emulator.screenWidth)]).toBe(0);
    }
  }
  expect(emulator.drawFlag).toBeTruthy();
});

test('opcode 0x00EE returns from subroutine', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x00;
  emulator.memory[pc + 1] = 0xEE;
  emulator.sp = 1;
  emulator.stack[0] = 0x530;

  emulator.emulateCycle();

  expect(emulator.pc).toBe(0x532);
});

test('opcode 0x1NNN jumps to address NNN', () => {
  const emulator = new Chip8Emulator();

  const oldPC = emulator.pc;
  emulator.memory[oldPC] = 0x13;
  emulator.memory[oldPC + 1] = 0x23;

  emulator.emulateCycle();

  expect(oldPC).not.toBe(emulator.pc);
  expect(emulator.pc).toBe(0x323);
});

test('opcode 0x2NNN calls subroutine', () => {
  const emulator = new Chip8Emulator();
  const oldPC = emulator.pc;
  emulator.memory[oldPC] = 0x23;
  emulator.memory[oldPC + 1] = 0x23;

  emulator.emulateCycle();

  expect(emulator.stack[0]).toBe(oldPC);
  expect(emulator.sp).toBe(1);
  expect(emulator.pc).toBe(0x323);
});

test('opcode 3XNN skips the next instruction if VX equals NN', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x33;
  emulator.memory[pc + 1] = 0x10;
  emulator.V[0x3] = 0x10;

  emulator.emulateCycle();

  expect(emulator.pc).toBe(0x204);
});

test('opcode 3XNN doesnt skip the next instruction if VX isnt equal to NN', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x33;
  emulator.memory[pc + 1] = 0x10;
  emulator.V[0x3] = 0x11;

  emulator.emulateCycle();

  expect(emulator.pc).toBe(0x202);
});

test('opcode 4XNN skips the next instruction if VX doesnt equal to NN', () => {
  const emulator = new Chip8Emulator(); 
  const pc = emulator.pc;
  emulator.memory[pc] = 0x43;
  emulator.memory[pc + 1] = 0x10;
  emulator.V[0x3] = 0x11;

  emulator.emulateCycle();

  expect(emulator.pc).toBe(0x204);
});

test('opcode 4XNN doesnt skip the next instruction if VX is equal to NN', () => {
  const emulator = new Chip8Emulator(); 
  const pc = emulator.pc;
  emulator.memory[pc] = 0x43;
  emulator.memory[pc + 1] = 0x10;
  emulator.V[0x3] = 0x10;

  emulator.emulateCycle();

  expect(emulator.pc).toBe(0x202);
});

test('opcode 5XY0 skips the next instruction if VX equals VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x53;
  emulator.memory[pc + 1] = 0x10;
  emulator.V[0x3] = 10;
  emulator.V[0x1] = 10;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x204);
});

test('opcode 5XY0 doesnt skip the next instruction if VX doesnt equal VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x53;
  emulator.memory[pc + 1] = 0x10;
  emulator.V[0x3] = 10;
  emulator.V[0x1] = 11;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x202);
});

test('opcode 6XNN sets VX to NN', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x61;
  emulator.memory[pc + 1] = 0x10;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x10);
});

test('opcode 7XNN adds NN to VX', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x71;
  emulator.memory[pc + 1] = 0x10;
  emulator.V[0x1] = 0x10;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x20);
});

test('opcode 8XY0 sets VX to the value of VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x20;
  emulator.V[0x1] = 0x10;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x30);
});

test('opcode 8XY1 sets VX to VX bitwise OR VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x21;
  emulator.V[0x1] = 0x10;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x30);
});

test('opcode 8XY2 sets VX to VX bitwise AND VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x22;
  emulator.V[0x1] = 0x10;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x10);
});

test('opcode 8XY3 sets VX to VX xor VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x23;
  emulator.V[0x1] = 0x10;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x20);
});

test('opcode 8YX4 adds VY to VX and sets VF to 1 when theres a carry', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x24;
  emulator.V[0x1] = 0xFF;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x2F);
  expect(emulator.V[0xF]).toBe(1);
});

test('opcode 8YX4 adds VY to VX and sets VF to 0 when theres no carry', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x24;
  emulator.V[0x1] = 0x30;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x60);
  expect(emulator.V[0xF]).toBe(0);
});

test('opcode 8XY5 subtracts VY from VX and sets VF to 0 when theres a borrow', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x25;
  emulator.V[0x1] = 0x10;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0xE0);
  expect(emulator.V[0xF]).toBe(0);
});

test('opcode 8XY5 subtracts VY from VX and sets VF to 1 when theres no borrow', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x25;
  emulator.V[0x1] = 0x30;
  emulator.V[0x2] = 0x10;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x20);
  expect(emulator.V[0xF]).toBe(1);
});

test('opcode 8XY6 shifts VX right by one, stores the result to VX, and sets VF to the value of the least significant bit of VX before the shift', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x26;
  emulator.V[0x1] = 0x31;
  emulator.V[0x2] = 0x29;

  emulator.emulateCycle();

  expect(emulator.V[0x1]).toBe(0x31 >> 1);
  expect(emulator.V[0xF]).toBe(1);
});

test('opcode 8XY7 sets VX to VX minus VX and sets VF to 0 when theres a borrow', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x27;
  emulator.V[0x1] = 0x30;
  emulator.V[0x2] = 0x10;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0xE0);
  expect(emulator.V[0xF]).toBe(0);
});

test('opcode 8XY7 sets VX to VY minus VX and sets VF to 1 when there is not a borrow', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x27;
  emulator.V[0x1] = 0x10;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.V[0x1]).toBe(0x20);
  expect(emulator.V[0xF]).toBe(1);
});

test('opcode 8XYE shifts VX left by one, copies the result to VX, and sets VF to the most significant bit of VX before the shift', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x81;
  emulator.memory[pc + 1] = 0x2E;
  emulator.V[0x1] = 0x31;
  emulator.V[0x2] = 0x29;

  emulator.emulateCycle();

  expect(emulator.V[0x1]).toBe(0x31 << 1);
  expect(emulator.V[0xF]).toBe(0);
});

test('opcode 9XY0 skips the next instruction if VX doesnt equal VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x91;
  emulator.memory[pc + 1] = 0x20;
  emulator.V[0x1] = 0x30;
  emulator.V[0x2] = 0x29;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x202);
});

test('opcode 9XY0 doesnt skip the next instruction if VX equals VY', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0x91;
  emulator.memory[pc + 1] = 0x20;
  emulator.V[0x1] = 0x30;
  emulator.V[0x2] = 0x30;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x200);
});

test('opcode ANNN set I to address N', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xA2;
  emulator.memory[pc + 1] = 0xF0;

  emulator.emulateCycle();

  const I = emulator.I;
  expect(I).toBe(0x2F0);
});

test('opcode BNNN jumps to the address NNN plus V0', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xB2;
  emulator.memory[pc + 1] = 0x22;
  emulator.V[0x0] = 0x20;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x20 + 0x222);
});

test('opcode CXNN sets VX to the result of a bitwise AND operation on a random number (0-255) and NN', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xC2;
  emulator.memory[pc + 1] = 0x22;
  emulator.emulateCycle();
  // TODO: Add in class mock for Math.random?
  // expect(emulator.pc).toBe(0x20 + 0x22);
});

test('opcode DXYN draws a sprite at coordinate (VX, VY) with height N', () => {
  const emulator = new Chip8Emulator();
  const zeroSprite = fontset.slice(0, 5);

  const drawX = 2;
  const drawY = 2;

  drawSpriteAt(emulator, zeroSprite, drawX, drawY);

  for (var y = 0; y < 5; y++) {
    const pixel = zeroSprite[y];
    for (var x = 0; x < 8; x++) {
      const actual = emulator.gfx[drawX + x + ((drawY + y) * emulator.screenWidth)];
      const expected = (pixel & (0x80 >> x)) != 0 ? 1 : 0; 
      expect(actual).toBe(expected);
    }
  }

  // Since this means we're drawing something to a blank screen, we should have also flipped
  // the draw flag bit
  // expect(emulator.V[0xF]).toBe(1);
});

test('Drawing using opcode DXYN should only set V[0xF] if a bit when from set to unset', () => {
  const emulator = new Chip8Emulator();
  const zeroSprite = fontset.slice(0, 5);

  drawSpriteAt(emulator, zeroSprite, 2, 2);

  // Since this means we're drawing something to a blank screen, we should have also flipped
  // the draw flag bit
    // expect(emulator.V[0xF]).toBe(0);

  drawSpriteAt(emulator, zeroSprite, 2, 2);

  // After drawing the same thing, the bit should be flipped back.
  expect(emulator.V[0xF]).toBe(1);
});

const drawSpriteAt = function (emulator, sprite, x, y) {
  // Coordinates (2, 2) with height 5. Width is fixed to 8 as per the spec
  const pc = emulator.pc;
  emulator.memory[pc] = 0xD2;
  emulator.memory[pc + 1] = 0x35;
  emulator.V[0x2] = x;
  emulator.V[0x3] = y;

  // Test drawing a zero (0)
  const spritePointer = 0x400;
  emulator.I = spritePointer;

  for (var i = 0; i < 5; i++) {
    emulator.memory[spritePointer + i] = sprite[i];
  }

  emulator.emulateCycle();
};

test('opcode EX9E skips the next instruction if the key stored in VX is pressed', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xE2;
  emulator.memory[pc + 1] = 0x9E;
  emulator.V[0x2] = 0xF;
  emulator.key[0xF] = 1;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x204);
});

test('opcode EX9E doesnt skip the next instruction if the key stored in VX is not pressed', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xE2;
  emulator.memory[pc + 1] = 0x9E;
  emulator.V[0x2] = 0xF;
  emulator.key[0xF] = 0;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x202);
});

test('opcode EXA1 skips the next instruction if the keys stored in VX is not pressed', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xE2;
  emulator.memory[pc + 1] = 0xA1;
  emulator.V[0x2] = 0xF;
  emulator.key[0xF] = 0;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x204);
});

test('opcode EXA1 doesnt skip the next instruction if the keys stored in VX is pressed', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xE2;
  emulator.memory[pc + 1] = 0xA1;
  emulator.V[0x2] = 0xF;
  emulator.key[0xF] = 1;
  emulator.emulateCycle();
  expect(emulator.pc).toBe(0x202);
});

test('opcode FX07 sets VX to the value of the delay timer', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF2;
  emulator.memory[pc + 1] = 0x07;
  emulator.delayTimer = 0x20;
  emulator.emulateCycle();
  expect(emulator.V[0x2]).toBe(0x20);
});

test('opcode FX0A blocks for key press and is then stored in VX', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF2;
  emulator.memory[pc + 1] = 0x0A;

  emulator.emulateCycle();

  // No key pressed so we should wait. Don't move the program.
  expect(emulator.V[0x2]).toBe(0);
  expect(emulator.pc).toBe(0x200);

  emulator.key[0xF] = 1;
  emulator.emulateCycle();

  // Key finally pressed. Program can continue.
  expect(emulator.V[0x2]).toBe(0xF);
  expect(emulator.pc).toBe(0x202);
});

test('opcode FX15 sets the delay timer to VX', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF2;
  emulator.memory[pc + 1] = 0x15;
  emulator.V[0x2] = 0x20;
  emulator.emulateCycle();
  expect(emulator.delayTimer).toBe(0x1F);
});

test('opcode FX18 sets the sound timer to VX', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF2;
  emulator.memory[pc + 1] = 0x18;
  emulator.V[0x2] = 0x20;
  emulator.emulateCycle();
  expect(emulator.soundTimer).toBe(0x1F);
})

test('opcoded FX1E adds VX to I and sets V[0xF] to one for carry', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF2;
  emulator.memory[pc + 1] = 0x1E;
  emulator.V[0x2] = 0x1;
  emulator.I = 0xFFF;
  emulator.emulateCycle();
  expect(emulator.I).toBe(0x0);
  expect(emulator.V[0xF]).toBe(1);
});

test('opcode FX29 sets I to the location of the sprite for character in VX', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF2;
  emulator.memory[pc + 1] = 0x29;
  emulator.V[0x2] = 0xD;
  emulator.emulateCycle();
  const expectedSpritePtr = 0xD * 5;
  expect(emulator.I).toBe(expectedSpritePtr);
});

test('opcode FX33 takes the decimal representation of VX, places the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF2;
  emulator.memory[pc + 1] = 0x33;
  emulator.V[0x2] = 0x2F; // 47 in decimal 
  emulator.I = 0x400;
  emulator.emulateCycle();
  const I = emulator.I;
  expect(emulator.memory[I]).toBe(0b0);
  expect(emulator.memory[I + 1]).toBe(0b100);
  expect(emulator.memory[I + 2]).toBe(0b111);
});

test('opcode FX55 stores V0 to VX (including VX) in memory starting at address I and increments I by 1 for each value written', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF5;
  emulator.memory[pc + 1] = 0x55;
  emulator.I = 0x400;

  for (var i = 0; i <= 5; i++) {
    emulator.V[i] = i;
  }

  emulator.emulateCycle();
  const I = emulator.I;

  for (var i = 0; i <= 5; i++) {
    expect(emulator.memory[0x400 + i]).toBe(i);
  }

  expect(I).toBe(0x406);
});

test('opcode FX65 fills V0 to VX (including VX) with values from memory starting at address I and increments I by 1 for each value written', () => {
  const emulator = new Chip8Emulator();
  const pc = emulator.pc;
  emulator.memory[pc] = 0xF5;
  emulator.memory[pc + 1] = 0x65;
  emulator.I = 0x400;

  for (var i = 0; i <= 5; i++) {
    emulator.memory[0x400 + i] = i;
  }

  emulator.emulateCycle();

  for (var i = 0; i <= 5; i++) {
    expect(emulator.V[i]).toBe(i);
    emulator.V[i] = i;
  }

  expect(emulator.I).toBe(0x406);
});
