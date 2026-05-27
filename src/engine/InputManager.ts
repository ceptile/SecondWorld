import { EventBus } from './EventBus';

export interface KeyState { [key: string]: boolean; }

export class InputManager {
  keys: KeyState = {};
  mouse = { x: 0, y: 0, dx: 0, dy: 0, buttons: 0 };
  isPointerLocked = false;
  private canvas: HTMLCanvasElement;
  private events: EventBus;

  constructor(canvas: HTMLCanvasElement, events: EventBus) {
    this.canvas = canvas;
    this.events = events;
    this.bindEvents();
  }

  private bindEvents() {
    window.addEventListener('keydown', e => {
      this.keys[e.code] = true;
      if (e.code === 'Escape') this.events.emit('input:escape');
      if (e.code === 'KeyE') this.events.emit('input:inventory');
      if (e.code === 'F3') this.events.emit('input:debug');
      e.preventDefault();
    });
    window.addEventListener('keyup', e => { this.keys[e.code] = false; });

    this.canvas.addEventListener('mousedown', e => {
      this.mouse.buttons = e.buttons;
      if (!this.isPointerLocked) this.requestPointerLock();
      else this.events.emit('input:mousedown', { button: e.button });
    });
    this.canvas.addEventListener('mouseup', e => {
      this.mouse.buttons = e.buttons;
      this.events.emit('input:mouseup', { button: e.button });
    });
    document.addEventListener('mousemove', e => {
      if (this.isPointerLocked) {
        this.mouse.dx = e.movementX;
        this.mouse.dy = e.movementY;
        this.events.emit('input:mousemove', { dx: e.movementX, dy: e.movementY });
      }
    });
    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.canvas;
    });
    this.canvas.addEventListener('contextmenu', e => e.preventDefault());

    // Touch support
    let touchStartX = 0, touchStartY = 0;
    this.canvas.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      e.preventDefault();
    }, { passive: false });
    this.canvas.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      this.mouse.dx = dx * 2;
      this.mouse.dy = dy * 2;
      this.events.emit('input:mousemove', { dx: dx * 2, dy: dy * 2 });
      e.preventDefault();
    }, { passive: false });

    // Scroll for hotbar
    this.canvas.addEventListener('wheel', e => {
      this.events.emit('input:scroll', { delta: e.deltaY });
      e.preventDefault();
    }, { passive: false });
  }

  requestPointerLock() { this.canvas.requestPointerLock(); }
  releasePointerLock() { document.exitPointerLock(); }

  isDown(code: string): boolean { return !!this.keys[code]; }
  consumeMouseDelta(): { dx: number; dy: number } {
    const d = { dx: this.mouse.dx, dy: this.mouse.dy };
    this.mouse.dx = 0; this.mouse.dy = 0;
    return d;
  }
}
