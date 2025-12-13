/**
 * MapGame - Jeu de placement des pays sur la carte du monde
 * Le joueur doit placer tous les pays sur la carte en cliquant sur le pays puis sur la carte
 */
class MapGame extends GameBase {
    constructor() {
        super('map', 'Challenge Monde', 'Placez tous les pays sur la carte du monde !');
        
        // Liste des pays sera initialisée dans init()
        this.countries = [];

        // État du jeu
        this.placedCountries = []; // Codes des pays déjà placés
        this.selectedCountry = null; // Pays actuellement sélectionné pour placement
        
        // État du zoom et pan
        this.zoomLevel = 1;
        this.minZoom = 0.3;
        this.maxZoom = 20; // Zoom beaucoup plus élevé pour les petits pays comme Monaco
        this.panX = 0;
        this.panY = 0;
        this.isPanning = false;
        this.startPanX = 0;
        this.startPanY = 0;
    }

    /**
     * Retourne la liste complète des pays de l'ONU
     * Même liste que FlagGame pour cohérence
     * @returns {Array} Liste des pays avec code et nom
     */
    getAllUNCountries() {
        // Liste simplifiée des 193 pays (même que FlagGame mais sans les drapeaux)
        // On récupère juste les codes et noms depuis window si FlagGame est chargé
        if (window.flagGame && window.flagGame.countries) {
            return window.flagGame.countries.map(c => ({
                code: c.code,
                name: c.name
            }));
        }
        
        // Fallback : liste minimale (sera remplacée par la vraie liste si FlagGame est chargé)
        return [
            { code: 'FR', name: 'France' },
            { code: 'US', name: 'États-Unis' },
            { code: 'GB', name: 'Royaume-Uni' },
            { code: 'DE', name: 'Allemagne' },
            { code: 'JP', name: 'Japon' }
        ];
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
        // Charger la liste des pays depuis FlagGame si disponible
        if (!this.countries || this.countries.length === 0) {
            this.countries = this.getAllUNCountries();
        }
        
        this.loadState();
    }

    /**
     * Démarre ou reprend le jeu
     */
    start() {
        this.isActive = true;
        this.isPaused = false;
        this.render();
        // Charger la carte après le rendu pour que le conteneur existe
        setTimeout(() => {
            this.loadMapSVG();
        }, 100);
    }

    /**
     * Charge le SVG de la carte
     */
    async loadMapSVG() {
        const container = this.getGameContainer();
        const mapContainer = container.querySelector('#map-container');
        
        if (!mapContainer) {
            console.error('Conteneur de carte non trouvé');
            return;
        }

        try {
            // Essayer différents chemins possibles
            let svgPath = 'assets/world.svg';
            let response;
            
            try {
                response = await fetch(svgPath);
            } catch (e) {
                // Si fetch échoue (CORS ou autre), essayer chemin absolu
                svgPath = './assets/world.svg';
                try {
                    response = await fetch(svgPath);
                } catch (e2) {
                    svgPath = '/assets/world.svg';
                    response = await fetch(svgPath);
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`HTTP error! status: ${response ? response.status : 'no response'}`);
            }
            
            const svgText = await response.text();
            
            if (!svgText || svgText.trim().length === 0) {
                throw new Error('Le fichier SVG est vide');
            }
            
            // Envelopper le SVG dans un conteneur pour le zoom/pan
            mapContainer.innerHTML = `
                <div class="svg-wrapper" id="svg-wrapper">
                    ${svgText}
                </div>
            `;
            
            // Initialiser le zoom et pan
            this.initZoomPan();
            
            // Attacher les event listeners aux paths de la carte
            this.attachMapListeners();
        } catch (error) {
            console.error('Erreur lors du chargement de la carte:', error);
            const isCorsError = error.message.includes('CORS') || error.message.includes('Failed to fetch') || 
                               window.location.protocol === 'file:';
            
            mapContainer.innerHTML = `
                <div style="color: var(--accent-danger); padding: 2rem; text-align: center;">
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;">⚠️ Erreur lors du chargement de la carte</p>
                    ${isCorsError ? `
                        <p style="font-size: 1rem; color: var(--text-primary); margin-bottom: 1rem;">
                            <strong>Vous devez utiliser un serveur web local !</strong>
                        </p>
                        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 8px; margin-top: 1rem; text-align: left;">
                            <p style="margin-bottom: 0.5rem;"><strong>Solutions :</strong></p>
                            <ul style="margin-left: 1.5rem; line-height: 1.8;">
                                <li><strong>Python 3:</strong> <code style="background: var(--bg-primary); padding: 0.2rem 0.5rem; border-radius: 4px;">python3 -m http.server 8000</code></li>
                                <li><strong>Node.js:</strong> <code style="background: var(--bg-primary); padding: 0.2rem 0.5rem; border-radius: 4px;">npx http-server</code></li>
                                <li>Puis ouvrez <code style="background: var(--bg-primary); padding: 0.2rem 0.5rem; border-radius: 4px;">http://localhost:8000</code></li>
                            </ul>
                        </div>
                    ` : `
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 1rem;">
                            Vérifiez que le fichier <code>assets/world.svg</code> existe.
                        </p>
                        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.5rem;">
                            Erreur: ${error.message}
                        </p>
                    `}
                </div>
            `;
        }
    }

