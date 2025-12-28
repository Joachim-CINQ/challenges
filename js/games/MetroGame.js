/**
 * MetroGame - Jeu de mémoire des stations de métro parisiennes
 * Inspiré de metro-memory.com (https://github.com/benjamintd/metro-memory.com)
 * Le joueur doit trouver toutes les stations en tapant leur nom sur la carte
 */
class MetroGame extends GameBase {
    constructor() {
        super('metro', 'Challenge Métro', 'Trouvez toutes les stations du métro parisien sur la carte !');
        
        // Données
        this.features = null; // GeoJSON features
        this.routes = null; // GeoJSON routes
        this.idMap = new Map(); // Map<id, feature>

        // État du jeu
        this.foundStationIds = new Set(); // IDs des stations trouvées
        this.userAnswers = {}; // { stationId: userInput }
        this.hintsRevealed = {}; // { stationId: { firstLetter: true, lastLetter: true } }
        
        // État de chargement
        this.isLoading = true;
        this.loadingProgress = 0;
        
        // Map (Leaflet)
        this.map = null;
        this.stationLayers = new Map(); // Map<id, L.CircleMarker>
        this.routeLayers = []; // Array of L.Polyline
        
        // Recherche
        this.fuse = null;
        
        // Configuration des lignes
        this.lines = {
            'METRO 1': { name: 'Ligne 1', color: '#FFCD00', backgroundColor: '#806600' },
            'METRO 2': { name: 'Ligne 2', color: '#003CA6', backgroundColor: '#001D53' },
            'METRO 3': { name: 'Ligne 3', color: '#837902', backgroundColor: '#413C01' },
            'METRO 3b': { name: 'Ligne 3bis', color: '#6EC4E8', backgroundColor: '#375674' },
            'METRO 4': { name: 'Ligne 4', color: '#CF009E', backgroundColor: '#67004F' },
            'METRO 5': { name: 'Ligne 5', color: '#FF7E2E', backgroundColor: '#7F3F17' },
            'METRO 6': { name: 'Ligne 6', color: '#6ECA97', backgroundColor: '#37654B' },
            'METRO 7': { name: 'Ligne 7', color: '#FA9ABA', backgroundColor: '#7D4D5D' },
            'METRO 7b': { name: 'Ligne 7bis', color: '#6ECA97', backgroundColor: '#37654B' },
            'METRO 8': { name: 'Ligne 8', color: '#E19BDF', backgroundColor: '#704D6F' },
            'METRO 9': { name: 'Ligne 9', color: '#B6BD00', backgroundColor: '#5B5E00' },
            'METRO 10': { name: 'Ligne 10', color: '#C9910D', backgroundColor: '#644806' },
            'METRO 11': { name: 'Ligne 11', color: '#704B1C', backgroundColor: '#38250E' },
            'METRO 12': { name: 'Ligne 12', color: '#007852', backgroundColor: '#003C29' },
            'METRO 13': { name: 'Ligne 13', color: '#6EC4E8', backgroundColor: '#375674' },
            'METRO 14': { name: 'Ligne 14', color: '#62259D', backgroundColor: '#31124E' }
        };
    }

    /**
     * Initialise le jeu
     */
    async init() {
        this.isLoading = true;
        this.loadingProgress = 0;
        this.loadState();
        // Charger les données GeoJSON
        await this.loadData();
        this.isLoading = false;
        this.loadingProgress = 100;
        
        // Mettre à jour le menu pour enlever l'indicateur de chargement
        if (gameManager && gameManager.updateGamesList) {
            gameManager.updateGamesList();
        }
    }

    /**
     * Charge les données GeoJSON
     */
    async loadData() {
        try {
            this.loadingProgress = 20;
            // Charger les features (stations)
            const featuresResponse = await fetch('js/data/paris-features.json');
            const featuresData = await featuresResponse.json();
            this.features = featuresData;
            this.loadingProgress = 50;
            
            // Créer la map des IDs
            featuresData.features.forEach(feature => {
                if (feature.id) {
                    this.idMap.set(feature.id, feature);
                }
            });
            this.loadingProgress = 70;
            
            // Charger les routes (lignes)
            try {
                const routesResponse = await fetch('js/data/paris-routes.json');
                const routesData = await routesResponse.json();
                this.routes = routesData;
            } catch (e) {
                console.warn('Routes non disponibles, utilisation sans lignes');
            }
            this.loadingProgress = 90;
            
            // Initialiser Fuse.js pour la recherche
            this.initFuse();
            this.loadingProgress = 100;
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            this.isLoading = false;
            throw error;
        }
    }

