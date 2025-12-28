/**
 * GameManager - Gestionnaire principal de la plateforme
 * Gère le score global, la navigation et les conditions de défaite
 */
class GameManager {
    // Constantes pour les coûts
    static HINT_COST = 25; // Coût d'un indice
    static ERROR_COST = 5; // Coût d'une erreur
    static CORRECT_ANSWER_POINTS = 10; // Points gagnés pour une bonne réponse

    constructor() {
        // Si pas de score sauvegardé, initialiser à 50 au lieu de 100
        const savedScore = StorageManager.loadGlobalScore();
        this.globalScore = savedScore !== null ? savedScore : 50;
        this.currentGame = null;
        this.games = new Map(); // Map<gameId, gameInstance>
        
        this.init();
    }

    /**
     * Initialise le GameManager
     */
    init() {
        this.updateScoreDisplay();
        this.updateCostsDisplay();
        this.setupEventListeners();
        this.showMenu();
    }

    /**
     * Configure les écouteurs d'événements
     */
    setupEventListeners() {
        const menuBtn = document.getElementById('menu-btn');
        const resetBtn = document.getElementById('reset-btn');
        const restartAllBtn = document.getElementById('restart-all-btn');

        if (menuBtn) {
            menuBtn.addEventListener('click', () => this.showMenu());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }

        if (restartAllBtn) {
            restartAllBtn.addEventListener('click', () => this.restartAllGames());
        }
    }

    /**
     * Enregistre un jeu dans le gestionnaire
     * @param {string} gameId - Identifiant unique du jeu
     * @param {GameBase} gameInstance - Instance du jeu
     */
    registerGame(gameId, gameInstance) {
        this.games.set(gameId, gameInstance);
    }

    /**
     * Affiche le menu principal
     */
    showMenu() {
        this.currentGame = null;
        this.hideAllScreens();
        document.getElementById('menu-screen').classList.add('active');
        document.getElementById('menu-btn').style.display = 'none';
        this.updateGamesList();
    }

    /**
     * Affiche un jeu spécifique
     * @param {string} gameId - Identifiant du jeu à afficher
     */
    showGame(gameId) {
        // Vérifier si le jeu est bloqué (score <= 0)
        if (this.globalScore <= 0) {
            this.showGameOver();
            return;
        }

        const game = this.games.get(gameId);
        if (!game) {
            console.error(`Jeu ${gameId} non trouvé`);
            return;
        }

        this.currentGame = game;
        this.hideAllScreens();
        document.getElementById('game-container').classList.add('active');
        document.getElementById('menu-btn').style.display = 'block';

        // Vérifier si le jeu est en cours de chargement
        if (game.isLoading === true) {
            // Afficher l'écran de chargement du jeu
            const container = document.getElementById('game-content');
            if (container) {
                if (game.renderLoadingScreen && typeof game.renderLoadingScreen === 'function') {
                    game.renderLoadingScreen();
                } else {
                    container.innerHTML = `
                        <div class="loading-screen">
                            <div class="loading-spinner"></div>
                            <h2>Chargement de ${game.name}...</h2>
                            <p>Veuillez patienter...</p>
                        </div>
                    `;
                }
            }
            
            // Attendre que le chargement soit terminé
            const checkLoading = setInterval(() => {
                if (game.isLoading === false) {
                    clearInterval(checkLoading);
                    // Relancer showGame une fois chargé
                    this.showGame(gameId);
                }
            }, 100);
            return;
        }
        
        // Charger l'état du jeu s'il existe
        game.loadState();
        
        // Gérer le cas où start() est async (PeopleGame)
        if (game.start && game.start.constructor.name === 'AsyncFunction') {
            game.start().catch(err => {
                console.error(`Erreur lors du démarrage de ${gameId}:`, err);
            });
        } else {
            game.start();
        }
    }

    /**
     * Affiche l'écran Game Over
     */
    showGameOver() {
        this.hideAllScreens();
        document.getElementById('gameover-screen').classList.add('active');
        document.getElementById('menu-btn').style.display = 'none';
    }

    /**
     * Cache tous les écrans
     */
    hideAllScreens() {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
    }

    /**
     * Met à jour la liste des jeux dans le menu
     */
    updateGamesList() {
        const gamesList = document.getElementById('games-list');
        gamesList.innerHTML = '';

        this.games.forEach((game, gameId) => {
            const card = document.createElement('div');
            card.className = 'game-card';
            
            // Vérifier si le jeu est en cours de chargement
            const isLoading = game.isLoading === true;
            const loadingClass = isLoading ? 'loading' : '';
            const loadingIndicator = isLoading ? '<div class="loading-indicator">⏳ Chargement...</div>' : '';
            
            // Obtenir la progression si disponible
            let progressHtml = '';
            if (game.getProgress && typeof game.getProgress === 'function') {
                try {
                    const progress = game.getProgress();
                    if (progress && progress.total > 0) {
                        progressHtml = `
                            <div class="game-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                                </div>
                                <span class="progress-text">${progress.found}/${progress.total} (${progress.percentage}%)</span>
                            </div>
                        `;
                    }
                } catch (error) {
                    console.error(`Erreur lors de la récupération de la progression pour ${gameId}:`, error);
                }
            }
            
            // Afficher la progression de chargement si en cours
            let loadingProgressHtml = '';
            if (isLoading && game.loadingProgress !== undefined) {
                loadingProgressHtml = `
                    <div class="loading-progress-mini">
                        <div class="loading-progress-bar-mini">
                            <div class="loading-progress-fill-mini" style="width: ${game.loadingProgress}%"></div>
                        </div>
                        <span class="loading-progress-text">${game.loadingProgress}%</span>
                    </div>
                `;
            }
            
            card.className = `game-card ${loadingClass}`;
            card.innerHTML = `
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                ${loadingIndicator}
                ${loadingProgressHtml}
                ${progressHtml}
            `;
            
            // Désactiver le clic si en cours de chargement
            if (!isLoading) {
                card.addEventListener('click', () => this.showGame(gameId));
            } else {
                card.style.cursor = 'wait';
                card.style.opacity = '0.7';
            }
            
            gamesList.appendChild(card);
        });
    }

