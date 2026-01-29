const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
const Category = require("./models/category_model");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Connect to database
const connectDB = async () => {
  const conn = await mongoose.connect(process.env.LOCAL_DATABASE_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};

const categories = [
  {
    name: "Electronics",
    description: "Phones, laptops, chargers, earbuds, tablets, cameras, etc.",
    status: "active",
  },
  {
    name: "Fashion",
    description: "Clothes, shirts, pants, dresses, jackets, hoodies, casual wear",
    status: "active",
  },
  {
    name: "Beauty",
    description: "Face products, hair products, body wash, makeup, skincare",
    status: "active",
  },
  {
    name: "Jewellery",
    description: "Necklaces, rings, watches, bracelets, earrings, accessories",
    status: "active",
  },
  {
    name: "Toys",
    description: "Action figures, dolls, board games, puzzles, educational toys",
    status: "active",
  },
  {
    name: "Footwear",
    description: "Shoes, sneakers, sandals, boots, slippers, sports shoes",
    status: "active",
  },
  {
    name: "Furniture",
    description: "Chairs, tables, beds, sofas, cabinets, desks, shelves",
    status: "active",
  },
  {
    name: "Home and Living",
    description: "Decor, kitchenware, bedding, curtains, lamps, home essentials",
    status: "active",
  },
  {
    name: "Sports",
    description: "Sports equipment, fitness gear, bicycles, gym accessories",
    status: "active",
  },
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing categories only
    await Category.deleteMany();
    console.log("Existing categories deleted...".red.inverse);

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} Categories created`.green.inverse);

    console.log("\n✅ Categories imported successfully!".green.bold);
    console.log("\n📊 Categories created:".cyan.bold);
    createdCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (ID: ${cat._id})`);
    });

    console.log("\n💡 Next steps:".yellow.bold);
    console.log("   1. Users will register via Flutter app");
    console.log("   2. Users will create products via Flutter app");
    console.log("   3. Categories are now ready to use!");

    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await Category.deleteMany();

    console.log("Categories deleted...".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`.red.inverse);
    process.exit(1);
  }
};

// Run functions based on command line argument
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("Please use -i to import or -d to delete data".yellow);
  process.exit();
}