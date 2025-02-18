from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
from datetime import timedelta, datetime
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

app = Flask(__name__)

# Simple CORS setup
CORS(app, 
     origins=["http://localhost:3000", "http://127.0.0.1:3000"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

bcrypt = Bcrypt(app)

# JWT Configuration
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
jwt = JWTManager(app)

# MongoDB Connection
try:
    client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
    db = client['MatchPoint']
    users = db.users
    courts = db.courts
    bookings = db.bookings
    
    # Test connection
    client.server_info()
    print("MongoDB connected successfully")
    
    # List all databases
    print("Available databases:", client.list_database_names())
    
    # Count users
    user_count = users.count_documents({})
    print(f"Found {user_count} users in database")
    
except Exception as e:
    print(f"MongoDB connection error: {str(e)}")
    raise

@app.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Received signup data:", data)  # Debug log
        
        # Check if user already exists
        if users.find_one({"email": data['email']}):
            return jsonify({"error": "Email already registered"}), 400
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create user document
        user = {
            "name": data['name'],
            "email": data['email'],
            "password": hashed_password,
            "phone": data.get('phone', ''),
            "created_at": datetime.utcnow()
        }
        
        # Insert user into database
        result = users.insert_one(user)
        
        # Create access token
        access_token = create_access_token(identity=str(result.inserted_id))
        
        return jsonify({
            "message": "User created successfully",
            "token": access_token,
            "user": {
                "name": user['name'],
                "email": user['email']
            }
        }), 201
    except Exception as e:
        print(f"Signup error: {str(e)}")  # Debug log
        return jsonify({"error": "An error occurred during signup"}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login attempt for:", data.get('email'))

        # Validate input
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Email and password are required"}), 400

        # Find user
        user = users.find_one({"email": data['email']})
        print("User found:", bool(user))  # Debug log
        
        if not user:
            return jsonify({"error": "Email not found"}), 401
            
        # Check password
        is_valid = bcrypt.check_password_hash(user['password'], data['password'])
        print("Password valid:", is_valid)  # Debug log
        
        if not is_valid:
            return jsonify({"error": "Invalid password"}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user['_id']))
        
        print(f"User {user['email']} logged in successfully")
        
        response_data = {
            "token": access_token,
            "user": {
                "name": user['name'],
                "email": user['email']
            }
        }
        print("Sending response:", response_data)  # Debug log
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        traceback.print_exc()  # Print full error traceback
        return jsonify({"error": f"Login failed: {str(e)}"}), 500

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = users.find_one({"_id": current_user_id})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "user": {
            "name": user['name'],
            "email": user['email'],
            "phone": user.get('phone', '')
        }
    }), 200

@app.route('/api/courts', methods=['GET'])
def get_courts():
    try:
        court_list = list(courts.find())
        # Debug log
        print(f"Found {len(court_list)} courts")
        for court in court_list:
            print(f"Court: {court['name']} - Sport: {court['sport']}")
            court['_id'] = str(court['_id'])
        
        return jsonify({
            "courts": court_list
        }), 200
    except Exception as e:
        print(f"Error fetching courts: {str(e)}")
        return jsonify({"error": "Failed to fetch courts"}), 500

@app.route('/api/slots', methods=['GET'])
def get_available_slots():
    try:
        court_id = request.args.get('courtId')
        date_str = request.args.get('date')
        
        if not court_id or not date_str:
            return jsonify({"error": "Court ID and date are required"}), 400
            
        booking_date = datetime.strptime(date_str, '%Y-%m-%d')
        
        # Generate time slots (6 AM to 10 PM)
        slots = []
        start_hour = 6  # 6 AM
        end_hour = 22   # 10 PM
        
        for hour in range(start_hour, end_hour):
            start_time = f"{hour:02d}:00"
            end_time = f"{(hour + 1):02d}:00"
            slot_id = f"slot_{hour}"
            
            # Check if slot is booked
            is_booked = bookings.find_one({
                'courtId': ObjectId(court_id),
                'date': booking_date,
                'timeSlot.start': start_time
            })
            
            slots.append({
                'id': slot_id,
                'time': f"{start_time} - {end_time}",
                'start': start_time,
                'end': end_time,
                'available': not bool(is_booked)
            })
            
        return jsonify({"slots": slots}), 200
        
    except Exception as e:
        print(f"Error fetching slots: {str(e)}")
        return jsonify({"error": "Failed to fetch available slots"}), 500

