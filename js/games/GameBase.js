/**
 * GameBase - Classe parente pour tous les jeux
 * Définit l'interface et la structure commune à tous les jeux
 */
class GameBase {
    constructor(gameId, name, description) {
        this.gameId = gameId;
        this.name = name;
        this.description = description;
        this.isActive = false;
        this.isPaused = false;
    }

    /**
     * Initialise le jeu (appelé une seule fois)
     * À implémenter par les classes enfants
     */
    init() {
        throw new Error('La méthode init() doit être implémentée');
    }

    /**
     * Démarre ou reprend le jeu
     * À implémenter par les classes enfants
     */
    start() {
        this.isActive = true;
        this.isPaused = false;
        throw new Error('La méthode start() doit être implémentée');
    }

    /**
     * Met en pause le jeu
     * À implémenter par les classes enfants
     */
    pause() {
        this.isPaused = true;
        this.saveState();
    }

    /**
     * Sauvegarde l'état actuel du jeu
     * À implémenter par les classes enfants
     */
    saveState() {
        throw new Error('La méthode saveState() doit être implémentée');
    }

    /**
     * Charge l'état sauvegardé du jeu
     * À implémenter par les classes enfants
     */
    loadState() {
        throw new Error('La méthode loadState() doit être implémentée');
    }

    /**
     * Réinitialise le jeu à son état initial
     * Optionnel - peut être surchargé
     */
    reset() {
        StorageManager.clearGameState(this.gameId);
        this.isActive = false;
        this.isPaused = false;
    }

    /**
     * Récupère le conteneur HTML du jeu
     * @returns {HTMLElement}
     */
    getGameContainer() {
        return document.getElementById('game-content');
    }

    /**
     * Affiche un message de feedback
     * @param {string} message - Message à afficher
     * @param {string} type - Type de message ('success' ou 'error')
     * @param {number} duration - Durée d'affichage en ms (0 = permanent)
     */
    showFeedback(message, type = 'success', duration = 2000) {
        const container = this.getGameContainer();
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        
        container.appendChild(feedback);

        if (duration > 0) {
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, duration);
        }

        return feedback;
    }
}


