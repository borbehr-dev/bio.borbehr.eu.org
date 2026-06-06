const faces = ["^_^", ">_0", ":3", "o_o", "-_-", "O_O", "x_x", ";_;", ":D", ":P", ":)", ":(", ":]", ":[", ":>", ":<", ":-)", ":-(", ":-D", ":-P", ";)", ";-)", ":'(", ":O", ":o", "XD", "xD", ":|", ":-|", ":/", ":-/", ":\\", ":-\\", ":*", "<3", "</3", "^o^", "^.^", "-.^", "._.", "T_T", "ಥ_ಥ", "ಠ_ಠ", "¯\\_(ツ)_/¯", "(^_^;)", "(>_<)", "(o_O)", "(O_o)", "(^_~)", "(^_-)", "(¬_¬)", "(=_=)", "(^3^)", "(^ω^)", "(=^.^=)", "(=^･^=)", "(>_>)", "(<_<)", "(^人^)", "(✿◠‿◠)"];

async function initBiolink() {
    try {
        // Загружаем данные из json файлов
        const [configRes, linksRes] = await Promise.all([
            fetch('./config.json'),
            fetch('./links.json')
        ]);
        
        const config = await configRes.json();
        const links = await linksRes.json();

        // Заполняем мета-теги и заголовки страницы
        document.title = config.meta.title;
        document.getElementById('meta-theme').content = config.meta.themeColor;
        document.getElementById('meta-og-title').content = config.meta.title;
        document.getElementById('meta-og-desc').content = config.meta.description;

        // Заполняем профиль
        document.getElementById('profile-name').textContent = config.profile.username;
        document.getElementById('profile-pic').src = config.profile.avatarUrl;

        // Обрабатываем значок/бейдж (если он есть в конфиге)
        if (config.profile.badge) {
            document.getElementById('badge-icon').src = config.profile.badge.iconUrl;
            document.getElementById('badge-tooltip').textContent = config.profile.badge.tooltip;
            document.getElementById('badge-wrapper').style.display = 'inline-flex';
        }

        // Музыкальный плеер
        const bgMusic = document.getElementById('bg-music');
        bgMusic.src = config.audio.src;

        // Логика экрана входа
        const enterScreen = document.getElementById('enter-screen');
        enterScreen.addEventListener('click', () => {
            enterScreen.classList.add('fade-out');
            bgMusic.volume = config.audio.volume;
            bgMusic.play().catch(err => console.log("Music autoplay blocked or failed:", err));
            setTimeout(() => enterScreen.remove(), 800);
        });

        // Генерируем кнопки соцсетей
        const linksContainer = document.getElementById('links-container');
        linksContainer.innerHTML = links.map(link => `
            <a href="${link.url}" class="link-icon" target="_blank" rel="noopener noreferrer" title="${link.name}">
                <img src="${link.icon}" alt="${link.name}">
            </a>
        `).join('');

        // Запуск интерактива
        startEffects();

    } catch (error) {
        console.error("Ошибка инициализации биолинка:", error);
    }
}

function startEffects() {
    // Анимация статуса "Now Playing"
    const el = document.querySelector(".now-playing");
    if (el) {
        let i = 0;
        setInterval(() => {
            el.textContent = "♫ Now Playing: " + faces[i];
            i = (i + 1) % faces.length;
        }, 50);
    }

    // Падающий снег
    setInterval(() => {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '❄';
        snowflake.style.left = Math.random() * 100 + '%';
        snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
        snowflake.style.opacity = Math.random();
        snowflake.style.animationDuration = Math.random() * 3 + 5 + 's';
        document.body.appendChild(snowflake);
        setTimeout(() => snowflake.remove(), 8000);
    }, 100);

    // 3D наклон карточки при движении мыши
    const card = document.getElementById('card');
    document.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientY - (r.top + r.height / 2)) / 30;
        const y = ((r.left + r.width / 2) - e.clientX) / 30;
        card.style.transform = `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
}

// Запускаем всё приложение
initBiolink();