    /**
     * Initialise Fuse.js pour la recherche floue
     */
    initFuse() {
        if (!this.features || typeof Fuse === 'undefined') {
            // Fallback si Fuse.js n'est pas disponible
            return;
        }
        
        this.fuse = new Fuse(this.features.features, {
            includeScore: true,
            includeMatches: true,
            keys: [
                'properties.name',
                'properties.long_name',
                'properties.short_name'
            ],
            minMatchCharLength: 2,
            threshold: 0.15,
            distance: 10,
            getFn: (obj, path) => {
                const value = Fuse.config.getFn(obj, path);
                if (value === undefined) {
                    return '';
                } else if (Array.isArray(value)) {
                    return value.map(el => this.normalizeString(el));
                } else {
                    return this.normalizeString(value);
                }
            }
        });
    }

    /**
     * Normalise une chaîne pour la comparaison (identique à FlagGame)
     */
    normalizeString(str) {
        if (!str) return '';
        
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
            .replace(/[^a-z0-9\s]/g, '') // Supprime la ponctuation
            .trim()
            .replace(/\s+/g, ' '); // Normalise les espaces
    }

    /**
     * Calcule la distance de Levenshtein entre deux chaînes (identique à FlagGame)
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
     * Vérifie si une réponse correspond à une station avec tolérance orthographique (identique à FlagGame)
     */
    checkAnswer(userInput, feature) {
        if (!userInput || !userInput.trim()) return false;

        const normalizedInput = this.normalizeString(userInput);
        const name = feature.properties.long_name || 
                    feature.properties.short_name || 
                    feature.properties.name;
        const normalizedName = this.normalizeString(name);

        // Vérification exacte (après normalisation)
        if (normalizedInput === normalizedName) return true;

        // Tolérance orthographique avec distance de Levenshtein
        const maxDistance = Math.max(2, Math.floor(normalizedName.length * 0.15)); // 15% de tolérance
        const distance = this.levenshteinDistance(normalizedInput, normalizedName);

        return distance <= maxDistance;
    }

    /**
     * Trouve la meilleure correspondance avec tolérance orthographique
     */
    findBestMatchWithTolerance(normalizedInput) {
        let bestMatch = null;
        let bestDistance = Infinity;
        const maxDistance = Math.max(2, Math.floor(normalizedInput.length * 0.15));

        this.features.features.forEach(feature => {
            if (!feature.id || this.foundStationIds.has(feature.id)) return;
            
            const name = feature.properties.long_name || 
                        feature.properties.short_name || 
                        feature.properties.name;
            const normalizedName = this.normalizeString(name);
            const distance = this.levenshteinDistance(normalizedInput, normalizedName);

            if (distance <= maxDistance && distance < bestDistance) {
                bestDistance = distance;
                bestMatch = feature.id;
            }
        });

        return bestMatch;
    }

    /**
     * Démarre ou reprend le jeu
     */
    start() {
        // Vérifier que le jeu est chargé
        if (this.isLoading) {
            this.renderLoadingScreen();
            // Attendre que le chargement soit terminé
            const checkLoading = setInterval(() => {
                if (!this.isLoading) {
                    clearInterval(checkLoading);
                    this.start();
                }
            }, 100);
            return;
        }
        
        this.isActive = true;
        this.isPaused = false;
        this.render();
        // Initialiser la carte après le rendu
        // Attendre que le layout soit calculé pour avoir la bonne hauteur
        setTimeout(() => {
            this.initMap();
            // Forcer un resize de la carte après un court délai pour s'assurer qu'elle prend toute la hauteur
            if (this.map) {
                setTimeout(() => {
                    this.map.invalidateSize();
                }, 200);
            }
        }, 100);
    }

    /**
     * Affiche l'écran de chargement
     */
    renderLoadingScreen() {
        const container = this.getGameContainer();
        container.innerHTML = `
            <div class="loading-screen">
                <div class="loading-spinner"></div>
                <h2>Chargement du Challenge Métro...</h2>
                <p>Chargement des données de la carte (${this.loadingProgress}%)</p>
                <div class="loading-progress-bar">
                    <div class="loading-progress-fill" style="width: ${this.loadingProgress}%"></div>
                </div>
            </div>
        `;
    }

