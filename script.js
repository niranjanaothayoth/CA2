// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGame');
    startGameButton.addEventListener('click', startGame);

    const restartGameButton = document.getElementById('restartGame');
    restartGameButton.addEventListener('click', startGame);

    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.5;
    bgMusic.play();

    function startGame() {
        const playerName = document.getElementById('playerName').value;
        const playerNickname = document.getElementById('playerNickname').value;
        if (playerName && playerNickname) {
            const playerInfo = {
                name: playerName,
                nickname: playerNickname
            };
            localStorage.setItem('playerInfo', JSON.stringify(playerInfo));

            document.querySelector('.game-setup').classList.add('hidden');
            document.querySelector('.game-board').classList.remove('hidden');
            document.getElementById('playerInfo').textContent = `${playerInfo.nickname} (${playerInfo.name})`;

            initializeGame();
        } else {
            alert('Please enter both name and nickname.');
        }
    }

    function initializeGame() {
        const cardsContainer = document.querySelector('.cards-container');
        cardsContainer.innerHTML = '';

        const cardImages = [
            'assets/url1.jpg', 'assets/url2.jpg', 'assets/url3.jpg', 'assets/url4.jpg', 'assets/url5.jpg',
            'assets/url6.jpg', 'assets/url7.jpg', 'assets/url8.jpg', 'assets/url9.jpg', 'assets/url10.jpg'
        ];

        const cards = [...cardImages, ...cardImages];
        cards.sort(() => 0.5 - Math.random());

        cards.forEach(image => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back" style="background-image: url('${image}');"></div>
                </div>
            `;
            cardsContainer.appendChild(card);
            card.addEventListener('click', () => flipCard(card));
        });

        resetGame();
    }

    let firstCard = null;
    let secondCard = null;
    let movesCount = 0;

    function flipCard(card) {
        if (card.classList.contains('flipped') || firstCard && secondCard) return;

        card.classList.add('flipped');
        document.getElementById('flipSound').play();

        if (!firstCard) {
            firstCard = card;
        } else {
            secondCard = card;
            checkMatch();
        }
    }

    function checkMatch() {
        movesCount++;
        document.getElementById('movesCount').textContent = movesCount;

        const isMatch = firstCard.querySelector('.card-back').style.backgroundImage === secondCard.querySelector('.card-back').style.backgroundImage;

        if (isMatch) {
            firstCard = null;
            secondCard = null;
            checkWin();
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard = null;
                secondCard = null;
            }, 1000);
        }
    }

    function checkWin() {
        const allFlipped = document.querySelectorAll('.card.flipped').length;
        if (allFlipped === 20) {
            document.getElementById('gameMessage').textContent = getRandomPhrase(['You won!', 'Great job!', 'Fantastic!']);
            document.getElementById('winSound').play();
            endGame();
        } else if (movesCount >= 50) {
            document.getElementById('gameMessage').textContent = getRandomPhrase(['You lost!', 'Try again!', 'Better luck next time!']);
            document.getElementById('loseSound').play();
            endGame();
        }
    }

    function endGame() {
        document.getElementById('restartGame').classList.remove('hidden');
    }

    function resetGame() {
        firstCard = null;
        secondCard = null;
        movesCount = 0;
        document.getElementById('movesCount').textContent = movesCount;
        document.getElementById('gameMessage').textContent = '';
        document.getElementById('restartGame').classList.add('hidden');
    }

    function getRandomPhrase(phrases) {
        const randomIndex = Math.floor(Math.random() * phrases.length);
        return phrases[randomIndex];
    }
});
