import json
import requests
import time

def get_wiki_image(name, lang="en"):
    """
    Récupère l'URL de l'image principale (thumbnail) d'une page Wikipédia.
    Utilise l'anglais par défaut car il y a plus d'images, mais on peut passer en 'fr'.
    """
    url = f"https://{lang}.wikipedia.org/w/api.php"
    
    # Paramètres de l'API MediaWiki pour récupérer l'image principale (pageimages)
    params = {
        "action": "query",
        "titles": name,
        "prop": "pageimages",
        "format": "json",
        "pithumbsize": 500  # Taille de l'image (500px de large max)
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()
        
        # L'API renvoie un dictionnaire avec l'ID de la page comme clé (ex: "12345")
        pages = data.get("query", {}).get("pages", {})
        
        for page_id, page_data in pages.items():
            if page_id == "-1": # Page non trouvée
                return None
            
            # Si une miniature (thumbnail) existe
            if "thumbnail" in page_data:
                return page_data["thumbnail"]["source"]
                
    except Exception as e:
        print(f"Erreur pour {name}: {e}")
        return None

    return None

def main():
    # 1. Lire le fichier JSON d'origine
    print("Lecture du fichier data.json...")
    with open("data.json", "r", encoding="utf-8") as f:
        personalities = json.load(f)

    print(f"{len(personalities)} personnalités à traiter.")
    print("-" * 40)

    # 2. Boucler sur chaque personne pour trouver l'image
    for person in personalities:
        name_query = person["name"]
        
        # Petite astuce : pour les personnages de fiction, parfois il faut préciser
        # Ex: "Mario" peut être ambigu, "Mario (Nintendo)" est mieux.
        # J'ai déjà ajusté les noms dans le JSON pour aider Wikipédia.
        
        print(f"Recherche pour : {name_query}...", end=" ")
        
        image_url = get_wiki_image(name_query)
        
        if image_url:
            person["image"] = image_url
            print("✅ Trouvé !")
        else:
            person["image"] = None
            print("❌ Pas d'image")
            
        # Pause courte pour être gentil avec l'API Wikipédia (éviter le ban IP)
        time.sleep(0.1)

    # 3. Sauvegarder le résultat dans un nouveau fichier
    print("-" * 40)
    with open("data_with_images.json", "w", encoding="utf-8") as f:
        json.dump(personalities, f, indent=2, ensure_ascii=False)
    
    print("Terminé ! Le fichier 'data_with_images.json' a été créé.")

if __name__ == "__main__":
    main()