    /**
     * Initialise la carte Leaflet
     */
    initMap() {
        const mapContainer = document.getElementById('metro-map');
        if (!mapContainer) return;

        // Vérifier si Leaflet est disponible
        if (typeof L === 'undefined') {
            mapContainer.innerHTML = `
                <div style="padding: 2rem; text-align: center;">
                    <p>⚠️ Leaflet.js n'est pas chargé. Ajoutez cette ligne dans index.html :</p>
                    <code>&lt;link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" /&gt;</code><br>
                    <code>&lt;script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"&gt;&lt;/script&gt;</code>
            </div>
        `;
            return;
    }

        // Calculer les bounds depuis les features
        let bounds = null;
        if (this.features && this.features.features.length > 0) {
            const lats = [];
            const lngs = [];
            this.features.features.forEach(feature => {
                if (feature.geometry.type === 'Point') {
                    const [lng, lat] = feature.geometry.coordinates;
                    lats.push(lat);
                    lngs.push(lng);
                }
            });
            
            if (lats.length > 0) {
                bounds = [
                    [Math.min(...lats), Math.min(...lngs)],
                    [Math.max(...lats), Math.max(...lngs)]
                ];
            }
        }

        // Créer la carte
        this.map = L.map('metro-map', {
            zoomControl: true,
            attributionControl: true
        });

        // Ajouter une tuile de base (OpenStreetMap) en noir et blanc
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Appliquer un filtre noir et blanc sur la carte pour faire ressortir les lignes de métro
        const mapElement = document.getElementById('metro-map');
        if (mapElement) {
            // Attendre que Leaflet crée le conteneur
            setTimeout(() => {
                const leafletContainer = mapElement.querySelector('.leaflet-container');
                if (leafletContainer) {
                    leafletContainer.style.filter = 'grayscale(100%) contrast(1.2) brightness(0.9)';
            }
            }, 100);
    }

        // Ajuster la vue aux bounds
        if (bounds) {
            this.map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            // Fallback: centrer sur Paris
            this.map.setView([48.8566, 2.3522], 12);
        }

        // Ajouter les routes (lignes)
        if (this.routes && this.routes.features) {
            this.routes.features.forEach(route => {
                if (route.geometry.type === 'LineString') {
                    const coordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]); // [lat, lng]
                    const lineColor = route.properties.color || '#000000';
                    
                    const polyline = L.polyline(coordinates, {
                        color: lineColor,
                        weight: 3,
                        opacity: 0.7
                    }).addTo(this.map);
                    
                    this.routeLayers.push(polyline);
            }
        });
    }

        // Ajouter les stations
        if (this.features && this.features.features) {
            this.features.features.forEach(feature => {
                if (feature.geometry.type === 'Point' && feature.id) {
                    const [lng, lat] = feature.geometry.coordinates;
                    const stationId = feature.id;
                    const isFound = this.foundStationIds.has(stationId);
                    const line = feature.properties.line;
                    const lineConfig = this.lines[line] || { color: '#ffffff', backgroundColor: '#000000' };
                    
                    // Créer un marqueur pour la station
                    const marker = L.circleMarker([lat, lng], {
                        radius: isFound ? 6 : 4,
                        fillColor: isFound ? lineConfig.color : '#ffffff',
                        color: isFound ? lineConfig.backgroundColor : '#888888',
                        weight: isFound ? 2 : 1,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(this.map);

                    // Ajouter le label (caché si non trouvé)
                    if (isFound) {
                        const label = L.marker([lat, lng], {
                            icon: L.divIcon({
                                className: 'metro-station-label',
                                html: `<div style="
                                    background: rgba(255, 255, 255, 0.9);
                                    padding: 2px 6px;
                                    border-radius: 3px;
                                    font-size: 11px;
                                    font-weight: bold;
                                    color: ${lineConfig.backgroundColor};
                                    border: 1px solid ${lineConfig.color};
                                    white-space: nowrap;
                                    transform: translate(-50%, -100%);
                                    margin-top: -8px;
                                ">${feature.properties.name}</div>`,
                                iconSize: [100, 20],
                                iconAnchor: [50, 20]
                            })
                        }).addTo(this.map);
                        marker.label = label;
                    }

                    this.stationLayers.set(stationId, marker);
            }
        });
    }
    }

    /**
     * Recherche une station par son nom
     */
    searchStation(userInput) {
        if (!userInput || !userInput.trim()) {
            this.showFeedback('⚠️ Entrez un nom de station', 'error', 2000);
            return;
        }
        
        // Éviter les doubles appels
        const searchKey = userInput.trim().toLowerCase();
        if (this._processingSearch && this._processingSearch.has(searchKey)) {
            return;
        }
        
        // Initialiser le Set si nécessaire
        if (!this._processingSearch) {
            this._processingSearch = new Set();
        }
        this._processingSearch.add(searchKey);
        
        // Retirer du Set après un court délai
        setTimeout(() => {
            if (this._processingSearch) {
                this._processingSearch.delete(searchKey);
            }
        }, 1000);

        if (!this.fuse) {
            // Fallback sans Fuse.js
            this.searchStationFallback(userInput);
            return;
        }

        const sanitizedSearch = this.normalizeString(userInput);
        const results = this.fuse.search(sanitizedSearch);
        
        let someAlreadyFound = false;
        const matches = [];
        
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            if (
                result.matches &&
                result.matches.length &&
                result.matches.some(match => {
                    const indices = match.indices[0];
                    return indices[0] === 0 &&
                           match.value.length - indices[1] < 2 &&
                           Math.abs(match.value.length - sanitizedSearch.length) < 4;
                })
            ) {
                const stationId = +result.item.id;
                if (!this.foundStationIds.has(stationId)) {
                    matches.push(stationId);
                } else {
                    someAlreadyFound = true;
                }
            }
        }

        if (matches.length === 0 && !someAlreadyFound) {
            // Essayer avec tolérance orthographique (Levenshtein)
            const bestMatch = this.findBestMatchWithTolerance(sanitizedSearch);
            if (bestMatch) {
                const firstFeature = this.idMap.get(bestMatch);
                if (firstFeature) {
                    const stationIdentifier = firstFeature.properties.long_name || 
                                             firstFeature.properties.short_name || 
                                             firstFeature.properties.name;
                    const normalizedIdentifier = this.normalizeString(stationIdentifier);
                    const allMatchingIds = [];
                    
                    this.features.features.forEach(feature => {
                        if (feature.id && !this.foundStationIds.has(feature.id)) {
                            const featureIdentifier = feature.properties.long_name || 
                                                    feature.properties.short_name || 
                                                    feature.properties.name;
                            if (this.normalizeString(featureIdentifier) === normalizedIdentifier) {
                                allMatchingIds.push(feature.id);
                            }
                        }
                    });

                    if (allMatchingIds.length > 0) {
                        allMatchingIds.forEach(stationId => {
                            this.handleAnswer(stationId, userInput);
                        });

                        if (this.map && firstFeature.geometry.type === 'Point') {
                            const [lng, lat] = firstFeature.geometry.coordinates;
                            this.map.flyTo([lat, lng], 14, {
                                duration: 0.5
                            });
                        }
                        return;
                    }
                }
            }
            
            // Aucune correspondance trouvée, pénalité
            const errorCost = gameManager.getErrorCost();
            if (!gameManager.deductErrorPoints()) {
                this.showFeedback('❌ Station non trouvée. Essayez encore !', 'error', 2000);
            } else {
                this.showFeedback(`❌ Station non trouvée (-${errorCost} pts). Essayez encore !`, 'error', 2000);
            }
            return;
        }

        if (someAlreadyFound) {
            this.showFeedback('✅ Cette station est déjà trouvée !', 'success', 2000);
            return;
        }

        // Trouver toutes les stations avec le même nom (sur différentes lignes)
        // Utiliser long_name ou short_name pour identifier les stations uniques, pas juste name
        const firstFeature = this.idMap.get(matches[0]);
        if (firstFeature) {
            // Utiliser long_name en priorité, puis short_name, puis name
            const stationIdentifier = firstFeature.properties.long_name || 
                                     firstFeature.properties.short_name || 
                                     firstFeature.properties.name;
            const normalizedIdentifier = this.normalizeString(stationIdentifier);
            const allMatchingIds = [];
            
            this.features.features.forEach(feature => {
                if (feature.id && !this.foundStationIds.has(feature.id)) {
                    const featureIdentifier = feature.properties.long_name || 
                                            feature.properties.short_name || 
                                            feature.properties.name;
                    if (this.normalizeString(featureIdentifier) === normalizedIdentifier) {
                        allMatchingIds.push(feature.id);
                    }
                }
            });

            // Marquer toutes comme trouvées
            allMatchingIds.forEach(stationId => {
                this.handleAnswer(stationId, userInput);
            });

            // Zoomer sur la première station trouvée
            if (this.map && firstFeature.geometry.type === 'Point') {
                const [lng, lat] = firstFeature.geometry.coordinates;
                this.map.flyTo([lat, lng], 14, {
                    duration: 0.5
            });
        }
    }

        const searchInput = document.getElementById('metro-search-input');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    /**
     * Recherche fallback sans Fuse.js
     */
    searchStationFallback(userInput) {
        const normalizedInput = this.normalizeString(userInput);
        const matches = [];
        
        this.features.features.forEach(feature => {
            if (!feature.id || this.foundStationIds.has(feature.id)) return;
            
            if (this.checkAnswer(userInput, feature)) {
                matches.push(feature.id);
            }
        });

        if (matches.length === 0) {
            // Essayer avec tolérance orthographique (Levenshtein)
            const bestMatch = this.findBestMatchWithTolerance(normalizedInput);
            if (bestMatch) {
                const firstFeature = this.idMap.get(bestMatch);
                if (firstFeature) {
                    const stationIdentifier = firstFeature.properties.long_name || 
                                             firstFeature.properties.short_name || 
                                             firstFeature.properties.name;
                    const normalizedIdentifier = this.normalizeString(stationIdentifier);
                    const allMatchingIds = [];
                    
                    this.features.features.forEach(feature => {
                        if (feature.id && !this.foundStationIds.has(feature.id)) {
                            const featureIdentifier = feature.properties.long_name || 
                                                    feature.properties.short_name || 
                                                    feature.properties.name;
                            if (this.normalizeString(featureIdentifier) === normalizedIdentifier) {
                                allMatchingIds.push(feature.id);
                            }
                        }
                    });

                    if (allMatchingIds.length > 0) {
                        allMatchingIds.forEach(stationId => {
                            this.handleAnswer(stationId, userInput);
                        });

                        if (this.map && firstFeature.geometry.type === 'Point') {
                            const [lng, lat] = firstFeature.geometry.coordinates;
                            this.map.flyTo([lat, lng], 14, {
                                duration: 0.5
                            });
                        }
                        return;
                    }
                }
            }
            
            // Aucune correspondance trouvée, pénalité
            const errorCost = gameManager.getErrorCost();
            if (!gameManager.deductErrorPoints()) {
                this.showFeedback('❌ Station non trouvée. Essayez encore !', 'error', 2000);
            } else {
                this.showFeedback(`❌ Station non trouvée (-${errorCost} pts). Essayez encore !`, 'error', 2000);
            }
            return;
        }

        // Trouver toutes les stations avec le même nom
        // Utiliser long_name ou short_name pour identifier les stations uniques
        const firstFeature = this.idMap.get(matches[0]);
        if (firstFeature) {
            const stationIdentifier = firstFeature.properties.long_name || 
                                     firstFeature.properties.short_name || 
                                     firstFeature.properties.name;
            const normalizedIdentifier = this.normalizeString(stationIdentifier);
            const allMatchingIds = matches.filter(id => {
                const feature = this.idMap.get(id);
                if (!feature) return false;
                const featureIdentifier = feature.properties.long_name || 
                                         feature.properties.short_name || 
                                         feature.properties.name;
                return this.normalizeString(featureIdentifier) === normalizedIdentifier;
            });
            
            allMatchingIds.forEach(stationId => {
                this.handleAnswer(stationId, userInput);
            });
        }

        const searchInput = document.getElementById('metro-search-input');
        if (searchInput) {
            searchInput.value = '';
        }
    }

    /**
     * Gère la soumission d'une réponse pour une station
     */
    handleAnswer(stationId, userInput) {
        const feature = this.idMap.get(stationId);
        if (!feature) return;

        if (this.foundStationIds.has(stationId)) return;
        
        // Éviter les doubles appels - vérifier si on est déjà en train de traiter cette réponse
        const answerKey = `${stationId}_${userInput.trim()}`;
        if (this._processingAnswers && this._processingAnswers.has(answerKey)) {
            return;
        }
        
        // Initialiser le Set si nécessaire
        if (!this._processingAnswers) {
            this._processingAnswers = new Set();
        }
        this._processingAnswers.add(answerKey);

        this.userAnswers[stationId] = userInput;
        this.foundStationIds.add(stationId);
        
        gameManager.addPoints(GameManager.CORRECT_ANSWER_POINTS);
        this.saveState();
        
        // Mettre à jour visuellement la carte
        this.revealStation(stationId);
        
        // Mettre à jour la progression
        this.updateProgress();
        
        const totalFound = this.foundStationIds.size;
        const totalStations = this.getUniqueStationCount();
        
        if (totalFound === totalStations) {
            this.showFeedback('🎉 Félicitations ! Vous avez trouvé toutes les stations !', 'success', 5000);
        } else {
            this.showFeedback(`✅ ${feature.properties.name} trouvée ! +${GameManager.CORRECT_ANSWER_POINTS} points`, 'success', 2000);
        }
        
        // Retirer du Set après un court délai pour permettre les nouvelles tentatives
        setTimeout(() => {
            if (this._processingAnswers) {
                this._processingAnswers.delete(answerKey);
            }
        }, 500);
    }

    /**
     * Révèle une station sur la carte
     */
    revealStation(stationId) {
        const marker = this.stationLayers.get(stationId);
        if (!marker) return;

        const feature = this.idMap.get(stationId);
        if (!feature) return;

        const line = feature.properties.line;
        const lineConfig = this.lines[line] || { color: '#ffffff', backgroundColor: '#000000' };
        
        // Mettre à jour le marqueur
        marker.setStyle({
            radius: 6,
            fillColor: lineConfig.color,
            color: lineConfig.backgroundColor,
            weight: 2,
            fillOpacity: 0.8
        });

        // Ajouter le label
        if (!marker.label && feature.geometry.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            const label = L.marker([lat, lng], {
                icon: L.divIcon({
                    className: 'metro-station-label',
                    html: `<div style="
                        background: rgba(255, 255, 255, 0.9);
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-size: 11px;
                        font-weight: bold;
                        color: ${lineConfig.backgroundColor};
                        border: 1px solid ${lineConfig.color};
                        white-space: nowrap;
                        transform: translate(-50%, -100%);
                        margin-top: -8px;
                    ">${feature.properties.name}</div>`,
                    iconSize: [100, 20],
                    iconAnchor: [50, 20]
                })
            }).addTo(this.map);
            marker.label = label;
        }
    }

    /**
     * Retourne le nombre de stations uniques (par long_name/short_name, pas par ligne)
     */
    getUniqueStationCount() {
        const uniqueIdentifiers = new Set();
        this.features.features.forEach(feature => {
            const identifier = feature.properties.long_name || 
                              feature.properties.short_name || 
                              feature.properties.name;
            if (identifier) {
                uniqueIdentifiers.add(this.normalizeString(identifier));
            }
        });
        return uniqueIdentifiers.size;
    }

    /**
     * Met à jour la progression
     */
    updateProgress() {
        if (!this.features) return;

        const totalStations = this.getUniqueStationCount();
        const stats = this.foundStationIds.size;
        const percentage = Math.round((stats / totalStations) * 100);

        // Mettre à jour le header
        const header = document.querySelector('.game-header p');
        if (header) {
            header.textContent = `Progression: ${stats}/${totalStations} (${percentage}%)`;
        }

        // Mettre à jour les barres de progression des lignes
        Object.keys(this.lines).forEach(lineId => {
            const lineStations = this.features.features.filter(f => f.properties.line === lineId);
            const uniqueLineStations = new Set();
            lineStations.forEach(s => {
                const identifier = s.properties.long_name || 
                                 s.properties.short_name || 
                                 s.properties.name;
                if (identifier) {
                    uniqueLineStations.add(this.normalizeString(identifier));
                }
            });
            
            const foundCount = Array.from(uniqueLineStations).filter(identifier => {
                return this.features.features.some(s => {
                    const sIdentifier = s.properties.long_name || 
                                      s.properties.short_name || 
                                      s.properties.name;
                    return sIdentifier &&
                           this.normalizeString(sIdentifier) === identifier && 
                           this.foundStationIds.has(s.id);
                });
            }).length;
            
            const linePercentage = uniqueLineStations.size > 0 
                ? Math.round((foundCount / uniqueLineStations.size) * 100) 
                : 0;
            
            const lineSummary = document.querySelector(`.line-summary[data-line="${lineId}"]`);
            if (lineSummary) {
                const progress = lineSummary.querySelector('.line-progress-small');
                const progressFill = lineSummary.querySelector('.progress-fill');
                if (progress) {
                    progress.textContent = `${foundCount}/${uniqueLineStations.size}`;
                }
                if (progressFill) {
                    progressFill.style.width = `${linePercentage}%`;
                }
            }
        });
    }

    /**
     * Rend l'interface du jeu
     */
    render() {
        const container = this.getGameContainer();
        const totalStations = this.features ? this.getUniqueStationCount() : 0;
        const stats = this.foundStationIds.size;
        const percentage = totalStations > 0 ? Math.round((stats / totalStations) * 100) : 0;

        container.innerHTML = `
            <div class="game-header">
                <h2>${this.name}</h2>
                <p>Progression: ${stats}/${totalStations} (${percentage}%)</p>
            </div>

            <div class="metro-game-layout">
                <div class="metro-map-section">
                    <div id="metro-map" class="metro-map-container" style="width: 100%; flex: 1; min-height: 0;"></div>
                    <p class="map-instructions" style="flex-shrink: 0; margin-top: 0.5rem; margin-bottom: 0;">
                        💡 Tapez le nom d'une station dans le champ de recherche
                    </p>
                </div>

                <div class="metro-search-section">
                    <div class="search-box">
                        <input 
                            type="text" 
                            id="metro-search-input"
                            class="metro-search-input"
                            placeholder="Tapez le nom d'une station..."
                            autocomplete="off"
                        />
                        <button class="btn-search" id="btn-search-metro">🔍</button>
                        <button class="btn-hint-metro" id="btn-hint-metro" title="Obtenir un indice (-25 pts)">💡</button>
                    </div>
                    <div class="metro-lines-summary">
                        ${Object.keys(this.lines).map(lineId => {
                            const line = this.lines[lineId];
                            const lineStations = this.features ? 
                                this.features.features.filter(f => f.properties.line === lineId) : [];
                            const uniqueLineStations = new Set();
                            lineStations.forEach(s => {
                                const identifier = s.properties.long_name || 
                                                 s.properties.short_name || 
                                                 s.properties.name;
                                if (identifier) {
                                    uniqueLineStations.add(this.normalizeString(identifier));
                                }
                            });
                            
                            const foundCount = this.features ? 
                                Array.from(uniqueLineStations).filter(identifier => {
                                    return this.features.features.some(s => {
                                        const sIdentifier = s.properties.long_name || 
                                                          s.properties.short_name || 
                                                          s.properties.name;
                                        return sIdentifier &&
                                               this.normalizeString(sIdentifier) === identifier && 
                                               this.foundStationIds.has(s.id);
                                    });
                                }).length : 0;
                            
                            const linePercentage = uniqueLineStations.size > 0 
                                ? Math.round((foundCount / uniqueLineStations.size) * 100) 
                                : 0;
                            
                            return `
                                <div class="line-summary" data-line="${lineId}" style="border-left: 4px solid ${line.color}">
                                    <span class="line-number">${line.name}</span>
                                    <span class="line-progress-small">${foundCount}/${uniqueLineStations.size}</span>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${linePercentage}%; background: ${line.color}"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>

            <div class="game-stats">
                <p>Score actuel: ${gameManager.getGlobalScore()} pts</p>
            </div>
        `;

        this.attachEventListeners();
    }

    /**
     * Attache les event listeners
     */
    attachEventListeners() {
        const searchInput = document.getElementById('metro-search-input');
        const searchButton = document.getElementById('btn-search-metro');
        const hintButton = document.getElementById('btn-hint-metro');
        
        if (searchInput) {
            // Recherche avec Enter
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.searchStation(searchInput.value);
                }
            });
        }

        if (searchButton) {
            // Protection contre les doubles clics
            let isProcessing = false;
            searchButton.addEventListener('click', () => {
                if (isProcessing) return;
                isProcessing = true;
                const value = searchInput?.value || '';
                this.searchStation(value);
                setTimeout(() => {
                    isProcessing = false;
                }, 1000);
            });
        }

        if (hintButton) {
            hintButton.addEventListener('click', () => {
                this.showHintDialog();
            });
        }
    }

    /**
     * Affiche une boîte de dialogue pour obtenir un indice (choisit une station au hasard)
     */
    showHintDialog() {
        if (!this.features) return;

        // Trouver toutes les stations non trouvées
        const unfoundStations = this.features.features.filter(f => 
            f.id && !this.foundStationIds.has(f.id)
        );
        
        if (unfoundStations.length === 0) {
            this.showFeedback('🎉 Toutes les stations sont déjà trouvées !', 'success', 2000);
            return;
        }

        // Créer une liste de stations uniques (par long_name/short_name, pas par code)
        const uniqueStations = [];
        const seenIdentifiers = new Set();
        unfoundStations.forEach(feature => {
            const identifier = feature.properties.long_name || 
                              feature.properties.short_name || 
                              feature.properties.name;
            const normalizedIdentifier = this.normalizeString(identifier);
            if (!seenIdentifiers.has(normalizedIdentifier)) {
                seenIdentifiers.add(normalizedIdentifier);
                uniqueStations.push(feature);
            }
        });

        // Choisir une station au hasard
        const randomIndex = Math.floor(Math.random() * uniqueStations.length);
        const selectedFeature = uniqueStations[randomIndex];

        if (selectedFeature && selectedFeature.id) {
            this.useHint(selectedFeature.id);
        }
    }

    /**
     * Utilise un indice pour révéler la première et dernière lettre d'une station
     */
    useHint(stationId) {
        const feature = this.idMap.get(stationId);
        if (!feature || this.foundStationIds.has(stationId)) {
            return;
        }

        const hintCost = gameManager.getHintCost();
        if (!gameManager.spendPoints(hintCost)) {
            this.showFeedback(`❌ Pas assez de points pour utiliser un indice ! (Coût: ${hintCost} pts)`, 'error', 2000);
            return;
        }

        const name = feature.properties.long_name || 
                    feature.properties.short_name || 
                    feature.properties.name;
        
        // Initialiser les indices pour cette station si nécessaire
        if (!this.hintsRevealed[stationId]) {
            this.hintsRevealed[stationId] = {
                firstLetter: false,
                lastLetter: false
            };
        }

        // Révéler la première et dernière lettre
        this.hintsRevealed[stationId].firstLetter = true;
        this.hintsRevealed[stationId].lastLetter = true;

        // Appliquer les indices à toutes les stations avec le même nom (sur différentes lignes)
        const identifier = feature.properties.long_name || 
                          feature.properties.short_name || 
                          feature.properties.name;
        const normalizedIdentifier = this.normalizeString(identifier);
        
        this.features.features.forEach(f => {
            if (f.id && !this.foundStationIds.has(f.id)) {
                const fIdentifier = f.properties.long_name || 
                                  f.properties.short_name || 
                                  f.properties.name;
                if (this.normalizeString(fIdentifier) === normalizedIdentifier) {
                    if (!this.hintsRevealed[f.id]) {
                        this.hintsRevealed[f.id] = {
                            firstLetter: false,
                            lastLetter: false
                        };
                    }
                    this.hintsRevealed[f.id].firstLetter = true;
                    this.hintsRevealed[f.id].lastLetter = true;
                }
            }
        });

        this.saveState();

        // Afficher l'indice
        const firstLetter = name.trim()[0].toUpperCase();
        const lastLetter = name.trim()[name.trim().length - 1].toUpperCase();
        this.showFeedback(`💡 Indice: ${firstLetter}...${lastLetter} (-${hintCost} pts)`, 'success', 3000);
        
        // Mettre à jour le placeholder dans le champ de recherche
        const searchInput = document.getElementById('metro-search-input');
        if (searchInput) {
            const hintText = this.getHintPlaceholder(feature);
            searchInput.placeholder = hintText || 'Tapez le nom d\'une station...';
        }
    }

    /**
     * Génère le placeholder avec les lettres révélées
     */
    getHintPlaceholder(feature) {
        const name = feature.properties.long_name || 
                    feature.properties.short_name || 
                    feature.properties.name;
        const trimmedName = name.trim();
        
        // Chercher les indices pour cette station ou une station avec le même nom
        let hints = this.hintsRevealed[feature.id];
        if (!hints) {
            const identifier = feature.properties.long_name || 
                              feature.properties.short_name || 
                              feature.properties.name;
            const normalizedIdentifier = this.normalizeString(identifier);
            
            // Chercher une station avec le même nom qui a des indices
            for (const [id, hintData] of Object.entries(this.hintsRevealed)) {
                const f = this.idMap.get(parseInt(id));
                if (f) {
                    const fIdentifier = f.properties.long_name || 
                                      f.properties.short_name || 
                                      f.properties.name;
                    if (this.normalizeString(fIdentifier) === normalizedIdentifier) {
                        hints = hintData;
                        break;
                    }
                }
            }
        }
        
        if (!hints || (!hints.firstLetter && !hints.lastLetter)) {
            return null;
        }

        let placeholder = '';
        for (let i = 0; i < trimmedName.length; i++) {
            if (i === 0 && hints.firstLetter) {
                placeholder += trimmedName[i].toUpperCase();
            } else if (i === trimmedName.length - 1 && hints.lastLetter) {
                placeholder += trimmedName[i].toUpperCase();
            } else if (trimmedName[i] === ' ') {
                placeholder += ' ';
            } else {
                placeholder += '_';
            }
        }

        return placeholder;
    }

    /**
     * Sauvegarde l'état du jeu
     */
    saveState() {
        const state = {
            foundStationIds: Array.from(this.foundStationIds),
            userAnswers: this.userAnswers,
            hintsRevealed: this.hintsRevealed
        };
        StorageManager.saveGameState(this.gameId, state);
    }

    /**
     * Charge l'état sauvegardé du jeu
     */
    loadState() {
        const state = StorageManager.loadGameState(this.gameId);
        if (state) {
            this.foundStationIds = new Set(state.foundStationIds || []);
            this.userAnswers = state.userAnswers || {};
            this.hintsRevealed = state.hintsRevealed || {};
        }
    }

    /**
     * Retourne la progression du jeu
     * @returns {Object} { found: number, total: number, percentage: number }
     */
    getProgress() {
        const found = this.foundStationIds.size;
        const total = this.features ? this.getUniqueStationCount() : 0;
        const percentage = total > 0 ? Math.round((found / total) * 100) : 0;
        return { found, total, percentage };
    }

    /**
     * Réinitialise le jeu
     */
    reset() {
        super.reset();
        this.foundStationIds = new Set();
        this.userAnswers = {};
        this.hintsRevealed = {};
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
}
