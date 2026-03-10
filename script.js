let istigfarCount = parseInt(localStorage.getItem('istigfar')) || 0;
let prayerTimes = {};

async function getPrayerTimes() {
    try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Banyuwangi&country=Indonesia&method=11');
        const data = await res.json();
        prayerTimes = data.data.timings;
        const list = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
        const names = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];
        list.forEach((p, i) => {
            document.getElementById(p.toLowerCase()).innerText = `${names[i]}: ${prayerTimes[p]}`;
        });
    } catch (e) { console.error("Gagal ambil jadwal"); }
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
    document.getElementById('clock').innerText = now.toLocaleTimeString();

    ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].forEach(p => {
        if (prayerTimes[p] === timeStr) {
            const audio = document.getElementById('adhanAudio');
            if (audio.paused) {
                audio.play();
                alert("Grace, Waktunya Sholat " + p);
            }
        }
    });
}

function countIstigfar() {
    if (istigfarCount < 150) {
        istigfarCount++;
        document.getElementById('istigfar-count').innerText = istigfarCount;
        localStorage.setItem('istigfar', istigfarCount);
        if (istigfarCount === 150) confetti();
    }
}

function completeTask() {
    confetti();
    alert("Keren, Grace! Level Up!");
}

function resetSystem() {
    if(confirm("Reset semua progress?")) {
        localStorage.clear();
        location.reload();
    }
}

setInterval(updateClock, 1000);
getPrayerTimes();
document.getElementById('istigfar-count').innerText = istigfarCount;