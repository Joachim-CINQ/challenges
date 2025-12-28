/**
 * LogoGame - Jeu de quiz sur les logos
 * Tous les logos sont affichés, le joueur doit deviner le nom de chaque marque/entreprise
 */
class LogoGame extends GameBase {
    constructor() {
        super('logos', 'Challenge Logos', 'Devinez tous les logos de marques et entreprises !');
        
        // Liste complète des logos
        this.logos = LOGO_DATA.map(logo => ({
            id: logo.id,
            name: logo.name,
            category: logo.category,
            logoUrl: logo.logoUrl,
            altNames: logo.altNames || []
        }));

        // État du jeu
        this.foundLogos = []; // IDs des logos déjà trouvés
        this.userAnswers = {}; // { logoId: userInput }
        this.hintsRevealed = {}; // { logoId: [indices de lettres révélées] }
        this.logosOrder = []; // Ordre aléatoire des logos
    }

    /**
     * Mélange un tableau de manière aléatoire (algorithme Fisher-Yates)
     * @param {Array} array - Tableau à mélanger
     * @returns {Array} Tableau mélangé
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Initialise le jeu
     */
    init() {
        this.loadState();
        
        // Mélanger l'ordre des logos si ce n'est pas déjà fait
        if (this.logosOrder.length === 0) {
            this.logosOrder = this.shuffleArray(this.logos.map(l => l.id));
        }
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
     * Récupère les logos dans l'ordre mélangé
     * @returns {Array} Liste des logos dans l'ordre aléatoire
     */
    getLogosInOrder() {
        return this.logosOrder.map(id => 
            this.logos.find(l => l.id === id)
        ).filter(l => l !== undefined);
    }

    /**
     * Utilise un indice pour révéler une lettre d'un logo
     * @param {number} logoId - ID du logo
     */
    useHint(logoId) {
        const logo = this.logos.find(l => l.id === logoId);
        if (!logo || this.foundLogos.includes(logoId)) {
            return;
        }

        // Vérifier si on a assez de points
        if (!gameManager.spendPoints(25)) {
            this.showFeedback('❌ Pas assez de points pour utiliser un indice !', 'error', 2000);
            return;
        }

        // Initialiser la liste des indices si nécessaire
        if (!this.hintsRevealed[logoId]) {
            this.hintsRevealed[logoId] = [];
        }

        // Trouver une lettre non encore révélée
        const name = logo.name;
        const allIndices = Array.from({ length: name.length }, (_, i) => i);
        const availableIndices = allIndices.filter(i => 
            !this.hintsRevealed[logoId].includes(i) && name[i] !== ' '
        );

        if (availableIndices.length > 0) {
            // Révéler une lettre aléatoire parmi celles disponibles
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            this.hintsRevealed[logoId].push(randomIndex);
            this.saveState();
            this.render();
            this.showFeedback(`💡 Lettre révélée : "${name[randomIndex]}" (-25 pts)`, 'success', 2000);
        } else {
            this.showFeedback('✅ Toutes les lettres sont déjà révélées !', 'success', 2000);
        }
    }

    /**
     * Génère le placeholder avec les lettres révélées
     * @param {Object} logo - Objet logo
     * @returns {string} Placeholder avec lettres révélées
     */
    getHintPlaceholder(logo) {
        const name = logo.name;
        const revealedIndices = this.hintsRevealed[logo.id] || [];
        const revealedSet = new Set(revealedIndices);
        
        return name.split('').map((char, index) => {
            if (char === ' ') return ' ';
            return revealedSet.has(index) ? char : '_';
        }).join('');
    }

    /**
     * Normalise une chaîne pour la comparaison
     */
    normalizeString(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
            .replace(/[^a-z0-9\s]/g, '') // Supprime la ponctuation
            .trim()
            .replace(/\s+/g, ' '); // Normalise les espaces
    }

    /**
     * Calcule la distance de Levenshtein entre deux chaînes
     * @param {string} str1 - Première chaîne
     * @param {string} str2 - Deuxième chaîne
     * @returns {number} Distance de Levenshtein
     */
    levenshteinDistance(str1, str2) {
        const matrix = [];
        const len1 = str1.length;
        const len2 = str2.length;

        for (let i = 0; i <= len1; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= len2; j++) {
            matrix[0][j] = j;
        }

        for (let i = 1; i <= len1; i++) {
            for (let j = 1; j <= len2; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j - 1] + 1
                    );
                }
            }
        }

        return matrix[len1][len2];
    }

    /**
     * Vérifie si une réponse correspond à un logo avec tolérance orthographique
     * @param {string} userInput - Réponse de l'utilisateur
     * @param {Object} logo - Objet logo
     * @returns {boolean} true si la réponse est correcte
     */
    checkAnswer(userInput, logo) {
        if (!userInput || !userInput.trim()) return false;

        const normalizedInput = this.normalizeString(userInput);
        const normalizedName = this.normalizeString(logo.name);

        // Vérification exacte (après normalisation)
        if (normalizedInput === normalizedName) return true;

        // Vérification des noms alternatifs
        for (const altName of logo.altNames || []) {
            if (this.normalizeString(altName) === normalizedInput) return true;
        }

        // Tolérance orthographique avec distance de Levenshtein
        const maxDistance = Math.max(2, Math.floor(normalizedName.length * 0.15)); // 15% de tolérance
        const distance = this.levenshteinDistance(normalizedInput, normalizedName);

        if (distance <= maxDistance) return true;

        // Vérifier aussi avec les noms alternatifs
        for (const altName of logo.altNames || []) {
            const normalizedAlt = this.normalizeString(altName);
            const altDistance = this.levenshteinDistance(normalizedInput, normalizedAlt);
            if (altDistance <= maxDistance) return true;
        }

        return false;
    }

    /**
     * Gère la soumission d'une réponse pour un logo
     * @param {number} logoId - ID du logo
     * @param {string} userInput - Réponse de l'utilisateur
     */
    handleAnswer(logoId, userInput) {
        const logo = this.logos.find(l => l.id === logoId);
        if (!logo) return;

        // Si déjà trouvé, ne rien faire
        if (this.foundLogos.includes(logoId)) return;

        // Sauvegarder la réponse de l'utilisateur
        this.userAnswers[logoId] = userInput;

        // Vérifier si la réponse est correcte
        if (this.checkAnswer(userInput, logo)) {
            this.foundLogos.push(logoId);
            gameManager.addPoints(10);
            this.saveState();
            this.render();
            
            // Vérifier si tous les logos sont trouvés
            if (this.foundLogos.length === this.logos.length) {
                this.showFeedback('🎉 Félicitations ! Vous avez trouvé tous les logos !', 'success', 5000);
            }
        }
    }

    /**
     * Retourne la progression du jeu
     * @returns {Object} { found: number, total: number, percentage: number }
     */
    getProgress() {
        const found = this.foundLogos.length;
        const total = this.logos.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const stats = this.foundLogos.length;
        const total = this.logos.length;
        const percentage = Math.round((stats / total) * 100);
        const logosInOrder = this.getLogosInOrder();

        // Sauvegarder la position de scroll avant de réinitialiser le DOM
        const logosContainer = container.querySelector('.logos-grid-container');
        let savedScrollTop = 0;
        let savedVisibleElement = null;
        
        if (logosContainer) {
            savedScrollTop = logosContainer.scrollTop;
            const logoItems = logosContainer.querySelectorAll('.logo-item');
            const containerRect = logosContainer.getBoundingClientRect();
            for (const item of logoItems) {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top >= containerRect.top && itemRect.top <= containerRect.bottom) {
                    savedVisibleElement = item.getAttribute('data-id');
                    break;
                }
            }
        }

        container.innerHTML = `
            <div class="game-header">
                <h2>${this.name}</h2>
                <p>Progression: ${stats}/${total} (${percentage}%)</p>
            </div>

            <div class="logos-grid-container">
                <div class="logos-grid" id="logos-grid">
                    ${logosInOrder.map(logo => {
                        const isFound = this.foundLogos.includes(logo.id);
                        const userAnswer = this.userAnswers[logo.id] || '';
                        const hasHint = this.hintsRevealed[logo.id] && this.hintsRevealed[logo.id].length > 0;
                        const placeholder = isFound ? logo.name : (hasHint ? this.getHintPlaceholder(logo) : 'Nom de la marque...');
                        
                        return `
                            <div class="logo-item ${isFound ? 'found' : ''}" data-id="${logo.id}">
                                <div class="logo-image-small">
                                    <img 
                                        src="${logo.logoUrl}" 
                                        alt="${logo.name}" 
                                        data-logo-id="${logo.id}"
                                        data-logo-name="${logo.name}"
                                        onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'160\\' height=\\'160\\'%3E%3Crect fill=\\'%23ddd\\' width=\\'160\\' height=\\'160\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\' fill=\\'%23999\\' font-size=\\'14\\'%3E${logo.name}%3C/text%3E%3C/svg%3E'"
                                    >
                                    ${isFound ? '<div class="checkmark">✓</div>' : ''}
                                </div>
                                <input 
                                    type="text" 
                                    class="logo-input ${isFound ? 'correct' : ''}"
                                    placeholder="${placeholder}"
                                    value="${isFound ? logo.name : userAnswer}"
                                    data-id="${logo.id}"
                                    ${isFound ? 'disabled' : ''}
                                    autocomplete="off"
                                />
                                ${!isFound ? `
                                    <button 
                                        class="btn-hint" 
                                        data-id="${logo.id}"
                                        title="Révéler une lettre (-25 pts)"
                                    >
                                        💡
                                    </button>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="game-stats">
                <p>Score actuel: ${gameManager.getGlobalScore()} pts</p>
            </div>
        `;

        // Attacher les event listeners
        this.attachEventListeners();

        // Restaurer la position de scroll après le rendu
        if (savedScrollTop > 0 || savedVisibleElement) {
            const restoreScroll = () => {
                const newLogosContainer = container.querySelector('.logos-grid-container');
                if (!newLogosContainer) return;
                
                if (savedVisibleElement) {
                    const targetElement = newLogosContainer.querySelector(`[data-id="${savedVisibleElement}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        newLogosContainer.scrollTop = Math.max(0, newLogosContainer.scrollTop - 10);
                        return;
                    }
                }
                
                newLogosContainer.scrollTop = savedScrollTop;
            };
            
            requestAnimationFrame(() => {
                restoreScroll();
                requestAnimationFrame(() => {
                    restoreScroll();
                    setTimeout(restoreScroll, 100);
                });
            });
        }
    }

    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        const inputs = document.querySelectorAll('.logo-input:not(:disabled)');
        
        inputs.forEach(input => {
            const logoId = parseInt(input.getAttribute('data-id'));
            
            // Validation à la perte de focus ou Enter
            input.addEventListener('blur', () => {
                this.handleAnswer(logoId, input.value);
            });

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    input.blur();
                }
            });
        });

        // Boutons d'indice
        const hintButtons = document.querySelectorAll('.btn-hint');
        hintButtons.forEach(button => {
            button.addEventListener('click', () => {
                const logoId = parseInt(button.getAttribute('data-id'));
                this.useHint(logoId);
            });
        });
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            foundLogos: this.foundLogos,
            userAnswers: this.userAnswers,
            hintsRevealed: this.hintsRevealed,
            logosOrder: this.logosOrder
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.foundLogos = state.foundLogos || [];
            this.userAnswers = state.userAnswers || {};
            this.hintsRevealed = state.hintsRevealed || {};
            this.logosOrder = state.logosOrder || [];
        }
        
        // Si pas d'ordre sauvegardé, créer un ordre aléatoire
        if (this.logosOrder.length === 0) {
            this.logosOrder = this.shuffleArray(this.logos.map(l => l.id));
            this.saveState();
        }
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.foundLogos = [];
        this.userAnswers = {};
        this.hintsRevealed = {};
        this.logosOrder = this.shuffleArray(this.logos.map(l => l.id));
    }
}
