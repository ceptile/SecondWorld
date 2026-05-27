import { Game } from './Game';

const loadingBar = document.getElementById('loading-bar') as HTMLDivElement;
const loadingText = document.getElementById('loading-text') as HTMLDivElement;
const loadingScreen = document.getElementById('loading-screen') as HTMLDivElement;

function setProgress(pct: number, text: string) {
  loadingBar.style.width = `${pct}%`;
  loadingText.textContent = text;
}

async function bootstrap() {
  try {
    setProgress(10, 'Creating renderer...');
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const game = new Game(canvas);

    setProgress(30, 'Loading assets...');
    await game.init();

    setProgress(70, 'Generating world...');
    await game.loadWorld();

    setProgress(95, 'Starting game...');
    await new Promise(r => setTimeout(r, 200));

    setProgress(100, 'Ready!');
    loadingScreen.style.transition = 'opacity 0.5s';
    loadingScreen.style.opacity = '0';
    setTimeout(() => { loadingScreen.style.display = 'none'; }, 500);

    game.start();
  } catch (err) {
    console.error('Failed to start SecondWorld:', err);
    loadingText.textContent = 'Error loading game. Check console.';
    loadingText.style.color = '#ff4444';
  }
}

bootstrap();
