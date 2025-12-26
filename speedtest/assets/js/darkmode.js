var dayMode, nightMode, dayModeMob, nightModeMob;

// Создаем CSS переменные для темной темы
function createDarkModeCSS() {
    const styleId = 'dark-mode-variables';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        :root {
            --dark-bg: #181818;
            --dark-text: #ffffff;
            --dark-card: #000000;
            --dark-border: #202020;
            --dark-icon: aliceblue;
            --dark-accent: #ffffff;
            
            transition: all 0.3s ease !important;
        }
        
        body.dark-theme {
            background-color: var(--dark-bg) !important;
            color: var(--dark-text) !important;
        }
        
        /* Стили для конкретных элементов из darkmode.css */
        body.dark-theme #ipDesk,
        body.dark-theme #ipMob,
        body.dark-theme .oDoLive-Status {
            fill: var(--dark-icon) !important;
        }
        
        body.dark-theme .oDoLive-Speed,
        body.dark-theme .rtextnum,
        body.dark-theme .rtextmbms,
        body.dark-theme .rtext,
        body.dark-theme .jitter-Mob,
        body.dark-theme .ConnectError {
            fill: var(--dark-accent) !important;
        }
        
        body.dark-theme .Cards,
        body.dark-theme .uiBg {
            fill: var(--dark-card) !important;
        }
        
        body.dark-theme .main-Gaugebg {
            stroke: var(--dark-card) !important;
        }
        
        body.dark-theme .progressbg {
            stroke: var(--dark-border) !important;
        }
        
        /* Плавные переходы для всех SVG элементов */
        body.dark-theme svg * {
            transition: fill 0.3s ease, stroke 0.3s ease !important;
        }
    `;
    document.head.appendChild(style);
}

// Инициализация при загрузке
window.addEventListener("load", function() {
    // Сначала создаем CSS переменные
    createDarkModeCSS();
    
    // Инициализируем элементы
    dayModeMob = document.getElementById("daymode-Mob");
    nightModeMob = document.getElementById("nightmode-Mob");
    dayMode = document.getElementById("daymode");
    nightMode = document.getElementById("nightmode");
    
    // Определяем начальную тему
    const savedMode = getCookieValue("mode");
    const systemPrefersDark = window.matchMedia && 
                             window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Загружаем тему
    if (savedMode === "dark" || (systemPrefersDark && savedMode === "")) {
        setSkin("dark");
    } else {
        setSkin("light");
    }
});

// Установка темы с предотвращением мерцания
function setSkin(mode) {
    if (mode === "dark") {
        // Предотвращаем мерцание - сначала добавляем класс, потом меняем отображение
        document.body.classList.add('dark-theme');
        
        // Прячем/показываем кнопки
        if (dayModeMob) {
            dayModeMob.style.display = "none";
            dayModeMob.style.opacity = "0";
        }
        if (nightModeMob) {
            nightModeMob.style.display = "inline-block";
            nightModeMob.style.opacity = "1";
        }
        if (dayMode) {
            dayMode.style.display = "none";
            dayMode.style.opacity = "0";
        }
        if (nightMode) {
            nightMode.style.display = "inline-block";
            nightMode.style.opacity = "1";
        }
        
        // Загружаем дополнительный CSS если нужно
        darkStyle = document.getElementById("darkmode");
        if (!darkStyle) {
            const link = document.createElement("link");
            link.id = "darkmode";
            link.rel = "stylesheet";
            link.href = "assets/css/darkmode.css";
            link.type = "text/css";
            
            // Добавляем после основного рендера
            setTimeout(() => {
                document.head.appendChild(link);
                createCookie("mode", "dark", 365);
            }, 10);
        } else {
            createCookie("mode", "dark", 365);
        }
        
    } else if (mode === "light") {
        // Убираем темную тему
        document.body.classList.remove('dark-theme');
        
        // Прячем/показываем кнопки
        if (nightModeMob) {
            nightModeMob.style.display = "none";
            nightModeMob.style.opacity = "0";
        }
        if (dayModeMob) {
            dayModeMob.style.display = "inline-block";
            dayModeMob.style.opacity = "1";
        }
        if (nightMode) {
            nightMode.style.display = "none";
            nightMode.style.opacity = "0";
        }
        if (dayMode) {
            dayMode.style.display = "inline-block";
            dayMode.style.opacity = "1";
        }
        
        // Удаляем дополнительный CSS
        darkStyle = document.getElementById("darkmode");
        if (darkStyle) {
            // Добавляем задержку перед удалением для плавности
            setTimeout(() => {
                darkStyle.parentNode.removeChild(darkStyle);
            }, 50);
        }
        
        createCookie("mode", "light", 365);
    }
    
    // Плавное появление кнопок
    setTimeout(() => {
        const buttons = [dayMode, nightMode, dayModeMob, nightModeMob];
        buttons.forEach(btn => {
            if (btn) {
                btn.style.transition = 'opacity 0.3s ease';
            }
        });
    }, 0);
}

// Функция переключения
function toggleSkin() {
    if (document.body.classList.contains('dark-theme')) {
        setSkin("light");
    } else {
        setSkin("dark");
    }
}

// Функции для работы с куками
function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookieValue(name) {
    var match = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return match ? match.pop() : "";
}

// Обновляем функцию changeSkin для совместимости
function changeSkin() {
    dayModeMob = document.getElementById("daymode-Mob");
    nightModeMob = document.getElementById("nightmode-Mob");
    dayMode = document.getElementById("daymode");
    nightMode = document.getElementById("nightmode");
    
    createDarkModeCSS();
    
    const savedMode = getCookieValue("mode");
    const systemPrefersDark = window.matchMedia && 
                             window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedMode === "dark") {
        setSkin("dark");
    } else if (savedMode === "light") {
        setSkin("light");
    } else if (systemPrefersDark) {
        setSkin("dark");
    } else {
        setSkin("light");
    }
}

// Слушатель системной темы
if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener('change', function(e) {
        if (!getCookieValue("mode")) {
            if (e.matches) {
                setSkin("dark");
            } else {
                setSkin("light");
            }
        }
    });
}

// Экспорт функций
window.setSkin = setSkin;
window.toggleSkin = toggleSkin;
window.changeSkin = changeSkin;