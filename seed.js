const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const uri = "mongodb://boonyupin30_db_user:boonyupin520@ac-ydivdaf-shard-00-00.sklmx2c.mongodb.net:27017,ac-ydivdaf-shard-00-01.sklmx2c.mongodb.net:27017,ac-ydivdaf-shard-00-02.sklmx2c.mongodb.net:27017/my-ecommerce?ssl=true&replicaSet=atlas-z3rrzs-shard-0&authSource=admin&retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");
    const db = client.db("my-ecommerce");

    const files = [
      { name: "01_users.mongodb.js", collection: "users" },
      { name: "02_cafe.mongodb.js", collection: "cafe" },
      { name: "03_cafe-tables.mongodb.js", collection: "cafe-tables" },
      { name: "04_board-games.mongodb.js", collection: "board-games" },
      { name: "05_cafe-games.mongodb.js", collection: "cafe-games" },
      { name: "06_meetup.mongodb.js", collection: "meetup" },
      { name: "07_booking.mongodb.js", collection: "booking" },
      { name: "08_payment.mongodb.js", collection: "payment" }
    ];

    for (const f of files) {
      const filePath = path.join(__dirname, 'temp-dbs', 'my-ecommerce-project', f.name);
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        continue;
      }
      let content = fs.readFileSync(filePath, 'utf8');

      // Clear existing array data
      let dataToInsert = [];
      const dbMock = {
        [f.collection]: {
          deleteMany: async () => {},
          insertMany: (arr) => {
            dataToInsert = arr;
          },
          find: () => {}
        }
      };

      function ObjectIdMock(id) {
        return new ObjectId(id);
      }

      // Clean shell commands
      content = content.replace(/use\(["']my-ecommerce["']\);?/g, '');
      // Replace db.collection-name with db["collection-name"] to avoid subtraction operator in JavaScript
      content = content.replace(/db\.([a-zA-Z0-9_-]+)/g, 'db["$1"]');

      // Execute script in mock sandbox
      try {
        const contextFunc = new Function('db', 'ObjectId', 'Date', content);
        contextFunc(dbMock, ObjectIdMock, Date);
      } catch (err) {
        console.error(`Error parsing file ${f.name}:`, err);
        continue;
      }

      const col = db.collection(f.collection);
      await col.deleteMany({});
      console.log(`Cleared collection ${f.collection}`);

      if (dataToInsert && dataToInsert.length > 0) {
        const cleanData = convertDates(dataToInsert);
        await col.insertMany(cleanData);
        console.log(`Seeded ${cleanData.length} documents into ${f.collection}`);
      } else {
        console.log(`No documents found to seed for ${f.collection}`);
      }
    }

    console.log("Database seeding completed successfully!");

  } catch (err) {
    console.error("Database seeding failed:", err);
  } finally {
    await client.close();
  }
}

function convertDates(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => convertDates(item));
  } else if (obj && typeof obj === 'object') {
    if (obj.constructor.name === 'ObjectId') {
      return obj; // keep ObjectId as is
    }
    if (obj.$date) {
      return new Date(obj.$date);
    }
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertDates(obj[key]);
    }
    return newObj;
  }
  return obj;
}

run();
