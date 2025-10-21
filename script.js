// Game State
const gameState = {
    petName: '',
    petType: '',
    hunger: 100,
    happiness: 100,
    energy: 100,
    health: 100,
    balance: 100,
    age: 0,
    expenses: {
        food: 0,
        toys: 0,
        health: 0,
        supplies: 0
    },
    badges: [],
    toys: 0,
    choresCooldown: {
        chore1: false,
        chore2: false,
        chore3: false
    }
};

const petEmojis = {
    dog: { baby: '🐕', adult: '🐶', senior: '🦮' },
    cat: { baby: '🐱', adult: '😺', senior: '😸' },
    rabbit: { baby: '🐰', adult: '🐇', senior: '🐰' },
    bird: { baby: '🐦', adult: '🦜', senior: '🦅' },
    hamster: { baby: '🐹', adult: '🐹', senior: '🐹' },
    fish: { baby: '🐠', adult: '🐟', senior: '🐡' }
};

// Setup Screen Logic
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const petNameInput = document.getElementById('petName');
const startBtn = document.getElementById('startBtn');
const petOptions = document.querySelectorAll('.pet-option');

petOptions.forEach(option => {
    option.addEventListener('click', () => {
        petOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        gameState.petType = option.dataset.type;
        checkStartBtn();
    });
});

petNameInput.addEventListener('input', checkStartBtn);

function checkStartBtn() {
    startBtn.disabled = !(petNameInput.value.trim() && gameState.petType);
}

startBtn.addEventListener('click', startGame);

function startGame() {
    gameState.petName = petNameInput.value.trim();
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    document.getElementById('petNameDisplay').textContent = gameState.petName;
    updateUI();
    startGameLoop();
}

// Game Loop
function startGameLoop() {
    setInterval(() => {
        gameState.hunger = Math.max(0, gameState.hunger - 2);
        gameState.happiness = Math.max(0, gameState.happiness - 1);
        gameState.energy = Math.max(0, gameState.energy - 1);
        
        if (gameState.hunger < 30 || gameState.happiness < 30) {
            gameState.health = Math.max(0, gameState.health - 1);
        }
        
        gameState.age++;
        updateUI();
        checkAchievements();
    }, 3000);
}

// Actions
document.getElementById('feedBtn').addEventListener('click', () => {
    if (gameState.balance >= 5) {
        gameState.hunger = Math.min(100, gameState.hunger + 30);
        gameState.balance -= 5;
        gameState.expenses.food += 5;
        showNotification('Fed ' + gameState.petName + '! 🍖');
        updateUI();
    } else {
        showNotification('Not enough money! Do chores to earn more.', 'warning');
    }
});

document.getElementById('playBtn').addEventListener('click', () => {
    if (gameState.balance >= 3 && gameState.energy > 20) {
        gameState.happiness = Math.min(100, gameState.happiness + 25);
        gameState.energy = Math.max(0, gameState.energy - 15);
        gameState.balance -= 3;
        gameState.expenses.toys += 3;
        showNotification('Playtime! ' + gameState.petName + ' is having fun! 🎾');
        updateUI();
    } else if (gameState.energy <= 20) {
        showNotification(gameState.petName + ' is too tired to play!', 'warning');
    } else {
        showNotification('Not enough money!', 'warning');
    }
});

document.getElementById('cleanBtn').addEventListener('click', () => {
    if (gameState.balance >= 4) {
        gameState.happiness = Math.min(100, gameState.happiness + 15);
        gameState.health = Math.min(100, gameState.health + 10);
        gameState.balance -= 4;
        gameState.expenses.supplies += 4;
        showNotification('Bath time! ' + gameState.petName + ' is squeaky clean! 🛁');
        updateUI();
    } else {
        showNotification('Not enough money!', 'warning');
    }
});

document.getElementById('restBtn').addEventListener('click', () => {
    if (gameState.energy < 100) {
        gameState.energy = Math.min(100, gameState.energy + 40);
        showNotification(gameState.petName + ' is resting... 😴');
        updateUI();
    } else {
        showNotification(gameState.petName + ' is not tired!', 'warning');
    }
});

document.getElementById('vetBtn').addEventListener('click', () => {
    if (gameState.balance >= 20) {
        gameState.health = 100;
        gameState.balance -= 20;
        gameState.expenses.health += 20;
        showNotification('Vet checkup complete! ' + gameState.petName + ' is healthy! ⚕️');
        updateUI();
    } else {
        showNotification('Not enough money for vet visit!', 'warning');
    }
});

document.getElementById('toyBtn').addEventListener('click', () => {
    if (gameState.balance >= 15) {
        gameState.toys++;
        gameState.happiness = Math.min(100, gameState.happiness + 30);
        gameState.balance -= 15;
        gameState.expenses.toys += 15;
        showNotification('New toy! ' + gameState.petName + ' loves it! 🎁');
        updateUI();
    } else {
        showNotification('Not enough money!', 'warning');
    }
});

// Chores
document.getElementById('chore1Btn').addEventListener('click', () => doChore('chore1', 10, 'Cleaned room!'));
document.getElementById('chore2Btn').addEventListener('click', () => doChore('chore2', 8, 'Washed dishes!'));
document.getElementById('chore3Btn').addEventListener('click', () => doChore('chore3', 12, 'Finished homework!'));

