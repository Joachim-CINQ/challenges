/**
 * LanguageGame - Jeu de quiz sur les langues
 * Des phrases "Bonne année à tous" dans différentes langues sont affichées, le joueur doit deviner la langue
 */
class LanguageGame extends GameBase {
    constructor() {
        super('languages', 'Challenge Langues', 'Devinez toutes les langues à partir de "Bonne année à tous" !');
        
        // Liste complète des langues
        this.languages = LANGUAGE_DATA.map(lang => ({
            id: lang.id,
            name: lang.name,
            text: lang.text,
            altNames: lang.altNames || []
        }));

        // État du jeu
        this.foundLanguages = []; // IDs des langues déjà trouvées
        this.userAnswers = {}; // { languageId: userInput }
        this.hintsRevealed = {}; // { languageId: [indices de lettres révélées] }
        this.languagesOrder = []; // Ordre aléatoire des langues
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
        
        // Mélanger l'ordre des langues si ce n'est pas déjà fait
        if (this.languagesOrder.length === 0) {
            this.languagesOrder = this.shuffleArray(this.languages.map(l => l.id));
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
     * Récupère les langues dans l'ordre mélangé
     * @returns {Array} Liste des langues dans l'ordre aléatoire
     */
    getLanguagesInOrder() {
        return this.languagesOrder.map(id => 
            this.languages.find(l => l.id === id)
        ).filter(l => l !== undefined);
    }

    /**
     * Utilise un indice pour révéler une lettre d'une langue
     * @param {number} languageId - ID de la langue
     */
    useHint(languageId) {
        const language = this.languages.find(l => l.id === languageId);
        if (!language || this.foundLanguages.includes(languageId)) {
            return;
        }

        // Vérifier si on a assez de points
        const hintCost = gameManager.getHintCost();
        if (!gameManager.spendPoints(hintCost)) {
            this.showFeedback(`❌ Pas assez de points pour utiliser un indice ! (Coût: ${hintCost} pts)`, 'error', 2000);
            return;
        }

        // Initialiser la liste des indices si nécessaire
        if (!this.hintsRevealed[languageId]) {
            this.hintsRevealed[languageId] = [];
        }

        // Trouver une lettre non encore révélée
        const name = language.name;
        const allIndices = Array.from({ length: name.length }, (_, i) => i);
        const availableIndices = allIndices.filter(i => 
            !this.hintsRevealed[languageId].includes(i) && name[i] !== ' '
        );

        if (availableIndices.length > 0) {
            // Révéler une lettre aléatoire parmi celles disponibles
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            this.hintsRevealed[languageId].push(randomIndex);
            this.saveState();
            this.render();
            this.showFeedback(`💡 Lettre révélée : "${name[randomIndex]}" (-${hintCost} pts)`, 'success', 2000);
        } else {
            this.showFeedback('✅ Toutes les lettres sont déjà révélées !', 'success', 2000);
        }
    }

    /**
     * Génère le placeholder avec les lettres révélées
     * @param {Object} language - Objet langue
     * @returns {string} Placeholder avec lettres révélées
     */
    getHintPlaceholder(language) {
        const name = language.name;
        const revealedIndices = this.hintsRevealed[language.id] || [];
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
     * Vérifie si une réponse correspond à une langue avec tolérance orthographique
     * @param {string} userInput - Réponse de l'utilisateur
     * @param {Object} language - Objet langue
     * @returns {boolean} true si la réponse est correcte
     */
    checkAnswer(userInput, language) {
        if (!userInput || !userInput.trim()) return false;

        const normalizedInput = this.normalizeString(userInput);
        const normalizedName = this.normalizeString(language.name);

        // Vérification exacte (après normalisation)
        if (normalizedInput === normalizedName) return true;

        // Vérification des noms alternatifs
        for (const altName of language.altNames || []) {
            if (this.normalizeString(altName) === normalizedInput) return true;
        }

        // Tolérance orthographique avec distance de Levenshtein
        const maxDistance = Math.max(2, Math.floor(normalizedName.length * 0.15)); // 15% de tolérance
        const distance = this.levenshteinDistance(normalizedInput, normalizedName);

        if (distance <= maxDistance) return true;

        // Vérifier aussi avec les noms alternatifs
        for (const altName of language.altNames || []) {
            const normalizedAlt = this.normalizeString(altName);
            const altDistance = this.levenshteinDistance(normalizedInput, normalizedAlt);
            if (altDistance <= maxDistance) return true;
        }

        return false;
    }

    /**
     * Gère la soumission d'une réponse pour une langue
     * @param {number} languageId - ID de la langue
     * @param {string} userInput - Réponse de l'utilisateur
     */
    handleAnswer(languageId, userInput) {
        const language = this.languages.find(l => l.id === languageId);
        if (!language) return;

        // Si déjà trouvé, ne rien faire
        if (this.foundLanguages.includes(languageId)) return;

        // Sauvegarder la réponse de l'utilisateur
        this.userAnswers[languageId] = userInput;

        // Vérifier si la réponse est correcte
        if (this.checkAnswer(userInput, language)) {
            this.foundLanguages.push(languageId);
            gameManager.addPoints(GameManager.CORRECT_ANSWER_POINTS);
            this.saveState();
            this.render();
            
            // Vérifier si toutes les langues sont trouvées
            if (this.foundLanguages.length === this.languages.length) {
                this.showFeedback('🎉 Félicitations ! Vous avez trouvé toutes les langues !', 'success', 5000);
            }
        } else {
            // Réponse incorrecte - déduire des points
            const errorCost = gameManager.getErrorCost();
            if (gameManager.deductErrorPoints()) {
                this.showFeedback(`❌ Incorrect ! -${errorCost} pts`, 'error', 2000);
            } else {
                this.showFeedback('❌ Incorrect ! (Pas assez de points pour pénalité)', 'error', 2000);
            }
        }
    }

    /**
     * Retourne la progression du jeu
     * @returns {Object} { found: number, total: number, percentage: number }
     */
    getProgress() {
        const found = this.foundLanguages.length;
        const total = this.languages.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const stats = this.foundLanguages.length;
        const total = this.languages.length;
        const percentage = Math.round((stats / total) * 100);
        const languagesInOrder = this.getLanguagesInOrder();

        // Sauvegarder la position de scroll avant de réinitialiser le DOM
        const languagesContainer = container.querySelector('.languages-grid-container');
        let savedScrollTop = 0;
        let savedVisibleElement = null;
        
        if (languagesContainer) {
            savedScrollTop = languagesContainer.scrollTop;
            const languageItems = languagesContainer.querySelectorAll('.language-item');
            const containerRect = languagesContainer.getBoundingClientRect();
            for (const item of languageItems) {
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

            <div class="languages-grid-container">
                <div class="languages-grid" id="languages-grid">
                    ${languagesInOrder.map(language => {
                        const isFound = this.foundLanguages.includes(language.id);
                        const userAnswer = this.userAnswers[language.id] || '';
                        const hasHint = this.hintsRevealed[language.id] && this.hintsRevealed[language.id].length > 0;
                        const placeholder = isFound ? language.name : (hasHint ? this.getHintPlaceholder(language) : 'Nom de la langue...');
                        
                        return `
                            <div class="language-item ${isFound ? 'found' : ''}" data-id="${language.id}">
                                <div class="language-text-display">
                                    <p class="language-phrase">"${language.text}"</p>
                                    ${isFound ? '<div class="checkmark">✓</div>' : ''}
                                </div>
                                <input 
                                    type="text" 
                                    class="language-input ${isFound ? 'correct' : ''}"
                                    placeholder="${placeholder}"
                                    value="${isFound ? language.name : userAnswer}"
                                    data-id="${language.id}"
                                    ${isFound ? 'disabled' : ''}
                                    autocomplete="off"
                                />
                                ${!isFound ? `
                                    <button 
                                        class="btn-hint" 
                                        data-id="${language.id}"
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
                const newLanguagesContainer = container.querySelector('.languages-grid-container');
                if (!newLanguagesContainer) return;
                
                if (savedVisibleElement) {
                    const targetElement = newLanguagesContainer.querySelector(`[data-id="${savedVisibleElement}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        newLanguagesContainer.scrollTop = Math.max(0, newLanguagesContainer.scrollTop - 10);
                        return;
                    }
                }
                
                newLanguagesContainer.scrollTop = savedScrollTop;
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
        const inputs = document.querySelectorAll('.language-input:not(:disabled)');
        
        inputs.forEach(input => {
            const languageId = parseInt(input.getAttribute('data-id'));
            
            // Validation à la perte de focus ou Enter
            input.addEventListener('blur', () => {
                this.handleAnswer(languageId, input.value);
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
                const languageId = parseInt(button.getAttribute('data-id'));
                this.useHint(languageId);
            });
        });
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            foundLanguages: this.foundLanguages,
            userAnswers: this.userAnswers,
            hintsRevealed: this.hintsRevealed,
            languagesOrder: this.languagesOrder
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.foundLanguages = state.foundLanguages || [];
            this.userAnswers = state.userAnswers || {};
            this.hintsRevealed = state.hintsRevealed || {};
            this.languagesOrder = state.languagesOrder || [];
        }
        
        // Si pas d'ordre sauvegardé, créer un ordre aléatoire
        if (this.languagesOrder.length === 0) {
            this.languagesOrder = this.shuffleArray(this.languages.map(l => l.id));
            this.saveState();
        }
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.foundLanguages = [];
        this.userAnswers = {};
        this.hintsRevealed = {};
        this.languagesOrder = this.shuffleArray(this.languages.map(l => l.id));
    }
}
