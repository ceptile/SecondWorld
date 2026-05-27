import * as THREE from 'three';
import { Renderer } from './engine/Renderer';
import { InputManager } from './engine/InputManager';
import { AudioEngine } from './engine/AudioEngine';
import { EventBus } from './engine/EventBus';
import { World } from './world/World';
import { Player } from './entities/Player';
import { HUD } from './ui/HUD';
import { UIManager } from './ui/UIManager';
import Stats from 'stats.js';

export type GameState = 'loading' | 'mainmenu' | 'playing' | 'paused' | 'dead';

export class Game {
  canvas: HTMLCanvasElement;
  renderer!: Renderer;
  input!: InputManager;
  audio!: AudioEngine;
  events: EventBus = new EventBus();
  world!: World;
  player!: Player;
  hud!: HUD;
  ui!: UIManager;
  state: GameState = 'loading';
  private stats: Stats;
  private clock = new THREE.Clock();
  private running = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom);
    this.stats.dom.style.cssText = 'position:fixed;top:0;left:0;z-index:999;';
  }

  async init() {
    this.renderer = new Renderer(this.canvas);
    this.input = new InputManager(this.canvas, this.events);
    this.audio = new AudioEngine();
    this.ui = new UIManager(this.events);
    await this.audio.init();
  }

  async loadWorld() {
    this.world = new World(this.renderer.scene, this.events);
    await this.world.init();
    this.player = new Player(this.world, this.input, this.renderer.camera, this.events);
    this.hud = new HUD(this.player, this.events);
    this.state = 'playing';
    this.input.requestPointerLock();
  }

  start() {
    this.running = true;
    this.loop();
    window.addEventListener('resize', () => this.renderer.resize());
  }

  private loop() {
    if (!this.running) return;
    requestAnimationFrame(() => this.loop());
    this.stats.begin();
    const dt = Math.min(this.clock.getDelta(), 0.1);
    if (this.state === 'playing') {
      this.player.update(dt);
      this.world.update(dt);
      this.hud.update();
    }
    this.renderer.render();
    this.stats.end();
  }

  pause() {
    this.state = 'paused';
    this.input.releasePointerLock();
    this.events.emit('game:paused');
  }

  resume() {
    this.state = 'playing';
    this.input.requestPointerLock();
    this.events.emit('game:resumed');
  }
}
