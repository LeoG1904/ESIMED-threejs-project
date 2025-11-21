document.getElementById("open-leaderboard-btn").onclick = () => {
    displayLeaderboard();
    document.getElementById("leaderboard-screen").style.display = "flex";
};

document.getElementById("close-leaderboard-btn").onclick = () => {
    document.getElementById("leaderboard-screen").style.display = "none";
};

export function loadLeaderboard() {
    const data = localStorage.getItem("cc_leaderboard");
    return data ? JSON.parse(data) : [];
}

export function saveLeaderboard(scores) {
    localStorage.setItem("cc_leaderboard", JSON.stringify(scores));
}

export function addScore(name, kills, time) {
    const scores = loadLeaderboard();

    scores.push({
        name,
        kills,
        time,
        score: kills + Math.floor(Number(time) || 0),
        date: new Date().toLocaleDateString()
    });

    console.log(kills + Math.floor(Number(time) || 0))

    // Trier du meilleur au moins bon
    scores.sort((a, b) => b.score - a.score);

    // Garder seulement les 10 meilleurs
    const top10 = scores.slice(0, 10);

    saveLeaderboard(top10);
    return top10;
}

export function displayLeaderboard() {
    const scores = loadLeaderboard();
    const list = document.getElementById("leaderboard-list");
    list.innerHTML = "";

    if (scores.length === 0) {
        list.innerHTML = "<li>No scores yet</li>";
        return;
    }

    scores.forEach(s => {
        const li = document.createElement("li");
        li.textContent = `${s.name} — ${s.score} pts  (kills: ${s.kills}, time: ${s.time}s)`;
        list.appendChild(li);
    });
}
