/**
 * PasswordGame - Jeu simple de mot de passe
 * L'utilisateur doit entrer le bon mot de passe pour débloquer un lien
 */
class PasswordGame extends GameBase {
    constructor() {
        super('password', 'Mot de Passe', 'Trouvez le mot de passe secret !');
        this.correctPassword = 'bouleafacettes';
        this.isUnlocked = false;
    }

    /**
     * Initialise le jeu
     */
    init() {
        this.loadState();
    }

    /**
     * Démarre ou reprend le jeu
     */
    start() {
        this.isActive = true;
        this.isPaused = false;
        this.render();
    }

    /**
     * Normalise une chaîne pour la comparaison (insensible à la casse)
     */
    normalizeString(str) {
        return str
            .toLowerCase()
            .trim();
    }

    /**
     * Vérifie si le mot de passe est correct
     * @param {string} userInput - Mot de passe entré par l'utilisateur
     * @returns {boolean} true si le mot de passe est correct
     */
    checkPassword(userInput) {
        if (!userInput) return false;
        return this.normalizeString(userInput) === this.normalizeString(this.correctPassword);
    }

    /**
     * Gère la soumission du mot de passe
     * @param {string} userInput - Mot de passe entré par l'utilisateur
     */
    handlePasswordSubmit(userInput) {
        if (this.isUnlocked) return;

        if (this.checkPassword(userInput)) {
            this.isUnlocked = true;
            this.saveState();
            this.render();
            this.showFeedback('🎉 Mot de passe correct ! Ouverture du lien...', 'success', 3000);
            
            // Ouvrir le lien dans un nouvel onglet après un court délai
            setTimeout(() => {
                window.open('https://kno-bros.myshopify.com/', '_blank');
            }, 1000);
        } else {
            this.showFeedback('❌ Mot de passe incorrect !', 'error', 2000);
        }
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();

        container.innerHTML = `
            <div class="game-header">
                <h2>${this.name}</h2>
                <p>${this.description}</p>
            </div>

            <div class="password-game-container" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 400px;
                gap: 2rem;
                padding: 2rem;
            ">
                ${this.isUnlocked ? `
                    <div style="
                        text-align: center;
                        padding: 2rem;
                        background: var(--accent-secondary, #4CAF50);
                        color: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    ">
                        <h3 style="margin: 0 0 1rem 0; font-size: 2rem;">🎉 Félicitations !</h3>
                        <p style="margin: 0; font-size: 1.2rem;">Le mot de passe a été trouvé !</p>
                        <p style="margin: 1rem 0 0 0;">Le lien devrait s'ouvrir automatiquement...</p>
                        <a 
                            href="https://kno-bros.myshopify.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style="
                                display: inline-block;
                                margin-top: 1rem;
                                padding: 0.75rem 1.5rem;
                                background: white;
                                color: var(--accent-secondary, #4CAF50);
                                text-decoration: none;
                                border-radius: 8px;
                                font-weight: bold;
                                transition: transform 0.2s;
                            "
                            onmouseover="this.style.transform='scale(1.05)'"
                            onmouseout="this.style.transform='scale(1)'"
                        >
                            Ouvrir le lien →
                        </a>
                    </div>
                ` : `
                    <div style="
                        width: 100%;
                        max-width: 500px;
                        text-align: center;
                    ">
                        <div style="
                            font-size: 3rem;
                            margin-bottom: 1rem;
                        ">🔐</div>
                        <h3 style="margin-bottom: 1rem;">Entrez le mot de passe</h3>
                        <form id="password-form" style="
                            display: flex;
                            flex-direction: column;
                            gap: 1rem;
                        ">
                            <input 
                                type="password" 
                                id="password-input"
                                placeholder="Mot de passe..."
                                autocomplete="off"
                                style="
                                    padding: 1rem;
                                    font-size: 1.2rem;
                                    border: 2px solid #ddd;
                                    border-radius: 8px;
                                    text-align: center;
                                    font-family: inherit;
                                "
                                autofocus
                            />
                            <button 
                                type="submit"
                                style="
                                    padding: 1rem 2rem;
                                    font-size: 1.1rem;
                                    background: var(--accent-primary, #007bff);
                                    color: white;
                                    border: none;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-weight: bold;
                                    transition: background 0.2s;
                                "
                                onmouseover="this.style.background='var(--accent-primary-hover, #0056b3)'"
                                onmouseout="this.style.background='var(--accent-primary, #007bff)'"
                            >
                                Vérifier
                            </button>
                        </form>
                    </div>
                `}
            </div>
        `;

        // Attacher les event listeners
        this.attachEventListeners();
    }

    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        if (this.isUnlocked) return;

        const form = document.getElementById('password-form');
        const input = document.getElementById('password-input');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (input) {
                    this.handlePasswordSubmit(input.value);
                    input.value = '';
                }
            });
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handlePasswordSubmit(input.value);
                    input.value = '';
                }
            });
        }
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            isUnlocked: this.isUnlocked
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.isUnlocked = state.isUnlocked || false;
        }
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.isUnlocked = false;
    }
}