    /**
     * Initialise le système de zoom et pan
     */
    initZoomPan() {
        const wrapper = document.getElementById('svg-wrapper');
        const svg = wrapper?.querySelector('svg');
        
        if (!wrapper || !svg) return;

        // Appliquer les transformations initiales
        this.applyTransform();

        // Zoom avec la molette
        wrapper.addEventListener('wheel', (e) => {
            e.preventDefault();
            const rect = wrapper.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            this.zoomAtPoint(mouseX, mouseY, delta);
        });

        // Pan avec clic et glisser
        let isDragging = false;
        let startX, startY;
        let mouseDownX, mouseDownY;
        let hasMoved = false;

        wrapper.addEventListener('mousedown', (e) => {
            // Ne pas activer le pan si on clique sur un path (pour le placement)
            if (e.target.tagName === 'path') {
                return;
            }
            isDragging = true;
            hasMoved = false;
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            startX = e.clientX - this.panX;
            startY = e.clientY - this.panY;
            wrapper.style.cursor = 'grabbing';
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (isDragging) {
                // Détecter si la souris a bougé (pour différencier clic et drag)
                const deltaX = Math.abs(e.clientX - mouseDownX);
                const deltaY = Math.abs(e.clientY - mouseDownY);
                if (deltaX > 3 || deltaY > 3) {
                    hasMoved = true;
                }
                
                this.panX = e.clientX - startX;
                this.panY = e.clientY - startY;
                this.applyTransform();
            }
        });

        wrapper.addEventListener('mouseup', (e) => {
            // Si on n'a pas bougé, c'était un clic, pas un drag
            if (isDragging && !hasMoved) {
                // Permettre le clic sur les paths même si on a commencé le drag ailleurs
                const point = new DOMPoint(e.clientX, e.clientY);
                const svg = wrapper.querySelector('svg');
                if (svg) {
                    const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
                    const element = document.elementFromPoint(e.clientX, e.clientY);
                    if (element && element.tagName === 'path' && element.getAttribute('id')) {
                        // Simuler un clic sur le path
                        const countryCode = element.getAttribute('id');
                        if (this.selectedCountry) {
                            this.placeCountry(this.selectedCountry, countryCode);
                        }
                    }
                }
            }
            isDragging = false;
            hasMoved = false;
            wrapper.style.cursor = 'default';
        });

        wrapper.addEventListener('mouseleave', () => {
            isDragging = false;
            hasMoved = false;
            wrapper.style.cursor = 'default';
        });

        // Touch events pour mobile
        let touchStartDistance = 0;
        let touchStartPanX = 0;
        let touchStartPanY = 0;

        wrapper.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                // Pan avec un doigt
                const touch = e.touches[0];
                startX = touch.clientX - this.panX;
                startY = touch.clientY - this.panY;
                isDragging = true;
            } else if (e.touches.length === 2) {
                // Zoom avec deux doigts
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                touchStartDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                touchStartPanX = this.panX;
                touchStartPanY = this.panY;
            }
        });

        wrapper.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDragging) {
                const touch = e.touches[0];
                this.panX = touch.clientX - startX;
                this.panY = touch.clientY - startY;
                this.applyTransform();
            } else if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
                const scale = distance / touchStartDistance;
                const centerX = (touch1.clientX + touch2.clientX) / 2;
                const centerY = (touch1.clientY + touch2.clientY) / 2;
                const rect = wrapper.getBoundingClientRect();
                this.zoomAtPoint(centerX - rect.left, centerY - rect.top, scale);
                touchStartDistance = distance;
            }
        });

        wrapper.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    /**
     * Zoom à un point spécifique
     */
    zoomAtPoint(pointX, pointY, scale) {
        const newZoom = this.zoomLevel * scale;
        const clampedZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
        
        if (clampedZoom === this.zoomLevel) return;
        
        // Ajuster le pan pour zoomer vers le point
        const rect = document.getElementById('svg-wrapper')?.getBoundingClientRect();
        if (rect) {
            const worldX = (pointX - this.panX) / this.zoomLevel;
            const worldY = (pointY - this.panY) / this.zoomLevel;
            this.panX = pointX - worldX * clampedZoom;
            this.panY = pointY - worldY * clampedZoom;
        }
        
        this.zoomLevel = clampedZoom;
        this.applyTransform();
    }

    /**
     * Applique les transformations de zoom et pan
     */
    applyTransform() {
        const wrapper = document.getElementById('svg-wrapper');
        const svg = wrapper?.querySelector('svg');
        
        if (!wrapper || !svg) return;

        svg.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
        svg.style.transformOrigin = '0 0';
    }

    /**
     * Zoom in
     */
    zoomIn() {
        const wrapper = document.getElementById('svg-wrapper');
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        this.zoomAtPoint(centerX, centerY, 1.5); // Zoom plus agressif
    }

    /**
     * Zoom out
     */
    zoomOut() {
        const wrapper = document.getElementById('svg-wrapper');
        if (!wrapper) return;
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        this.zoomAtPoint(centerX, centerY, 0.67); // Dézoom plus agressif (1/1.5)
    }

    /**
     * Reset zoom et pan
     */
    resetZoom() {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();
    }

    /**
     * Attache les event listeners aux éléments de la carte
     */
    attachMapListeners() {
        const paths = document.querySelectorAll('#svg-wrapper path[id]');
        
        paths.forEach(path => {
            const countryCode = path.getAttribute('id');
            const isPlaced = this.placedCountries.includes(countryCode);
            
            // Style visuel pour les pays placés
            if (isPlaced) {
                path.style.fill = '#5cb85c';
                path.style.stroke = '#2d5a2d';
                path.style.strokeWidth = '1.5';
                path.style.opacity = '0.7';
                path.style.cursor = 'default';
            } else {
                path.style.fill = '#e8e8e8';
                path.style.stroke = '#333333';
                path.style.strokeWidth = '0.8';
                path.style.opacity = '1';
                path.style.cursor = 'pointer';
                path.style.transition = 'all 0.3s ease';
            }

            // Event listener pour le placement
            // Utiliser mousedown au lieu de click pour éviter les conflits avec le pan
            path.addEventListener('mousedown', (e) => {
                e.stopPropagation(); // Empêcher le pan de se déclencher
                if (this.selectedCountry && !isPlaced) {
                    this.placeCountry(this.selectedCountry, countryCode);
                } else if (!this.selectedCountry) {
                    this.showFeedback('⚠️ Sélectionnez d\'abord un pays dans la liste', 'error', 2000);
                }
            });
            
            // Aussi gérer le click pour compatibilité
            path.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.selectedCountry && !isPlaced) {
                    this.placeCountry(this.selectedCountry, countryCode);
                } else if (!this.selectedCountry) {
                    this.showFeedback('⚠️ Sélectionnez d\'abord un pays dans la liste', 'error', 2000);
                }
            });

            // Effet hover
            if (!isPlaced) {
                path.addEventListener('mouseenter', () => {
                    if (this.selectedCountry) {
                        path.style.fill = '#8b6f47';
                        path.style.stroke = '#5a4a2f';
                        path.style.strokeWidth = '2';
                        path.style.opacity = '0.8';
                    }
                });

                path.addEventListener('mouseleave', () => {
                    if (this.selectedCountry && !isPlaced) {
                        path.style.fill = '#e8e8e8';
                        path.style.stroke = '#333333';
                        path.style.strokeWidth = '0.8';
                        path.style.opacity = '1';
                    }
                });
            }
        });
    }

    /**
     * Place un pays sur la carte
     * @param {string} selectedCode - Code du pays sélectionné
     * @param {string} mapCode - Code du pays sur la carte où on clique
     */
    placeCountry(selectedCode, mapCode) {
        if (selectedCode === mapCode) {
            // Placement correct !
            this.placedCountries.push(selectedCode);
            gameManager.addPoints(10);
            this.selectedCountry = null;
            this.saveState();
            this.render();
            this.attachMapListeners();
            
            // Vérifier si tous les pays sont placés
            if (this.placedCountries.length === this.countries.length) {
                this.showFeedback('🎉 Félicitations ! Vous avez placé tous les pays !', 'success', 5000);
            } else {
                this.showFeedback('✅ Correct ! +10 points', 'success', 2000);
            }
        } else {
            // Placement incorrect - pénalité de points
            const pointsLost = 5;
            if (gameManager.spendPoints(pointsLost)) {
                this.showFeedback(`❌ Incorrect ! -${pointsLost} points`, 'error', 2000);
            } else {
                // Si le score est déjà à 0 ou insuffisant, juste afficher un message
                this.showFeedback('❌ Incorrect ! (Pas assez de points pour pénalité)', 'error', 2000);
            }
            this.selectedCountry = null; // Désélectionner pour permettre un nouveau choix
            this.render();
            this.attachMapListeners();
        }
    }

    /**
     * Sélectionne un pays dans la liste
     * @param {string} countryCode - Code du pays à sélectionner
     */
    selectCountry(countryCode) {
        if (this.placedCountries.includes(countryCode)) {
            this.showFeedback('⚠️ Ce pays est déjà placé !', 'error', 2000);
            return;
        }

        this.selectedCountry = countryCode;
        this.render();
        this.attachMapListeners();
    }

    /**
     * Récupère les pays dans l'ordre alphabétique, en excluant ceux déjà placés
     * @returns {Array} Liste des pays non placés triés par ordre alphabétique
     */
    getCountriesInOrder() {
        return [...this.countries]
            .filter(country => !this.placedCountries.includes(country.code))
            .sort((a, b) => {
                // Trier par nom en français, en ignorant la casse et les accents
                const nameA = a.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                const nameB = b.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                return nameA.localeCompare(nameB, 'fr');
            });
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const stats = this.placedCountries.length;
        const total = this.countries.length;
        const percentage = Math.round((stats / total) * 100);
        const countriesInOrder = this.getCountriesInOrder();

        container.innerHTML = `
            <div class="game-header">
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; margin-bottom: 1rem;">
                    <div>
                        <h2>${this.name}</h2>
                        <p>Progression: ${stats}/${total} (${percentage}%)</p>
                    </div>
                    <button class="btn-restart" onclick="mapGame.reset()" title="Réinitialiser le jeu">🔄 Restart</button>
                </div>
                ${this.selectedCountry ? `
                    <p class="selected-country-hint">
                        Pays sélectionné : <strong>${this.countries.find(c => c.code === this.selectedCountry)?.name}</strong>
                        <button class="btn-clear-selection" onclick="mapGame.clearSelection()">✕</button>
                    </p>
                ` : '<p class="instruction">Sélectionnez un pays dans la liste, puis cliquez sur sa position sur la carte</p>'}
            </div>

            <div class="map-game-container">
                <div class="map-section">
                    <div class="map-controls">
                        <button class="btn-zoom" onclick="mapGame.zoomIn()" title="Zoomer">
                            <span>+</span>
                        </button>
                        <button class="btn-zoom" onclick="mapGame.zoomOut()" title="Dézoomer">
                            <span>−</span>
                        </button>
                        <button class="btn-zoom" onclick="mapGame.resetZoom()" title="Réinitialiser">
                            <span>⌂</span>
                        </button>
                    </div>
                    <div id="map-container" class="map-container">
                        <p>Chargement de la carte...</p>
                    </div>
                    <p class="map-instructions">
                        💡 Utilisez la molette pour zoomer, cliquez-glissez pour déplacer
                    </p>
                </div>

                <div class="countries-list-section">
                    <h3>Pays à placer</h3>
                    <div class="countries-list" id="countries-list">
                        ${countriesInOrder.length > 0 ? countriesInOrder.map(country => {
                            const isSelected = this.selectedCountry === country.code;
                            
                            return `
                                <button 
                                    class="country-item ${isSelected ? 'selected' : ''}"
                                    data-code="${country.code}"
                                >
                                    ${country.name}
                                </button>
                            `;
                        }).join('') : '<p style="text-align: center; color: var(--accent-secondary); font-size: 1.5rem; font-weight: 700; padding: 2rem;">🎉 Tous les pays ont été placés !</p>'}
                    </div>
                </div>
            </div>

            <div class="game-stats">
                <p>Score actuel: ${gameManager.getGlobalScore()} pts</p>
            </div>
        `;

        // Attacher les event listeners
        this.attachEventListeners();
        
        // Charger la carte si elle n'est pas déjà chargée
        const mapContainer = container.querySelector('#map-container');
        if (mapContainer && !mapContainer.querySelector('svg')) {
            // Attendre un peu pour que le DOM soit prêt
            setTimeout(() => {
                this.loadMapSVG();
            }, 50);
        } else if (mapContainer && mapContainer.querySelector('svg')) {
            // La carte est déjà chargée, juste mettre à jour les listeners
            this.attachMapListeners();
        }
    }

    /**
     * Efface la sélection du pays
     */
    clearSelection() {
        this.selectedCountry = null;
        this.render();
        this.attachMapListeners();
    }

    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        const countryButtons = document.querySelectorAll('.country-item:not(:disabled)');
        
        countryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const countryCode = button.getAttribute('data-code');
                this.selectCountry(countryCode);
            });
        });
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            placedCountries: this.placedCountries
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.placedCountries = state.placedCountries || [];
        }
    }

    /**
     * Retourne la progression du jeu
     * @returns {Object} { found: number, total: number, percentage: number }
     */
    getProgress() {
        const found = this.placedCountries.length;
        const total = this.countries.length;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.placedCountries = [];
        this.selectedCountry = null;
    }
}

