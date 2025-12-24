/**
 * Données des logos pour le Challenge Logos
 * Liste de logos d'entreprises, marques et organisations populaires
 */
const LOGO_DATA = [
    // Technologie
    { id: 1, name: 'Apple', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/apple.com', altNames: ['Apple Inc', 'iPhone', 'Mac'] },
    { id: 2, name: 'Google', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/google.com', altNames: ['Alphabet'] },
    { id: 3, name: 'Microsoft', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/microsoft.com', altNames: ['Windows', 'Office'] },
    { id: 4, name: 'Amazon', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/amazon.com', altNames: ['Amazon.com'] },
    { id: 5, name: 'Facebook', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/facebook.com', altNames: ['Meta'] },
    { id: 6, name: 'Twitter', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/twitter.com', altNames: ['X'] },
    { id: 7, name: 'Instagram', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/instagram.com', altNames: [] },
    { id: 8, name: 'YouTube', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/youtube.com', altNames: ['Youtube'] },
    { id: 9, name: 'Netflix', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/netflix.com', altNames: [] },
    { id: 10, name: 'Spotify', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/spotify.com', altNames: [] },
    { id: 11, name: 'Adobe', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/adobe.com', altNames: ['Photoshop', 'Illustrator'] },
    { id: 12, name: 'Samsung', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/samsung.com', altNames: [] },
    { id: 13, name: 'Sony', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/sony.com', altNames: ['PlayStation'] },
    { id: 14, name: 'Nintendo', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/nintendo.com', altNames: ['Switch', 'Wii'] },
    { id: 15, name: 'Tesla', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/tesla.com', altNames: [] },
    { id: 16, name: 'Intel', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/intel.com', altNames: [] },
    { id: 17, name: 'Nvidia', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/nvidia.com', altNames: [] },
    { id: 18, name: 'IBM', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/ibm.com', altNames: [] },
    { id: 19, name: 'Oracle', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/oracle.com', altNames: [] },
    { id: 20, name: 'Cisco', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/cisco.com', altNames: [] },
    
    // Automobile
    { id: 21, name: 'BMW', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/bmw.com', altNames: [] },
    { id: 22, name: 'Mercedes-Benz', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/mercedes-benz.com', altNames: ['Mercedes', 'Benz'] },
    { id: 23, name: 'Audi', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/audi.com', altNames: [] },
    { id: 24, name: 'Volkswagen', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/volkswagen.com', altNames: ['VW'] },
    { id: 25, name: 'Toyota', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/toyota.com', altNames: [] },
    { id: 26, name: 'Honda', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/honda.com', altNames: [] },
    { id: 27, name: 'Ford', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/ford.com', altNames: [] },
    { id: 28, name: 'Ferrari', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/ferrari.com', altNames: [] },
    { id: 29, name: 'Porsche', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/porsche.com', altNames: [] },
    { id: 30, name: 'Lamborghini', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/lamborghini.com', altNames: [] },
    
    // Alimentation & Boissons
    { id: 31, name: 'McDonald\'s', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/mcdonalds.com', altNames: ['McDo', 'McDonalds'] },
    { id: 32, name: 'Starbucks', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/starbucks.com', altNames: [] },
    { id: 33, name: 'Coca-Cola', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/coca-cola.com', altNames: ['Coca Cola', 'Coke'] },
    { id: 34, name: 'Pepsi', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/pepsi.com', altNames: [] },
    { id: 35, name: 'Red Bull', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/redbull.com', altNames: [] },
    { id: 36, name: 'Heineken', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/heineken.com', altNames: [] },
    { id: 37, name: 'KFC', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/kfc.com', altNames: ['Kentucky Fried Chicken'] },
    { id: 38, name: 'Burger King', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/burgerking.com', altNames: [] },
    { id: 39, name: 'Pizza Hut', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/pizzahut.com', altNames: [] },
    { id: 40, name: 'Domino\'s', category: 'Alimentation', logoUrl: 'https://logo.clearbit.com/dominos.com', altNames: ['Dominos'] },
    
    // Mode & Luxe
    { id: 41, name: 'Nike', category: 'Mode', logoUrl: 'https://logo.clearbit.com/nike.com', altNames: [] },
    { id: 42, name: 'Adidas', category: 'Mode', logoUrl: 'https://logo.clearbit.com/adidas.com', altNames: [] },
    { id: 43, name: 'Gucci', category: 'Mode', logoUrl: 'https://logo.clearbit.com/gucci.com', altNames: [] },
    { id: 44, name: 'Louis Vuitton', category: 'Mode', logoUrl: 'https://logo.clearbit.com/louisvuitton.com', altNames: ['LV'] },
    { id: 45, name: 'Chanel', category: 'Mode', logoUrl: 'https://logo.clearbit.com/chanel.com', altNames: [] },
    { id: 46, name: 'Puma', category: 'Mode', logoUrl: 'https://logo.clearbit.com/puma.com', altNames: [] },
    { id: 47, name: 'Zara', category: 'Mode', logoUrl: 'https://logo.clearbit.com/zara.com', altNames: [] },
    { id: 48, name: 'H&M', category: 'Mode', logoUrl: 'https://logo.clearbit.com/hm.com', altNames: ['H and M', 'Hennes & Mauritz'] },
    { id: 49, name: 'Uniqlo', category: 'Mode', logoUrl: 'https://logo.clearbit.com/uniqlo.com', altNames: [] },
    { id: 50, name: 'Hermès', category: 'Mode', logoUrl: 'https://logo.clearbit.com/hermes.com', altNames: ['Hermes'] },
    
    // Médias & Divertissement
    { id: 51, name: 'Disney', category: 'Médias', logoUrl: 'https://logo.clearbit.com/disney.com', altNames: ['Walt Disney'] },
    { id: 52, name: 'Marvel', category: 'Médias', logoUrl: 'https://logo.clearbit.com/marvel.com', altNames: [] },
    { id: 53, name: 'DC Comics', category: 'Médias', logoUrl: 'https://logo.clearbit.com/dccomics.com', altNames: ['DC'] },
    { id: 54, name: 'Warner Bros', category: 'Médias', logoUrl: 'https://logo.clearbit.com/warnerbros.com', altNames: ['Warner Brothers'] },
    { id: 55, name: 'Universal', category: 'Médias', logoUrl: 'https://logo.clearbit.com/universalstudios.com', altNames: ['Universal Studios'] },
    { id: 56, name: 'Paramount', category: 'Médias', logoUrl: 'https://logo.clearbit.com/paramount.com', altNames: [] },
    { id: 57, name: 'Sony Pictures', category: 'Médias', logoUrl: 'https://logo.clearbit.com/sonypictures.com', altNames: ['Sony Pictures'] },
    { id: 58, name: '20th Century Fox', category: 'Médias', logoUrl: 'https://logo.clearbit.com/20thcenturystudios.com', altNames: ['20th Century', 'Fox'] },
    { id: 59, name: 'HBO', category: 'Médias', logoUrl: 'https://logo.clearbit.com/hbo.com', altNames: ['Home Box Office'] },
    { id: 60, name: 'CNN', category: 'Médias', logoUrl: 'https://logo.clearbit.com/cnn.com', altNames: ['Cable News Network'] },
    
    // Finance & Banque
    { id: 61, name: 'Visa', category: 'Finance', logoUrl: 'https://logo.clearbit.com/visa.com', altNames: [] },
    { id: 62, name: 'Mastercard', category: 'Finance', logoUrl: 'https://logo.clearbit.com/mastercard.com', altNames: ['Master Card'] },
    { id: 63, name: 'American Express', category: 'Finance', logoUrl: 'https://logo.clearbit.com/americanexpress.com', altNames: ['Amex'] },
    { id: 64, name: 'PayPal', category: 'Finance', logoUrl: 'https://logo.clearbit.com/paypal.com', altNames: [] },
    { id: 65, name: 'JPMorgan Chase', category: 'Finance', logoUrl: 'https://logo.clearbit.com/jpmorganchase.com', altNames: ['JP Morgan', 'Chase'] },
    { id: 66, name: 'Bank of America', category: 'Finance', logoUrl: 'https://logo.clearbit.com/bankofamerica.com', altNames: ['BofA'] },
    { id: 67, name: 'Wells Fargo', category: 'Finance', logoUrl: 'https://logo.clearbit.com/wellsfargo.com', altNames: [] },
    { id: 68, name: 'Goldman Sachs', category: 'Finance', logoUrl: 'https://logo.clearbit.com/goldmansachs.com', altNames: [] },
    { id: 69, name: 'Morgan Stanley', category: 'Finance', logoUrl: 'https://logo.clearbit.com/morganstanley.com', altNames: [] },
    { id: 70, name: 'Citibank', category: 'Finance', logoUrl: 'https://logo.clearbit.com/citi.com', altNames: ['Citi'] },
    
    // Autres
    { id: 71, name: 'IKEA', category: 'Commerce', logoUrl: 'https://logo.clearbit.com/ikea.com', altNames: [] },
    { id: 72, name: 'Walmart', category: 'Commerce', logoUrl: 'https://logo.clearbit.com/walmart.com', altNames: [] },
    { id: 73, name: 'Target', category: 'Commerce', logoUrl: 'https://logo.clearbit.com/target.com', altNames: [] },
    { id: 74, name: 'eBay', category: 'Commerce', logoUrl: 'https://logo.clearbit.com/ebay.com', altNames: [] },
    { id: 75, name: 'Uber', category: 'Transport', logoUrl: 'https://logo.clearbit.com/uber.com', altNames: [] },
    { id: 76, name: 'Airbnb', category: 'Transport', logoUrl: 'https://logo.clearbit.com/airbnb.com', altNames: ['Air BnB'] },
    { id: 77, name: 'FedEx', category: 'Transport', logoUrl: 'https://logo.clearbit.com/fedex.com', altNames: ['Federal Express'] },
    { id: 78, name: 'UPS', category: 'Transport', logoUrl: 'https://logo.clearbit.com/ups.com', altNames: ['United Parcel Service'] },
    { id: 79, name: 'DHL', category: 'Transport', logoUrl: 'https://logo.clearbit.com/dhl.com', altNames: [] },
    { id: 80, name: 'Monster Energy', category: 'Boissons', logoUrl: 'https://logo.clearbit.com/monsterenergy.com', altNames: ['Monster'] },
    
    // Sport
    { id: 81, name: 'NBA', category: 'Sport', logoUrl: 'https://logo.clearbit.com/nba.com', altNames: ['National Basketball Association'] },
    { id: 82, name: 'NFL', category: 'Sport', logoUrl: 'https://logo.clearbit.com/nfl.com', altNames: ['National Football League'] },
    { id: 83, name: 'FIFA', category: 'Sport', logoUrl: 'https://logo.clearbit.com/fifa.com', altNames: [] },
    { id: 84, name: 'UEFA', category: 'Sport', logoUrl: 'https://logo.clearbit.com/uefa.com', altNames: [] },
    { id: 85, name: 'Olympic Games', category: 'Sport', logoUrl: 'https://logo.clearbit.com/olympic.org', altNames: ['Jeux Olympiques', 'Olympics'] },
    
    // Automobile (suite)
    { id: 86, name: 'Hyundai', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/hyundai.com', altNames: [] },
    { id: 87, name: 'Mazda', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/mazda.com', altNames: [] },
    { id: 88, name: 'Subaru', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/subaru.com', altNames: [] },
    { id: 89, name: 'Volvo', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/volvo.com', altNames: [] },
    { id: 90, name: 'Jaguar', category: 'Automobile', logoUrl: 'https://logo.clearbit.com/jaguar.com', altNames: [] },
    
    // Technologie (suite)
    { id: 91, name: 'Dell', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/dell.com', altNames: [] },
    { id: 92, name: 'HP', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/hp.com', altNames: ['Hewlett-Packard'] },
    { id: 93, name: 'Lenovo', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/lenovo.com', altNames: [] },
    { id: 94, name: 'Asus', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/asus.com', altNames: [] },
    { id: 95, name: 'Acer', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/acer.com', altNames: [] },
    { id: 96, name: 'LG', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/lg.com', altNames: [] },
    { id: 97, name: 'Panasonic', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/panasonic.com', altNames: [] },
    { id: 98, name: 'Canon', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/canon.com', altNames: [] },
    { id: 99, name: 'Nikon', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/nikon.com', altNames: [] },
    { id: 100, name: 'Xiaomi', category: 'Technologie', logoUrl: 'https://logo.clearbit.com/xiaomi.com', altNames: [] }
];
