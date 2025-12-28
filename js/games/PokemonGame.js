/**
 * PokemonGame - Jeu de quiz sur les Pokémon
 * Tous les sprites sont affichés, le joueur doit deviner le nom de chaque Pokémon
 * Utilise la PokeAPI pour récupérer les données des 150 premiers Pokémon
 */
class PokemonGame extends GameBase {
    constructor() {
        super('pokemon', 'Challenge Pokémon', 'Devinez tous les 150 premiers Pokémon !');
        
        // Liste des Pokémon (sera chargée depuis l'API)
        this.pokemon = [];
        this.pokemonLoaded = false;

        // État du jeu
        this.foundPokemon = []; // IDs des Pokémon déjà trouvés
        this.userAnswers = {}; // { pokemonId: userInput }
        this.hintsRevealed = {}; // { pokemonId: [indices de lettres révélées] }
        this.pokemonOrder = []; // Ordre aléatoire des Pokémon
        
        // État de chargement
        this.isLoading = true;
        this.loadingProgress = 0;
    }

    /**
     * Récupère les données d'un Pokémon depuis la PokeAPI
     * @param {number} id - ID du Pokémon (1-150)
     * @returns {Promise<Object|null>} Données du Pokémon ou null
     */
    async fetchPokemonData(id) {
        try {
            // Récupérer les données du Pokémon
            const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
            if (!pokemonResponse.ok) {
                throw new Error(`HTTP error! status: ${pokemonResponse.status}`);
            }
            const pokemonData = await pokemonResponse.json();
            
            // Récupérer les données de l'espèce pour obtenir le nom français
            const speciesResponse = await fetch(pokemonData.species.url);
            if (!speciesResponse.ok) {
                throw new Error(`HTTP error! status: ${speciesResponse.status}`);
            }
            const speciesData = await speciesResponse.json();
            
            // Trouver le nom français
            const frenchName = speciesData.names.find(name => name.language.name === 'fr');
            const displayName = frenchName ? frenchName.name : this.capitalizeFirst(pokemonData.name);
            const englishName = this.capitalizeFirst(pokemonData.name);
            
            // Construire la liste des noms alternatifs (anglais + autres variantes)
            // Utiliser un Set pour éviter les doublons
            const altNamesSet = new Set([englishName]);
            
            // Ajouter le nom français s'il est différent du nom d'affichage
            if (frenchName && frenchName.name !== displayName) {
                altNamesSet.add(frenchName.name);
            }
            
            // Ajouter les noms alternatifs depuis getAltNames (pour les cas où l'API n'a pas le nom français)
            const additionalAltNames = this.getAltNames(pokemonData.name);
            additionalAltNames.forEach(name => altNamesSet.add(name));
            
            // Convertir en tableau et retirer le nom d'affichage s'il est présent
            const altNames = Array.from(altNamesSet).filter(name => name !== displayName);
            
            return {
                id: pokemonData.id,
                name: displayName, // Nom français par défaut
                englishName: englishName, // Garder le nom anglais pour référence
                imageUrl: pokemonData.sprites.front_default || pokemonData.sprites.other?.['official-artwork']?.front_default,
                altNames: altNames
            };
        } catch (error) {
            console.error(`Erreur pour le Pokémon ${id}:`, error);
            return null;
        }
    }

