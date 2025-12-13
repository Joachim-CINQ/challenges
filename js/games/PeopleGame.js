/**
 * PeopleGame - Jeu de quiz sur les personnalités
 * Tous les portraits sont affichés, le joueur doit deviner le nom de chaque personnalité
 */
class PeopleGame extends GameBase {
    constructor() {
        super('people', 'Challenge People', 'Devinez toutes les personnalités célèbres !');
        
        // Liste complète des personnalités (sera filtrée pour ne garder que celles avec images)
        this.allPeople = PEOPLE_DATA.map(person => ({
            id: person.id,
            name: person.name,
            category: person.category,
            altNames: this.getAltNames(person.name)
        }));

        // Liste filtrée des personnalités avec images valides
        this.people = [];
        this.imagesLoaded = false;

        // État du jeu
        this.foundPeople = []; // IDs des personnalités déjà trouvées
        this.userAnswers = {}; // { personId: userInput }
        this.hintsRevealed = {}; // { personId: [indices de lettres révélées] }
        this.peopleOrder = []; // Ordre aléatoire des personnalités
        
        // État de chargement
        this.isLoading = true;
        this.loadingProgress = 0;
    }

    /**
     * Génère l'URL de l'image Wikipédia pour une personnalité
     * @param {string} name - Nom de la personnalité
     * @returns {string} URL placeholder (sera remplacée par fetchWikiImage)
     */
    getWikiImageUrl(name) {
        // Retourner un placeholder, l'image sera chargée via fetchWikiImage
        return null;
    }

    /**
     * Récupère l'URL réelle de l'image depuis l'API Wikipédia
     * @param {string} name - Nom de la personnalité
     * @returns {Promise<string|null>} URL de l'image ou null
     */
    async fetchWikiImage(name) {
        try {
            const encodedName = encodeURIComponent(name);
            const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const pages = data.query?.pages || {};
            for (const pageId in pages) {
                if (pageId !== '-1' && pages[pageId].thumbnail) {
                    return pages[pageId].thumbnail.source;
                }
            }
        } catch (error) {
            console.error(`Erreur pour ${name}:`, error);
        }
        
        return null;
    }