@app.route('/api/bookings', methods=['POST'])
@jwt_required()
def create_booking():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate input
        if not all(k in data for k in ['courtId', 'date', 'timeSlot']):
            return jsonify({"error": "Missing required fields"}), 400
            
        # Check if slot is available
        existing_booking = bookings.find_one({
            'courtId': ObjectId(data['courtId']),
            'date': datetime.strptime(data['date'], '%Y-%m-%d'),
            'timeSlot.start': data['timeSlot']['start']
        })
        
        if existing_booking:
            return jsonify({"error": "This slot is already booked"}), 400
            
        # Create booking
        booking = {
            'userId': ObjectId(current_user_id),
            'courtId': ObjectId(data['courtId']),
            'date': datetime.strptime(data['date'], '%Y-%m-%d'),
            'timeSlot': data['timeSlot'],
            'status': 'pending',
            'createdAt': datetime.utcnow()
        }
        
        result = bookings.insert_one(booking)
        
        return jsonify({
            "message": "Booking created successfully",
            "bookingId": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        print(f"Error creating booking: {str(e)}")
        return jsonify({"error": "Failed to create booking"}), 500

@app.route('/api/bookings', methods=['GET'])
@jwt_required()
def get_user_bookings():
    try:
        current_user_id = get_jwt_identity()
        
        # Get user's bookings with court details
        user_bookings = list(bookings.aggregate([
            {
                '$match': {
                    'userId': ObjectId(current_user_id)
                }
            },
            {
                '$lookup': {
                    'from': 'courts',
                    'localField': 'courtId',
                    'foreignField': '_id',
                    'as': 'court'
                }
            },
            {
                '$unwind': '$court'
            },
            {
                '$sort': {
                    'date': -1
                }
            }
        ]))
        
        # Convert ObjectId to string for JSON serialization
        for booking in user_bookings:
            booking['_id'] = str(booking['_id'])
            booking['userId'] = str(booking['userId'])
            booking['courtId'] = str(booking['courtId'])
            booking['court']['_id'] = str(booking['court']['_id'])
        
        return jsonify({
            "bookings": user_bookings
        }), 200
        
    except Exception as e:
        print(f"Error fetching user bookings: {str(e)}")
        return jsonify({"error": "Failed to fetch bookings"}), 500

# Add this to initialize some sample courts if none exist
def init_sample_courts():
    if courts.count_documents({}) == 0:
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
            {
                "name": "Community Badminton Court",
                "description": "Affordable badminton courts for casual players",
                "image": "https://images.unsplash.com/photo-1613918431747-0e7aad504dbd",
                "pricePerHour": 400,
                "sport": "Badminton",
                "status": "Active",
                "amenities": [
                    "Standard courts",
                    "Basic equipment",
                    "Water facility",
                    "Lockers"
                ],
                "maxPlayers": 4,
                "timing": "6 AM - 9 PM",
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
            {
                "name": "Indoor Tennis Center",
                "description": "All-weather tennis facility with climate control",
                "image": "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6",
                "pricePerHour": 1500,
                "sport": "Tennis",
                "status": "Active",
                "amenities": [
                    "Climate controlled",
                    "Premium courts",
                    "Video analysis",
                    "Pro coaching",
                    "Gym access"
                ],
                "maxPlayers": 4,
                "timing": "6 AM - 11 PM",
                "type": "Indoor"
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
            {
                "name": "Outdoor Basketball Court",
                "description": "Street-style basketball court with lighting",
                "image": "https://images.unsplash.com/photo-1544919982-b61976f0ba43",
                "pricePerHour": 500,
                "sport": "Basketball",
                "status": "Active",
                "amenities": [
                    "Professional hoops",
                    "Night lighting",
                    "Water station",
                    "Basic equipment"
                ],
                "maxPlayers": 10,
                "timing": "6 AM - 9 PM",
                "type": "Outdoor"
            },
            # Volleyball Courts
            {
                "name": "Beach Volleyball Arena",
                "description": "Professional beach volleyball courts with sand imported from Australia",
                "image": "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1",
                "pricePerHour": 900,
                "sport": "Volleyball",
                "status": "Active",
                "amenities": [
                    "Premium sand",
                    "Professional nets",
                    "Changing rooms",
                    "Beach showers",
                    "Equipment rental"
                ],
                "maxPlayers": 12,
                "timing": "6 AM - 6 PM",
                "type": "Outdoor"
            },
            {
                "name": "Indoor Volleyball Court",
                "description": "Professional indoor volleyball facility with spring flooring",
                "image": "https://images.unsplash.com/photo-1592656094267-764a45160876",
                "pricePerHour": 800,
                "sport": "Volleyball",
                "status": "Active",
                "amenities": [
                    "Spring flooring",
                    "Air conditioning",
                    "Scoreboard",
                    "Basic equipment",
                    "Coaching available"
                ],
                "maxPlayers": 12,
                "timing": "6 AM - 10 PM",
                "type": "Indoor"
            }
        ]
        courts.insert_many(sample_courts)
        print("Sample courts initialized")

# Call this after MongoDB connection
init_sample_courts()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)