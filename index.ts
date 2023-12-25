const TILE_SIZE = 30;
const FPS = 30;
const SLEEP = 1000 / FPS;

enum RawTile {
  AIR,
  FLUX,
  UNBREAKABLE,
  PLAYER,
  STONE, FALLING_STONE,
  BOX, FALLING_BOX,
  KEY1, LOCK1,
  KEY2, LOCK2
}

interface Tile {
  isFlux(): boolean;
  isAir(): boolean;
  isUnBreakable(): boolean;
  isPlayer(): boolean;
  isStone(): boolean;
  isFalling(): boolean;
  isBox(): boolean;
  isKey1(): boolean;
  isKey2(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(dx: number): void;
  isStony(): boolean;
  isBoxy(): boolean;
  drop(): void;
  rest(): void;
}

class Flux implements Tile {
  isFlux(): boolean { return true; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  color(g: CanvasRenderingContext2D) {
    g.fillStyle = '#ccffcc';
  }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#ccffcc';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}

class Air implements Tile {
  isFlux(): boolean { return false; }

  isAir(): boolean { return true; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) { }

  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}
class UnBreakable implements Tile {
  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return true; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#999999';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {

  }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}

class Play implements Tile {
  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return true; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) { }

  moveHorizontal(dx: number): void { }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}

interface FallingState {
  isFalling(): boolean;
  moveHorizontal(tile: Tile, dx: number): void;
}

class Falling implements FallingState {
  isFalling(): boolean {
    return true;
  }

  moveHorizontal(tile: Tile, dx: number): void { }
}

class Resting implements FallingState {
  isFalling(): boolean {
    return false;
  }

  moveHorizontal(tile: Tile, dx: number): void {
    if (map[playery][playerx + dx].isAir()
      || !map[playery][playerx + dx].isAir()) {
      map[playery][playerx + dx] = tile;
      moveToTile(playerx + dx, playery);
    }
  }
}

class Stone implements Tile {
  constructor(private falling: FallingState) { }

  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return true; }

  isFalling(): boolean { return this.falling.isFalling(); }

  isBox(): boolean { return false; }

  isFallingBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#0000cc';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    this.falling.moveHorizontal(this, dx);
  }

  isStony(): boolean {
    return true;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() {
    this.falling = new Falling();
  }

  rest() {
    this.falling = new Resting();
  }
}

class Box implements Tile {
  constructor(private falling: FallingState) { }

  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return this.falling.isFalling(); }

  isBox(): boolean { return true; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#8b4513';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    this.falling.moveHorizontal(this, dx);
  }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return true;
  }

  drop() {
    this.falling = new Falling();
  }

  rest() {
    this.falling = new Resting();
  }
}

class Key1 implements Tile {
  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isKey1(): boolean { return true; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#ffcc00';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    removeLock1();
    moveToTile(playerx + dx, playery);
  }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}

class Key2 implements Tile {
  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return true; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#00ccff';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}

class Lock1 implements Tile {
  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isFallingBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return true; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#ffcc00';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void { }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}

class Lock2 implements Tile {
  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isUnBreakable(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isStone(): boolean { return false; }

  isFalling(): boolean { return false; }

  isBox(): boolean { return false; }

  isKey1(): boolean { return false; }

  isKey2(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return true; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#00ccff';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void { }

  isStony(): boolean {
    return false;
  }

  isBoxy(): boolean {
    return false;
  }

  drop() { }

  rest() { }
}

enum RawInput {
  UP, DOWN, LEFT, RIGHT
}

interface Input {
  handle(): void;
}

class Right implements Input {
  isRight() { return true; }

  isLeft() { return false; }

  isUp() { return false; }

  isDown() { return false; }

  handle() {
    moveVertical(1);
  }
}

class Left implements Input {
  handle() {
    moveHorizontal(-1);
  }
}

class Up implements Input {
  handle() {
    moveVertical(-1);
  }
}

class Down implements Input {
  handle() {
    moveVertical(1);
  }
}

let playerx = 1;
let playery = 1;
const rawMap: RawTile[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 3, 0, 1, 1, 2, 0, 2],
  [2, 4, 2, 6, 1, 2, 0, 2],
  [2, 8, 4, 1, 1, 2, 0, 2],
  [2, 4, 1, 1, 1, 9, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
const assertExhausted = (x: never): never => {
  throw new Error(`Unexpected object: ${x}`);
};

let map: Tile[][];
const transformTile = (tile: RawTile) => {
  switch (tile) {
  case RawTile.AIR: return new Air();
  case RawTile.PLAYER: return new Play();
  case RawTile.UNBREAKABLE: return new UnBreakable();
  case RawTile.STONE: return new Stone(new Resting());
  case RawTile.FALLING_STONE: return new Stone(new Falling());
  case RawTile.BOX: return new Box(new Resting());
  case RawTile.FALLING_BOX: return new Box(new Falling());
  case RawTile.FLUX: return new Flux();
  case RawTile.KEY1: return new Key1();
  case RawTile.LOCK1: return new Lock1();
  case RawTile.KEY2: return new Key2();
  case RawTile.LOCK2: return new Lock2();
  default: assertExhausted(tile);
  }
};

const transformMap = () => {
  map = new Array(rawMap.length);
  for (let y = 0; y < rawMap.length; y++) {
    map[y] = new Array(rawMap[y].length);
    for (let x = 0; x < rawMap[y].length; x++) {
      map[y][x] = transformTile(rawMap[y][x]);
    }
  }
};

const inputs: Input[] = [];

function removeLock1() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock1()) {
        map[y][x] = new Air();
      }
    }
  }
}

function removeLock2() {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x].isLock2()) {
        map[y][x] = new Air();
      }
    }
  }
}

