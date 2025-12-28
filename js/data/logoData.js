/**
 * Données des logos pour le Challenge Logos
 * Liste de logos d'entreprises, marques et organisations populaires
 */
const LOGO_DATA = [
    // Technologie
    { id: 1, name: 'Apple', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/apple/000000', altNames: ['Apple Inc', 'iPhone', 'Mac'] },
    { id: 2, name: 'Google', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/google/4285F4', altNames: ['Alphabet'] },
    { id: 3, name: 'Microsoft', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/microsoft/00A4EF', altNames: ['Windows', 'Office'] },
    { id: 4, name: 'Amazon', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/amazon/FF9900', altNames: ['Amazon.com'] },
    { id: 5, name: 'Facebook', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/facebook/1877F2', altNames: ['Meta'] },
    { id: 6, name: 'Twitter', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/twitter/1DA1F2', altNames: ['X'] },
    { id: 7, name: 'Instagram', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/instagram/E4405F', altNames: [] },
    { id: 8, name: 'YouTube', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/youtube/FF0000', altNames: ['Youtube'] },
    { id: 9, name: 'Netflix', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/netflix/E50914', altNames: [] },
    { id: 10, name: 'Spotify', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/spotify/1DB954', altNames: [] },
    { id: 11, name: 'Adobe', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/adobe/FF0000', altNames: ['Photoshop', 'Illustrator'] },
    { id: 12, name: 'Samsung', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/samsung/1428A0', altNames: [] },
    { id: 13, name: 'Sony', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/sony/000000', altNames: ['PlayStation'] },
    { id: 14, name: 'Nintendo', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/nintendo/E60012', altNames: ['Switch', 'Wii'] },
    { id: 15, name: 'Tesla', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/tesla/CC0000', altNames: [] },
    { id: 16, name: 'Intel', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/intel/0071C5', altNames: [] },
    { id: 17, name: 'Nvidia', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/nvidia/76B900', altNames: [] },
    { id: 18, name: 'IBM', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/ibm/006699', altNames: [] },
    { id: 19, name: 'Oracle', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/oracle/F80000', altNames: [] },
    { id: 20, name: 'Cisco', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/cisco/1BA0D7', altNames: [] },
    
    // Automobile
    { id: 21, name: 'BMW', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/bmw/0066CC', altNames: [] },
    { id: 22, name: 'Mercedes-Benz', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/mercedes/00ADEF', altNames: ['Mercedes', 'Benz'] },
    { id: 23, name: 'Audi', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/audi/BB0A30', altNames: [] },
    { id: 24, name: 'Volkswagen', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/volkswagen/151B54', altNames: ['VW'] },
    { id: 25, name: 'Toyota', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/toyota/EB0A1E', altNames: [] },
    { id: 26, name: 'Honda', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/honda/E40521', altNames: [] },
    { id: 27, name: 'Ford', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/ford/00274C', altNames: [] },
    { id: 28, name: 'Ferrari', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/ferrari/DC143C', altNames: [] },
    { id: 29, name: 'Porsche', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/porsche/B12B28', altNames: [] },
    { id: 30, name: 'Lamborghini', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/lamborghini/FFB800', altNames: [] },
    
    // Alimentation & Boissons
    { id: 31, name: 'McDonald\'s', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/mcdonalds/FBC817', altNames: ['McDo', 'McDonalds'] },
    { id: 32, name: 'Starbucks', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/starbucks/00704A', altNames: [] },
    { id: 33, name: 'Coca-Cola', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/cocacola/F40009', altNames: ['Coca Cola', 'Coke'] },
    { id: 34, name: 'Pepsi', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/pepsi/004B93', altNames: [] },
    { id: 35, name: 'Red Bull', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/redbull/EE0000', altNames: [] },
    { id: 36, name: 'Heineken', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/heineken/00A100', altNames: [] },
    { id: 37, name: 'KFC', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/kfc/E4002B', altNames: ['Kentucky Fried Chicken'] },
    { id: 38, name: 'Burger King', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/burgerking/EC1C24', altNames: [] },
    { id: 39, name: 'Pizza Hut', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/pizzahut/EE3124', altNames: [] },
    { id: 40, name: 'Domino\'s', category: 'Alimentation', logoUrl: 'https://cdn.simpleicons.org/dominos/0B648F', altNames: ['Dominos'] },
    
    // Mode & Luxe
    { id: 41, name: 'Nike', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/nike/111111', altNames: [] },
    { id: 42, name: 'Adidas', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/adidas/000000', altNames: [] },
    { id: 43, name: 'Gucci', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/gucci/1C1C1C', altNames: [] },
    { id: 44, name: 'Louis Vuitton', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/louisvuitton/0F4C92', altNames: ['LV'] },
    { id: 45, name: 'Chanel', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/chanel/000000', altNames: [] },
    { id: 46, name: 'Puma', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/puma/000000', altNames: [] },
    { id: 47, name: 'Zara', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/zara/000000', altNames: [] },
    { id: 48, name: 'H&M', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/hm/ED1B24', altNames: ['H and M', 'Hennes & Mauritz'] },
    { id: 49, name: 'Uniqlo', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/uniqlo/000000', altNames: [] },
    { id: 50, name: 'Hermès', category: 'Mode', logoUrl: 'https://cdn.simpleicons.org/hermes/000000', altNames: ['Hermes'] },
    
    // Médias & Divertissement
    { id: 51, name: 'Disney', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/disney/113CCF', altNames: ['Walt Disney'] },
    { id: 52, name: 'Marvel', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/marvel/ED1D24', altNames: [] },
    { id: 53, name: 'DC Comics', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/dccomics/0078F0', altNames: ['DC'] },
    { id: 54, name: 'Warner Bros', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/warnerbros/004DB4', altNames: ['Warner Brothers'] },
    { id: 55, name: 'Universal', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/universal/000000', altNames: ['Universal Studios'] },
    { id: 56, name: 'Paramount', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/paramount/0066FF', altNames: [] },
    { id: 57, name: 'Sony Pictures', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/sony/000000', altNames: ['Sony Pictures'] },
    { id: 58, name: '20th Century Fox', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/20thcenturystudios/CF142B', altNames: ['20th Century', 'Fox'] },
    { id: 59, name: 'HBO', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/hbo/000000', altNames: ['Home Box Office'] },
    { id: 60, name: 'CNN', category: 'Médias', logoUrl: 'https://cdn.simpleicons.org/cnn/CC0000', altNames: ['Cable News Network'] },
    
    // Finance & Banque
    { id: 61, name: 'Visa', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/visa/1A1F71', altNames: [] },
    { id: 62, name: 'Mastercard', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/mastercard/EB001B', altNames: ['Master Card'] },
    { id: 63, name: 'American Express', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/americanexpress/002663', altNames: ['Amex'] },
    { id: 64, name: 'PayPal', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/paypal/00457C', altNames: [] },
    { id: 65, name: 'JPMorgan Chase', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/jpmorgan/006600', altNames: ['JP Morgan', 'Chase'] },
    { id: 66, name: 'Bank of America', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/bankofamerica/EF3C00', altNames: ['BofA'] },
    { id: 67, name: 'Wells Fargo', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/wellsfargo/FFCC00', altNames: [] },
    { id: 68, name: 'Goldman Sachs', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/goldmansachs/000000', altNames: [] },
    { id: 69, name: 'Morgan Stanley', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/morganstanley/000000', altNames: [] },
    { id: 70, name: 'Citibank', category: 'Finance', logoUrl: 'https://cdn.simpleicons.org/citi/056EAE', altNames: ['Citi'] },
    
    // Autres
    { id: 71, name: 'IKEA', category: 'Commerce', logoUrl: 'https://cdn.simpleicons.org/ikea/0058A3', altNames: [] },
    { id: 72, name: 'Walmart', category: 'Commerce', logoUrl: 'https://cdn.simpleicons.org/walmart/0071CE', altNames: [] },
    { id: 73, name: 'Target', category: 'Commerce', logoUrl: 'https://cdn.simpleicons.org/target/CC0000', altNames: [] },
    { id: 74, name: 'eBay', category: 'Commerce', logoUrl: 'https://cdn.simpleicons.org/ebay/E53238', altNames: [] },
    { id: 75, name: 'Uber', category: 'Transport', logoUrl: 'https://cdn.simpleicons.org/uber/000000', altNames: [] },
    { id: 76, name: 'Airbnb', category: 'Transport', logoUrl: 'https://cdn.simpleicons.org/airbnb/FF5A5F', altNames: ['Air BnB'] },
    { id: 77, name: 'FedEx', category: 'Transport', logoUrl: 'https://cdn.simpleicons.org/fedex/4D148C', altNames: ['Federal Express'] },
    { id: 78, name: 'UPS', category: 'Transport', logoUrl: 'https://cdn.simpleicons.org/ups/7B68EE', altNames: ['United Parcel Service'] },
    { id: 79, name: 'DHL', category: 'Transport', logoUrl: 'https://cdn.simpleicons.org/dhl/FFCC00', altNames: [] },
    { id: 80, name: 'Monster Energy', category: 'Boissons', logoUrl: 'https://cdn.simpleicons.org/monsterenergy/000000', altNames: ['Monster'] },
    
    // Sport
    { id: 81, name: 'NBA', category: 'Sport', logoUrl: 'https://cdn.simpleicons.org/nba/C8102E', altNames: ['National Basketball Association'] },
    { id: 82, name: 'NFL', category: 'Sport', logoUrl: 'https://cdn.simpleicons.org/nfl/013369', altNames: ['National Football League'] },
    { id: 83, name: 'FIFA', category: 'Sport', logoUrl: 'https://cdn.simpleicons.org/fifa/326295', altNames: [] },
    { id: 84, name: 'UEFA', category: 'Sport', logoUrl: 'https://cdn.simpleicons.org/uefa/004DB4', altNames: [] },
    { id: 85, name: 'Olympic Games', category: 'Sport', logoUrl: 'https://cdn.simpleicons.org/olympics/0085C7', altNames: ['Jeux Olympiques', 'Olympics'] },
    
    // Automobile (suite)
    { id: 86, name: 'Hyundai', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/hyundai/002C5F', altNames: [] },
    { id: 87, name: 'Mazda', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/mazda/101010', altNames: [] },
    { id: 88, name: 'Subaru', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/subaru/013C74', altNames: [] },
    { id: 89, name: 'Volvo', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/volvo/003057', altNames: [] },
    { id: 90, name: 'Jaguar', category: 'Automobile', logoUrl: 'https://cdn.simpleicons.org/jaguar/000000', altNames: [] },
    
    // Technologie (suite)
    { id: 91, name: 'Dell', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/dell/007DB8', altNames: [] },
    { id: 92, name: 'HP', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/hp/0096D6', altNames: ['Hewlett-Packard'] },
    { id: 93, name: 'Lenovo', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/lenovo/E2231A', altNames: [] },
    { id: 94, name: 'Asus', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/asus/000000', altNames: [] },
    { id: 95, name: 'Acer', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/acer/83B81A', altNames: [] },
    { id: 96, name: 'LG', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/lg/A50034', altNames: [] },
    { id: 97, name: 'Panasonic', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/panasonic/000000', altNames: [] },
    { id: 98, name: 'Canon', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/canon/BC1142', altNames: [] },
    { id: 99, name: 'Nikon', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/nikon/000000', altNames: [] },
    { id: 100, name: 'Xiaomi', category: 'Technologie', logoUrl: 'https://cdn.simpleicons.org/xiaomi/FF6900', altNames: [] }
];