    /**
     * Ajoute des points au score global
     * @param {number} amount - Nombre de points à ajouter
     * @returns {boolean} - true si succès
     */
    addPoints(amount) {
        if (amount <= 0) return false;
        
        this.globalScore += amount;
        this.updateScoreDisplay();
        StorageManager.saveGlobalScore(this.globalScore);
        return true;
    }

    /**
     * Dépense des points du score global
     * @param {number} amount - Nombre de points à dépenser
     * @returns {boolean} - true si succès, false si pas assez de points ou game over
     */
    spendPoints(amount) {
        if (this.globalScore <= 0) {
            return false; // Game Over
        }

        if (amount <= 0) return false;

        if (this.globalScore < amount) {
            return false; // Pas assez de points
        }

        this.globalScore -= amount;
        this.updateScoreDisplay();
        StorageManager.saveGlobalScore(this.globalScore);

        // Vérifier si le score atteint 0 après dépense
        if (this.globalScore <= 0) {
            this.globalScore = 0;
            this.showGameOver();
            return false;
        }

        return true;
    }

    /**
     * Déduit des points pour une erreur
     * @returns {boolean} - true si succès, false si game over
     */
    deductErrorPoints() {
        return this.spendPoints(GameManager.ERROR_COST);
    }

    /**
     * Retourne le coût d'un indice
     * @returns {number}
     */
    getHintCost() {
        return GameManager.HINT_COST;
    }

    /**
     * Retourne le coût d'une erreur
     * @returns {number}
     */
    getErrorCost() {
        return GameManager.ERROR_COST;
    }

    /**
     * Met à jour l'affichage du score dans le HUD
     */
    updateScoreDisplay() {
        const scoreElement = document.getElementById('global-score');
        if (scoreElement) {
            scoreElement.textContent = this.globalScore;
            
            // Animation visuelle si le score change
            scoreElement.style.transform = 'scale(1.2)';
            setTimeout(() => {
                scoreElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    /**
     * Met à jour l'affichage des coûts dans le HUD
     */
    updateCostsDisplay() {
        const hintCostElement = document.getElementById('hint-cost');
        const errorCostElement = document.getElementById('error-cost');
        
        if (hintCostElement) {
            hintCostElement.textContent = GameManager.HINT_COST;
        }
        
        if (errorCostElement) {
            errorCostElement.textContent = GameManager.ERROR_COST;
        }
    }

    /**
     * Réinitialise complètement le jeu
     */
    resetGame() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les jeux et votre score ?')) {
            StorageManager.resetAll();
            this.globalScore = 50;
            this.updateScoreDisplay();
            this.showMenu();
            
            // Réinitialiser tous les jeux enregistrés
            this.games.forEach(game => {
                if (game.reset) {
                    game.reset();
                }
            });
        }
    }

    /**
     * Réinitialise tous les jeux et remet le score au début (bouton restart global)
     */
    restartAllGames() {
        if (confirm('Êtes-vous sûr de vouloir tout réinitialiser ? Toutes vos réponses seront effacées et le score remis à 50 points.')) {
            StorageManager.resetAll();
            this.globalScore = 50;
            this.updateScoreDisplay();
            
            // Réinitialiser tous les jeux enregistrés
            this.games.forEach(game => {
                if (game.reset) {
                    game.reset();
                }
            });
            
            // Si on est dans un jeu, recharger la page ou retourner au menu
            if (this.currentGame) {
                this.showMenu();
            }
            
            this.showFeedback('🔄 Tous les jeux ont été réinitialisés !', 'success', 3000);
        }
    }

    /**
     * Affiche un message de feedback dans le HUD
     */
    showFeedback(message, type = 'success', duration = 2000) {
        const hud = document.getElementById('hud');
        if (!hud) return;

        const feedback = document.createElement('div');
        feedback.className = `hud-feedback ${type}`;
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 120px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            background: ${type === 'success' ? 'var(--accent-secondary)' : 'var(--accent-danger)'};
            color: white;
            border-radius: 12px;
            font-weight: 900;
            font-family: 'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', 'Trebuchet MS', sans-serif;
            z-index: 2000;
            box-shadow: 0 4px 12px var(--shadow);
        `;
        
        document.body.appendChild(feedback);

        if (duration > 0) {
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, duration);
        }
    }

    /**
     * Retourne le score global actuel
     * @returns {number}
     */
    getGlobalScore() {
        return this.globalScore;
    }
}

// Instance globale du GameManager
let gameManager;


