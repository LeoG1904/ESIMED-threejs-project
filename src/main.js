import './style.css';
import { Application } from './application.js';
import './homeBackground.js'; // <-- ici, pour charger le background animé
import "./class/leaderBoard.js";

const startBtn = document.getElementById('start-btn');
const menu = document.getElementById('homepage');

startBtn.addEventListener('click', () => {
    // Cacher le menu
    menu.style.display = 'none';

    // Lancer le jeu
    new Application();
});
