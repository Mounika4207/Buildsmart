require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const connectDB = require('../config/db');

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Turf.deleteMany({}),
      Booking.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users...');
    // Create users (password will be automatically hashed by pre-save hook)
    const customer = await User.create({
      name: 'Aditya Sen',
      email: 'aditya@example.com',
      password: 'password123',
      phone: '+91 99887 76655',
      role: 'customer',
    });

    const owner1 = await User.create({
      name: 'Rajesh Nair',
      email: 'rajesh.owner@playarena.example',
      password: 'password123',
      phone: '+91 98450 11223',
      role: 'owner',
    });

    const owner2 = await User.create({
      name: 'Meera Kapoor',
      email: 'meera.owner@playarena.example',
      password: 'password123',
      phone: '+91 98201 44556',
      role: 'owner',
    });

    const owner3 = await User.create({
      name: 'Vikram Reddy',
      email: 'vikram.owner@playarena.example',
      password: 'password123',
      phone: '+91 97000 88991',
      role: 'owner',
    });

    const admin = await User.create({
      name: 'Chief Admin',
      email: 'admin@playarena.example',
      password: 'password123',
      phone: '+91 98111 00000',
      role: 'admin',
    });

    console.log(`[Seed] Created 5 users (1 Customer, 3 Owners, 1 Admin).`);

    console.log('[Seed] Creating sports turf facilities...');
    const turfsData = [
      {
        name: 'Thunderbolt Arena & Astro Turf',
        sports: ['football', 'cricket'],
        city: 'Bengaluru',
        area: 'Koramangala 4th Block',
        address: 'Plot 42, 80 Feet Road, Near Sony World Signal, Koramangala, Bengaluru, Karnataka 560034',
        pricePerHour: 1400,
        rating: 4.8,
        reviewsCount: 3,
        isVerified: true,
        images: [
          'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1200&q=80',
        ],
        facilities: ['Floodlights', 'Parking', 'Locker Room', 'Drinking Water', 'Cafeteria', 'Equipment Rental'],
        openingHours: { open: '06:00', close: '23:00' },
        description:
          'Premier 7-a-side AstroTurf facility with FIFA 2-star certified artificial grass. Equipped with 800-lux tournament-grade floodlights, premium player dugout, clean shower rooms, and an attached sports cafe. Perfect for midnight box cricket leagues and competitive football matches.',
        owner: owner1._id,
        cancellationPolicy:
          'Full refund if cancelled at least 4 hours before the reserved start time. 50% refund within 2 to 4 hours.',
      },
      {
        name: 'Velocity Indoor Badminton & Pickleball Hub',
        sports: ['badminton', 'pickleball'],
        city: 'Mumbai',
        area: 'Andheri West',
        address: 'Survey 14, Link Road, Behind Infinity Mall, Andheri West, Mumbai, Maharashtra 400053',
        pricePerHour: 950,
        rating: 4.9,
        reviewsCount: 2,
        isVerified: true,
        images: [
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?auto=format&fit=crop&w=1200&q=80',
        ],
        facilities: ['Air Conditioning', 'BWF Wooden Flooring', 'Showers', 'Pro Shop', 'Water Cooler', 'Valet Parking'],
        openingHours: { open: '05:00', close: '23:30' },
        description:
          'Air-conditioned indoor multi-court complex featuring 4 BWF standard anti-slip wooden courts and 2 dedicated pickleball arenas. Non-marking shoes mandatory (rentals available at front desk).',
        owner: owner2._id,
        cancellationPolicy:
          'Free cancellation up to 6 hours before slot. No refund for cancellations made within 2 hours.',
      },
      {
        name: 'StrikeZone Floodlit Cricket Arena',
        sports: ['cricket'],
        city: 'Delhi NCR',
        area: 'Sector 62, Noida',
        address: 'C-58, Institutional Area, Near Fortis Hospital, Sector 62, Noida, Uttar Pradesh 201301',
        pricePerHour: 1800,
        rating: 4.7,
        reviewsCount: 1,
        isVerified: true,
        images: [
          'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
        ],
        facilities: ['LED Floodlights', 'Bowling Machine', 'Leather Ball Pitch', 'Viewing Gallery', 'Free Parking', 'Refreshments'],
        openingHours: { open: '06:00', close: '23:00' },
        description:
          'Engineered specifically for serious cricket enthusiasts. Offers high-tension side and ceiling netting (35ft clearance), dual cement and turf batting strips, plus optional Robo-Arm bowling machine with speed controller.',
        owner: owner1._id,
        cancellationPolicy: 'Cancellations allowed up to 12 hours prior with 90% refund.',
      },
      {
        name: 'Ace Point Tennis & Pickleball Academy',
        sports: ['tennis', 'pickleball'],
        city: 'Hyderabad',
        area: 'Gachibowli',
        address: 'Old Mumbai Highway, Beside Bio-Diversity Park, Gachibowli, Hyderabad, Telangana 500032',
        pricePerHour: 1200,
        rating: 4.6,
        reviewsCount: 0,
        isVerified: false, // Pending verification for admin workflow demonstration!
        images: [
          'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
        ],
        facilities: ['Cushioned Acrylic Surface', 'Ball Boy Assistance', 'Coaching Available', 'Locker Room', 'Parking'],
        openingHours: { open: '06:00', close: '22:00' },
        description:
          'US Open spec 8-layer cushioned acrylic hard courts that are gentle on joints and knees. Features shadow-free LED floodlight masts, racket stringing services, and tournament grade balls.',
        owner: owner3._id,
        cancellationPolicy: 'Cancellation permissible up to 8 hours before match time.',
      },
      {
        name: 'SkyHoops Downtown Basketball Court',
        sports: ['basketball'],
        city: 'Bengaluru',
        area: 'Indiranagar',
        address: '100ft Road, Opposite Toit Brewery, Indiranagar, Bengaluru, Karnataka 560038',
        pricePerHour: 1100,
        rating: 4.9,
        reviewsCount: 1,
        isVerified: true,
        images: [
          'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
        ],
        facilities: ['Breakaway Rims', 'Scoreboard & Timer', 'Floodlights', 'Drinking Water', 'Restrooms'],
        openingHours: { open: '06:00', close: '23:00' },
        description:
          'Rooftop basketball haven with panoramic skyline views. Equipped with professional tempered glass backboards, spring-loaded breakaway rims, and high-traction poly-resin outdoor flooring.',
        owner: owner2._id,
        cancellationPolicy: 'Refund of 80% if cancelled 5 hours prior.',
      },
      {
        name: 'Camp Nou Arena Sports Complex',
        sports: ['football'],
        city: 'Chennai',
        area: 'Besant Nagar',
        address: 'Beach Road, 3rd Avenue, Besant Nagar, Chennai, Tamil Nadu 600090',
        pricePerHour: 1500,
        rating: 4.7,
        reviewsCount: 0,
        isVerified: true,
        images: [
          'https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
        ],
        facilities: ['FIFA Grade Grass', 'Beachside Breeze', 'Shower Facilities', 'Parking', 'First Aid On-site'],
        openingHours: { open: '06:00', close: '23:00' },
        description:
          'Coastal sports enclave with lush 50mm monofilament football turf right next to Elliot Beach. Features high-velocity perimeter blowers and night-time match illumination.',
        owner: owner3._id,
        cancellationPolicy: 'Free cancellation up to 4 hours in advance.',
      },
    ];

    const createdTurfs = await Turf.insertMany(turfsData);
    console.log(`[Seed] Created ${createdTurfs.length} sports facilities.`);

    console.log('[Seed] Creating player reviews...');
    await Review.create([
      {
        turf: createdTurfs[0]._id,
        user: customer._id,
        userName: 'Kunal Sharma',
        rating: 5,
        comment:
          'Top tier turf! The grass condition is phenomenal and the floodlights have zero blind spots. Will definitely book again for our weekend corporate tournament.',
      },
      {
        turf: createdTurfs[0]._id,
        user: customer._id,
        userName: 'Ananya Deshmukh',
        rating: 5,
        comment:
          'Clean shower rooms and very supportive turf staff. Booking through PlayArena was seamless.',
      },
      {
        turf: createdTurfs[0]._id,
        user: customer._id,
        userName: 'Rohan Verma',
        rating: 4,
        comment:
          'Great court, high ceiling clearance. Parking can get crowded around 8 PM, so arrive 15 minutes early.',
      },
      {
        turf: createdTurfs[1]._id,
        user: customer._id,
        userName: 'Aditya Sen',
        rating: 5,
        comment: 'BWF wooden flooring is pristine. Perfect bounce and grip.',
      },
    ]);

    console.log('[Seed] Creating demo bookings...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 5);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];

    await Booking.create([
      {
        bookingReference: 'PA-2026-9018',
        customer: {
          user: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        turf: createdTurfs[0]._id,
        date: tomorrowStr,
        startTime: '19:00',
        endTime: '20:00',
        duration: 1,
        sport: 'football',
        totalAmount: 1400,
        status: 'confirmed',
        paymentStatus: 'pending',
        paymentMethod: 'Pay at Venue',
      },
      {
        bookingReference: 'PA-2026-8842',
        customer: {
          user: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        turf: createdTurfs[1]._id,
        date: nextWeekStr,
        startTime: '07:00',
        endTime: '09:00',
        duration: 2,
        sport: 'badminton',
        totalAmount: 1900,
        status: 'confirmed',
        paymentStatus: 'paid',
        paymentMethod: 'Online UPI',
      },
      {
        bookingReference: 'PA-2026-7719',
        customer: {
          user: customer._id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        turf: createdTurfs[2]._id,
        date: '2026-10-15',
        startTime: '20:00',
        endTime: '22:00',
        duration: 2,
        sport: 'cricket',
        totalAmount: 3600,
        status: 'completed',
        paymentStatus: 'paid',
        paymentMethod: 'Online Card',
      },
    ]);

    console.log('====================================================');
    console.log('✅ [Seed] Database successfully seeded with demo records!');
    console.log('Demo Credentials for Evaluation:');
    console.log('  Customer:   aditya@example.com / password123');
    console.log('  Turf Owner: rajesh.owner@playarena.example / password123');
    console.log('  Admin:      admin@playarena.example / password123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Database seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
