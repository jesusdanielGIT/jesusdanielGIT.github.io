const images = [
    './images/cereza.jpg',
    './images/flor.jpg',
    './images/girasol.jpg',
    './images/hoja.jpg',
    './images/hongo.jpg',
    './images/nomo.jpg',
    './images/nuez.jpg',
    './images/tronco.jpg'
];

class MemoryGame {
    constructor(images) {
        this.images = [...images, ...images];
        this.board = document.getElementById('game-board');
        this.attemptsDisplay = document.getElementById('attempts');
        this.completedPairsDisplay = document.getElementById('completed-pairs');
        this.restantPairsDisplay = document.getElementById('restant-pairs')
        this.totalPairsDisplay = document.getElementById('total-pairs');
        this.timerDisplay = document.getElementById('timer');
        this.startButton = document.getElementById('start');
        this.restartButton = document.getElementById('restart');
        this.attempts = 0;
        this.selectedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = images.length;
        this.timer = null;
        this.startTime = null;

        this.startButton.addEventListener('click', () => this.start());
        this.restartButton.addEventListener('click', () => this.restart());
        this.initGame();
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    initGame() {
        this.board.innerHTML = '';
        const shuffledImages = this.shuffle(this.images);
        
        shuffledImages.forEach((src, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.index = index;

            const img = document.createElement('img');
            img.src = src;
            card.appendChild(img);

            card.addEventListener('click', () => this.handleCardClick(card));
            this.board.appendChild(card);
        });
    }

    start() {
        this.board.querySelectorAll('.card').forEach(card => card.classList.add('active'));
        this.startButton.disabled = true;
        this.restartButton.disabled = false;
        this.startTime = new Date();
        this.timer = setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const currentTime = new Date();
        const elapsedTime = new Date(currentTime - this.startTime);
        const minutes = String(elapsedTime.getMinutes()).padStart(2, '0');
        const seconds = String(elapsedTime.getSeconds()).padStart(2, '0');
        this.timerDisplay.textContent = `${minutes}:${seconds}`;
    }

    handleCardClick(card) {
        if (
            card.classList.contains('flipped') || 
            card.classList.contains('matched') || 
            this.selectedCards.length === 2
        ) return;

        card.classList.add('flipped');
        this.selectedCards.push(card);

        if (this.selectedCards.length === 2) {
            this.attempts++;
            this.attemptsDisplay.textContent = this.attempts;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.selectedCards;
        const img1 = card1.querySelector('img').src;
        const img2 = card2.querySelector('img').src;

        if (img1 === img2) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;
            this.completedPairsDisplay.textContent = this.matchedPairs;
            this.restantPairsDisplay.textContent = this.totalPairs - this.matchedPairs; 

            if (this.matchedPairs === this.totalPairs) {
                clearInterval(this.timer);
                alert(`¡Ganaste en ${this.attempts} intentos y ${this.timerDisplay.textContent}!`);
            }
        } else {
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }, 1000);
        }

        this.selectedCards = [];
    }

    restart() {
        this.attempts = 0;
        this.matchedPairs = 0;
        this.restantPairsDisplay.textContent = '0';
        this.attemptsDisplay.textContent = '0';
        this.completedPairsDisplay.textContent = '0';
        this.timerDisplay.textContent = '00:00';
        clearInterval(this.timer);
        this.initGame();
        this.startButton.disabled = false;
        this.restartButton.disabled = true;
        this.board.querySelectorAll('.card').forEach(card => {
            card.classList.remove('active', 'flipped', 'matched');
        });
    }
}

new MemoryGame(images);