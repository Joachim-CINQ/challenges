/**
 * Données des personnalités pour le Challenge People
 * Basé sur People.json
 */
const PEOPLE_DATA = [
  { id: 1, name: "Marilyn Monroe", category: "Cinema" },
  { id: 2, name: "Charlie Chaplin", category: "Cinema" },
  { id: 3, name: "Brad Pitt", category: "Cinema" },
  { id: 4, name: "Leonardo DiCaprio", category: "Cinema" },
  { id: 5, name: "Angelina Jolie", category: "Cinema" },
  { id: 6, name: "Will Smith", category: "Cinema" },
  { id: 7, name: "Tom Cruise", category: "Cinema" },
  { id: 8, name: "Dwayne Johnson", category: "Cinema" },
  { id: 9, name: "Jackie Chan", category: "Cinema" },
  { id: 10, name: "Johnny Depp", category: "Cinema" },
  { id: 11, name: "Emma Watson", category: "Cinema" },
  { id: 12, name: "Morgan Freeman", category: "Cinema" },
  { id: 13, name: "Robert De Niro", category: "Cinema" },
  { id: 14, name: "Meryl Streep", category: "Cinema" },
  { id: 15, name: "Scarlett Johansson", category: "Cinema" },
  { id: 16, name: "Audrey Hepburn", category: "Cinema" },
  { id: 17, name: "Bruce Lee", category: "Cinema" },
  { id: 18, name: "Arnold Schwarzenegger", category: "Cinema" },
  { id: 19, name: "Sylvester Stallone", category: "Cinema" },
  { id: 20, name: "Zendaya", category: "Cinema" },
  { id: 21, name: "Keanu Reeves", category: "Cinema" },
  { id: 22, name: "Quentin Tarantino", category: "Cinema" },
  { id: 23, name: "Steven Spielberg", category: "Cinema" },
  { id: 24, name: "Omar Sy", category: "Cinema" },
  { id: 25, name: "Jenna Ortega", category: "Cinema" },
  { id: 26, name: "Michael Jackson", category: "Music" },
  { id: 27, name: "Elvis Presley", category: "Music" },
  { id: 28, name: "Madonna", category: "Music" },
  { id: 29, name: "Beyoncé", category: "Music" },
  { id: 30, name: "Taylor Swift", category: "Music" },
  { id: 31, name: "Eminem", category: "Music" },
  { id: 32, name: "Rihanna", category: "Music" },
  { id: 33, name: "Bob Marley", category: "Music" },
  { id: 34, name: "Freddie Mercury", category: "Music" },
  { id: 35, name: "Lady Gaga", category: "Music" },
  { id: 36, name: "John Lennon", category: "Music" },
  { id: 37, name: "Shakira", category: "Music" },
  { id: 38, name: "Adele", category: "Music" },
  { id: 39, name: "Snoop Dogg", category: "Music" },
  { id: 40, name: "David Bowie", category: "Music" },
  { id: 41, name: "Edith Piaf", category: "Music" },
  { id: 42, name: "Britney Spears", category: "Music" },
  { id: 43, name: "Justin Bieber", category: "Music" },
  { id: 44, name: "Kanye West", category: "Music" },
  { id: 45, name: "Daft Punk", category: "Music" },
  { id: 46, name: "Kurt Cobain", category: "Music" },
  { id: 47, name: "Elton John", category: "Music" },
  { id: 48, name: "Stromae", category: "Music" },
  { id: 49, name: "Céline Dion", category: "Music" },
  { id: 50, name: "Tupac Shakur", category: "Music" },
  { id: 51, name: "Napoleon", category: "History" },
  { id: 52, name: "Julius Caesar", category: "History" },
  { id: 53, name: "Cleopatra", category: "History" },
  { id: 54, name: "Queen Elizabeth II", category: "History" },
  { id: 55, name: "Barack Obama", category: "History" },
  { id: 56, name: "Donald Trump", category: "History" },
  { id: 57, name: "Nelson Mandela", category: "History" },
  { id: 58, name: "Mahatma Gandhi", category: "History" },
  { id: 59, name: "Martin Luther King Jr.", category: "History" },
  { id: 60, name: "John F. Kennedy", category: "History" },
  { id: 61, name: "Winston Churchill", category: "History" },
  { id: 62, name: "Abraham Lincoln", category: "History" },
  { id: 63, name: "Che Guevara", category: "History" },
  { id: 64, name: "Vladimir Putin", category: "History" },
  { id: 65, name: "Emmanuel Macron", category: "History" },
  { id: 66, name: "Mao Zedong", category: "History" },
  { id: 67, name: "Princess Diana", category: "History" },
  { id: 68, name: "Dalai Lama", category: "History" },
  { id: 69, name: "Louis XIV", category: "History" },
  { id: 70, name: "Joan of Arc", category: "History" },
  { id: 71, name: "Malcolm X", category: "History" },
  { id: 72, name: "Mother Teresa", category: "History" },
  { id: 73, name: "Charles de Gaulle", category: "History" },
  { id: 74, name: "Adolf Hitler", category: "History" },
  { id: 75, name: "Joe Biden", category: "History" },
  { id: 76, name: "Albert Einstein", category: "Science" },
  { id: 77, name: "Marie Curie", category: "Science" },
  { id: 78, name: "Isaac Newton", category: "Science" },
  { id: 79, name: "Charles Darwin", category: "Science" },
  { id: 80, name: "Nikola Tesla", category: "Science" },
  { id: 81, name: "Elon Musk", category: "Business" },
  { id: 82, name: "Steve Jobs", category: "Business" },
  { id: 83, name: "Bill Gates", category: "Business" },
  { id: 84, name: "Mark Zuckerberg", category: "Business" },
  { id: 85, name: "Stephen Hawking", category: "Science" },
  { id: 86, name: "Neil Armstrong", category: "Science" },
  { id: 87, name: "Sigmund Freud", category: "Science" },
  { id: 88, name: "Thomas Edison", category: "Science" },
  { id: 89, name: "Jeff Bezos", category: "Business" },
  { id: 90, name: "Galileo Galilei", category: "Science" },
  { id: 91, name: "Thomas Pesquet", category: "Science" },
  { id: 92, name: "Henry Ford", category: "Business" },
  { id: 93, name: "Pythagoras", category: "Science" },
  { id: 94, name: "Gustave Eiffel", category: "Science" },
  { id: 95, name: "Tim Cook", category: "Business" },
  { id: 96, name: "Michael Jordan", category: "Sport" },
  { id: 97, name: "Lionel Messi", category: "Sport" },
  { id: 98, name: "Cristiano Ronaldo", category: "Sport" },
  { id: 99, name: "Pelé", category: "Sport" },
  { id: 100, name: "Diego Maradona", category: "Sport" },
  { id: 101, name: "Zinedine Zidane", category: "Sport" },
  { id: 102, name: "Usain Bolt", category: "Sport" },
  { id: 103, name: "Serena Williams", category: "Sport" },
  { id: 104, name: "Muhammad Ali", category: "Sport" },
  { id: 105, name: "Tiger Woods", category: "Sport" },
  { id: 106, name: "Roger Federer", category: "Sport" },
  { id: 107, name: "Mike Tyson", category: "Sport" },
  { id: 108, name: "LeBron James", category: "Sport" },
  { id: 109, name: "Kylian Mbappé", category: "Sport" },
  { id: 110, name: "Lewis Hamilton", category: "Sport" },
  { id: 111, name: "Pablo Picasso", category: "Art" },
  { id: 112, name: "Vincent van Gogh", category: "Art" },
  { id: 113, name: "Leonardo da Vinci", category: "Art" },
  { id: 114, name: "Frida Kahlo", category: "Art" },
  { id: 115, name: "William Shakespeare", category: "Art" },
  { id: 116, name: "Victor Hugo", category: "Art" },
  { id: 117, name: "J.K. Rowling", category: "Art" },
  { id: 118, name: "Salvador Dalí", category: "Art" },
  { id: 119, name: "Andy Warhol", category: "Art" },
  { id: 120, name: "Molière", category: "Art" },
  { id: 121, name: "Harry Potter", category: "Fiction" },
  { id: 122, name: "Darth Vader", category: "Fiction" },
  { id: 123, name: "Mickey Mouse", category: "Fiction" },
  { id: 124, name: "Superman", category: "Fiction" },
  { id: 125, name: "Batman", category: "Fiction" },
  { id: 126, name: "Spider-Man", category: "Fiction" },
  { id: 127, name: "Wonder Woman", category: "Fiction" },
  { id: 128, name: "Mario (Nintendo)", category: "Fiction" },
  { id: 129, name: "Pikachu", category: "Fiction" },
  { id: 130, name: "Sherlock Holmes", category: "Fiction" },
  { id: 131, name: "James Bond", category: "Fiction" },
  { id: 132, name: "The Joker", category: "Fiction" },
  { id: 133, name: "Homer Simpson", category: "Fiction" },
  { id: 134, name: "Shrek", category: "Fiction" },
  { id: 135, name: "Gandalf", category: "Fiction" },
  { id: 136, name: "Jon Snow", category: "Fiction" },
  { id: 137, name: "Luke Skywalker", category: "Fiction" },
  { id: 138, name: "Barbie", category: "Fiction" },
  { id: 139, name: "Forrest Gump", category: "Fiction" },
  { id: 140, name: "Jack Sparrow", category: "Fiction" },
  { id: 141, name: "Iron Man", category: "Fiction" },
  { id: 142, name: "Captain America", category: "Fiction" },
  { id: 143, name: "Elsa (Disney)", category: "Fiction" },
  { id: 144, name: "SpongeBob SquarePants", category: "Fiction" },
  { id: 145, name: "Count Dracula", category: "Fiction" },
  { id: 146, name: "Tarzan", category: "Fiction" },
  { id: 147, name: "Zorro", category: "Fiction" },
  { id: 148, name: "Santa Claus", category: "Fiction" },
  { id: 149, name: "Gollum", category: "Fiction" },
  { id: 150, name: "Asterix", category: "Fiction" }
];

/**
 * Génère l'URL de l'image Wikipédia pour une personnalité
 * Utilise l'API MediaWiki pour récupérer l'image principale
 * @param {string} name - Nom de la personnalité
 * @returns {string} URL de l'image ou placeholder
 */
function getWikiImageUrl(name) {
    // Pour l'instant, on utilise un placeholder
    // En production, on pourrait utiliser l'API MediaWiki ou pré-charger les images
    // Format: https://en.wikipedia.org/wiki/File:ImageName.jpg
    // On encode le nom pour l'URL
    const encodedName = encodeURIComponent(name.replace(/\s+/g, '_'));
    // Utiliser l'API MediaWiki via un proxy CORS ou pré-charger les images
    // Pour l'instant, on retourne un placeholder qui sera remplacé par l'API
    return `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
}

/**
 * Récupère l'URL de l'image depuis l'API Wikipédia
 * @param {string} name - Nom de la personnalité
 * @returns {Promise<string>} URL de l'image
 */
async function fetchWikiImage(name) {
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
    
    // Fallback: utiliser un placeholder
    return null;
}

