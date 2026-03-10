let istigfarCount = parseInt(localStorage.getItem('istigfar')) || 0;
let currentLevel = parseInt(localStorage.getItem('level')) || 1;
let currentDay = parseInt(localStorage.getItem('day')) || 1;
let prayerTimes = {};

// Daftar Task tiap Level
const levelTasks = {
    1: { title: "Deep Focus", desc: "Belajar/Coding 20 Menit Tanpa Sosmed." },
    2: { title: "Digital Detox", desc: "Matikan HP selama 30 menit & baca buku." },
    3: { title: "Self Care", desc: "Olahraga ringan/stretching selama 10 menit." },
    4: { title: "Mindfulness", desc: "Meditasi atau dengerin murottal dengan tenang." }
};

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

// Fungsi Level Up
function completeTask() {
    confetti();
    currentLevel++;
    if (currentLevel > 4) currentLevel = 1; // Balik ke level 1 kalau sudah tamat
    
    localStorage.setItem('level', currentLevel);
    updateLevelUI();
    alert("Keren, Grace! Sekarang kamu naik ke Level " + currentLevel);
}

function updateLevelUI() {
    const task = levelTasks[currentLevel];
    document.querySelector('.badge').innerText = `Level ${currentLevel}`;
    document.querySelector('.card h3').innerText = task.title;
    document.querySelector('.card p').innerText = task.desc;
}

// Fungsi Ganti Hari
function resetSystem() {
    if(confirm("Reset progress dan lanjut ke Hari Berikutnya?")) {
        currentDay++;
        if (currentDay > 7) currentDay = 1; // Balik ke hari 1 setelah seminggu
        
        istigfarCount = 0;
        currentLevel = 1;
        
        localStorage.setItem('day', currentDay);
        localStorage.setItem('istigfar', 0);
        localStorage.setItem('level', 1);
        
        location.reload();
    }
}

// Inisialisasi awal
setInterval(updateClock, 1000);
getPrayerTimes();
updateLevelUI();
document.getElementById('istigfar-count').innerText = istigfarCount;
document.getElementById('day-display').innerText = `Day ${currentDay}`;