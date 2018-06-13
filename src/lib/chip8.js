import fontset from './fontset.js';

const screenWidth = 64;
const screenHeight = 32;

export default class Chip8Emulator {
  constructor(canvasEl) {
    this.fps = 60;
    this.then = 0;
    this.canvasEl = canvasEl;

    this.reset();
  }

  reset = () => {
    // 4K Memory in Chip 8!
    var memory = new Uint8Array(4096).fill(0);

    // Memory 0x000 -> 0x050 contains the fontset
    for (var i = 0; i < fontset.length; i++) {
      memory[i] = fontset[i];
    }

    this.memory = memory;
    this.gfx = new Array(6 * 32).fill(0);
    this.stack = new Uint16Array(16).fill(0);
    this.key = new Uint8Array(16).fill(0);
    this.V = new Uint8Array(16).fill(0);
    this.pc = 0x200;
    this.I = 0;
    this.sp = 0;
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.drawFlag = false;
  }

  loadProgram = (program) => {
    for (var i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = program[i];
    }
  }

  start() {
    this.executionLoop();
    this.renderLoop();
    this.then = Date.now();
  }

  stop() {
    if (this.executionLoopInterval) {
      clearInterval(this.executionLoopInterval);
    }

    if (this.renderLoopId) {
      window.cancelAnimationFrame(this.renderLoopId);
      this.renderLoopId = null;
    }
  }

  executionLoop = () => {
    this.executionLoopInterval = setInterval(() => {
      for (var cyclesPer = 0; cyclesPer < 2; cyclesPer++) {
        this.emulateCycle();
      }
    }, 5);
  }

  renderLoop = () => {
    this.renderLoopId = window.requestAnimationFrame(this.renderLoop.bind(this));

    const fpsInterval = 1000 / this.fps;
    const now = Date.now();
    const elapsed = now - this.then;

    if (elapsed > fpsInterval) {
      this.then = now - (elapsed % fpsInterval);
      if (this.drawFlag) {
        this.drawGraphics();
      }
    }
  }

emulateCycle = () => {
  // Fetch Opcode
  var opcode = this.memory[this.pc] << 8 | this.memory[this.pc + 1];

  // Decode Opcode (for documentation, see opcode.test.js)
  switch (opcode & 0xF000) {
    case 0x0000: {
      switch (opcode & 0x000F) {
        case 0x0000: {
          this.gfx.fill(0);
          this.drawFlag = true;
          this.pc += 2;
          break;
        }
        case 0x000E: {
          this.sp -= 1;
          this.pc = this.stack[this.sp];
          this.pc += 2;
          break;
        }
      }
      break;
    }
    case 0x1000: {
      this.pc = opcode & 0x0FFF;
      break;
    }
    case 0x2000: {
      this.stack[this.sp] = this.pc;          
      this.sp++;
      this.pc = opcode & 0x0FFF;
      break;
    }
    case 0x3000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const NN = opcode & 0x00FF;

      if (this.V[VXIndex] == NN) {
        this.pc += 4;
      } else {
        this.pc += 2;
      }
      break;
    }
    case 0x4000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const NN = opcode & 0x00FF;

      if (this.V[VXIndex] != NN) {
        this.pc += 4;
      } else {
        this.pc += 2;
      }
      break;
    }
    case 0x5000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const VYIndex = (opcode & 0x00F0) >> 4;

