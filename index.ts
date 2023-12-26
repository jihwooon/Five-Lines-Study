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
  isAir(): boolean;
  isPlayer(): boolean;
  isLock1(): boolean;
  isLock2(): boolean;
  draw(g: CanvasRenderingContext2D, x: number, y: number): void;
  moveHorizontal(dx: number): void;
  moveVertical(dy: number): void;
  update(x: number, y: number): void
}

interface RemoveStrategy {
  check(tile: Tile): boolean;
}

class RemoveLock1 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock1();
  }
}

class RemoveLock2 implements RemoveStrategy {
  check(tile: Tile) {
    return tile.isLock2();
  }
}

class Flux implements Tile {
  isAir(): boolean { return false; }

  isPlayer(): boolean { return false; }

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

  update(x: number, y: number): void { }

  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }
}

class Air implements Tile {
  isAir(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) { }

  moveHorizontal(dx: number): void {
    moveToTile(playerx + dx, playery);
  }

  moveVertical(dy: number): void {
    moveToTile(playerx, playery + dy);
  }

  update(x: number, y: number): void { }
}
class UnBreakable implements Tile {
  isAir(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#999999';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void { }

  update(x: number, y: number): void { }

  moveVertical(dy: number): void { }
}

class Play implements Tile {
  isAir(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) { }

  moveHorizontal(dx: number): void { }

  update(x: number, y: number): void { }

  moveVertical(dy: number): void { }
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

class FallStrategy {
  constructor(private falling: FallingState) { }

  getFalling() {
    return this.falling;
  }

  isFalling() {
    return this.falling;
  }

  update(tile: Tile, x: number, y: number): void {
    this.falling = map[y + 1][x].isAir()
      ? new Falling()
      : new Resting();
    this.drop(y, x, tile);
  }

  private drop(y: number, x: number, tile: Tile) {
    if (this.falling.isFalling()) {
      map[y + 1][x] = tile;
      map[y][x] = new Air();
    }
  }
}

class Stone implements Tile {
  private fallStrategy: FallStrategy;

  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }

  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isFalling(): boolean { return this.isFalling(); }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#0000cc';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    this.fallStrategy
      .getFalling()
      .moveHorizontal(this, dx);
  }

  update(x: number, y: number): void {
    this.fallStrategy.update(this, x, y);
  }

  moveVertical(dy: number): void { }
}

class Box implements Tile {
  private fallStrategy: FallStrategy;

  constructor(falling: FallingState) {
    this.fallStrategy = new FallStrategy(falling);
  }

  isFlux(): boolean { return false; }

  isAir(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isFalling(): boolean { return this.isFalling(); }

  isLock1(): boolean { return false; }

  isLock2(): boolean { return false; }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#8b4513';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    this.fallStrategy
      .getFalling()
      .moveHorizontal(this, dx);
  }

  update(x: number, y: number): void {
    this.fallStrategy.update(this, x, y);
  }

  moveVertical(dy: number): void { }
}

class KeyConfiguration {
  constructor(
    private color: string,
    private lock1: boolean,
    private removeStrategy: RemoveStrategy,
  ) { }

  getColor() {
    return this.color;
  }

  isLock() {
    return this.lock1;
  }

  getRemoveStrategy() {
    return this.removeStrategy;
  }
}

class Key implements Tile {
  constructor(
    private keyConf: KeyConfiguration,
  ) { }

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
    g.fillStyle = this.keyConf.getColor();
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void {
    remove(this.keyConf.getRemoveStrategy());
    moveToTile(playerx + dx, playery);
  }

  update(x: number, y: number): void { }

  moveVertical(dy: number): void {
    remove(this.keyConf.getRemoveStrategy());
    moveToTile(playerx, playery + dy);
  }
}

class Lock1 implements Tile {
  constructor(
    private keyConf: KeyConfiguration,
  ) { }

  isAir(): boolean { return false; }

  isPlayer(): boolean { return false; }

  isLock1(): boolean { return this.keyConf.isLock(); }

  isLock2(): boolean { return !this.keyConf.isLock(); }

  draw(g: CanvasRenderingContext2D, x: number, y: number) {
    g.fillStyle = '#ffcc00';
    g.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }

  moveHorizontal(dx: number): void { }

  update(x: number, y: number): void { }

  moveVertical(dy: number): void { }
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

const YELLOW_KEY = new KeyConfiguration('#ffcc00', true, new RemoveLock1());
const BLUE_KEY = new KeyConfiguration('#00ccff', true, new RemoveLock2());

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
  case RawTile.KEY1: return new Key(YELLOW_KEY);
  case RawTile.LOCK1: return new Lock1(YELLOW_KEY);
  case RawTile.KEY2: return new Key(BLUE_KEY);
  case RawTile.LOCK2: return new Lock1(BLUE_KEY);
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

function remove(shouldRemove: RemoveStrategy) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (shouldRemove.check(map[y][x])) {
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
}

function moveVertical(dy: number) {
  map[playery + dy][playerx].moveVertical(dy);
}

function updateMap() {
  for (let y = map.length - 1; y >= 0; y--) {
    for (let x = 0; x < map[y].length; x++) {
      map[y][x].update(x, y);
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
