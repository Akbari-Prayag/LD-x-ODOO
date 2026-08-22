import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Tag,
  MapPin,
  Check,
  Globe,
  Users,
  Clock,
  Wallet,
  Plus,
  Trash2,
  Compass,
  Upload,
  Camera,
  Palmtree,
  Mountain,
  Landmark,
  Car,
  Heart,
  User,
  Utensils,
  X,
  FileImage,
  Link2,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { createTrip, selectTripsCreating } from '../../store/slices/tripsSlice.js'
import { fetchCities, selectCities } from '../../store/slices/citiesSlice.js'
import { createTripSchema } from '../../utils/validationSchemas.js'
import { formatCurrency } from '../../utils/formatUtils.js'
import Input from '../../components/ui/Input.jsx'
import Button from '../../components/ui/Button.jsx'

// Country Metadata Map (default currencies, phone codes, timezones)
const COUNTRY_META = {
  'India':                  { code: 'IN', currency: 'INR', phoneCode: '+91', timezone: 'Asia/Kolkata (GMT+5:30)' },
  'France':                 { code: 'FR', currency: 'EUR', phoneCode: '+33', timezone: 'Europe/Paris (GMT+1)' },
  'Japan':                  { code: 'JP', currency: 'JPY', phoneCode: '+81', timezone: 'Asia/Tokyo (GMT+9)' },
  'UAE':                    { code: 'AE', currency: 'AED', phoneCode: '+971', timezone: 'Asia/Dubai (GMT+4)' },
  'United Arab Emirates':   { code: 'AE', currency: 'AED', phoneCode: '+971', timezone: 'Asia/Dubai (GMT+4)' },
  'United States':          { code: 'US', currency: 'USD', phoneCode: '+1', timezone: 'America/New_York (GMT-5)' },
  'USA':                    { code: 'US', currency: 'USD', phoneCode: '+1', timezone: 'America/New_York (GMT-5)' },
  'Indonesia':              { code: 'ID', currency: 'IDR', phoneCode: '+62', timezone: 'Asia/Makassar (GMT+8)' },
  'Thailand':               { code: 'TH', currency: 'THB', phoneCode: '+66', timezone: 'Asia/Bangkok (GMT+7)' },
  'United Kingdom':         { code: 'GB', currency: 'GBP', phoneCode: '+44', timezone: 'Europe/London (GMT+0)' },
  'UK':                     { code: 'GB', currency: 'GBP', phoneCode: '+44', timezone: 'Europe/London (GMT+0)' },
  'Singapore':              { code: 'SG', currency: 'SGD', phoneCode: '+65', timezone: 'Asia/Singapore (GMT+8)' },
}

const CURRENCIES = [
  { code: 'INR', label: 'INR (₹) - Indian Rupee', symbol: '₹' },
  { code: 'USD', label: 'USD ($) - US Dollar', symbol: '$' },
  { code: 'EUR', label: 'EUR (€) - Euro', symbol: '€' },
  { code: 'GBP', label: 'GBP (£) - British Pound', symbol: '£' },
  { code: 'AED', label: 'AED (د.إ) - UAE Dirham', symbol: 'د.إ' },
  { code: 'SGD', label: 'SGD (S$) - Singapore Dollar', symbol: 'S$' },
  { code: 'JPY', label: 'JPY (¥) - Japanese Yen', symbol: '¥' },
  { code: 'THB', label: 'THB (฿) - Thai Baht', symbol: '฿' },
  { code: 'AUD', label: 'AUD (A$) - Australian Dollar', symbol: 'A$' },
]

// Professional Travel Styles using Lucide outline icons
const TRIP_STYLES = [
  { id: 'beach',     name: 'Beach & Coastal',    icon: Palmtree, tags: ['Beach', 'Sunset', 'Water Sports', 'Relaxation'], defaultBudget: 35000 },
  { id: 'mountains', name: 'Mountain Adventure', icon: Mountain, tags: ['Trekking', 'Scenic', 'Nature', 'Bonfire'],      defaultBudget: 30000 },
  { id: 'heritage',  name: 'Culture & Heritage', icon: Landmark, tags: ['History', 'Architecture', 'Museums', 'Palaces'],defaultBudget: 40000 },
  { id: 'roadtrip',  name: 'Scenic Roadtrip',    icon: Car,      tags: ['Road Trip', 'Explore', 'Photography', 'Scenic'], defaultBudget: 25000 },
  { id: 'romantic',  name: 'Romantic Getaway',   icon: Heart,    tags: ['Romantic', 'Lakeside', 'Fine Dining', 'Peaceful'],defaultBudget: 50000 },
  { id: 'solo',      name: 'Solo Backpacking',   icon: User,     tags: ['Solo Trip', 'Hostels', 'Budget', 'Culture'],     defaultBudget: 20000 },
  { id: 'family',    name: 'Family Holiday',     icon: Users,    tags: ['Family', 'Sightseeing', 'Kid Friendly', 'Resort'],defaultBudget: 60000 },
  { id: 'foodie',    name: 'Culinary & Foodie',  icon: Utensils, tags: ['Food Tour', 'Street Food', 'Cooking', 'Markets'], defaultBudget: 32000 },
]

