import { h, render } from 'preact';
import TWEEN from 'tween.js';

import App from './components/App';
import { installServiceWorker } from './sw';

function animateTween() {
  requestAnimationFrame(animateTween);
  TWEEN.update();
}
animateTween();

installServiceWorker();

render(<App />, document.getElementById('app'));