    /**
     * Met en majuscule la première lettre d'une chaîne
     * @param {string} str - Chaîne à formater
     * @returns {string} Chaîne avec première lettre en majuscule
     */
    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Génère des noms alternatifs pour un Pokémon
     * @param {string} name - Nom du Pokémon
     * @returns {Array<string>} Liste des noms alternatifs
     */
    getAltNames(name) {
        const altNames = [];
        const capitalized = this.capitalizeFirst(name);
        
        // Ajouter la version avec majuscule si différente
        if (capitalized !== name) {
            altNames.push(capitalized);
        }
        
        // Quelques cas spéciaux pour les noms français courants
        const frenchNames = {
            'bulbasaur': ['Bulbizarre'],
            'ivysaur': ['Herbizarre'],
            'venusaur': ['Florizarre'],
            'charmander': ['Salamèche'],
            'charmeleon': ['Reptincel'],
            'charizard': ['Dracaufeu'],
            'squirtle': ['Carapuce'],
            'wartortle': ['Carabaffe'],
            'blastoise': ['Tortank'],
            'caterpie': ['Chenipan'],
            'metapod': ['Chrysacier'],
            'butterfree': ['Papilusion'],
            'weedle': ['Aspicot'],
            'kakuna': ['Coconfort'],
            'beedrill': ['Dardargnan'],
            'pidgey': ['Roucool'],
            'pidgeotto': ['Roucoups'],
            'pidgeot': ['Roucarnage'],
            'rattata': ['Rattata'],
            'raticate': ['Rattatac'],
            'spearow': ['Piafabec'],
            'fearow': ['Rapasdepic'],
            'ekans': ['Abo'],
            'arbok': ['Arbok'],
            'pikachu': ['Pikachu'],
            'raichu': ['Raichu'],
            'sandshrew': ['Sabelette'],
            'sandslash': ['Sablaireau'],
            'nidoran-f': ['Nidoran♀'],
            'nidoran-m': ['Nidoran♂'],
            'nidorina': ['Nidorina'],
            'nidoqueen': ['Nidoqueen'],
            'nidorino': ['Nidorino'],
            'nidoking': ['Nidoking'],
            'clefairy': ['Mélofée'],
            'clefable': ['Mélodelfe'],
            'vulpix': ['Goupix'],
            'ninetales': ['Feunard'],
            'jigglypuff': ['Rondoudou'],
            'wigglytuff': ['Grodoudou'],
            'zubat': ['Nosferapti'],
            'golbat': ['Nosferalto'],
            'oddish': ['Mystherbe'],
            'gloom': ['Ortide'],
            'vileplume': ['Rafflesia'],
            'paras': ['Paras'],
            'parasect': ['Parasect'],
            'venonat': ['Mimitoss'],
            'venomoth': ['Aéromite'],
            'diglett': ['Taupiqueur'],
            'dugtrio': ['Triopikeur'],
            'meowth': ['Miaouss'],
            'persian': ['Persian'],
            'psyduck': ['Psykokwak'],
            'golduck': ['Akwakwak'],
            'mankey': ['Férosinge'],
            'primeape': ['Colossinge'],
            'growlithe': ['Caninos'],
            'arcanine': ['Arcanin'],
            'poliwag': ['Ptitard'],
            'poliwhirl': ['Têtarte'],
            'poliwrath': ['Tartard'],
            'abra': ['Abra'],
            'kadabra': ['Kadabra'],
            'alakazam': ['Alakazam'],
            'machop': ['Machoc'],
            'machoke': ['Machopeur'],
            'machamp': ['Mackogneur'],
            'bellsprout': ['Chétiflor'],
            'weepinbell': ['Boustiflor'],
            'victreebel': ['Empiflor'],
            'tentacool': ['Tentacool'],
            'tentacruel': ['Tentacruel'],
            'geodude': ['Racaillou'],
            'graveler': ['Gravalanch'],
            'golem': ['Grolem'],
            'ponyta': ['Ponyta'],
            'rapidash': ['Galopa'],
            'slowpoke': ['Ramoloss'],
            'slowbro': ['Flagadoss'],
            'magnemite': ['Magnéti'],
            'magneton': ['Magnéton'],
            'farfetchd': ['Canarticho'],
            'doduo': ['Doduo'],
            'dodrio': ['Dodrio'],
            'seel': ['Otaria'],
            'dewgong': ['Lamantine'],
            'grimer': ['Tadmorv'],
            'muk': ['Grotadmorv'],
            'shellder': ['Kokiyas'],
            'cloyster': ['Crustabri'],
            'gastly': ['Fantominus'],
            'haunter': ['Spectrier'],
            'gengar': ['Ectoplasma'],
            'onix': ['Onix'],
            'drowzee': ['Soporifik'],
            'hypno': ['Hypnomade'],
            'krabby': ['Krabby'],
            'kingler': ['Krabboss'],
            'voltorb': ['Voltorbe'],
            'electrode': ['Électrode'],
            'exeggcute': ['Noeunoeuf'],
            'exeggutor': ['Noadkoko'],
            'cubone': ['Osselait'],
            'marowak': ['Ossatueur'],
            'hitmonlee': ['Kicklee'],
            'hitmonchan': ['Tygnon'],
            'lickitung': ['Excelangue'],
            'koffing': ['Smogo'],
            'weezing': ['Smogogo'],
            'rhyhorn': ['Rhinocorne'],
            'rhydon': ['Rhinoféros'],
            'chansey': ['Leveinard'],
            'tangela': ['Saquedeneu'],
            'kangaskhan': ['Kangourex'],
            'horsea': ['Hypotrempe'],
            'seadra': ['Hypocéan'],
            'goldeen': ['Poissirène'],
            'seaking': ['Poissoroy'],
            'staryu': ['Stari'],
            'starmie': ['Staross'],
            'mr-mime': ['M. Mime'],
            'scyther': ['Insécateur'],
            'jynx': ['Lippoutou'],
            'electabuzz': ['Élektek'],
            'magmar': ['Magmar'],
            'pinsir': ['Scarabrute'],
            'tauros': ['Tauros'],
            'magikarp': ['Magicarpe'],
            'gyarados': ['Léviator'],
            'lapras': ['Lokhlass'],
            'ditto': ['Métamorph'],
            'eevee': ['Évoli'],
            'vaporeon': ['Aquali'],
            'jolteon': ['Voltali'],
            'flareon': ['Pyroli'],
            'porygon': ['Porygon'],
            'omanyte': ['Amonita'],
            'omastar': ['Amonistar'],
            'kabuto': ['Kabuto'],
            'kabutops': ['Kabutops'],
            'aerodactyl': ['Ptéra'],
            'snorlax': ['Ronflex'],
            'articuno': ['Artikodin'],
            'zapdos': ['Électhor'],
            'moltres': ['Sulfura'],
            'dratini': ['Minidraco'],
            'dragonair': ['Draco'],
            'dragonite': ['Dracolosse'],
            'mewtwo': ['Mewtwo'],
            'mew': ['Mew']
        };
        
        const lowerName = name.toLowerCase();
        if (frenchNames[lowerName]) {
            altNames.push(...frenchNames[lowerName]);
        }
        
        return altNames;
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
    async init() {
        this.isLoading = true;
        this.loadingProgress = 0;
        this.loadState();
        
        // Charger les Pokémon depuis l'API si ce n'est pas déjà fait
        if (!this.pokemonLoaded) {
            await this.loadPokemon();
        }
        
        // Mélanger l'ordre des Pokémon si ce n'est pas déjà fait
        if (this.pokemonOrder.length === 0) {
            this.pokemonOrder = this.shuffleArray(this.pokemon.map(p => p.id));
        }
        
        this.isLoading = false;
        this.loadingProgress = 100;
        
        // Mettre à jour le menu pour enlever l'indicateur de chargement
        if (gameManager && gameManager.updateGamesList) {
            gameManager.updateGamesList();
        }
    }

    /**
     * Charge les 150 premiers Pokémon depuis l'API
     */
    async loadPokemon() {
        const pokemonList = [];
        const total = 150;
        
        // Charger les Pokémon un par un
        for (let i = 1; i <= total; i++) {
            this.loadingProgress = Math.round((i / total) * 90); // 0-90% pour le chargement
            
            // Mettre à jour le menu pendant le chargement
            if (gameManager && gameManager.updateGamesList && i % 10 === 0) {
                gameManager.updateGamesList();
            }
            
            const pokemonData = await this.fetchPokemonData(i);
            if (pokemonData && pokemonData.imageUrl) {
                // Vérifier que l'image charge vraiment
                const imageValid = await this.validateImage(pokemonData.imageUrl);
                if (imageValid) {
                    pokemonList.push(pokemonData);
                }
            }
            
            // Petit délai pour éviter de surcharger l'API
            if (i % 10 === 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        this.pokemon = pokemonList;
        this.pokemonLoaded = true;
        
        // Réinitialiser l'ordre si nécessaire
        if (this.pokemonOrder.length > 0) {
            // Filtrer l'ordre pour ne garder que les IDs valides
            this.pokemonOrder = this.pokemonOrder.filter(id => 
                this.pokemon.some(p => p.id === id)
            );
        }
        
        // Mettre à jour les foundPokemon pour ne garder que les IDs valides
        this.foundPokemon = this.foundPokemon.filter(id => 
            this.pokemon.some(p => p.id === id)
        );
        
        this.saveState();
        
        // Mettre à jour le menu pour afficher la progression correcte
        if (gameManager && gameManager.updateGamesList) {
            gameManager.updateGamesList();
        }
    }

    /**
     * Valide qu'une image charge correctement
     * @param {string} imageUrl - URL de l'image
     * @returns {Promise<boolean>} true si l'image est valide
     */
    validateImage(imageUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imageUrl;
            // Timeout après 5 secondes
            setTimeout(() => resolve(false), 5000);
        });
    }

    /**
     * Démarre ou reprend le jeu
     */
    async start() {
        // Vérifier que le jeu est chargé
        if (this.isLoading || !this.pokemonLoaded) {
            this.renderLoadingScreen();
            // Attendre que le chargement soit terminé
            const checkLoading = setInterval(() => {
                if (!this.isLoading && this.pokemonLoaded) {
                    clearInterval(checkLoading);
                    this.start();
                }
            }, 100);
            return;
        }
        
        this.isActive = true;
        this.isPaused = false;
        this.render();
    }

    /**
     * Affiche l'écran de chargement
     */
    renderLoadingScreen() {
        const container = this.getGameContainer();
        container.innerHTML = `
            <div class="loading-screen">
                <div class="loading-spinner"></div>
                <h2>Chargement du Challenge Pokémon...</h2>
                <p>Récupération des données depuis la PokeAPI (${this.loadingProgress}%)</p>
                <div class="loading-progress-bar">
                    <div class="loading-progress-fill" style="width: ${this.loadingProgress}%"></div>
                </div>
                <p class="loading-note">Cela peut prendre quelques instants...</p>
            </div>
        `;
    }

    /**
     * Récupère les Pokémon dans l'ordre mélangé
     * @returns {Array} Liste des Pokémon dans l'ordre aléatoire
     */
    getPokemonInOrder() {
        return this.pokemonOrder.map(id => 
            this.pokemon.find(p => p.id === id)
        ).filter(p => p !== undefined);
    }

    /**
     * Utilise un indice pour révéler une lettre d'un Pokémon
     * @param {number} pokemonId - ID du Pokémon
     */
    useHint(pokemonId) {
        const pokemon = this.pokemon.find(p => p.id === pokemonId);
        if (!pokemon || this.foundPokemon.includes(pokemonId)) {
            return;
        }

        // Vérifier si on a assez de points
        const hintCost = gameManager.getHintCost();
        if (!gameManager.spendPoints(hintCost)) {
            this.showFeedback(`❌ Pas assez de points pour utiliser un indice ! (Coût: ${hintCost} pts)`, 'error', 2000);
            return;
        }

        // Initialiser la liste des indices si nécessaire
        if (!this.hintsRevealed[pokemonId]) {
            this.hintsRevealed[pokemonId] = [];
        }

        // Trouver une lettre non encore révélée
        const name = pokemon.name;
        const allIndices = Array.from({ length: name.length }, (_, i) => i);
        const availableIndices = allIndices.filter(i => 
            !this.hintsRevealed[pokemonId].includes(i) && name[i] !== ' '
        );

        if (availableIndices.length > 0) {
            // Révéler une lettre aléatoire parmi celles disponibles
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            this.hintsRevealed[pokemonId].push(randomIndex);
            this.saveState();
            this.render();
            this.showFeedback(`💡 Lettre révélée : "${name[randomIndex]}" (-${hintCost} pts)`, 'success', 2000);
        } else {
            this.showFeedback('✅ Toutes les lettres sont déjà révélées !', 'success', 2000);
        }
    }

    /**
     * Génère le placeholder avec les lettres révélées
     * @param {Object} pokemon - Objet Pokémon
     * @returns {string} Placeholder avec lettres révélées
     */
    getHintPlaceholder(pokemon) {
        const name = pokemon.name;
        const revealedIndices = this.hintsRevealed[pokemon.id] || [];
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
     * Vérifie si une réponse correspond à un Pokémon avec tolérance orthographique
     * @param {string} userInput - Réponse de l'utilisateur
     * @param {Object} pokemon - Objet Pokémon
     * @returns {boolean} true si la réponse est correcte
     */
    checkAnswer(userInput, pokemon) {
        if (!userInput || !userInput.trim()) return false;

        const normalizedInput = this.normalizeString(userInput);
        const normalizedName = this.normalizeString(pokemon.name);

        // Vérification exacte (après normalisation)
        if (normalizedInput === normalizedName) return true;

        // Vérification des noms alternatifs
        for (const altName of pokemon.altNames || []) {
            if (this.normalizeString(altName) === normalizedInput) return true;
        }

        // Tolérance orthographique avec distance de Levenshtein
        const maxDistance = Math.max(2, Math.floor(normalizedName.length * 0.15)); // 15% de tolérance
        const distance = this.levenshteinDistance(normalizedInput, normalizedName);

        if (distance <= maxDistance) return true;

        // Vérifier aussi avec les noms alternatifs
        for (const altName of pokemon.altNames || []) {
            const normalizedAlt = this.normalizeString(altName);
            const altDistance = this.levenshteinDistance(normalizedInput, normalizedAlt);
            if (altDistance <= maxDistance) return true;
        }

        return false;
    }

    /**
     * Gère la soumission d'une réponse pour un Pokémon
     * @param {number} pokemonId - ID du Pokémon
     * @param {string} userInput - Réponse de l'utilisateur
     */
    handleAnswer(pokemonId, userInput) {
        const pokemon = this.pokemon.find(p => p.id === pokemonId);
        if (!pokemon) return;

        // Si déjà trouvé, ne rien faire
        if (this.foundPokemon.includes(pokemonId)) return;

        // Sauvegarder la réponse de l'utilisateur
        this.userAnswers[pokemonId] = userInput;

        // Vérifier si la réponse est correcte
        if (this.checkAnswer(userInput, pokemon)) {
            this.foundPokemon.push(pokemonId);
            gameManager.addPoints(GameManager.CORRECT_ANSWER_POINTS);
            this.saveState();
            this.render();
            
            // Vérifier si tous les Pokémon sont trouvés
            if (this.foundPokemon.length === this.pokemon.length) {
                this.showFeedback('🎉 Félicitations ! Vous avez trouvé tous les Pokémon !', 'success', 5000);
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
        const found = this.foundPokemon.length;
        const total = this.pokemon.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const stats = this.foundPokemon.length;
        const total = this.pokemon.length;
        const percentage = Math.round((stats / total) * 100);
        const pokemonInOrder = this.getPokemonInOrder();

        // Sauvegarder la position de scroll avant de réinitialiser le DOM
        const pokemonContainer = container.querySelector('.pokemon-grid-container');
        let savedScrollTop = 0;
        let savedVisibleElement = null;
        
        if (pokemonContainer) {
            savedScrollTop = pokemonContainer.scrollTop;
            const pokemonItems = pokemonContainer.querySelectorAll('.pokemon-item');
            const containerRect = pokemonContainer.getBoundingClientRect();
            for (const item of pokemonItems) {
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

            <div class="pokemon-grid-container">
                <div class="pokemon-grid" id="pokemon-grid">
                    ${pokemonInOrder.filter(pokemon => pokemon.imageUrl).map(pokemon => {
                        const isFound = this.foundPokemon.includes(pokemon.id);
                        const userAnswer = this.userAnswers[pokemon.id] || '';
                        const hasHint = this.hintsRevealed[pokemon.id] && this.hintsRevealed[pokemon.id].length > 0;
                        const placeholder = isFound ? pokemon.name : (hasHint ? this.getHintPlaceholder(pokemon) : 'Nom du Pokémon...');
                        
                        return `
                            <div class="pokemon-item ${isFound ? 'found' : ''}" data-id="${pokemon.id}">
                                <div class="pokemon-image-small">
                                    <img 
                                        src="${pokemon.imageUrl}" 
                                        alt="${pokemon.name}" 
                                        data-pokemon-id="${pokemon.id}"
                                        onerror="this.parentElement.innerHTML='❓'"
                                    >
                                    ${isFound ? '<div class="checkmark">✓</div>' : ''}
                                </div>
                                <input 
                                    type="text" 
                                    class="pokemon-input ${isFound ? 'correct' : ''}"
                                    placeholder="${placeholder}"
                                    value="${isFound ? pokemon.name : userAnswer}"
                                    data-id="${pokemon.id}"
                                    ${isFound ? 'disabled' : ''}
                                    autocomplete="off"
                                />
                                ${!isFound ? `
                                    <button 
                                        class="btn-hint" 
                                        data-id="${pokemon.id}"
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
                const newPokemonContainer = container.querySelector('.pokemon-grid-container');
                if (!newPokemonContainer) return;
                
                if (savedVisibleElement) {
                    const targetElement = newPokemonContainer.querySelector(`[data-id="${savedVisibleElement}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        newPokemonContainer.scrollTop = Math.max(0, newPokemonContainer.scrollTop - 10);
                        return;
                    }
                }
                
                newPokemonContainer.scrollTop = savedScrollTop;
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
        const inputs = document.querySelectorAll('.pokemon-input:not(:disabled)');
        
        inputs.forEach(input => {
            const pokemonId = parseInt(input.getAttribute('data-id'));
            
            // Validation à la perte de focus ou Enter
            input.addEventListener('blur', () => {
                this.handleAnswer(pokemonId, input.value);
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
                const pokemonId = parseInt(button.getAttribute('data-id'));
                this.useHint(pokemonId);
            });
        });
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            foundPokemon: this.foundPokemon,
            userAnswers: this.userAnswers,
            hintsRevealed: this.hintsRevealed,
            pokemonOrder: this.pokemonOrder,
            pokemonLoaded: this.pokemonLoaded
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.foundPokemon = state.foundPokemon || [];
            this.userAnswers = state.userAnswers || {};
            this.hintsRevealed = state.hintsRevealed || {};
            this.pokemonOrder = state.pokemonOrder || [];
            this.pokemonLoaded = state.pokemonLoaded || false;
        }
        
        // Si pas d'ordre sauvegardé et que les Pokémon sont chargés, créer un ordre aléatoire
        if (this.pokemonOrder.length === 0 && this.pokemon.length > 0) {
            this.pokemonOrder = this.shuffleArray(this.pokemon.map(p => p.id));
            this.saveState();
        }
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.foundPokemon = [];
        this.userAnswers = {};
        this.hintsRevealed = {};
        if (this.pokemon.length > 0) {
            this.pokemonOrder = this.shuffleArray(this.pokemon.map(p => p.id));
        }
    }
}
