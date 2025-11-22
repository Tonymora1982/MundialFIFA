const groupsData = {
    "A": [
        { name: "México", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Francia", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Egipto", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Corea del Sur", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }
    ],
    "B": [
        { name: "Estados Unidos", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Inglaterra", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Ucrania", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Irán", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }
    ],
    "C": [
        { name: "Argentina", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Arabia Saudita", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Italia", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 },
        { name: "Polonia", played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }
    ],
    // Add more groups as needed, keeping it simple for now
};

const liveMatches = [
    { id: 1, home: "México", away: "Francia", homeScore: 0, awayScore: 0, minute: 1, status: "LIVE" },
    { id: 2, home: "Argentina", away: "Arabia Saudita", homeScore: 1, awayScore: 2, minute: 85, status: "LIVE" }
];

const bracketData = {
    r16: [
        { home: "1A", away: "2B", homeScore: "-", awayScore: "-" },
        { home: "1C", away: "2D", homeScore: "-", awayScore: "-" },
        { home: "1E", away: "2F", homeScore: "-", awayScore: "-" },
        { home: "1G", away: "2H", homeScore: "-", awayScore: "-" }
    ],
    r8: [
        { home: "W1", away: "W2", homeScore: "-", awayScore: "-" },
        { home: "W3", away: "W4", homeScore: "-", awayScore: "-" }
    ],
    r4: [
        { home: "W5", away: "W6", homeScore: "-", awayScore: "-" }
    ],
    final: [
        { home: "W7", away: "W8", homeScore: "-", awayScore: "-" }
    ]
};

const dailyNews = [
    { title: "Sedes Anunciadas", date: "Hoy", content: "La FIFA ha confirmado los estadios para la gran final del 2026. Nueva York/Nueva Jersey será el escenario principal." },
    { title: "Mbappé en Duda", date: "Hace 2 horas", content: "El capitán francés sufre una molestia en el entrenamiento y es duda para el debut contra México." },
    { title: "Récord de Entradas", date: "Ayer", content: "Se han agotado todas las entradas para la fase de grupos en tiempo récord. El entusiasmo es total." }
];

function renderCountdown() {
    const targetDate = new Date("June 11, 2026 00:00:00").getTime();

    const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days;
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    };

    setInterval(updateTimer, 1000);
    updateTimer();
}

function renderNews() {
    const container = document.getElementById('news-container');
    container.innerHTML = dailyNews.map(news => `
        <div class="news-card">
            <h3>${news.title}</h3>
            <span class="date">${news.date}</span>
            <p>${news.content}</p>
        </div>
    `).join('');
}

function renderGroups() {
    const container = document.getElementById('groups-container');
    container.innerHTML = '';

    for (const [groupName, teams] of Object.entries(groupsData)) {
        const groupCard = document.createElement('div');
        groupCard.className = 'group-card';
        groupCard.style.opacity = '0'; // Initial state for animation

        let tableHtml = `<h3>Grupo ${groupName}</h3>
        <table class="group-table">
            <thead>
                <tr>
                    <th>Equipo</th>
                    <th>PJ</th>
                    <th>Pts</th>
                </tr>
            </thead>
            <tbody>`;

        teams.forEach(team => {
            tableHtml += `
                <tr>
                    <td>${team.name}</td>
                    <td>${team.played}</td>
                    <td>${team.points}</td>
                </tr>`;
        });

        tableHtml += `</tbody></table>`;
        groupCard.innerHTML = tableHtml;
        container.appendChild(groupCard);
    }
}

function renderLiveMatches(animate = false) {
    const container = document.getElementById('live-matches-container');
    // Only clear if we are re-rendering everything, but for updates we might want to be more surgical
    // For simplicity, we re-render, but if we want to animate specific elements, we need to target them.
    // However, the requirement is "flash effect" on update.
    // Let's re-render and then animate entry if it's the first time.

    // To handle updates efficiently without destroying DOM (which kills animations), we should diff.
    // But since this is a simple demo, I'll clear and re-render, but for the "score update" animation,
    // I need to track changes.

    const existingCards = {};
    Array.from(container.children).forEach(card => {
        const id = card.dataset.id;
        if(id) existingCards[id] = card;
    });

    liveMatches.forEach(match => {
        let matchCard = existingCards[match.id];
        let isNew = false;

        if (!matchCard) {
            matchCard = document.createElement('div');
            matchCard.className = 'match-card';
            matchCard.dataset.id = match.id;
            matchCard.style.opacity = '0'; // Initial state
            container.appendChild(matchCard);
            isNew = true;
        }

        const oldScore = matchCard.querySelector('.score')?.textContent;
        const newScore = `${match.homeScore} - ${match.awayScore}`;

        matchCard.innerHTML = `
            <div class="team home">
                <i class="fa-solid fa-shirt fa-2x" style="color: #ccc; margin-bottom: 5px;"></i>
                <span>${match.home}</span>
            </div>
            <div class="match-info">
                <div class="match-status"><i class="fa-solid fa-circle live-indicator"></i> ${match.minute}'</div>
                <div class="score" id="score-${match.id}">${newScore}</div>
            </div>
            <div class="team away">
                <i class="fa-solid fa-shirt fa-2x" style="color: var(--primary-color); margin-bottom: 5px;"></i>
                <span>${match.away}</span>
            </div>
        `;

        // If score changed and not new, animate
        if (!isNew && oldScore && oldScore !== newScore) {
             anime({
                targets: `#score-${match.id}`,
                scale: [1, 1.5, 1],
                color: ['#ffffff', '#ff0055', '#ffffff'],
                duration: 600,
                easing: 'easeInOutQuad'
            });
        }
    });
}

function renderBracket() {
    const renderRound = (matches, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = matches.map(m =>
            `<div class="bracket-match" style="opacity: 0">
                <div class="team"><span>${m.home}</span><span>${m.homeScore}</span></div>
                <div class="team"><span>${m.away}</span><span>${m.awayScore}</span></div>
            </div>`
        ).join('');
    };

    renderRound(bracketData.r16, 'r16-matches');
    renderRound(bracketData.r8, 'r8-matches');
    renderRound(bracketData.r4, 'r4-matches');
    renderRound(bracketData.final, 'final-match');
}

function animateEntry() {
    // Animate Matches
    anime({
        targets: '.match-card',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutQuad'
    });

    // Animate Groups
    anime({
        targets: '.group-card',
        translateY: [20, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {start: 300}), // Start after matches
        easing: 'easeOutQuad'
    });

    // Animate Bracket
    anime({
        targets: '.bracket-match',
        translateX: [-20, 0],
        opacity: [0, 1],
        delay: anime.stagger(50, {start: 800}), // Start after groups
        easing: 'easeOutQuad'
    });
}

function updateScores() {
    liveMatches.forEach(match => {
        // Random chance to score
        if (Math.random() > 0.9) {
            if (Math.random() > 0.5) {
                match.homeScore++;
            } else {
                match.awayScore++;
            }
        }
        // Increment time
        if (match.minute < 90) {
            match.minute++;
        }
    });
    renderLiveMatches(); // This now handles diffing internally for animations
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderCountdown();
    renderNews();
    renderGroups();
    renderLiveMatches();
    renderBracket();

    // Initial Animation
    animateEntry();

    // Simulate live updates every 2 seconds
    setInterval(updateScores, 2000);
});