// Comprehensive World Destination Matrix (Hundreds of real cities, regions, timezones & daily costs)
const COMPREHENSIVE_WORLD_DATABASE = [
  {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    phoneCode: '+91',
    regions: [
      {
        name: 'Maharashtra',
        cities: [
          { name: 'Mumbai', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3500, tags: ['City', 'Food', 'Culture', 'Bollywood'], image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Pune', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2400, tags: ['Heritage', 'Weekend', 'Cafes'], image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Lonavala & Khandala', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2800, tags: ['Hill Station', 'Waterfalls', 'Scenic'], image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Mahabaleshwar', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2600, tags: ['Hill Station', 'Strawberries', 'Viewpoints'], image: 'https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Alibaug', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3200, tags: ['Beach', 'Weekend', 'Forts'], image: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Nashik', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2200, tags: ['Vineyards', 'Wine Tour', 'Temples'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Nagpur', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2000, tags: ['Tigers', 'Lakes', 'Oranges'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Aurangabad (Chhatrapati Sambhajinagar)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2100, tags: ['Ajanta Ellora', 'History', 'Caves'], image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Shirdi', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1800, tags: ['Spiritual', 'Temples', 'Pilgrimage'], image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Rajasthan',
        cities: [
          { name: 'Jaipur', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2500, tags: ['Palaces', 'Culture', 'Bazaars', 'Forts'], image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Udaipur', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3200, tags: ['Lakes', 'Romantic', 'Palaces', 'Royalty'], image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Jodhpur', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2200, tags: ['Blue City', 'Forts', 'Heritage'], image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Jaisalmer', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2800, tags: ['Desert Safari', 'Dunes', 'Forts', 'Stargazing'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Pushkar', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1600, tags: ['Holy Lake', 'Camel Fair', 'Cafes', 'Desert'], image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Mount Abu', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2400, tags: ['Hill Station', 'Dilwara Temples', 'Sunset'], image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Ranthambore', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3500, tags: ['Tiger Safari', 'Wildlife', 'Nature'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Goa',
        cities: [
          { name: 'North Goa (Calangute, Anjuna, Vagator)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3000, tags: ['Beach', 'Nightlife', 'Cafes', 'Water Sports'], image: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80' },
          { name: 'South Goa (Palolem, Colva, Agonda)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2800, tags: ['Quiet Beach', 'Relaxation', 'Resorts', 'Sunsets'], image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Panaji (Fontainhas Heritage)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2500, tags: ['Latin Quarter', 'Architecture', 'Casinos', 'Food'], image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Delhi (NCR)',
        cities: [
          { name: 'New Delhi & Central', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3000, tags: ['Monuments', 'India Gate', 'Museums', 'Food'], image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Old Delhi (Chandni Chowk)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1800, tags: ['Street Food', 'Red Fort', 'Bazaars', 'Heritage'], image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Gurgaon & CyberHub', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3500, tags: ['Nightlife', 'Breweries', 'Dining', 'Modern'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Himachal Pradesh',
        cities: [
          { name: 'Manali & Solang', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2500, tags: ['Snow', 'Adventure', 'Paragliding', 'Valleys'], image: 'https://images.unsplash.com/photo-1626015365107-45a21b6d7a3f?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Shimla & Kufri', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2600, tags: ['Mall Road', 'Colonial', 'Toy Train', 'Pine Forests'], image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Dharamshala & McLeodganj', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2000, tags: ['Tibetan Culture', 'Monasteries', 'Triund Trek'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Kasol & Parvati Valley', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1800, tags: ['Backpacking', 'Trekking', 'Rivers', 'Cafes'], image: 'https://images.unsplash.com/photo-1626015365107-45a21b6d7a3f?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Spiti Valley', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2800, tags: ['High Altitude', 'Stargazing', 'Monasteries', 'Rugged'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Uttarakhand',
        cities: [
          { name: 'Rishikesh', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1800, tags: ['Rafting', 'Yoga', 'Ganga Aarti', 'Bungee'], image: 'https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Mussoorie & Dehradun', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2500, tags: ['Queen of Hills', 'Waterfalls', 'Scenic'], image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Nainital', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2400, tags: ['Naini Lake', 'Boating', 'Viewpoints'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Jim Corbett National Park', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3600, tags: ['Jungle Safari', 'Tigers', 'Resorts'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Kerala',
        cities: [
          { name: 'Kochi (Cochin)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2600, tags: ['Fort Kochi', 'Spice Market', 'Art', 'Seafood'], image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Munnar', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2400, tags: ['Tea Plantations', 'Misty Hills', 'Waterfalls'], image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Alleppey (Alappuzha)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3200, tags: ['Houseboat Cruise', 'Backwaters', 'Ayurveda'], image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Varkala', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2200, tags: ['Cliff Beach', 'Surfing', 'Sunsets', 'Cafes'], image: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Wayanad', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2400, tags: ['Caves', 'Wildlife', 'Treehouses', 'Trekking'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Karnataka',
        cities: [
          { name: 'Bengaluru (Bangalore)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3200, tags: ['Pub Capital', 'Tech City', 'Gardens', 'Food'], image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Mysore', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1900, tags: ['Palaces', 'Silk', 'Heritage', 'Dasara'], image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Coorg (Madikeri)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2800, tags: ['Coffee Estates', 'Waterfalls', 'Hills'], image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Hampi', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1800, tags: ['UNESCO Ruins', 'Boulders', 'History', 'Sunsets'], image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Gokarna', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1900, tags: ['Om Beach', 'Trekking', 'Peaceful', 'Shiva Temples'], image: 'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Uttar Pradesh',
        cities: [
          { name: 'Agra', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2200, tags: ['Taj Mahal', 'Agra Fort', 'Mughal History'], image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Varanasi (Kashi)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1600, tags: ['Ganges Ghats', 'Spiritual Aarti', 'Temples', 'Boating'], image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Lucknow', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2000, tags: ['Nawabi Cuisine', 'Kebabs', 'Imambara', 'Chikankari'], image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Mathura & Vrindavan', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 1500, tags: ['Lord Krishna', 'Holi', 'Temples', 'Spiritual'], image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Gujarat',
        cities: [
          { name: 'Ahmedabad', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2200, tags: ['Sabarmati Ashram', 'Food Trail', 'UNESCO Heritage'], image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Rann of Kutch', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3500, tags: ['White Desert', 'Rann Utsav', 'Moonlight Safari'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Gir National Park', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3400, tags: ['Asiatic Lions', 'Safari', 'Wildlife'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Statue of Unity (Kevadia)', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 2800, tags: ['World Tallest Statue', 'Laser Show', 'Valley of Flowers'], image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Jammu & Kashmir / Ladakh',
        cities: [
          { name: 'Srinagar & Dal Lake', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3000, tags: ['Houseboat', 'Shikara', 'Mughal Gardens'], image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Gulmarg', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3500, tags: ['Gondola Cable Car', 'Skiing', 'Snow Peaks'], image: 'https://images.unsplash.com/photo-1626015365107-45a21b6d7a3f?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Leh & Ladakh', timezone: 'Asia/Kolkata (GMT+5:30)', avgDailyCost: 3200, tags: ['Pangong Lake', 'Nubra Valley', 'Biking', 'Monasteries'], image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
  {
    code: 'AE',
    name: 'UAE',
    currency: 'AED',
    phoneCode: '+971',
    regions: [
      {
        name: 'Dubai',
        cities: [
          { name: 'Downtown Dubai & Burj Khalifa', timezone: 'Asia/Dubai (GMT+4)', avgDailyCost: 650, tags: ['Skyscrapers', 'Luxury Shopping', 'Fountain Show'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Dubai Marina & JBR Beach', timezone: 'Asia/Dubai (GMT+4)', avgDailyCost: 600, tags: ['Yacht Cruise', 'Beach Promenade', 'Nightlife'], image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Palm Jumeirah', timezone: 'Asia/Dubai (GMT+4)', avgDailyCost: 800, tags: ['Atlantis', 'Waterpark', 'Luxury Resorts'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Old Dubai & Gold Souk (Deira)', timezone: 'Asia/Dubai (GMT+4)', avgDailyCost: 350, tags: ['Abra Ride', 'Spice Souk', 'Heritage'], image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Abu Dhabi',
        cities: [
          { name: 'Abu Dhabi City & Grand Mosque', timezone: 'Asia/Dubai (GMT+4)', avgDailyCost: 550, tags: ['Sheikh Zayed Mosque', 'Louvre Museum', 'Corniche'], image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Yas Island', timezone: 'Asia/Dubai (GMT+4)', avgDailyCost: 650, tags: ['Ferrari World', 'Warner Bros', 'F1 Circuit'], image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    currency: 'EUR',
    phoneCode: '+33',
    regions: [
      {
        name: 'Île-de-France',
        cities: [
          { name: 'Paris', timezone: 'Europe/Paris (GMT+1)', avgDailyCost: 160, tags: ['Eiffel Tower', 'Louvre', 'Cafes', 'Fashion'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Versailles', timezone: 'Europe/Paris (GMT+1)', avgDailyCost: 140, tags: ['Royal Palace', 'Gardens', 'History'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'French Riviera (Côte d’Azur)',
        cities: [
          { name: 'Nice', timezone: 'Europe/Paris (GMT+1)', avgDailyCost: 180, tags: ['Promenade des Anglais', 'Mediterranean', 'Old Town'], image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Cannes', timezone: 'Europe/Paris (GMT+1)', avgDailyCost: 220, tags: ['Film Festival', 'Yachts', 'Beaches'], image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    currency: 'JPY',
    phoneCode: '+81',
    regions: [
      {
        name: 'Kanto (Tokyo Area)',
        cities: [
          { name: 'Tokyo (Shinjuku, Shibuya, Ginza)', timezone: 'Asia/Tokyo (GMT+9)', avgDailyCost: 14000, tags: ['Modern', 'Anime', 'Food', 'Neon Lights'], image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Hakone (Mount Fuji Views)', timezone: 'Asia/Tokyo (GMT+9)', avgDailyCost: 16000, tags: ['Onsen Hot Springs', 'Fuji Views', 'Lakes'], image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Kansai (Kyoto & Osaka)',
        cities: [
          { name: 'Kyoto', timezone: 'Asia/Tokyo (GMT+9)', avgDailyCost: 13000, tags: ['Ancient Temples', 'Geisha', 'Bamboo Forest', 'Shrines'], image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Osaka', timezone: 'Asia/Tokyo (GMT+9)', avgDailyCost: 12000, tags: ['Street Food Dotonbori', 'Castles', 'Universal Studios'], image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    phoneCode: '+1',
    regions: [
      {
        name: 'New York',
        cities: [
          { name: 'New York City (Manhattan & Brooklyn)', timezone: 'America/New_York (GMT-5)', avgDailyCost: 220, tags: ['Broadway', 'Central Park', 'Times Square', 'Museums'], image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'California',
        cities: [
          { name: 'San Francisco', timezone: 'America/Los_Angeles (GMT-8)', avgDailyCost: 200, tags: ['Golden Gate', 'Cable Cars', 'Fisherman Wharf'], image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Los Angeles', timezone: 'America/Los_Angeles (GMT-8)', avgDailyCost: 210, tags: ['Hollywood', 'Santa Monica', 'Theme Parks'], image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
  {
    code: 'SG',
    name: 'Singapore',
    currency: 'SGD',
    phoneCode: '+65',
    regions: [
      {
        name: 'Singapore City',
        cities: [
          { name: 'Marina Bay & Downtown', timezone: 'Asia/Singapore (GMT+8)', avgDailyCost: 180, tags: ['Gardens by the Bay', 'Skypark', 'Luxury'], image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Sentosa Island', timezone: 'Asia/Singapore (GMT+8)', avgDailyCost: 220, tags: ['Universal Studios', 'Beaches', 'Cable Car'], image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
  {
    code: 'TH',
    name: 'Thailand',
    currency: 'THB',
    phoneCode: '+66',
    regions: [
      {
        name: 'Bangkok',
        cities: [
          { name: 'Bangkok & Chao Phraya', timezone: 'Asia/Bangkok (GMT+7)', avgDailyCost: 1800, tags: ['Grand Palace', 'Floating Markets', 'Street Food'], image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
      {
        name: 'Southern Islands',
        cities: [
          { name: 'Phuket', timezone: 'Asia/Bangkok (GMT+7)', avgDailyCost: 2200, tags: ['Patong', 'Phi Phi Day Trips', 'Beaches'], image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Krabi (Ao Nang & Railay)', timezone: 'Asia/Bangkok (GMT+7)', avgDailyCost: 1900, tags: ['Limestone Cliffs', 'Island Hopping', 'Kayaking'], image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
  {
    code: 'ID',
    name: 'Indonesia',
    currency: 'IDR',
    phoneCode: '+62',
    regions: [
      {
        name: 'Bali',
        cities: [
          { name: 'Ubud (Cultural Heart)', timezone: 'Asia/Makassar (GMT+8)', avgDailyCost: 650000, tags: ['Rice Terraces', 'Yoga', 'Waterfalls', 'Art'], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Seminyak & Canggu', timezone: 'Asia/Makassar (GMT+8)', avgDailyCost: 850000, tags: ['Beach Clubs', 'Surfing', 'Cafes', 'Nightlife'], image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80' },
          { name: 'Nusa Penida & Lembongan', timezone: 'Asia/Makassar (GMT+8)', avgDailyCost: 550000, tags: ['Kelingking Beach', 'Manta Rays', 'Snorkeling'], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80' },
        ],
      },
    ],
  },
]

export default function CreateTripPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isCreating = useSelector(selectTripsCreating)
  const dbCities = useSelector(selectCities) || []
  const fileInputRef = useRef(null)

  // Load real cities from MySQL backend on mount
  useEffect(() => {
    dispatch(fetchCities({ limit: 100 }))
  }, [dispatch])

  // Merge Database Cities with Comprehensive World Database
  const countriesData = useMemo(() => {
    // Clone master world database as foundation
    const countryMap = {}
    COMPREHENSIVE_WORLD_DATABASE.forEach((country) => {
      countryMap[country.name] = {
        name: country.name,
        code: country.code,
        currency: country.currency,
        phoneCode: country.phoneCode,
        regions: {},
      }
      country.regions.forEach((reg) => {
        countryMap[country.name].regions[reg.name] = {
          name: reg.name,
          cities: [...reg.cities],
        }
      })
    })

    // If backend database has custom added cities, merge them in seamlessly!
    if (dbCities && dbCities.length > 0) {
      dbCities.forEach((city) => {
        const cName = city.country || 'India'
        const meta = COUNTRY_META[cName] || { code: cName.substring(0, 2).toUpperCase(), currency: 'USD', phoneCode: '+1' }
        if (!countryMap[cName]) {
          countryMap[cName] = {
            name: cName,
            code: meta.code,
            currency: meta.currency,
            phoneCode: meta.phoneCode,
            regions: {},
          }
        }
        const rName = city.region || city.state || 'General'
        if (!countryMap[cName].regions[rName]) {
          countryMap[cName].regions[rName] = {
            name: rName,
            cities: [],
          }
        }

        // Avoid duplicate cities by name
        const exists = countryMap[cName].regions[rName].cities.some(
          (c) => c.name.toLowerCase() === city.name.toLowerCase()
        )
        if (!exists) {
          countryMap[cName].regions[rName].cities.push({
            id: city.id,
            name: city.name,
            timezone: meta.timezone || 'Asia/Kolkata (GMT+5:30)',
            avgDailyCost: city.avgDailyCost || 3000,
            tags: Array.isArray(city.tags) ? city.tags : ['Explore', 'Sightseeing'],
            image: city.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
            lat: city.lat,
            lng: city.lng,
          })
        }
      })
    }

    return Object.values(countryMap).map((country) => ({
      ...country,
      regions: Object.values(country.regions),
    }))
  }, [dbCities])

  // Default dates: today and 7 days from now
  const today = new Date().toISOString().split('T')[0]
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  // Dynamic States
  const [selectedCountryCode, setSelectedCountryCode] = useState('IN')
  const [selectedRegionName, setSelectedRegionName] = useState('Maharashtra')
  const [selectedCityName, setSelectedCityName] = useState('Mumbai')

  const [travelersCount, setTravelersCount] = useState(2)
  const [activeTripStyle, setActiveTripStyle] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [customTag, setCustomTag] = useState('')
  const [coverPhotoMode, setCoverPhotoMode] = useState('upload') // 'upload' | 'url'
  const [coverPreview, setCoverPreview] = useState('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createTripSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: today,
      endDate: nextWeek,
      budget: '',
      currency: 'INR',
      coverPhoto: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    },
  })

  const watchStartDate = watch('startDate')
  const watchEndDate   = watch('endDate')
  const watchBudget    = watch('budget') || 0
  const watchCurrency  = watch('currency') || 'INR'
  const watchName      = watch('name') || ''
  const watchCover     = watch('coverPhoto')

  // Selected Country Object from dynamic dataset
  const currentCountry = useMemo(() => {
    return countriesData.find((c) => c.code === selectedCountryCode) || countriesData[0] || FALLBACK_COUNTRIES_DATA[0]
  }, [countriesData, selectedCountryCode])

  // Available Regions for Country
  const availableRegions = useMemo(() => currentCountry.regions || [], [currentCountry])

  // Current Region Object
  const currentRegion = useMemo(() => {
    return availableRegions.find((r) => r.name === selectedRegionName) || availableRegions[0] || { cities: [] }
  }, [availableRegions, selectedRegionName])

  // Available Cities for Region
  const availableCities = useMemo(() => currentRegion.cities || [], [currentRegion])

  // Current City Object
  const currentCity = useMemo(() => {
    return availableCities.find((c) => c.name === selectedCityName) || availableCities[0] || {}
  }, [availableCities, selectedCityName])

  // Dynamic Currency Symbol
  const currentCurrencySymbol = useMemo(() => {
    const match = CURRENCIES.find((c) => c.code === watchCurrency)
    return match?.symbol || '₹'
  }, [watchCurrency])

  // Dynamic Calculation: Duration
  const duration = useMemo(() => {
    if (!watchStartDate || !watchEndDate) return 1
    const start = new Date(watchStartDate)
    const end = new Date(watchEndDate)
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff + 1)
  }, [watchStartDate, watchEndDate])

  // Dynamic Calculation: Budget breakdown & Per-Person
  const totalBudget = Number(watchBudget) || 0
  const budgetPerPerson = travelersCount > 0 ? Math.round(totalBudget / travelersCount) : totalBudget
  const dailyPerPerson = duration > 0 ? Math.round(budgetPerPerson / duration) : budgetPerPerson
  const dailyTotal = duration > 0 ? Math.round(totalBudget / duration) : totalBudget

  // Dynamic Category Allocation (40% Stays, 25% Food, 20% Activities, 15% Transit)
  const budgetAllocations = useMemo(() => ({
    stays: Math.round(totalBudget * 0.40),
    food: Math.round(totalBudget * 0.25),
    activities: Math.round(totalBudget * 0.20),
    transit: Math.round(totalBudget * 0.15),
  }), [totalBudget])

  // Handle Country Selection
  const handleCountryChange = (countryCode) => {
    setSelectedCountryCode(countryCode)
    const country = countriesData.find((c) => c.code === countryCode)
    if (country) {
      setValue('currency', country.currency)
      const firstRegion = country.regions[0]
      if (firstRegion) {
        setSelectedRegionName(firstRegion.name)
        const firstCity = firstRegion.cities[0]
        if (firstCity) {
          setSelectedCityName(firstCity.name)
        }
      }
    }
  }

  // Handle Region Selection
  const handleRegionChange = (regionName) => {
    setSelectedRegionName(regionName)
    const region = availableRegions.find((r) => r.name === regionName)
    if (region && region.cities.length > 0) {
      const firstCity = region.cities[0]
      setSelectedCityName(firstCity.name)
    }
  }

  // Handle City Selection
  const handleCityChange = (cityName) => {
    setSelectedCityName(cityName)
    const city = availableCities.find((c) => c.name === cityName)
    if (city?.tags) {
      setSelectedTags((prev) => Array.from(new Set([...prev, ...city.tags])))
    }
  }

  // Handle Local File Upload for Cover Photo
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (.jpg, .png, .webp).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result
      if (typeof result === 'string') {
        setCoverPreview(result)
        setValue('coverPhoto', result)
        toast.success('Cover image uploaded successfully!')
      }
    }
    reader.readAsDataURL(file)
  }

  // Quick Date Shortcut Picker
  const handleQuickDates = (type) => {
    const now = new Date()
    let sDate = new Date()
    let eDate = new Date()

    if (type === 'weekend') {
      const day = now.getDay()
      const diffToFriday = (5 - day + 7) % 7
      sDate.setDate(now.getDate() + diffToFriday)
      eDate.setDate(sDate.getDate() + 2)
    } else if (type === 'week') {
      sDate.setDate(now.getDate() + 1)
      eDate.setDate(sDate.getDate() + 6)
    } else if (type === 'twoweeks') {
      sDate.setDate(now.getDate() + 7)
      eDate.setDate(sDate.getDate() + 13)
    } else if (type === 'nextmonth') {
      sDate.setMonth(now.getMonth() + 1)
      sDate.setDate(1)
      eDate = new Date(sDate)
      eDate.setDate(sDate.getDate() + 7)
    }

    const sStr = sDate.toISOString().split('T')[0]
    const eStr = eDate.toISOString().split('T')[0]
    setValue('startDate', sStr)
    setValue('endDate', eStr)
    toast.success(`Dates set: ${sStr} to ${eStr}`)
  }

  // Handle Trip Style Selection
  const handleSelectTripStyle = (style) => {
    setActiveTripStyle(style.id)
    setSelectedTags(style.tags)
    if (totalBudget === 0) {
      setValue('budget', style.defaultBudget)
    }
  }

  // Tag Toggling
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleAddCustomTag = (e) => {
    e.preventDefault()
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()])
      setCustomTag('')
    }
  }

  // Form Submit
  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        coverPhoto: coverPreview || data.coverPhoto,
        tags: selectedTags,
      }

      const createdTrip = await dispatch(createTrip(payload)).unwrap()
      const newId = createdTrip.id || createdTrip._id
      toast.success(`Trip "${createdTrip.name}" created successfully!`)
      navigate(`/trips/${newId}`)
    } catch (err) {
      toast.error(err || 'Failed to create trip')
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 animate-fade-in">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="btn btn-sm btn-ghost text-surface-600 hover:text-surface-900 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Trips</span>
        </Link>
      </div>

      {/* Main Grid: Form on Left + Live Interactive Preview Studio on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ── Left Column: Smart Form (7 Cols) ── */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* 1. Trip Name & Description */}
            <div className="card p-6 md:p-7 space-y-5 border border-surface-200 shadow-card">
              <div className="border-b border-surface-100 pb-3 flex items-center justify-between">
                <h2 className="text-base font-display font-bold text-surface-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary-600" />
                  <span>Trip Identity</span>
                </h2>
                <span className="text-xs text-surface-400 font-medium">Step 1 of 4</span>
              </div>

              <div className="space-y-4">
                <Input
                  label="Trip Name"
                  required
                  placeholder="e.g. Goa Coastal Escape, Tokyo Explorer 2026"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <div className="space-y-1.5">
                  <label className="input-label">Travel Notes / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description or travel goals for this journey..."
                    className="input py-2.5 resize-none text-xs"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="input-error-msg">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Destination Cascading Selector (Country -> Region -> City) */}
            <div className="card p-6 md:p-7 space-y-5 border border-surface-200 shadow-card">
              <div className="border-b border-surface-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-surface-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent-500" />
                    <span>Destination & Region</span>
                  </h2>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Select country, region, and primary destination city.
                  </p>
                </div>
                <span className="text-xs text-surface-400 font-medium">Step 2 of 4</span>
              </div>

              {/* 3-Tier Cascading Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {/* 1. Country */}
                <div className="space-y-1">
                  <label className="input-label">1. Country</label>
                  <select
                    value={selectedCountryCode}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="input py-2 text-xs bg-white font-medium text-surface-900"
                  >
                    {countriesData.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.currency})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Region / State */}
                <div className="space-y-1">
                  <label className="input-label">2. Region / State</label>
                  <select
                    value={selectedRegionName}
                    onChange={(e) => handleRegionChange(e.target.value)}
                    className="input py-2 text-xs bg-white font-medium text-surface-900"
                  >
                    {availableRegions.map((region) => (
                      <option key={region.name} value={region.name}>
                        {region.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. City */}
                <div className="space-y-1">
                  <label className="input-label">3. Primary City</label>
                  <select
                    value={selectedCityName}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="input py-2 text-xs bg-white font-medium text-surface-900"
                  >
                    {availableCities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Auto-detected Meta Box */}
              <div className="p-3.5 bg-surface-50 rounded-xl border border-surface-200/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-surface-400 block text-[10px]">Timezone</span>
                  <span className="font-semibold text-surface-800 truncate block">
                    {currentCity.timezone || 'Asia/Kolkata (GMT+5:30)'}
                  </span>
                </div>
                <div>
                  <span className="text-surface-400 block text-[10px]">Currency Default</span>
                  <span className="font-semibold text-surface-800 truncate block">
                    {currentCountry.currency}
                  </span>
                </div>
                <div>
                  <span className="text-surface-400 block text-[10px]">Phone Code</span>
                  <span className="font-semibold text-surface-800 block">
                    {currentCountry.phoneCode}
                  </span>
                </div>
                <div>
                  <span className="text-surface-400 block text-[10px]">Avg. Daily Cost</span>
                  <span className="font-semibold text-emerald-700 block">
                    ~{formatCurrency(currentCity.avgDailyCost || 3000, currentCountry.currency)}/day
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Dates, Duration & Live Budget Breakdown */}
            <div className="card p-6 md:p-7 space-y-5 border border-surface-200 shadow-card">
              <div className="border-b border-surface-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-surface-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    <span>Dates, Travelers & Budget</span>
                  </h2>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Set dates and budget to compute daily allowance and per-person splits.
                  </p>
                </div>
                <span className="text-xs text-surface-400 font-medium">Step 3 of 4</span>
              </div>

              {/* Quick Date Shortcut Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-xs text-surface-400 whitespace-nowrap">Quick Dates:</span>
                <button
                  type="button"
                  onClick={() => handleQuickDates('weekend')}
                  className="px-2.5 py-1 rounded-md bg-surface-100 hover:bg-surface-200 text-[11px] font-semibold text-surface-700 whitespace-nowrap cursor-pointer transition-colors"
                >
                  This Weekend
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDates('week')}
                  className="px-2.5 py-1 rounded-md bg-surface-100 hover:bg-surface-200 text-[11px] font-semibold text-surface-700 whitespace-nowrap cursor-pointer transition-colors"
                >
                  7 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDates('twoweeks')}
                  className="px-2.5 py-1 rounded-md bg-surface-100 hover:bg-surface-200 text-[11px] font-semibold text-surface-700 whitespace-nowrap cursor-pointer transition-colors"
                >
                  14 Days
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDates('nextmonth')}
                  className="px-2.5 py-1 rounded-md bg-surface-100 hover:bg-surface-200 text-[11px] font-semibold text-surface-700 whitespace-nowrap cursor-pointer transition-colors"
                >
                  Next Month
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  required
                  leftIcon={<Calendar className="w-4 h-4" />}
                  error={errors.startDate?.message}
                  {...register('startDate')}
                />

                <Input
                  label="End Date"
                  type="date"
                  required
                  min={watchStartDate}
                  leftIcon={<Calendar className="w-4 h-4" />}
                  error={errors.endDate?.message}
                  {...register('endDate')}
                />

                <Input
                  label="Total Target Budget"
                  type="number"
                  min="0"
                  step="any"
                  placeholder="e.g. 45000"
                  leftIcon={
                    <span className="font-bold text-xs text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded border border-primary-200">
                      {currentCurrencySymbol}
                    </span>
                  }
                  error={errors.budget?.message}
                  {...register('budget')}
                />

                <div className="space-y-1">
                  <label className="input-label">Currency</label>
                  <select
                    className="input py-2 text-xs bg-white text-surface-900 font-medium"
                    {...register('currency')}
                  >
                    {CURRENCIES.map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Travelers Counter */}
              <div className="flex items-center justify-between p-3.5 bg-surface-50 rounded-xl border border-surface-200/80">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-primary-600" />
                  <div>
                    <span className="text-xs font-bold text-surface-900 block">Travelers Group Size</span>
                    <span className="text-[10px] text-surface-500">
                      {travelersCount === 1 ? 'Solo Trip' : travelersCount === 2 ? 'Couple / Duo' : 'Family / Group Trip'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 4, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTravelersCount(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        travelersCount === num
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-white border border-surface-200 text-surface-700 hover:bg-surface-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live Budget Summary Box */}
              {totalBudget > 0 && (
                <div className="p-4 bg-gradient-to-br from-primary-50/70 to-indigo-50/40 rounded-xl border border-primary-100 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-primary-950 flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-primary-600" />
                      Daily Allowance Breakdown
                    </span>
                    <span className="font-extrabold text-primary-700">
                      {duration} Days &bull; {travelersCount} {travelersCount === 1 ? 'Person' : 'People'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-white p-2 rounded-lg border border-primary-100/80">
                      <span className="text-[10px] text-surface-400 block">Per Day (Total)</span>
                      <span className="text-xs font-bold text-surface-900">
                        {formatCurrency(dailyTotal, watchCurrency)}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-primary-100/80">
                      <span className="text-[10px] text-surface-400 block">Per Person / Day</span>
                      <span className="text-xs font-bold text-emerald-700">
                        {formatCurrency(dailyPerPerson, watchCurrency)}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-primary-100/80">
                      <span className="text-[10px] text-surface-400 block">Per Person Total</span>
                      <span className="text-xs font-bold text-surface-900">
                        {formatCurrency(budgetPerPerson, watchCurrency)}
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-primary-100/80">
                      <span className="text-[10px] text-surface-400 block">Tier</span>
                      <span className="text-[11px] font-bold text-indigo-700">
                        {dailyPerPerson > 8000 ? 'Luxury' : dailyPerPerson > 3000 ? 'Comfort' : 'Budget'}
                      </span>
                    </div>
                  </div>

                  {/* Suggested Category Split */}
                  <div className="pt-2 border-t border-primary-100/60 grid grid-cols-4 gap-1 text-[10px] text-surface-600 text-center">
                    <div>Stays: {formatCurrency(budgetAllocations.stays, watchCurrency)}</div>
                    <div>Food: {formatCurrency(budgetAllocations.food, watchCurrency)}</div>
                    <div>Sights: {formatCurrency(budgetAllocations.activities, watchCurrency)}</div>
                    <div>Transit: {formatCurrency(budgetAllocations.transit, watchCurrency)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Travel Style (Clean Lucide Icons, No Emojis) */}
            <div className="card p-6 md:p-7 space-y-5 border border-surface-200 shadow-card">
              <div className="border-b border-surface-100 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-display font-bold text-surface-900 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary-600" />
                    <span>Travel Style & Preferences</span>
                  </h2>
                  <p className="text-xs text-surface-500 mt-0.5">
                    Select a travel style to auto-tune suggested activities and tags.
                  </p>
                </div>
                <span className="text-xs text-surface-400 font-medium">Step 4 of 4</span>
              </div>

              {/* Travel Style Buttons with Lucide Icons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TRIP_STYLES.map((style) => {
                  const isSelected = activeTripStyle === style.id
                  const IconComponent = style.icon
                  return (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => handleSelectTripStyle(style)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-start gap-1.5 ${
                        isSelected
                          ? 'border-primary-600 bg-primary-50/70 ring-2 ring-primary-500/20 font-bold text-primary-900 shadow-xs'
                          : 'border-surface-200 bg-white hover:bg-surface-50 text-surface-800'
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${isSelected ? 'text-primary-600' : 'text-surface-500'}`} />
                      <span className="text-xs font-semibold block leading-tight">{style.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Selected Tags */}
              <div className="space-y-2 pt-2">
                <label className="input-label">Selected Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTags.length === 0 ? (
                    <span className="text-xs text-surface-400 italic">No tags selected yet. Click a style above or add custom tags.</span>
                  ) : (
                    selectedTags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-2.5 py-1 rounded-md bg-primary-100 text-primary-800 text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-primary-200 transition-colors"
                      >
                        <span>{tag}</span>
                        <span className="text-primary-500 hover:text-danger-600 font-bold">&times;</span>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Custom Tag */}
                <div className="flex items-center gap-2 max-w-xs pt-1">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="Add custom tag..."
                    className="input py-1 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddCustomTag(e)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link to="/trips">
                <Button variant="outline" size="md" disabled={isCreating}>
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isCreating}
                className="min-w-[180px] font-bold shadow-md"
              >
                Create Itinerary &rarr;
              </Button>
            </div>
          </form>
        </div>

        {/* ── Right Column: Live Trip Preview & Cover Photo Upload Studio ── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-5">

            {/* Live Preview Card */}
            <div className="card overflow-hidden border border-surface-200 shadow-card-lg bg-white">
              <div className="p-3.5 border-b border-surface-100 bg-surface-50/70 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-surface-900">Live TripCard Preview</span>
                </div>
                <span className="text-[11px] text-surface-500">Updates in real-time</span>
              </div>

              {/* Cover Photo with Badges */}
              <div className="relative aspect-video bg-surface-100">
                <img
                  src={coverPreview}
                  alt="Trip Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                  <span className="badge badge-primary text-[10px] font-bold">
                    Planning
                  </span>
                  <span className="badge bg-black/40 backdrop-blur-xs text-white text-[10px] font-semibold">
                    {currentCountry.name}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                  <span className="text-[11px] text-white/80 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{duration} Days &bull; {travelersCount} {travelersCount === 1 ? 'Traveler' : 'Travelers'}</span>
                  </span>
                  <h3 className="text-lg font-bold font-display text-white drop-shadow-sm truncate">
                    {watchName || 'Untitled Journey'}
                  </h3>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-3.5">
                <div className="space-y-2 text-xs text-surface-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                    <span className="font-semibold text-surface-800">
                      {watchStartDate} &rarr; {watchEndDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent-500 shrink-0" />
                    <span className="truncate">
                      Destination: {currentCity.name ? `${currentCity.name}, ${currentCountry.name}` : currentCountry.name}
                    </span>
                  </div>
                </div>

                {/* Budget Progress Bar */}
                {totalBudget > 0 && (
                  <div className="pt-2 border-t border-surface-100 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-500 font-medium">Estimated Budget</span>
                      <span className="font-extrabold text-surface-900">
                        {formatCurrency(totalBudget, watchCurrency)}
                      </span>
                    </div>
                    <div className="w-full bg-surface-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-600 h-full w-2/5 rounded-full" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Cover Photo Upload Card (No Presets) ── */}
            <div className="card p-5 space-y-4 border border-surface-200 bg-white shadow-card">
              <div className="flex items-center justify-between border-b border-surface-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-surface-900">
                  <Camera className="w-4 h-4 text-primary-600" />
                  <span>Trip Cover Photo</span>
                </div>

                {/* Mode Switcher */}
                <div className="flex items-center rounded-lg bg-surface-100 p-0.5 border border-surface-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setCoverPhotoMode('upload')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      coverPhotoMode === 'upload' ? 'bg-white shadow-2xs text-primary-700 font-bold' : 'text-surface-600 hover:text-surface-900'
                    }`}
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverPhotoMode('url')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                      coverPhotoMode === 'url' ? 'bg-white shadow-2xs text-primary-700 font-bold' : 'text-surface-600 hover:text-surface-900'
                    }`}
                  >
                    <Link2 className="w-3 h-3" />
                    <span>Image URL</span>
                  </button>
                </div>
              </div>

              {coverPhotoMode === 'upload' ? (
                <div className="space-y-3">
                  {/* Hidden Native File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  {/* Drag & Drop Area */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-surface-300 hover:border-primary-500 bg-surface-50/70 hover:bg-primary-50/20 rounded-2xl p-6 text-center transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-100 group-hover:bg-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-2.5 transition-colors shadow-2xs">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-surface-800">
                      Click to upload cover photo
                    </p>
                    <p className="text-[11px] text-surface-400 mt-1">
                      Supports JPG, PNG, WEBP (Max 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    label="Image Web URL"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={watchCover}
                    onChange={(e) => {
                      setValue('coverPhoto', e.target.value)
                      setCoverPreview(e.target.value)
                    }}
                    error={errors.coverPhoto?.message}
                  />
                  <p className="text-[11px] text-surface-400">
                    Paste any public image URL from Unsplash or other sources.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