function moveToTile(newx: number, newy: number) {
  map[playery][playerx].isAir();
  map[newy][newx].isPlayer();
  playerx = newx;
  playery = newy;
}

function moveHorizontal(dx: number) {
  map[playery][playerx + dx].moveHorizontal(dx);

  if (map[playery][playerx + dx].isFlux()
    || map[playery][playerx + dx].isAir()) {
    moveToTile(playerx + dx, playery);
  } else if ((map[playery][playerx + dx].isStone()
    || map[playery][playerx + dx].isBox())
    && map[playery][playerx + dx + dx].isAir()
    && !map[playery + 1][playerx + dx].isAir()) {
    map[playery][playerx + dx + dx] = map[playery][playerx + dx];
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey1()) {
    removeLock1();
    moveToTile(playerx + dx, playery);
  } else if (map[playery][playerx + dx].isKey2()) {
    removeLock2();
    moveToTile(playerx + dx, playery);
  }
}

function moveVertical(dy: number) {
  if (map[playery + dy][playerx].isFlux()
    || map[playery + dy][playerx].isAir()) {
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey1()) {
    removeLock1();
    moveToTile(playerx, playery + dy);
  } else if (map[playery + dy][playerx].isKey2()) {
    removeLock2();
    moveToTile(playerx, playery + dy);
  }
}

function updateTile(y: number, x: number) {
  if ((map[y][x].isStony()
      && map[y + 1][x].isAir())
      || (map[y][x].isBoxy()
      && map[y + 1][x].isAir())) {
    map[y][x].drop();
    map[y + 1][x] = map[y][x];
    map[y][x] = new Air();
  } else if (map[y][x].isFalling()) {
    map[y][x].rest();
  }
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      updateTile(y, x);
    }
  }
}

function handleInputs() {
  while (inputs.length > 0) {
    const input = inputs.pop();
    input.handle();
  }
}

function update() {
  handleInputs();
  updateMap();
}

function drawMap(g: CanvasRenderingContext2D) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].draw(g, x, y);
    }
  }
}

function drawPlayer(g: CanvasRenderingContext2D) {
  g.fillStyle = '#ff0000';
  g.fillRect(playerx * TILE_SIZE, playery * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

function createGraphics() {
  const canvas = document.getElementById('GameCanvas') as HTMLCanvasElement;
  const g = canvas.getContext('2d');

  g.clearRect(0, 0, canvas.width, canvas.height);
  return g;
}

function draw() {
  const g = createGraphics();

  // Draw map
  drawMap(g);

  // Draw player
  drawPlayer(g);
}

function gameLoop() {
  const before = Date.now();
  update();
  draw();
  const after = Date.now();
  const frameTime = after - before;
  const sleep = SLEEP - frameTime;
  setTimeout(() => gameLoop(), sleep);
}

window.onload = () => {
  transformMap();
  gameLoop();
};

const LEFT_KEY = 'ArrowLeft';
const UP_KEY = 'ArrowUp';
const RIGHT_KEY = 'ArrowRight';
const DOWN_KEY = 'ArrowDown';
window.addEventListener('keydown', (e) => {
  if (e.key === LEFT_KEY || e.key === 'a') inputs.push(new Left());
  else if (e.key === UP_KEY || e.key === 'w') inputs.push(new Up());
  else if (e.key === RIGHT_KEY || e.key === 'd') inputs.push(new Right());
  else if (e.key === DOWN_KEY || e.key === 's') inputs.push(new Down());
});
