/**
 * StorageManager - Gestionnaire de persistance localStorage
 * Fournit des méthodes utilitaires pour sauvegarder/charger des données JSON
 */
class StorageManager {
    /**
     * Sauvegarde un état de jeu dans le localStorage
     * @param {string} gameId - Identifiant unique du jeu (ex: 'flags', 'map')
     * @param {Object} data - Données à sauvegarder
     */
    static saveGameState(gameId, data) {
        try {
            const key = `game_${gameId}`;
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error(`Erreur lors de la sauvegarde du jeu ${gameId}:`, error);
            return false;
        }
    }

    /**
     * Charge un état de jeu depuis le localStorage
     * @param {string} gameId - Identifiant unique du jeu
     * @returns {Object|null} - Données chargées ou null si inexistantes
     */
    static loadGameState(gameId) {
        try {
            const key = `game_${gameId}`;
            const jsonData = localStorage.getItem(key);
            if (jsonData) {
                return JSON.parse(jsonData);
            }
            return null;
        } catch (error) {
            console.error(`Erreur lors du chargement du jeu ${gameId}:`, error);
            return null;
        }
    }

    /**
     * Supprime l'état d'un jeu du localStorage
     * @param {string} gameId - Identifiant unique du jeu
     */
    static clearGameState(gameId) {
        try {
            const key = `game_${gameId}`;
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Erreur lors de la suppression du jeu ${gameId}:`, error);
            return false;
        }
    }

    /**
     * Sauvegarde le score global
     * @param {number} score - Score à sauvegarder
     */
    static saveGlobalScore(score) {
        try {
            localStorage.setItem('global_score', score.toString());
            return true;
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du score global:', error);
            return false;
        }
    }

    /**
     * Charge le score global
     * @returns {number} - Score global ou 100 par défaut
     */
    static loadGlobalScore() {
        try {
            const score = localStorage.getItem('global_score');
            return score ? parseInt(score, 10) : 50;
        } catch (error) {
            console.error('Erreur lors du chargement du score global:', error);
            return 50;
        }
    }

    /**
     * Réinitialise toutes les données (score + tous les jeux)
     */
    static resetAll() {
        try {
            // Supprimer le score global
            localStorage.removeItem('global_score');
            
            // Supprimer tous les états de jeux
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('game_')) {
                    localStorage.removeItem(key);
                }
            });
            
            return true;
        } catch (error) {
            console.error('Erreur lors de la réinitialisation:', error);
            return false;
        }
    }
}


