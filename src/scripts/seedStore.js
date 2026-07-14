import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { ProductCategory } from '../features/product/productCategory.model.js';
import { Product } from '../features/product/product.model.js';

const seedStore = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.mongodbUri);
    console.log('Connected.');

    // Clear existing store data
    console.log('Clearing existing product categories and products...');
    await ProductCategory.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared.');

    // Seed Categories
    console.log('Seeding categories...');
    const categoriesData = [
      {
        name: 'Cables & Adapters',
        description: 'Essential charging cables and adapters for your EV.',
        isActive: true,
      },
      {
        name: 'Mounts & Mats',
        description: 'Organize your charging station with mounts and garage mats.',
        isActive: true,
      },
      {
        name: 'Smart Chargers',
        description: 'Advanced wallbox and portable chargers.',
        isActive: true,
      },
    ];
    
    const categories = await ProductCategory.insertMany(categoriesData);
    console.log(`Seeded ${categories.length} categories.`);
    
    // Map category names to their ObjectIds
    const categoryMap = categories.reduce((acc, cat) => {
      acc[cat.name] = cat._id;
      return acc;
    }, {});

    // Seed Products
    console.log('Seeding 10 products...');
    const productsData = [
      {
        name: 'type-2-to-type-2-5m',
        displayName: 'Type 2 to Type 2 Charging Cable (5m)',
        description: 'High-quality 5-meter charging cable for Type 2 EVs.',
        fullDescription: 'This premium 5-meter Type 2 to Type 2 charging cable offers fast and reliable charging at home or public stations. Built with durable materials to withstand daily use.',
        price: 149.99,
        rating: 4.8,
        reviews: 124,
        category: categoryMap['Cables & Adapters'],
        icon: 'electrical_services',
        stock: 50,
      },
      {
        name: 'portable-ev-charger-3pin',
        displayName: 'Portable EV Charger (3-pin)',
        description: 'Charge your EV from any standard 3-pin socket.',
        fullDescription: 'Perfect for emergencies or visiting friends and family. This portable charger plugs into any standard domestic 3-pin socket, providing a slow but steady charge.',
        price: 199.99,
        rating: 4.5,
        reviews: 89,
        category: categoryMap['Smart Chargers'],
        icon: 'power',
        stock: 25,
      },
      {
        name: 'wallbox-pulsar-plus',
        displayName: 'Wallbox Pulsar Plus 7.4kW',
        description: 'Compact and powerful smart home charger.',
        fullDescription: 'The Wallbox Pulsar Plus is our best-selling smart charger. It features WiFi and Bluetooth connectivity, scheduling capabilities, and a sleek, compact design.',
        price: 549.00,
        rating: 4.9,
        reviews: 312,
        category: categoryMap['Smart Chargers'],
        icon: 'ev_station',
        stock: 15,
      },
      {
        name: 'tesla-to-type-1-adapter',
        displayName: 'Tesla to Type 1 Adapter',
        description: 'Charge your Type 1 EV at Tesla Destination Chargers.',
        fullDescription: 'This adapter allows you to connect your Type 1 EV to Tesla Destination Chargers (excluding Superchargers), greatly expanding your charging options on the road.',
        price: 89.99,
        rating: 4.6,
        reviews: 45,
        category: categoryMap['Cables & Adapters'],
        icon: 'usb',
        stock: 100,
      },
      {
        name: 'ev-cable-organizer',
        displayName: 'EV Cable Organizer Hook',
        description: 'Keep your charging cable neatly coiled and off the floor.',
        fullDescription: 'A heavy-duty wall-mounted hook designed specifically for EV charging cables. Helps prevent tripping hazards and damage to your cable.',
        price: 24.99,
        rating: 4.7,
        reviews: 210,
        category: categoryMap['Mounts & Mats'],
        icon: 'cable',
        stock: 200,
      },
      {
        name: 'heavy-duty-garage-mat',
        displayName: 'Premium Heavy Duty Garage Mat',
        description: 'Protect your garage floor and add a touch of style.',
        fullDescription: 'This durable, oil-resistant garage mat is perfect for parking your EV on. It catches drips, prevents stains, and provides a comfortable surface to walk on.',
        price: 129.50,
        rating: 4.4,
        reviews: 67,
        category: categoryMap['Mounts & Mats'],
        icon: 'dashboard',
        stock: 30,
      },
      {
        name: 'smart-home-station-22kw',
        displayName: 'Smart Home Station Pro 22kW',
        description: 'Ultra-fast 3-phase home charging station.',
        fullDescription: 'For homes with 3-phase power, this 22kW charger provides blazing fast charging speeds. Features load balancing and solar integration capabilities.',
        price: 899.00,
        rating: 4.8,
        reviews: 54,
        category: categoryMap['Smart Chargers'],
        icon: 'ev_station',
        stock: 10,
      },
      {
        name: 'type-1-to-type-2-adapter',
        displayName: 'Type 1 to Type 2 Charging Adapter',
        description: 'Connect Type 1 vehicles to Type 2 public stations.',
        fullDescription: 'Essential for older EVs with a Type 1 inlet. This adapter lets you use the modern Type 2 untethered public charging infrastructure.',
        price: 75.00,
        rating: 4.5,
        reviews: 112,
        category: categoryMap['Cables & Adapters'],
        icon: 'usb',
        stock: 80,
      },
      {
        name: 'cable-carry-bag',
        displayName: 'EV Cable Carry Bag',
        description: 'Store your charging cable safely in the trunk.',
        fullDescription: 'A waterproof, durable zip bag designed to hold EV charging cables. Keeps your trunk clean and your cable protected from damage.',
        price: 19.99,
        rating: 4.6,
        reviews: 430,
        category: categoryMap['Mounts & Mats'],
        icon: 'shopping_bag',
        stock: 150,
      },
      {
        name: 'premium-wall-mount-bracket',
        displayName: 'Premium Charger Wall Mount Bracket',
        description: 'Securely mount your portable charger to the wall.',
        fullDescription: 'Turn your portable charger into a semi-permanent home solution. This sturdy bracket holds the control box of most portable EV chargers securely on your wall.',
        price: 34.50,
        rating: 4.3,
        reviews: 88,
        category: categoryMap['Mounts & Mats'],
        icon: 'hardware',
        stock: 120,
      }
    ];

    const products = await Product.insertMany(productsData);
    console.log(`Seeded ${products.length} products.`);

    console.log('Store seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding store data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
};

seedStore();
