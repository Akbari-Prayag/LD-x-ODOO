const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../server/.env') })
const { sequelize, ensureDatabaseExists } = require('../server/config/database')
const { User, City, Activity, Trip, TripStop, TripActivity, Expense } = require('../server/models')

const cities = [
  // Indian destinations
  {
    name: 'Mumbai', country: 'India', region: 'Maharashtra', state: 'Maharashtra',
    description: 'The financial capital of India, known for Bollywood, Gateway of India, and street food.',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800',
    costIndex: 3, popularity: 95, avgDailyCost: 3500,
    tags: ['city', 'food', 'culture', 'nightlife'], bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    lat: 19.0760, lng: 72.8777,
  },
  {
    name: 'Goa', country: 'India', region: 'Goa', state: 'Goa',
    description: 'Famous for its beaches, Portuguese heritage, seafood, and vibrant nightlife.',
    image: 'https://images.unsplash.com/photo-1587922546307-776227941871?w=800',
    costIndex: 2, popularity: 92, avgDailyCost: 2500,
    tags: ['beach', 'nightlife', 'food', 'adventure'], bestMonths: ['Nov', 'Dec', 'Jan', 'Feb'],
    lat: 15.2993, lng: 74.1240,
  },
  {
    name: 'Jaipur', country: 'India', region: 'Rajasthan', state: 'Rajasthan',
    description: 'The Pink City, famous for its stunning Rajput palaces, forts, and vibrant bazaars.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    costIndex: 2, popularity: 88, avgDailyCost: 2000,
    tags: ['history', 'culture', 'shopping', 'architecture'], bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    lat: 26.9124, lng: 75.7873,
  },
  {
    name: 'Kerala (Backwaters)', country: 'India', region: 'Kerala', state: 'Kerala',
    description: 'God\'s Own Country – serene backwaters, houseboat stays, and lush green landscapes.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
    costIndex: 2, popularity: 85, avgDailyCost: 2800,
    tags: ['nature', 'relaxation', 'culture', 'food'], bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    lat: 9.4981, lng: 76.3388,
  },
  {
    name: 'Agra', country: 'India', region: 'Uttar Pradesh', state: 'Uttar Pradesh',
    description: 'Home to the iconic Taj Mahal, Agra Fort, and Mughal history.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800',
    costIndex: 2, popularity: 90, avgDailyCost: 1800,
    tags: ['history', 'culture', 'architecture', 'sightseeing'], bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    lat: 27.1767, lng: 78.0081,
  },
  {
    name: 'Varanasi', country: 'India', region: 'Uttar Pradesh', state: 'Uttar Pradesh',
    description: 'One of the world\'s oldest cities, known for the Ganges ghats, spiritual ceremonies and temples.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800',
    costIndex: 1, popularity: 82, avgDailyCost: 1500,
    tags: ['spiritual', 'culture', 'history', 'sightseeing'], bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    lat: 25.3176, lng: 82.9739,
  },
  {
    name: 'Delhi', country: 'India', region: 'Delhi', state: 'Delhi',
    description: 'India\'s capital – a blend of Mughal history, modern culture, diverse food and iconic monuments.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
    costIndex: 3, popularity: 94, avgDailyCost: 3000,
    tags: ['history', 'food', 'culture', 'shopping'], bestMonths: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    lat: 28.6139, lng: 77.2090,
  },
  {
    name: 'Manali', country: 'India', region: 'Himachal Pradesh', state: 'Himachal Pradesh',
    description: 'A high-altitude Himalayan resort town known for adventure sports, scenic beauty, and snow.',
    image: 'https://images.unsplash.com/photo-1626015365107-45a21b6d7a3f?w=800',
    costIndex: 2, popularity: 87, avgDailyCost: 2200,
    tags: ['adventure', 'nature', 'snow', 'trekking'], bestMonths: ['Mar', 'Apr', 'May', 'Jun', 'Oct', 'Nov'],
    lat: 32.2432, lng: 77.1892,
  },
  {
    name: 'Rishikesh', country: 'India', region: 'Uttarakhand', state: 'Uttarakhand',
    description: 'Yoga capital of the world, known for white-water rafting, ashrams and Himalayan scenery.',
    image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?w=800',
    costIndex: 1, popularity: 80, avgDailyCost: 1200,
    tags: ['adventure', 'spiritual', 'yoga', 'rafting'], bestMonths: ['Feb', 'Mar', 'Apr', 'May', 'Sep', 'Oct', 'Nov'],
    lat: 30.0869, lng: 78.2676,
  },
  {
    name: 'Mysore', country: 'India', region: 'Karnataka', state: 'Karnataka',
    description: 'City of Palaces – famous for Mysore Palace, silk, sandal products and Dasara festival.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    costIndex: 1, popularity: 78, avgDailyCost: 1800,
    tags: ['history', 'culture', 'architecture', 'shopping'], bestMonths: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    lat: 12.2958, lng: 76.6394,
  },
  // International destinations
  {
    name: 'Paris', country: 'France', region: 'Île-de-France',
    description: 'The City of Light – iconic for the Eiffel Tower, world-class cuisine, art, and fashion.',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    costIndex: 5, popularity: 99, avgDailyCost: 12000,
    tags: ['romance', 'culture', 'food', 'art', 'fashion'], bestMonths: ['Apr', 'May', 'Jun', 'Sep', 'Oct'],
    lat: 48.8566, lng: 2.3522,
  },
  {
    name: 'Tokyo', country: 'Japan', region: 'Kanto',
    description: 'An electrifying mix of tradition and modernity – from ancient temples to futuristic technology.',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
    costIndex: 4, popularity: 97, avgDailyCost: 10000,
    tags: ['culture', 'food', 'technology', 'nightlife', 'shopping'], bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
    lat: 35.6762, lng: 139.6503,
  },
  {
    name: 'Bali', country: 'Indonesia', region: 'Bali',
    description: 'Island of the Gods – stunning temples, terraced rice fields, surfing and spiritual retreats.',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    costIndex: 2, popularity: 96, avgDailyCost: 4500,
    tags: ['beach', 'culture', 'adventure', 'spiritual', 'nature'], bestMonths: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    lat: -8.3405, lng: 115.0920,
  },
  {
    name: 'Dubai', country: 'UAE', region: 'Dubai',
    description: 'Futuristic skyline, luxury shopping, desert safaris and world records – in the heart of Arabia.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    costIndex: 5, popularity: 95, avgDailyCost: 15000,
    tags: ['luxury', 'shopping', 'adventure', 'architecture', 'food'], bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    lat: 25.2048, lng: 55.2708,
  },
  {
    name: 'Singapore', country: 'Singapore', region: 'Singapore',
    description: 'A gleaming city-state blending cultures, cuisines, and cutting-edge architecture.',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    costIndex: 4, popularity: 93, avgDailyCost: 9000,
    tags: ['food', 'shopping', 'culture', 'architecture'], bestMonths: ['Feb', 'Mar', 'Apr', 'Jul', 'Aug'],
    lat: 1.3521, lng: 103.8198,
  },
  {
    name: 'New York', country: 'USA', region: 'Northeast',
    description: 'The city that never sleeps – Times Square, Central Park, Broadway and world-class museums.',
    image: 'https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?w=800',
    costIndex: 5, popularity: 98, avgDailyCost: 14000,
    tags: ['culture', 'food', 'nightlife', 'shopping', 'art'], bestMonths: ['Apr', 'May', 'Sep', 'Oct'],
    lat: 40.7128, lng: -74.0060,
  },
  {
    name: 'Bangkok', country: 'Thailand', region: 'Central Thailand',
    description: 'Vibrant street food, ornate temples, buzzing nightlife and floating markets.',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
    costIndex: 2, popularity: 91, avgDailyCost: 3500,
    tags: ['food', 'culture', 'nightlife', 'shopping', 'temples'], bestMonths: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    lat: 13.7563, lng: 100.5018,
  },
  {
    name: 'Rome', country: 'Italy', region: 'Lazio',
    description: 'The Eternal City – Colosseum, Vatican, Renaissance art, and the world\'s best pasta.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    costIndex: 4, popularity: 96, avgDailyCost: 11000,
    tags: ['history', 'culture', 'food', 'art', 'architecture'], bestMonths: ['Apr', 'May', 'Sep', 'Oct'],
    lat: 41.9028, lng: 12.4964,
  },
  {
    name: 'Kyoto', country: 'Japan', region: 'Kansai',
    description: 'Japan\'s cultural heart – ancient temples, geisha districts, bamboo groves and tea ceremonies.',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    costIndex: 3, popularity: 90, avgDailyCost: 8000,
    tags: ['culture', 'history', 'nature', 'spiritual', 'architecture'], bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
    lat: 35.0116, lng: 135.7681,
  },
  {
    name: 'Barcelona', country: 'Spain', region: 'Catalonia',
    description: 'Gaudí\'s masterpieces, vibrant tapas culture, Mediterranean beaches and passionate nightlife.',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800',
    costIndex: 4, popularity: 92, avgDailyCost: 10500,
    tags: ['culture', 'food', 'beach', 'nightlife', 'architecture'], bestMonths: ['May', 'Jun', 'Sep', 'Oct'],
    lat: 41.3851, lng: 2.1734,
  },
]