      if (this.V[VXIndex] == this.V[VYIndex]) {
        this.pc += 4;
      } else {
        this.pc += 2;
      }
      break;
    }
    case 0x6000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const NN = opcode & 0x00FF;
      this.V[VXIndex] = NN;
      this.pc += 2;
      break;
    }
    case 0x7000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const NN = opcode & 0x00FF;
      this.V[VXIndex] += NN;
      this.pc += 2;
      break;
    }
    case 0x8000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const VYIndex = (opcode & 0x00F0) >> 4;

      switch (opcode & 0x000F) {
        case 0x0000: {
          this.V[VXIndex] = this.V[VYIndex];
          break;
        }
        case 0x0001: {
          this.V[VXIndex] |= this.V[VYIndex];
          break;
        }
        case 0x0002: {
          this.V[VXIndex] &= this.V[VYIndex];
          break;
        }
        case 0x0003: {
          this.V[VXIndex] ^= this.V[VYIndex];
          break;
        }
        case 0x0004: {
          if (this.V[VYIndex] > (0xFF - this.V[VXIndex])) {
            this.V[0xF] = 1;
          } else {
            this.V[0xF] = 0;
          }
          this.V[VXIndex] += this.V[VYIndex];
          break;
        }
        case 0x0005: {
          if (this.V[VYIndex] > this.V[VXIndex]) {
            this.V[0xF] = 0;
          } else {
            this.V[0xF] = 1;
          }
          this.V[VXIndex] -= this.V[VYIndex];
          break;
        }
        case 0x0006: {
          this.V[0xF] = this.V[VXIndex] & 0x1;
          this.V[VXIndex] >>= 1;
          break;
        }
        case 0x0007: {
          if (this.V[VXIndex] > this.V[VYIndex]) {
            this.V[0xF] = 0;
          } else {
            this.V[0xF] = 1;
          }
          this.V[VXIndex] = this.V[VYIndex] - this.V[VXIndex];
          break;
        }
        case 0x000E: {
          this.V[0xF] = this.V[VXIndex] >> 7;
          this.V[VXIndex] <<= 1;
          break;
        }
      }

      this.pc += 2;
      break;
    }
    case 0x9000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const VYIndex = (opcode & 0x00F0) >> 4;
      if (this.V[VXIndex] != this.V[VYIndex]) {
        this.pc += 2;
      }
      break;
    }
    case 0xA000: {
      this.I = opcode & 0x0FFF;
      this.pc += 2;
      break;
    }
    case 0xB000: {
      const addr = opcode & 0x0FFF;
      this.pc = addr + this.V[0];
      break;
    }
    case 0xC000: {
      const VXIndex = (opcode & 0x0F00) >> 8;
      const NN = opcode & 0x00FF;
      this.V[VXIndex] = NN & (Math.random() * 0xFF);
      this.pc += 2;
      break;
    }
    case 0xD000: {
      const width = 8;
      const x = this.V[(opcode & 0x0F00) >> 8];
      const y = this.V[(opcode & 0x00F0) >> 4];
      const height = opcode & 0x000F;
      this.V[0xF] = 0;

      for (var yline = 0; yline < height; yline++) {
        const pixel = this.memory[this.I + yline];
        for (var xline = 0; xline < width; xline++) {
          if ((pixel & (0x80 >> xline)) != 0) {
            if(this.gfx[(x + xline + ((y + yline) * screenWidth))] == 1) {
              this.V[0xF] = 1;                                 
            }
            this.gfx[x + xline + ((y + yline) * screenWidth)] ^= 1;
          }
        }
      }

      this.drawFlag = true;
      this.pc += 2;
      break;
    }
    case 0xE000: {
      switch(opcode & 0x00FF) {
        case 0x009E: {
          if(this.key[this.V[(opcode & 0x0F00) >> 8]] != 0)
            this.pc += 4;
          else
            this.pc += 2;
          break;
        }
        case 0x00A1: {
          if(this.key[this.V[(opcode & 0x0F00) >> 8]] == 0)
            this.pc += 4;
          else
            this.pc += 2;
          break;
        }
      }
      break;
    }
    case 0xF000: {
      switch (opcode & 0x00FF) {
        case 0x0007: {
          this.V[(opcode & 0x0F00) >> 8] = this.delayTimer;
          this.pc += 2;
          break;
        }
        case 0x000A: {
          var keyPress = false;
          for (let k = 0; k < this.key.length; k++) {
            if (this.key[k] != 0) {
              this.V[(opcode & 0x0F00) >> 8] = k;
              keyPress = true;
              break;
            }
          }

          if (!keyPress) {
            return;
          }

          this.pc += 2;
          break;
        }
        case 0x0015: {
          this.delayTimer = this.V[(opcode & 0x0F00) >> 8];
          this.pc += 2;
          break;
        }
        case 0x0018: {
          this.soundTimer = this.V[(opcode & 0x0F00) >> 8];
          this.pc += 2;
          break;
        }
        case 0x001E: {
          const VXIndex = (opcode & 0x0F00) >> 8;
          if (this.I + this.V[VXIndex] > 0xFFF) {
            this.V[0xF] = 1;
          } else {
            this.V[0xF] = 0;
          }

          this.I += this.V[VXIndex];
          this.I %= 0x1000;
          this.pc += 2;
          break;
        }
        case 0x0029: {
          const sprite = this.V[(opcode & 0x0F00) >> 8];
          // Font set starts at 0x0 and each character takes up 5 bytes.
          this.I = sprite * 0x5;
          this.pc += 2;
          break;
        }
        case 0x0033: {
          this.memory[this.I]     = Math.floor(this.V[(opcode & 0x0F00) >> 8] / 100);
          this.memory[this.I + 1] = Math.floor(this.V[(opcode & 0x0F00) >> 8] / 10) % 10;
          this.memory[this.I + 2] = (this.V[(opcode & 0x0F00) >> 8] % 100) % 10;
          this.pc += 2;
          break;
        }
        case 0x0055: {
          const end = (opcode & 0x0F00) >> 8;
          for (var vi = 0; vi <= end; vi++) {
            this.memory[this.I] = this.V[vi];
            this.I++;
          }
          this.pc += 2;
          break;
        }
        case 0x0065: {
          const end = (opcode & 0x0F00) >> 8;
          for (var vi = 0; vi <= end; vi++) {
            this.V[vi] = this.memory[this.I];
            this.I++;
          }
          this.pc += 2;
          break;
        }
      }
      break;
    }
  }

  if (this.delayTimer > 0) {
    this.delayTimer--;
  }

  if (this.soundTimer > 0) {
    if (this.soundTimer == 1) {
      console.log("BEEP");
    }
    this.soundTimer--;
  }
}


  drawGraphics = () => {
    const ctx = this.canvasEl.getContext('2d');
    const scale = 10;
    var imageData = ctx.getImageData(0, 0, screenWidth * scale, screenHeight * scale);
    var data = imageData.data;
    var buf = new ArrayBuffer(imageData.data.length);
    var buf8 = new Uint8ClampedArray(buf);
    var data = new Uint32Array(buf);

    for (var y = 0; y < screenHeight; y++) {
      for (var x = 0; x < screenWidth; x++) {
        const value = this.gfx[x + (y * screenWidth)];
        const px = x * scale;
        const py = y * scale;
        const scaledWidth = screenWidth * scale;

        for (var iy = 0; iy < scale; iy++) {
          for (var ix = 0; ix < scale; ix++) {
            var dataIndex = px + py * scaledWidth;
            dataIndex += ix;
            dataIndex += iy * scaledWidth;
            data[dataIndex] = value == 1 ? 0xFFFFFFFF : 0xFF000000;
          }
        }
      }
    }

    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
    this.drawFlag = false;
  }

  onKeyUp = (k) => {
    if (k == "1") 
      this.key[0x1] = 1;
    else if (k == "2")
      this.key[0x2] = 1;
    else if (k == "3")
      this.key[0x3] = 1;
    else if (k == "4")
      this.key[0xC] = 1;
    else if (k == "q")
      this.key[0x4] = 1;
    else if (k == "w")
      this.key[0x5] = 1;
    else if (k == "e")
      this.key[0x6] = 1;
    else if (k == "r")
      this.key[0xD] = 1;
    else if (k == "a")
      this.key[0x7] = 1;
    else if (k == "s")
      this.key[0x8] = 1;
    else if (k == "d")
      this.key[0x9] = 1;
    else if (k == "f")
      this.key[0xE] = 1;
    else if (k == "z")
      this.key[0xA] = 1;
    else if (k == "x")
      this.key[0x0] = 1;
    else if (k == "c")
      this.key[0xB] = 1;
    else if (k == "v")
      this.key[0xF] = 1;
  }

  onKeyDown = (k) => {
    if (k == "1") 
      this.key[0x1] = 0;
    else if (k == "2")
      this.key[0x2] = 0;
    else if (k == "3")
      this.key[0x3] = 0;
    else if (k == "4")
      this.key[0xC] = 0;
    else if (k == "q")
      this.key[0x4] = 0;
    else if (k == "w")
      this.key[0x5] = 0;
    else if (k == "e")
      this.key[0x6] = 0;
    else if (k == "r")
      this.key[0xD] = 0;
    else if (k == "a")
      this.key[0x7] = 0;
    else if (k == "s")
      this.key[0x8] = 0;
    else if (k == "d")
      this.key[0x9] = 0;
    else if (k == "f")
      this.key[0xE] = 0;
    else if (k == "z")
      this.key[0xA] = 0;
    else if (k == "x")
      this.key[0x0] = 0;
    else if (k == "c")
      this.key[0xB] = 0;
    else if (k == "v")
      this.key[0xF] = 0;
  }
}