    /**
     * Génère des noms alternatifs pour une personnalité
     * @param {string} name - Nom de la personnalité
     * @returns {Array<string>} Liste des noms alternatifs
     */
    getAltNames(name) {
        const altNames = [];
        
        // Quelques cas spéciaux
        const specialCases = {
            'Mario (Nintendo)': ['Mario', 'Super Mario'],
            'Elsa (Disney)': ['Elsa', 'Frozen'],
            'The Joker': ['Joker'],
            'Count Dracula': ['Dracula', 'Vlad Dracula'],
            'Santa Claus': ['Père Noël', 'Saint Nicolas'],
            'Joan of Arc': ['Jeanne d\'Arc', 'Jeanne d Arc'],
            'Mother Teresa': ['Mère Teresa', 'Mere Teresa'],
            'Dalai Lama': ['Dalaï Lama', 'Dalai Lama'],
            'Muhammad Ali': ['Cassius Clay', 'Mohammed Ali'],
            'Diego Maradona': ['Maradona'],
            'Pelé': ['Pele', 'Edson Arantes do Nascimento'],
            'Cristiano Ronaldo': ['CR7', 'Cristiano'],
            'Lionel Messi': ['Messi'],
            'Kylian Mbappé': ['Mbappé', 'Mbappe', 'Kylian'],
            'Zinedine Zidane': ['Zidane', 'Zizou'],
            'Lewis Hamilton': ['Hamilton'],
            'Roger Federer': ['Federer'],
            'Serena Williams': ['Serena'],
            'Usain Bolt': ['Bolt'],
            'LeBron James': ['LeBron', 'Lebron James'],
            'Michael Jordan': ['MJ', 'Jordan'],
            'Tiger Woods': ['Woods'],
            'Mike Tyson': ['Tyson'],
            'Taylor Swift': ['Swift', 'Taylor'],
            'Edith Piaf': ['Piaf', 'La Môme Piaf'],
            'Céline Dion': ['Celine Dion'],
            'Stromae': ['Paul Van Haver'],
            'Daft Punk': ['Daft Punk'],
            'Kanye West': ['Ye', 'Kanye'],
            'Justin Bieber': ['Bieber', 'JB'],
            'Britney Spears': ['Britney'],
            'Lady Gaga': ['Gaga', 'Stefani Germanotta'],
            'Shakira': ['Shakira'],
            'Adele': ['Adele Adkins'],
            'Rihanna': ['Rihanna'],
            'Beyoncé': ['Beyonce'],
            'Madonna': ['Madonna Ciccone'],
            'Elvis Presley': ['Elvis', 'The King'],
            'Michael Jackson': ['MJ', 'King of Pop'],
            'Bob Marley': ['Marley'],
            'Freddie Mercury': ['Mercury', 'Farrokh Bulsara'],
            'John Lennon': ['Lennon'],
            'David Bowie': ['Bowie'],
            'Kurt Cobain': ['Cobain'],
            'Elton John': ['Elton'],
            'Snoop Dogg': ['Snoop', 'Calvin Broadus'],
            'Eminem': ['Marshall Mathers', 'Slim Shady'],
            'Tupac Shakur': ['2Pac', 'Tupac'],
            'Leonardo da Vinci': ['Leonardo', 'Da Vinci'],
            'Vincent van Gogh': ['Van Gogh', 'VanGogh'],
            'Pablo Picasso': ['Picasso'],
            'Salvador Dalí': ['Dali', 'Dalí'],
            'Andy Warhol': ['Warhol'],
            'Frida Kahlo': ['Kahlo'],
            'William Shakespeare': ['Shakespeare'],
            'Victor Hugo': ['Hugo'],
            'Molière': ['Jean-Baptiste Poquelin'],
            'J.K. Rowling': ['Rowling', 'Joanne Rowling'],
            'Harry Potter': ['Potter'],
            'Darth Vader': ['Vader', 'Anakin Skywalker'],
            'Mickey Mouse': ['Mickey'],
            'Superman': ['Clark Kent', 'Kal-El'],
            'Batman': ['Bruce Wayne', 'The Dark Knight'],
            'Spider-Man': ['Spider Man', 'Peter Parker'],
            'Wonder Woman': ['Diana Prince'],
            'Pikachu': ['Pikachu'],
            'Sherlock Holmes': ['Holmes', 'Sherlock'],
            'James Bond': ['Bond', '007'],
            'Homer Simpson': ['Homer'],
            'Shrek': ['Shrek'],
            'Gandalf': ['Gandalf the Grey', 'Gandalf the White'],
            'Jon Snow': ['Jon', 'Aegon Targaryen'],
            'Luke Skywalker': ['Luke', 'Skywalker'],
            'Barbie': ['Barbie'],
            'Forrest Gump': ['Forrest'],
            'Jack Sparrow': ['Sparrow', 'Captain Jack Sparrow'],
            'Iron Man': ['Tony Stark'],
            'Captain America': ['Steve Rogers', 'Cap'],
            'SpongeBob SquarePants': ['SpongeBob', 'Sponge Bob'],
            'Tarzan': ['Tarzan'],
            'Zorro': ['Zorro'],
            'Gollum': ['Smeagol'],
            'Asterix': ['Astérix', 'Asterix'],
            'Albert Einstein': ['Einstein'],
            'Marie Curie': ['Curie', 'Maria Skłodowska'],
            'Isaac Newton': ['Newton'],
            'Charles Darwin': ['Darwin'],
            'Nikola Tesla': ['Tesla'],
            'Stephen Hawking': ['Hawking'],
            'Neil Armstrong': ['Armstrong'],
            'Sigmund Freud': ['Freud'],
            'Thomas Edison': ['Edison'],
            'Galileo Galilei': ['Galileo', 'Galilei'],
            'Thomas Pesquet': ['Pesquet'],
            'Pythagoras': ['Pythagore'],
            'Gustave Eiffel': ['Eiffel'],
            'Elon Musk': ['Musk'],
            'Steve Jobs': ['Jobs'],
            'Bill Gates': ['Gates'],
            'Mark Zuckerberg': ['Zuckerberg'],
            'Jeff Bezos': ['Bezos'],
            'Tim Cook': ['Cook'],
            'Henry Ford': ['Ford'],
            'Napoleon': ['Napoléon', 'Napoleon Bonaparte', 'Bonaparte'],
            'Julius Caesar': ['Caesar', 'César', 'Cesar'],
            'Cleopatra': ['Cléopâtre', 'Cleopatre'],
            'Queen Elizabeth II': ['Elizabeth II', 'Queen Elizabeth', 'Elizabeth'],
            'Barack Obama': ['Obama'],
            'Donald Trump': ['Trump'],
            'Nelson Mandela': ['Mandela'],
            'Mahatma Gandhi': ['Gandhi'],
            'Martin Luther King Jr.': ['MLK', 'Martin Luther King'],
            'John F. Kennedy': ['JFK', 'Kennedy'],
            'Winston Churchill': ['Churchill'],
            'Abraham Lincoln': ['Lincoln'],
            'Che Guevara': ['Guevara', 'Che'],
            'Vladimir Putin': ['Putin', 'Poutine'],
            'Emmanuel Macron': ['Macron'],
            'Mao Zedong': ['Mao', 'Mao Tse-tung'],
            'Princess Diana': ['Diana', 'Princess of Wales'],
            'Louis XIV': ['Louis 14', 'Sun King', 'Roi Soleil'],
            'Malcolm X': ['Malcolm X'],
            'Charles de Gaulle': ['De Gaulle', 'DeGaulle'],
            'Adolf Hitler': ['Hitler'],
            'Joe Biden': ['Biden'],
            'Marilyn Monroe': ['Monroe', 'Norma Jeane'],
            'Charlie Chaplin': ['Chaplin'],
            'Brad Pitt': ['Pitt'],
            'Leonardo DiCaprio': ['DiCaprio', 'Di Caprio'],
            'Angelina Jolie': ['Jolie'],
            'Will Smith': ['Smith'],
            'Tom Cruise': ['Cruise'],
            'Dwayne Johnson': ['The Rock', 'Rock'],
            'Jackie Chan': ['Chan'],
            'Johnny Depp': ['Depp'],
            'Emma Watson': ['Watson'],
            'Morgan Freeman': ['Freeman'],
            'Robert De Niro': ['De Niro', 'DeNiro'],
            'Meryl Streep': ['Streep'],
            'Scarlett Johansson': ['Johansson'],
            'Audrey Hepburn': ['Hepburn'],
            'Bruce Lee': ['Lee'],
            'Arnold Schwarzenegger': ['Schwarzenegger', 'Arnold'],
            'Sylvester Stallone': ['Stallone', 'Rocky'],
            'Zendaya': ['Zendaya'],
            'Keanu Reeves': ['Reeves'],
            'Quentin Tarantino': ['Tarantino'],
            'Steven Spielberg': ['Spielberg'],
            'Omar Sy': ['Omar'],
            'Jenna Ortega': ['Ortega']
        };

        if (specialCases[name]) {
            altNames.push(...specialCases[name]);
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
        
        // Charger les images et filtrer les personnalités sans image
        if (!this.imagesLoaded) {
            await this.loadAndFilterPeople();
        }
        
        // Mélanger l'ordre des personnalités si ce n'est pas déjà fait
        if (this.peopleOrder.length === 0) {
            this.peopleOrder = this.shuffleArray(this.people.map(p => p.id));
        }
        
        this.isLoading = false;
        this.loadingProgress = 100;
        
        // Mettre à jour le menu pour enlever l'indicateur de chargement
        if (gameManager && gameManager.updateGamesList) {
            gameManager.updateGamesList();
        }
    }

    /**
     * Charge les images et filtre les personnalités sans image valide
     */
    async loadAndFilterPeople() {
        const peopleWithImages = [];
        const total = this.allPeople.length;
        
        // Charger les images pour toutes les personnalités
        for (let i = 0; i < this.allPeople.length; i++) {
            const person = this.allPeople[i];
            this.loadingProgress = Math.round((i / total) * 90); // 0-90% pour le chargement des images
            
            // Mettre à jour le menu pendant le chargement
            if (gameManager && gameManager.updateGamesList && i % 10 === 0) {
                gameManager.updateGamesList();
            }
            
            const imageUrl = await this.fetchWikiImage(person.name);
            if (imageUrl) {
                // Vérifier que l'image charge vraiment
                const imageValid = await this.validateImage(imageUrl);
                if (imageValid) {
                    person.imageUrl = imageUrl;
                    peopleWithImages.push(person);
                }
            }
        }
        
        this.people = peopleWithImages;
        this.imagesLoaded = true;
        
        // Réinitialiser l'ordre si nécessaire
        if (this.peopleOrder.length > 0) {
            // Filtrer l'ordre pour ne garder que les IDs valides
            this.peopleOrder = this.peopleOrder.filter(id => 
                this.people.some(p => p.id === id)
            );
        }
        
        // Mettre à jour les foundPeople pour ne garder que les IDs valides
        this.foundPeople = this.foundPeople.filter(id => 
            this.people.some(p => p.id === id)
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
        if (this.isLoading || !this.imagesLoaded) {
            this.renderLoadingScreen();
            // Attendre que le chargement soit terminé
            const checkLoading = setInterval(() => {
                if (!this.isLoading && this.imagesLoaded) {
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
                <h2>Chargement du Challenge People...</h2>
                <p>Chargement des images des personnalités (${this.loadingProgress}%)</p>
                <div class="loading-progress-bar">
                    <div class="loading-progress-fill" style="width: ${this.loadingProgress}%"></div>
                </div>
                <p class="loading-note">Cela peut prendre quelques instants...</p>
            </div>
        `;
    }

    /**
     * Récupère les personnalités dans l'ordre mélangé
     * @returns {Array} Liste des personnalités dans l'ordre aléatoire
     */
    getPeopleInOrder() {
        return this.peopleOrder.map(id => 
            this.people.find(p => p.id === id)
        ).filter(p => p !== undefined);
    }

    /**
     * Utilise un indice pour révéler une lettre d'une personnalité
     * @param {number} personId - ID de la personnalité
     */
    useHint(personId) {
        const person = this.people.find(p => p.id === personId);
        if (!person || this.foundPeople.includes(personId)) {
            return;
        }

        // Vérifier si on a assez de points
        if (!gameManager.spendPoints(25)) {
            this.showFeedback('❌ Pas assez de points pour utiliser un indice !', 'error', 2000);
            return;
        }

        // Initialiser la liste des indices si nécessaire
        if (!this.hintsRevealed[personId]) {
            this.hintsRevealed[personId] = [];
        }

        // Trouver une lettre non encore révélée
        const name = person.name;
        const allIndices = Array.from({ length: name.length }, (_, i) => i);
        const availableIndices = allIndices.filter(i => 
            !this.hintsRevealed[personId].includes(i) && name[i] !== ' '
        );

        if (availableIndices.length > 0) {
            // Révéler une lettre aléatoire parmi celles disponibles
            const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
            this.hintsRevealed[personId].push(randomIndex);
            this.saveState();
            this.render();
            this.showFeedback(`💡 Lettre révélée : "${name[randomIndex]}" (-25 pts)`, 'success', 2000);
        } else {
            this.showFeedback('✅ Toutes les lettres sont déjà révélées !', 'success', 2000);
        }
    }

    /**
     * Génère le placeholder avec les lettres révélées
     * @param {Object} person - Objet personnalité
     * @returns {string} Placeholder avec lettres révélées
     */
    getHintPlaceholder(person) {
        const name = person.name;
        const revealedIndices = this.hintsRevealed[person.id] || [];
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
     * Vérifie si une réponse correspond à une personnalité avec tolérance orthographique
     * @param {string} userInput - Réponse de l'utilisateur
     * @param {Object} person - Objet personnalité
     * @returns {boolean} true si la réponse est correcte
     */
    checkAnswer(userInput, person) {
        if (!userInput || !userInput.trim()) return false;

        const normalizedInput = this.normalizeString(userInput);
        const normalizedName = this.normalizeString(person.name);

        // Vérification exacte (après normalisation)
        if (normalizedInput === normalizedName) return true;

        // Vérification des noms alternatifs
        for (const altName of person.altNames || []) {
            if (this.normalizeString(altName) === normalizedInput) return true;
        }

        // Tolérance orthographique avec distance de Levenshtein
        const maxDistance = Math.max(2, Math.floor(normalizedName.length * 0.15)); // 15% de tolérance
        const distance = this.levenshteinDistance(normalizedInput, normalizedName);

        if (distance <= maxDistance) return true;

        // Vérifier aussi avec les noms alternatifs
        for (const altName of person.altNames || []) {
            const normalizedAlt = this.normalizeString(altName);
            const altDistance = this.levenshteinDistance(normalizedInput, normalizedAlt);
            if (altDistance <= maxDistance) return true;
        }

        return false;
    }

    /**
     * Gère la soumission d'une réponse pour une personnalité
     * @param {number} personId - ID de la personnalité
     * @param {string} userInput - Réponse de l'utilisateur
     */
    handleAnswer(personId, userInput) {
        const person = this.people.find(p => p.id === personId);
        if (!person) return;

        // Si déjà trouvé, ne rien faire
        if (this.foundPeople.includes(personId)) return;

        // Sauvegarder la réponse de l'utilisateur
        this.userAnswers[personId] = userInput;

        // Vérifier si la réponse est correcte
        if (this.checkAnswer(userInput, person)) {
            this.foundPeople.push(personId);
            gameManager.addPoints(10);
            this.saveState();
            this.render();
            
            // Vérifier si toutes les personnalités sont trouvées
            if (this.foundPeople.length === this.people.length) {
                this.showFeedback('🎉 Félicitations ! Vous avez trouvé toutes les personnalités !', 'success', 5000);
            }
        }
    }

    /**
     * Charge l'image réelle depuis Wikipédia (déjà chargée dans init)
     * @param {Object} person - Objet personnalité
     * @param {HTMLElement} imgElement - Élément img à mettre à jour
     */
    loadPersonImage(person, imgElement) {
        if (person.imageUrl) {
            imgElement.src = person.imageUrl;
            imgElement.onerror = () => {
                // Si l'image échoue maintenant, cacher l'élément
                const personItem = imgElement.closest('.person-item');
                if (personItem) {
                    personItem.style.display = 'none';
                }
            };
        } else {
            // Si pas d'image, cacher l'élément
            const personItem = imgElement.closest('.person-item');
            if (personItem) {
                personItem.style.display = 'none';
            }
        }
    }

    /**
     * Retourne la progression du jeu
     * @returns {Object} { found: number, total: number, percentage: number }
     */
    getProgress() {
        const found = this.foundPeople.length;
        const total = this.people.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const stats = this.foundPeople.length;
        const total = this.people.length;
        const percentage = Math.round((stats / total) * 100);
        const peopleInOrder = this.getPeopleInOrder();

        // Sauvegarder la position de scroll avant de réinitialiser le DOM
        const peopleContainer = container.querySelector('.people-grid-container');
        let savedScrollTop = 0;
        let savedVisibleElement = null;
        
        if (peopleContainer) {
            savedScrollTop = peopleContainer.scrollTop;
            const peopleItems = peopleContainer.querySelectorAll('.person-item');
            const containerRect = peopleContainer.getBoundingClientRect();
            for (const item of peopleItems) {
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

            <div class="people-grid-container">
                <div class="people-grid" id="people-grid">
                    ${peopleInOrder.filter(person => person.imageUrl).map(person => {
                        const isFound = this.foundPeople.includes(person.id);
                        const userAnswer = this.userAnswers[person.id] || '';
                        const hasHint = this.hintsRevealed[person.id] && this.hintsRevealed[person.id].length > 0;
                        const placeholder = isFound ? person.name : (hasHint ? this.getHintPlaceholder(person) : 'Nom de la personnalité...');
                        
                        return `
                            <div class="person-item ${isFound ? 'found' : ''}" data-id="${person.id}">
                                <div class="person-image-small">
                                    <img 
                                        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Crect fill='%23ddd' width='160' height='160'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='14'%3EChargement...%3C/text%3E%3C/svg%3E" 
                                        alt="${person.name}" 
                                        data-person-id="${person.id}"
                                        data-person-name="${person.name}"
                                        onerror="this.parentElement.innerHTML='❓'"
                                    >
                                    ${isFound ? '<div class="checkmark">✓</div>' : ''}
                                </div>
                                <input 
                                    type="text" 
                                    class="person-input ${isFound ? 'correct' : ''}"
                                    placeholder="${placeholder}"
                                    value="${isFound ? person.name : userAnswer}"
                                    data-id="${person.id}"
                                    ${isFound ? 'disabled' : ''}
                                    autocomplete="off"
                                />
                                ${!isFound ? `
                                    <button 
                                        class="btn-hint" 
                                        data-id="${person.id}"
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

        // Charger les images depuis Wikipédia (déjà chargées dans init)
        const imgElements = container.querySelectorAll('img[data-person-name]');
        imgElements.forEach(img => {
            const personName = img.getAttribute('data-person-name');
            const person = this.people.find(p => p.name === personName);
            if (person && person.imageUrl) {
                this.loadPersonImage(person, img);
            } else {
                // Cacher l'élément si pas d'image
                const personItem = img.closest('.person-item');
                if (personItem) {
                    personItem.style.display = 'none';
                }
            }
        });

        // Attacher les event listeners
        this.attachEventListeners();

        // Restaurer la position de scroll après le rendu
        if (savedScrollTop > 0 || savedVisibleElement) {
            const restoreScroll = () => {
                const newPeopleContainer = container.querySelector('.people-grid-container');
                if (!newPeopleContainer) return;
                
                if (savedVisibleElement) {
                    const targetElement = newPeopleContainer.querySelector(`[data-id="${savedVisibleElement}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'instant', block: 'start' });
                        newPeopleContainer.scrollTop = Math.max(0, newPeopleContainer.scrollTop - 10);
                        return;
                    }
                }
                
                newPeopleContainer.scrollTop = savedScrollTop;
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
        const inputs = document.querySelectorAll('.person-input:not(:disabled)');
        
        inputs.forEach(input => {
            const personId = parseInt(input.getAttribute('data-id'));
            
            // Validation à la perte de focus ou Enter
            input.addEventListener('blur', () => {
                this.handleAnswer(personId, input.value);
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
                const personId = parseInt(button.getAttribute('data-id'));
                this.useHint(personId);
            });
        });
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            foundPeople: this.foundPeople,
            userAnswers: this.userAnswers,
            hintsRevealed: this.hintsRevealed,
            peopleOrder: this.peopleOrder
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.foundPeople = state.foundPeople || [];
            this.userAnswers = state.userAnswers || {};
            this.hintsRevealed = state.hintsRevealed || {};
            this.peopleOrder = state.peopleOrder || [];
        }
        
        // Si pas d'ordre sauvegardé, créer un ordre aléatoire
        if (this.peopleOrder.length === 0) {
            this.peopleOrder = this.shuffleArray(this.people.map(p => p.id));
            this.saveState();
        }
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.foundPeople = [];
        this.userAnswers = {};
        this.hintsRevealed = {};
        this.peopleOrder = this.shuffleArray(this.people.map(p => p.id));
    }
}