function doChore(choreId, amount, message) {
    if (!gameState.choresCooldown[choreId]) {
        gameState.balance += amount;
        gameState.choresCooldown[choreId] = true;
        document.getElementById(choreId + 'Btn').disabled = true;
        showNotification(message + ' Earned $' + amount + '! 💰');
        updateUI();
        
        setTimeout(() => {
            gameState.choresCooldown[choreId] = false;
            document.getElementById(choreId + 'Btn').disabled = false;
        }, 15000);
    }
}

// UI Updates
function updateUI() {
    document.getElementById('balance').textContent = '$' + gameState.balance;
    
    updateStat('hunger', gameState.hunger);
    updateStat('happiness', gameState.happiness);
    updateStat('energy', gameState.energy);
    updateStat('health', gameState.health);
    
    document.getElementById('foodExpense').textContent = '$' + gameState.expenses.food;
    document.getElementById('toyExpense').textContent = '$' + gameState.expenses.toys;
    document.getElementById('healthExpense').textContent = '$' + gameState.expenses.health;
    document.getElementById('supplyExpense').textContent = '$' + gameState.expenses.supplies;
    
    const total = gameState.expenses.food + gameState.expenses.toys + 
                 gameState.expenses.health + gameState.expenses.supplies;
    document.getElementById('totalExpense').textContent = '$' + total;
    
    updatePetAppearance();
    updatePetMood();
}

function updateStat(stat, value) {
    document.getElementById(stat + 'Value').textContent = Math.round(value);
    document.getElementById(stat + 'Bar').style.width = value + '%';
}

function updatePetAppearance() {
    const stage = gameState.age < 50 ? 'baby' : gameState.age < 150 ? 'adult' : 'senior';
    const emoji = petEmojis[gameState.petType][stage];
    document.getElementById('petCharacter').textContent = emoji;
    
    const badges = ['Baby', 'Young', 'Adult', 'Senior'];
    const badgeIndex = Math.min(Math.floor(gameState.age / 50), 3);
    document.getElementById('evolutionBadge').textContent = badges[badgeIndex];
}

function updatePetMood() {
    const avg = (gameState.hunger + gameState.happiness + gameState.energy + gameState.health) / 4;
    let mood, message;
    
    if (avg >= 80) {
        mood = 'Happy & Healthy! 😊';
        message = 'I love spending time with you!';
    } else if (avg >= 60) {
        mood = 'Doing Good! 🙂';
        message = 'Things are going well!';
    } else if (avg >= 40) {
        mood = 'Needs Attention 😐';
        message = 'I could use some care...';
    } else if (avg >= 20) {
        mood = 'Not Feeling Great 😟';
        message = 'Please take care of me!';
    } else {
        mood = 'Very Unhappy! 😢';
        message = 'I really need your help!';
    }
    
    document.getElementById('petMood').textContent = mood;
    document.getElementById('petMessage').textContent = message;
}

function checkAchievements() {
    const achievements = [
        { id: 'first-feed', condition: gameState.expenses.food > 0, text: '🍖 First Meal' },
        { id: 'toy-collector', condition: gameState.toys >= 3, text: '🎁 Toy Collector' },
        { id: 'caregiver', condition: (gameState.expenses.food + gameState.expenses.toys + gameState.expenses.health + gameState.expenses.supplies) >= 100, text: '💝 Dedicated Caregiver' },
        { id: 'healthy-pet', condition: gameState.health === 100 && gameState.age > 20, text: '❤️ Perfect Health' },
        { id: 'happy-pet', condition: gameState.happiness === 100, text: '😊 Ultimate Happiness' },
        { id: 'big-spender', condition: (gameState.expenses.food + gameState.expenses.toys + gameState.expenses.health + gameState.expenses.supplies) >= 200, text: '💰 Big Spender' },
        { id: 'adult-stage', condition: gameState.age >= 50, text: '🌟 All Grown Up' },
        { id: 'senior-stage', condition: gameState.age >= 150, text: '👑 Wise Senior' },
        { id: 'hard-worker', condition: gameState.expenses.food + gameState.expenses.toys + gameState.expenses.health + gameState.expenses.supplies > gameState.balance + 50, text: '💼 Hard Worker' }
    ];
    
    achievements.forEach(achievement => {
        if (achievement.condition && !gameState.badges.includes(achievement.id)) {
            gameState.badges.push(achievement.id);
            addBadge(achievement.text);
            showNotification('New Achievement: ' + achievement.text + '! 🏆');
        }
    });
}

function addBadge(text) {
    const badgeList = document.getElementById('badgeList');
    if (gameState.badges.length === 1) {
        badgeList.innerHTML = '';
    }
    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = text;
    badgeList.appendChild(badge);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 5px; color: ${type === 'warning' ? '#ff6b6b' : '#667eea'};">
            ${type === 'warning' ? '⚠️' : '✅'} ${type === 'warning' ? 'Oops!' : 'Success!'}
        </div>
        <div>${message}</div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}