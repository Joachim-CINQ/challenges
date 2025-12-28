/**
 * main.js - Point d'entrée de l'application
 * Initialise le GameManager et enregistre tous les jeux
 */

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Créer l'instance globale du GameManager
    gameManager = new GameManager();

    // Créer et enregistrer le jeu FlagGame
    const flagGame = new FlagGame();
    flagGame.init();
    gameManager.registerGame('flags', flagGame);

    // Exposer flagGame globalement pour les callbacks onclick et pour MapGame
    window.flagGame = flagGame;

    // Créer et enregistrer le jeu MapGame
    const mapGame = new MapGame();
    mapGame.init();
    gameManager.registerGame('map', mapGame);

    // Exposer mapGame globalement pour les callbacks onclick
    window.mapGame = mapGame;

    // Créer et enregistrer le jeu MetroGame
    const metroGame = new MetroGame();
    metroGame.init();
    gameManager.registerGame('metro', metroGame);

    // Exposer metroGame globalement pour les callbacks onclick
    window.metroGame = metroGame;

    // Créer et enregistrer le jeu PeopleGame
    const peopleGame = new PeopleGame();
    // init() est async pour charger les images, on l'appelle mais on n'attend pas
    peopleGame.init().catch(err => {
        console.error('Erreur lors de l\'initialisation de PeopleGame:', err);
    });
    gameManager.registerGame('people', peopleGame);

    // Exposer peopleGame globalement pour les callbacks onclick
    window.peopleGame = peopleGame;

    // Créer et enregistrer le jeu PokemonGame
    const pokemonGame = new PokemonGame();
    // init() est async pour charger les données depuis l'API, on l'appelle mais on n'attend pas
    pokemonGame.init().catch(err => {
        console.error('Erreur lors de l\'initialisation de PokemonGame:', err);
    });
    gameManager.registerGame('pokemon', pokemonGame);

    // Exposer pokemonGame globalement pour les callbacks onclick
    window.pokemonGame = pokemonGame;

    // Créer et enregistrer le jeu LogoGame
    // Désactivé temporairement - code conservé pour réactivation future
    /*
    const logoGame = new LogoGame();
    logoGame.init();
    gameManager.registerGame('logos', logoGame);

    // Exposer logoGame globalement pour les callbacks onclick
    window.logoGame = logoGame;
    */

    // Créer et enregistrer le jeu LanguageGame
    const languageGame = new LanguageGame();
    languageGame.init();
    gameManager.registerGame('languages', languageGame);

    // Exposer languageGame globalement pour les callbacks onclick
    window.languageGame = languageGame;

    // Créer et enregistrer le jeu ExpressionsGame
    const expressionsGame = new ExpressionsGame();
    expressionsGame.init();
    gameManager.registerGame('expressions', expressionsGame);

    // Exposer expressionsGame globalement pour les callbacks onclick
    window.expressionsGame = expressionsGame;

    // Mettre à jour le menu pour afficher les jeux enregistrés
    gameManager.showMenu();

    console.log('🎯 Challenges initialisé !');
    console.log('Jeux enregistrés:', gameManager.games.size);
});


