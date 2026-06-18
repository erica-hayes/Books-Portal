const sequelize = require('../configurations/config');
const Book = require('../models/book-model');
const defaultBooks = require('../seeds/default-books');

async function seedBooks() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    let created = 0;
    let updated = 0;

    for (const seedBook of defaultBooks) {
      const [book, wasCreated] = await Book.findOrCreate({
        where: { ID: seedBook.ID },
        defaults: seedBook
      });

      if (wasCreated) {
        created += 1;
        continue;
      }

      await book.update(seedBook);
      updated += 1;
    }

    console.log(`Seeding complete. Created: ${created}, Updated: ${updated}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed books:', error);
    process.exit(1);
  }
}

seedBooks();
