import './style.css';
import { Application } from './core/application.js';
import './scenes/homeScene.js';
import "./game/leaderBoard.js";

const startBtn = document.getElementById('start-btn');
const menu = document.getElementById('homepage');

startBtn.addEventListener('click', () => {
    // Cacher le menu
    menu.style.display = 'none';

    // Lancer le jeu
    new Application();
});
