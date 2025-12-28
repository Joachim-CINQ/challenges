/**
 * ExpressionsGame - Jeu de quiz sur les expressions françaises
 * Des expressions françaises incomplètes sont affichées, le joueur doit compléter le mot manquant
 */
class ExpressionsGame extends GameBase {
    constructor() {
        super('expressions', 'Expressions Françaises', 'Complétez toutes les expressions françaises !');
        
        // Liste complète des expressions
        this.expressions = EXPRESSIONS_DATA.map(expr => ({
            id: expr.id,
            expression: expr.expression,
            answer: expr.answer,
            altAnswers: expr.altAnswers || []
        }));

        // État du jeu
        this.foundExpressions = []; // IDs des expressions déjà trouvées
        this.userAnswers = {}; // { expressionId: userInput }
        this.hintsRevealed = {}; // { expressionId: [indices de lettres révélées] }
        this.expressionsOrder = []; // Ordre aléatoire des expressions
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
        
        // Mélanger l'ordre des expressions si ce n'est pas déjà fait
        if (this.expressionsOrder.length === 0) {
            this.expressionsOrder = this.shuffleArray(this.expressions.map(e => e.id));
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
     * Récupère les expressions dans l'ordre mélangé
     * @returns {Array} Liste des expressions dans l'ordre aléatoire
     */
    getExpressionsInOrder() {
        return this.expressionsOrder.map(id => 
            this.expressions.find(e => e.id === id)
        ).filter(e => e !== undefined);
    }

    /**
     * Utilise un indice pour révéler une lettre d'une expression
     * @param {number} expressionId - ID de l'expression
     */
    useHint(expressionId) {
        const expression = this.expressions.find(e => e.id === expressionId);
        if (!expression || this.foundExpressions.includes(expressionId)) {
            return;
        }

        // Vérifier si on a assez de points
        const hintCost = gameManager.getHintCost();
        if (!gameManager.spendPoints(hintCost)) {
            this.showFeedback(`❌ Pas assez de points pour utiliser un indice ! (Coût: ${hintCost} pts)`, 'error', 2000);
            return;
        }

        // Initialiser la liste des indices si nécessaire
        if (!this.hintsRevealed[expressionId]) {
            this.hintsRevealed[expressionId] = [];
        }

        // Trouver une lettre non encore révélée
        const answer = expression.answer;
        if (!answer || answer.length === 0) {
            this.showFeedback('💡 Cette expression est déjà complète !', 'error', 2000);
            return;
        }

        const allIndices = Array.from({ length: answer.length }, (_, i) => i);
        const availableIndices = allIndices.filter(i => 
            !this.hintsRevealed[expressionId].includes(i) && answer[i] !== ' '
        );

        if (availableIndices.length > 0) {
            // Révéler une lettre aléatoire parmi celles disponibles
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            this.hintsRevealed[expressionId].push(randomIndex);
            this.saveState();
            this.render();
            this.showFeedback(`💡 Lettre révélée : "${answer[randomIndex]}" (-${hintCost} pts)`, 'success', 2000);
        } else {
            this.showFeedback('✅ Toutes les lettres sont déjà révélées !', 'success', 2000);
        }
    }

    /**
     * Génère le placeholder avec les lettres révélées
     * @param {Object} expression - Objet expression
     * @returns {string} Placeholder avec lettres révélées
     */
    getHintPlaceholder(expression) {
        const answer = expression.answer;
        if (!answer || answer.length === 0) {
            return '';
        }
        
        const revealedIndices = this.hintsRevealed[expression.id] || [];
        const revealedSet = new Set(revealedIndices);
        
        return answer.split('').map((char, index) => {
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
     * Vérifie si une réponse correspond à une expression avec tolérance orthographique
     * @param {string} userInput - Réponse de l'utilisateur
     * @param {Object} expression - Objet expression
     * @returns {boolean} true si la réponse est correcte
     */
    checkAnswer(userInput, expression) {
        if (!userInput || !userInput.trim()) return false;

        const normalizedInput = this.normalizeString(userInput);
        const normalizedAnswer = this.normalizeString(expression.answer);

        // Vérification exacte (après normalisation)
        if (normalizedInput === normalizedAnswer) return true;

        // Vérification des réponses alternatives
        for (const altAnswer of expression.altAnswers || []) {
            if (this.normalizeString(altAnswer) === normalizedInput) return true;
        }

        // Tolérance orthographique avec distance de Levenshtein
        const maxDistance = Math.max(1, Math.floor(normalizedAnswer.length * 0.2)); // 20% de tolérance
        const distance = this.levenshteinDistance(normalizedInput, normalizedAnswer);

        if (distance <= maxDistance) return true;

        // Vérifier aussi avec les réponses alternatives
        for (const altAnswer of expression.altAnswers || []) {
            const normalizedAlt = this.normalizeString(altAnswer);
            const altDistance = this.levenshteinDistance(normalizedInput, normalizedAlt);
            if (altDistance <= maxDistance) return true;
        }

        return false;
    }

    /**
     * Gère la soumission d'une réponse pour une expression
     * @param {number} expressionId - ID de l'expression
     * @param {string} userInput - Réponse de l'utilisateur
     */
    handleAnswer(expressionId, userInput) {
        const expression = this.expressions.find(e => e.id === expressionId);
        if (!expression) return;

        // Si déjà trouvé, ne rien faire
        if (this.foundExpressions.includes(expressionId)) return;

        // Éviter les doubles appels - vérifier si on est déjà en train de traiter cette réponse
        const answerKey = `${expressionId}_${userInput.trim()}`;
        if (this._processingAnswers && this._processingAnswers.has(answerKey)) {
            return;
        }
        
        // Initialiser le Set si nécessaire
        if (!this._processingAnswers) {
            this._processingAnswers = new Set();
        }
        this._processingAnswers.add(answerKey);

        // Sauvegarder la réponse de l'utilisateur
        this.userAnswers[expressionId] = userInput;

        // Vérifier si la réponse est correcte
        if (this.checkAnswer(userInput, expression)) {
            this.foundExpressions.push(expressionId);
            gameManager.addPoints(GameManager.CORRECT_ANSWER_POINTS);
            this.saveState();
            this.render();
            
            // Vérifier si toutes les expressions sont trouvées
            if (this.foundExpressions.length === this.expressions.length) {
                this.showFeedback('🎉 Félicitations ! Vous avez complété toutes les expressions !', 'success', 5000);
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
        
        // Retirer du Set après un court délai pour permettre les nouvelles tentatives
        setTimeout(() => {
            if (this._processingAnswers) {
                this._processingAnswers.delete(answerKey);
            }
        }, 500);
    }

    /**
     * Retourne la progression du jeu
     * @returns {Object} { found: number, total: number, percentage: number }
     */
    getProgress() {
        const found = this.foundExpressions.length;
        const total = this.expressions.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const stats = this.foundExpressions.length;
        const total = this.expressions.length;
        const percentage = Math.round((stats / total) * 100);
        const expressionsInOrder = this.getExpressionsInOrder();

        container.innerHTML = `
            <div class="game-header">
                <h2>${this.name}</h2>
                <p>Progression: ${stats}/${total} (${percentage}%)</p>
            </div>

            <div class="expressions-grid-container">
                <div class="expressions-grid" id="expressions-grid">
                    ${expressionsInOrder.map(expression => {
                        const isFound = this.foundExpressions.includes(expression.id);
                        const userAnswer = this.userAnswers[expression.id] || '';
                        const hasHint = this.hintsRevealed[expression.id] && this.hintsRevealed[expression.id].length > 0;
                        const placeholder = isFound ? expression.answer : (hasHint ? this.getHintPlaceholder(expression) : 'Mot manquant...');
                        
                        return `
                            <div class="expression-item ${isFound ? 'found' : ''}" data-id="${expression.id}">
                                <div class="expression-text-display">
                                    <p class="expression-phrase">${expression.expression}</p>
                                    ${isFound ? '<div class="checkmark">✓</div>' : ''}
                                </div>
                                <input 
                                    type="text" 
                                    class="expression-input ${isFound ? 'correct' : ''}"
                                    placeholder="${placeholder}"
                                    value="${isFound ? expression.answer : userAnswer}"
                                    data-id="${expression.id}"
                                    ${isFound ? 'disabled' : ''}
                                    autocomplete="off"
                                />
                                ${!isFound ? `
                                    <button 
                                        class="btn-hint" 
                                        data-id="${expression.id}"
                                        title="Révéler une lettre (-${gameManager.getHintCost()} pts)"
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
    }

    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        const inputs = document.querySelectorAll('.expression-input:not(:disabled)');
        
        inputs.forEach(input => {
            const expressionId = parseInt(input.getAttribute('data-id'));
            
            // Validation à la perte de focus ou Enter
            // Utiliser un flag pour éviter les doubles appels
            let isProcessing = false;
            
            const handleSubmit = () => {
                if (isProcessing) return;
                isProcessing = true;
                this.handleAnswer(expressionId, input.value);
                setTimeout(() => {
                    isProcessing = false;
                }, 500);
            };
            
            input.addEventListener('blur', handleSubmit);

            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    // Ne pas appeler blur() pour éviter le double appel
                    handleSubmit();
                }
            });
        });

        // Boutons d'indice
        const hintButtons = document.querySelectorAll('.btn-hint');
        hintButtons.forEach(button => {
            button.addEventListener('click', () => {
                const expressionId = parseInt(button.getAttribute('data-id'));
                this.useHint(expressionId);
            });
        });
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            foundExpressions: this.foundExpressions,
            userAnswers: this.userAnswers,
            hintsRevealed: this.hintsRevealed,
            expressionsOrder: this.expressionsOrder
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.foundExpressions = state.foundExpressions || [];
            this.userAnswers = state.userAnswers || {};
            this.hintsRevealed = state.hintsRevealed || {};
            this.expressionsOrder = state.expressionsOrder || [];
        }
        
        // Si pas d'ordre sauvegardé et que les expressions sont chargées, créer un ordre aléatoire
        if (this.expressionsOrder.length === 0 && this.expressions.length > 0) {
            this.expressionsOrder = this.shuffleArray(this.expressions.map(e => e.id));
            this.saveState();
        }
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.foundExpressions = [];
        this.userAnswers = {};
        this.hintsRevealed = {};
        if (this.expressions.length > 0) {
            this.expressionsOrder = this.shuffleArray(this.expressions.map(e => e.id));
        }
    }
}
