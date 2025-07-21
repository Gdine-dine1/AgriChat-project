const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ShopItem = require('../models/ShopItem');

dotenv.config();

const items = [
  {
    name: 'Fertilizer (50kg)',
    description: 'High-quality NPK fertilizer for all crops.',
    price: 3500,
    imageUrl: 'https://placehold.co/400x300?text=Fertilizer+50kg',
    stock: 100,
  },
  {
    name: 'Hybrid Maize Seeds (2kg)',
    description: 'Certified hybrid maize seeds for high yield.',
    price: 1200,
    imageUrl: 'https://placehold.co/400x300?text=Maize+Seeds',
    stock: 50,
  },
  {
    name: 'Drip Irrigation Kit',
    description: 'Complete drip irrigation kit for 1 acre.',
    price: 15000,
    imageUrl: 'https://placehold.co/400x300?text=Drip+Irrigation+Kit',
    stock: 20,
  },
  {
    name: 'Pesticide (1L)',
    description: 'Broad-spectrum pesticide for pest control.',
    price: 800,
    imageUrl: 'https://placehold.co/400x300?text=Pesticide+1L',
    stock: 60,
  },
  {
    name: 'Protective Gloves',
    description: 'Durable gloves for safe farm work.',
    price: 300,
    imageUrl: 'https://placehold.co/400x300?text=Gloves',
    stock: 200,
  },
  {
    name: 'Wheelbarrow',
    description: 'Heavy-duty wheelbarrow for farm transport.',
    price: 4500,
    imageUrl: 'https://placehold.co/400x300?text=Wheelbarrow',
    stock: 30,
  },
  {
    name: 'Watering Can (10L)',
    description: 'Durable plastic watering can for easy irrigation.',
    price: 700,
    imageUrl: 'https://placehold.co/400x300?text=Watering+Can',
    stock: 80,
  },
  {
    name: 'Hoe',
    description: 'Strong steel hoe for tilling and weeding.',
    price: 600,
    imageUrl: 'https://placehold.co/400x300?text=Hoe',
    stock: 100,
  },
  {
    name: 'Rake',
    description: 'Metal rake for soil leveling and debris removal.',
    price: 550,
    imageUrl: 'https://placehold.co/400x300?text=Rake',
    stock: 70,
  },
  {
    name: 'Shovel',
    description: 'Multipurpose shovel for digging and moving soil.',
    price: 900,
    imageUrl: 'https://placehold.co/400x300?text=Shovel',
    stock: 60,
  },
  {
    name: 'Sprayer (16L)',
    description: 'Knapsack sprayer for pesticides and fertilizers.',
    price: 2500,
    imageUrl: 'https://placehold.co/400x300?text=Sprayer+16L',
    stock: 40,
  },
  {
    name: 'Seedling Tray (50 cells)',
    description: 'Reusable tray for starting seedlings.',
    price: 350,
    imageUrl: 'https://placehold.co/400x300?text=Seedling+Tray',
    stock: 120,
  },
  {
    name: 'Pruning Shears',
    description: 'Sharp shears for pruning plants and trees.',
    price: 800,
    imageUrl: 'https://placehold.co/400x300?text=Pruning+Shears',
    stock: 90,
  },
  {
    name: 'Gumboots',
    description: 'Waterproof boots for muddy farm work.',
    price: 1200,
    imageUrl: 'https://placehold.co/400x300?text=Gumboots',
    stock: 110,
  },
  {
    name: 'Animal Feed (50kg)',
    description: 'Nutritious feed for livestock.',
    price: 2500,
    imageUrl: 'https://placehold.co/400x300?text=Animal+Feed',
    stock: 80,
  },
  {
    name: 'Milking Bucket (Stainless Steel)',
    description: 'Hygienic bucket for milking cows and goats.',
    price: 1800,
    imageUrl: 'https://placehold.co/400x300?text=Milking+Bucket',
    stock: 50,
  },
  {
    name: 'Egg Incubator (60 eggs)',
    description: 'Automatic incubator for hatching eggs.',
    price: 12000,
    imageUrl: 'https://placehold.co/400x300?text=Egg+Incubator',
    stock: 10,
  },
  {
    name: 'Beehive Kit',
    description: 'Complete kit for starting beekeeping.',
    price: 8000,
    imageUrl: 'https://placehold.co/400x300?text=Beehive+Kit',
    stock: 15,
  },
  {
    name: 'Greenhouse Film (10m)',
    description: 'UV-resistant film for greenhouse covering.',
    price: 3500,
    imageUrl: 'https://placehold.co/400x300?text=Greenhouse+Film',
    stock: 25,
  },
  {
    name: 'Compost Bin',
    description: 'Sturdy bin for making organic compost.',
    price: 2500,
    imageUrl: 'https://placehold.co/400x300?text=Compost+Bin',
    stock: 30,
  },
  {
    name: 'Solar Lantern',
    description: 'Rechargeable lantern for farm lighting.',
    price: 1500,
    imageUrl: 'https://placehold.co/400x300?text=Solar+Lantern',
    stock: 60,
  },
  {
    name: 'Rain Gauge',
    description: 'Accurate gauge for measuring rainfall.',
    price: 400,
    imageUrl: 'https://placehold.co/400x300?text=Rain+Gauge',
    stock: 70,
  },
  {
    name: 'Soil pH Meter',
    description: 'Digital meter for testing soil pH.',
    price: 2200,
    imageUrl: 'https://placehold.co/400x300?text=Soil+pH+Meter',
    stock: 40,
  },
  {
    name: 'Sprinkler Set',
    description: 'Rotating sprinkler set for garden irrigation.',
    price: 900,
    imageUrl: 'https://placehold.co/400x300?text=Sprinkler+Set',
    stock: 55,
  },
  {
    name: 'Farm Hat',
    description: 'Wide-brimmed hat for sun protection.',
    price: 350,
    imageUrl: 'https://placehold.co/400x300?text=Farm+Hat',
    stock: 90,
  },
  {
    name: 'Seed Planter',
    description: 'Handheld tool for easy seed planting.',
    price: 1200,
    imageUrl: 'https://placehold.co/400x300?text=Seed+Planter',
    stock: 35,
  },
  {
    name: 'Animal Vaccine (10 doses)',
    description: 'Essential vaccines for livestock health.',
    price: 3000,
    imageUrl: 'https://placehold.co/400x300?text=Animal+Vaccine',
    stock: 20,
  },
  {
    name: 'Farm Apron',
    description: 'Waterproof apron for farm chores.',
    price: 500,
    imageUrl: 'https://placehold.co/400x300?text=Farm+Apron',
    stock: 60,
  },
  {
    name: 'Livestock Ear Tags (Pack of 20)',
    description: 'Durable tags for animal identification.',
    price: 800,
    imageUrl: 'https://placehold.co/400x300?text=Ear+Tags',
    stock: 100,
  },
  {
    name: 'Farm First Aid Kit',
    description: 'Comprehensive kit for farm emergencies.',
    price: 2500,
    imageUrl: 'https://placehold.co/400x300?text=First+Aid+Kit',
    stock: 25,
  },
  {
    name: 'Manual Weeder',
    description: 'Hand tool for removing weeds efficiently.',
    price: 650,
    imageUrl: 'https://placehold.co/400x300?text=Manual+Weeder',
    stock: 80,
  },
  {
    name: 'Farm Record Book',
    description: 'Notebook for tracking farm activities and expenses.',
    price: 300,
    imageUrl: 'https://placehold.co/400x300?text=Record+Book',
    stock: 150,
  },
];

async function addShopItems() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await ShopItem.deleteMany({}); // Optional: clear existing items
    await ShopItem.insertMany(items);
    console.log('✅ Shop items added successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error adding shop items:', err);
    mongoose.disconnect();
  }
}

addShopItems();