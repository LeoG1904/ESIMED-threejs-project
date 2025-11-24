import './style.css';
import { Application } from './core/Application.js';

import "./game/LeaderBoard.js";
import HomeScene from "./scenes/homeScene.js";

const startBtn = document.getElementById('start-btn');
const menu = document.getElementById('homepage');
const canvas = document.getElementById('bg-canvas');

// Créer et lancer la scène du menu
const homeScene = new HomeScene(canvas, 500);
homeScene.start();
// Gérer le resize pour que la scène menu reste responsive
window.addEventListener('resize', () => {
    homeScene.resize(window.innerWidth, window.innerHeight);
});
startBtn.addEventListener('click', () => {
    // Cacher le menu
    menu.style.display = 'none';

    // Lancer le jeu
    new Application();
});
