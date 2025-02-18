from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['MatchPoint']

# Clear the courts collection
db.courts.drop()
print("Courts collection cleared")

# Initialize courts
courts = db.courts

sample_courts = [
    # Football Facilities
    {
        "name": "Premium Football Turf",
        "description": "FIFA-approved artificial grass turf with floodlights and professional facilities",
        "image": "https://images.unsplash.com/photo-1459865264687-595d652de67e",
        "pricePerHour": 1500,
        "sport": "Football",
        "status": "Active",
        "amenities": [
            "High-quality turf",
            "Floodlights",
            "Changing rooms",
            "Parking available",
            "Referee services",
            "First aid facility"
        ],
        "maxPlayers": 22,
        "timing": "6 AM - 10 PM",
        "type": "Indoor"
    },
    {
        "name": "Community Football Ground",
        "description": "Natural grass football field perfect for casual games and training",
        "image": "https://images.unsplash.com/photo-1551958219-acbc608c6377",
        "pricePerHour": 1000,
        "sport": "Football",
        "status": "Active",
        "amenities": [
            "Natural grass",
            "Basic equipment",
            "Water coolers",
            "Parking"
        ],
        "maxPlayers": 22,
        "timing": "6 AM - 6 PM",
        "type": "Outdoor"
    },
    # Cricket Facilities
    {
        "name": "International Cricket Stadium",
        "description": "Professional cricket ground with floodlights and practice nets",
        "image": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
        "pricePerHour": 2000,
        "sport": "Cricket",
        "status": "Active",
        "amenities": [
            "Natural grass",
            "Practice nets",
            "Pavilion",
            "Equipment rental",
            "Electronic scoreboard",
            "Commentary box"
        ],
        "maxPlayers": 22,
        "timing": "6 AM - 10 PM",
        "type": "Outdoor"
    },
    {
        "name": "Cricket Practice Facility",
        "description": "Dedicated cricket practice facility with bowling machines",
        "image": "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
        "pricePerHour": 800,
        "sport": "Cricket",
        "status": "Active",
        "amenities": [
            "Bowling machines",
            "Practice nets",
            "Basic equipment",
            "Coaching available"
        ],
        "maxPlayers": 6,
        "timing": "6 AM - 9 PM",
        "type": "Indoor"
    },
    # Badminton Courts
    {
        "name": "Premium Badminton Arena",
        "description": "Professional indoor badminton courts with wooden flooring",
        "image": "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea",
        "pricePerHour": 800,
        "sport": "Badminton",
        "status": "Active",
        "amenities": [
            "Wooden flooring",
            "Air conditioning",
            "Equipment rental",
            "Changing rooms",
            "Pro shop",
            "Coaching"
        ],
        "maxPlayers": 4,
        "timing": "6 AM - 10 PM",
        "type": "Indoor"
    },
    # Tennis Facilities
    {
        "name": "Elite Tennis Complex",
        "description": "Championship tennis courts with professional facilities",
        "image": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8",
        "pricePerHour": 1200,
        "sport": "Tennis",
        "status": "Active",
        "amenities": [
            "Clay courts",
            "Ball machine",
            "Pro shop",
            "Coaching available",
            "Spectator seating",
            "Cafe"
        ],
        "maxPlayers": 4,
        "timing": "6 AM - 10 PM",
        "type": "Outdoor"
    },
    # Basketball Facilities
    {
        "name": "Pro Basketball Arena",
        "description": "Professional indoor basketball court with premium facilities",
        "image": "https://images.unsplash.com/photo-1544919982-b61976f0ba43",
        "pricePerHour": 1000,
        "sport": "Basketball",
        "status": "Active",
        "amenities": [
            "Maple wood flooring",
            "Electronic scoreboard",
            "Locker rooms",
            "Spectator seating",
            "Pro equipment",
            "Training staff"
        ],
        "maxPlayers": 10,
        "timing": "6 AM - 10 PM",
        "type": "Indoor"
    },
    # Table Tennis Facilities
    {
        "name": "Table Tennis Center",
        "description": "Professional table tennis facility with multiple tables",
        "image": "https://images.unsplash.com/photo-1534158914592-062992fbe900",
        "pricePerHour": 400,
        "sport": "Table Tennis",
        "status": "Active",
        "amenities": [
            "Professional tables",
            "Air conditioning",
            "Equipment rental",
            "Training robots",
            "Coaching available"
        ],
        "maxPlayers": 4,
        "timing": "6 AM - 10 PM",
        "type": "Indoor"
    },
    # Swimming Facilities
    {
        "name": "Olympic Swimming Pool",
        "description": "Temperature-controlled Olympic-size swimming pool",
        "image": "https://images.unsplash.com/photo-1576610616656-d3aa5d1f4534",
        "pricePerHour": 500,
        "sport": "Swimming",
        "status": "Active",
        "amenities": [
            "Olympic size pool",
            "Temperature control",
            "Changing rooms",
            "Lifeguard",
            "Swimming equipment"
        ],
        "maxPlayers": 8,
        "timing": "6 AM - 9 PM",
        "type": "Indoor"
    },
    # Squash Courts
    {
        "name": "Squash Complex",
        "description": "Professional squash courts with viewing gallery",
        "image": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8",
        "pricePerHour": 600,
        "sport": "Squash",
        "status": "Active",
        "amenities": [
            "Glass back courts",
            "Air conditioning",
            "Equipment rental",
            "Coaching",
            "Viewing gallery"
        ],
        "maxPlayers": 2,
        "timing": "6 AM - 10 PM",
        "type": "Indoor"
    },
    # Volleyball Courts
    {
        "name": "Indoor Volleyball Arena",
        "description": "Professional indoor volleyball courts",
        "image": "https://images.unsplash.com/photo-1592656094267-764a45160876",
        "pricePerHour": 800,
        "sport": "Volleyball",
        "status": "Active",
        "amenities": [
            "Spring flooring",
            "Air conditioning",
            "Equipment rental",
            "Coaching available"
        ],
        "maxPlayers": 12,
        "timing": "6 AM - 10 PM",
        "type": "Indoor"
    },
    # Yoga Studio
    {
        "name": "Zen Yoga Studio",
        "description": "Peaceful yoga studio with all amenities",
        "image": "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
        "pricePerHour": 300,
        "sport": "Yoga",
        "status": "Active",
        "amenities": [
            "Yoga mats",
            "Meditation area",
            "Air purifiers",
            "Sound system",
            "Props available"
        ],
        "maxPlayers": 20,
        "timing": "6 AM - 8 PM",
        "type": "Indoor"
    },
    # Boxing Ring
    {
        "name": "Boxing Academy",
        "description": "Professional boxing ring with training facilities",
        "image": "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b",
        "pricePerHour": 700,
        "sport": "Boxing",
        "status": "Active",
        "amenities": [
            "Professional ring",
            "Punching bags",
            "Training equipment",
            "Coaching available",
            "First aid"
        ],
        "maxPlayers": 4,
        "timing": "6 AM - 10 PM",
        "type": "Indoor"
    },
    # Gym
    {
        "name": "Premium Fitness Center",
        "description": "State-of-the-art gym with modern equipment",
        "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        "pricePerHour": 200,
        "sport": "Gym",
        "status": "Active",
        "amenities": [
            "Modern equipment",
            "Personal training",
            "Cardio area",
            "Free weights",
            "Supplements shop"
        ],
        "maxPlayers": 50,
        "timing": "5 AM - 11 PM",
        "type": "Indoor"
    }
]

# Insert courts
result = courts.insert_many(sample_courts)
print(f"Added {len(result.inserted_ids)} courts to the database")

# Verify the courts were added
court_count = courts.count_documents({})
print(f"Total courts in database: {court_count}")

# Print all sports available
sports = courts.distinct("sport")
print("\nAvailable sports:", sports)

# Print count by sport
for sport in sports:
    count = courts.count_documents({"sport": sport})
    print(f"{sport}: {count} courts") 