const getActivities = (cityMap) => [
  // Mumbai
  { name: 'Gateway of India Tour', cityId: cityMap['Mumbai'], category: 'sightseeing', estimatedCost: 0, durationValue: 2, durationUnit: 'hours', description: 'Iconic British-built triumphal arch overlooking the Arabian Sea. Best at sunrise.', ratingAverage: 4.5, ratingCount: 1200, image: 'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=600', tags: ['monument', 'history'] },
  { name: 'Street Food Tour - Chowpatty', cityId: cityMap['Mumbai'], category: 'food', estimatedCost: 500, durationValue: 3, durationUnit: 'hours', description: 'Bhel puri, vada pav, and pav bhaji at the famous Chowpatty beach.', ratingAverage: 4.7, ratingCount: 890, image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600', tags: ['street food', 'local'] },
  { name: 'Dharavi Slum Tour', cityId: cityMap['Mumbai'], category: 'culture', estimatedCost: 800, durationValue: 3, durationUnit: 'hours', description: 'An eye-opening guided tour of one of Asia\'s largest slums – now a thriving community.', ratingAverage: 4.3, ratingCount: 450, image: 'https://images.unsplash.com/photo-1625248935982-e8e9d62a8f65?w=600', tags: ['culture', 'community'] },

  // Goa
  { name: 'Baga Beach Day', cityId: cityMap['Goa'], category: 'adventure', estimatedCost: 1500, durationValue: 6, durationUnit: 'hours', description: 'Sun, sand, water sports – parasailing, banana boat, and jet skiing at Baga.', ratingAverage: 4.6, ratingCount: 2100, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', tags: ['beach', 'water sports'] },
  { name: 'Old Goa Church Tour', cityId: cityMap['Goa'], category: 'culture', estimatedCost: 200, durationValue: 3, durationUnit: 'hours', description: 'UNESCO-listed Basilica of Bom Jesus and Se Cathedral – finest examples of Portuguese baroque.', ratingAverage: 4.4, ratingCount: 780, image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=600', tags: ['history', 'architecture'] },
  { name: 'Sunset Cruise on Mandovi River', cityId: cityMap['Goa'], category: 'entertainment', estimatedCost: 600, durationValue: 2, durationUnit: 'hours', description: 'Enjoy live music, folk dances, and a golden sunset over the Mandovi River.', ratingAverage: 4.2, ratingCount: 560, image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600', tags: ['sunset', 'cruise', 'entertainment'] },

  // Jaipur
  { name: 'Amber Fort Tour', cityId: cityMap['Jaipur'], category: 'sightseeing', estimatedCost: 500, durationValue: 3, durationUnit: 'hours', description: 'Majestic hilltop fort with mirrored rooms, elephants, and stunning views of Maota Lake.', ratingAverage: 4.8, ratingCount: 3200, image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?w=600', tags: ['fort', 'history', 'elephants'] },
  { name: 'Hawa Mahal Photo Walk', cityId: cityMap['Jaipur'], category: 'sightseeing', estimatedCost: 50, durationValue: 1, durationUnit: 'hours', description: 'The Palace of Winds – iconic 5-story pink sandstone facade with 953 small windows.', ratingAverage: 4.5, ratingCount: 2800, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600', tags: ['architecture', 'photography'] },
  { name: 'Jaipur Bazaar Shopping', cityId: cityMap['Jaipur'], category: 'shopping', estimatedCost: 3000, durationValue: 4, durationUnit: 'hours', description: 'Shop for Rajasthani textiles, blue pottery, gems, and handicrafts in Johari Bazaar.', ratingAverage: 4.3, ratingCount: 1500, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', tags: ['shopping', 'handicrafts'] },

  // International
  { name: 'Eiffel Tower Sunset Visit', cityId: cityMap['Paris'], category: 'sightseeing', estimatedCost: 2800, durationValue: 3, durationUnit: 'hours', description: 'Watch Paris glow as the sun sets behind the Eiffel Tower from Trocadéro.', ratingAverage: 4.9, ratingCount: 8900, image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=600', tags: ['iconic', 'sunset', 'romance'] },
  { name: 'Louvre Museum Tour', cityId: cityMap['Paris'], category: 'culture', estimatedCost: 2200, durationValue: 4, durationUnit: 'hours', description: 'World\'s largest art museum – home to Mona Lisa, Venus de Milo, and 35,000+ objects.', ratingAverage: 4.8, ratingCount: 7200, image: 'https://images.unsplash.com/photo-1499856871958-5b9357976b82?w=600', tags: ['art', 'museum', 'culture'] },
  { name: 'Shibuya Crossing Experience', cityId: cityMap['Tokyo'], category: 'sightseeing', estimatedCost: 0, durationValue: 1, durationUnit: 'hours', description: 'Stand in the world\'s busiest pedestrian crossing and watch the organized chaos.', ratingAverage: 4.7, ratingCount: 5600, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600', tags: ['iconic', 'urban', 'photography'] },
  { name: 'Ubud Rice Terrace Trek', cityId: cityMap['Bali'], category: 'nature', estimatedCost: 1500, durationValue: 4, durationUnit: 'hours', description: 'Walk through the iconic Tegallalang rice terraces with a local guide at sunrise.', ratingAverage: 4.8, ratingCount: 3400, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600', tags: ['nature', 'trekking', 'sunrise'] },
  { name: 'Desert Safari Dubai', cityId: cityMap['Dubai'], category: 'adventure', estimatedCost: 5500, durationValue: 6, durationUnit: 'hours', description: 'Dune bashing, camel riding, sandboarding, and dinner under the stars in the Arabian desert.', ratingAverage: 4.7, ratingCount: 4100, image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600', tags: ['desert', 'adventure', 'sunset'] },
  { name: 'Colosseum Skip-the-Line Tour', cityId: cityMap['Rome'], category: 'culture', estimatedCost: 4500, durationValue: 3, durationUnit: 'hours', description: 'Step into the arena of gladiators with a skip-the-line guided tour of the iconic Colosseum.', ratingAverage: 4.9, ratingCount: 6800, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600', tags: ['history', 'iconic', 'guided tour'] },
]

async function seed() {
  await ensureDatabaseExists()
  await sequelize.authenticate()
  console.log('Connected to MySQL...')

  // Force recreate all tables
  await sequelize.sync({ force: true })
  console.log('Cleared & recreated MySQL tables')

  // Create cities
  const createdCities = await City.bulkCreate(cities)
  const cityMap = createdCities.reduce((acc, c) => { acc[c.name] = c.id; return acc }, {})
  console.log(`✅ Created ${createdCities.length} cities`)

  // Create activities
  const activityData = getActivities(cityMap)
  const createdActivities = await Activity.bulkCreate(activityData)
  console.log(`✅ Created ${createdActivities.length} activities`)

  // Create demo users
  const adminUser = await User.create({
    name: 'Admin User', email: 'admin@globetrotter.com', password: 'admin123', role: 'admin',
  })
  const demoUser = await User.create({
    name: 'Prayag Demo', email: 'demo@globetrotter.com', password: 'demo123', role: 'user',
  })
  console.log('✅ Created demo users:')
  console.log('   admin@globetrotter.com / admin123')
  console.log('   demo@globetrotter.com  / demo123')

  // Create a demo trip
  const demoTrip = await Trip.create({
    name:        'Golden Triangle Adventure',
    description: 'Explore the iconic Delhi-Agra-Jaipur triangle – the best of North India in 7 days.',
    startDate:   '2025-01-15',
    endDate:     '2025-01-21',
    budget:      50000,
    currency:    'INR',
    ownerId:     demoUser.id,
    status:      'planning',
    isPublic:    true,
    coverPhoto:  'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200',
    tags:        ['india', 'history', 'culture'],
  })

  // Add sample expenses
  await Expense.bulkCreate([
    { tripId: demoTrip.id, userId: demoUser.id, description: 'Flight Delhi ✈', amount: 8000, category: 'transport', date: '2025-01-15' },
    { tripId: demoTrip.id, userId: demoUser.id, description: 'Hotel Jaipur (3 nights)', amount: 12000, category: 'stay', date: '2025-01-15' },
    { tripId: demoTrip.id, userId: demoUser.id, description: 'Amber Fort entry', amount: 500, category: 'activities', date: '2025-01-17' },
    { tripId: demoTrip.id, userId: demoUser.id, description: 'Rajasthani dinner', amount: 1200, category: 'meals', date: '2025-01-17' },
    { tripId: demoTrip.id, userId: demoUser.id, description: 'Train Jaipur → Agra', amount: 1800, category: 'transport', date: '2025-01-18' },
    { tripId: demoTrip.id, userId: demoUser.id, description: 'Taj Mahal ticket', amount: 1100, category: 'activities', date: '2025-01-19' },
  ])

  // Update trip totalSpent
  demoTrip.totalSpent = 24600
  await demoTrip.save()

  console.log(`✅ Created demo trip: "${demoTrip.name}" (public slug: ${demoTrip.publicSlug})`)
  console.log('\n🎉 MySQL Database seeded successfully! You can now start the server.')

  await sequelize.close()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
