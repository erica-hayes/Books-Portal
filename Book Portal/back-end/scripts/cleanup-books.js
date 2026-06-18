const sequelize = require('../configurations/config');
const Book = require('../models/book-model');
const { Op } = require('sequelize');

function parseArgs(argv) {
  const args = {
    dryRun: true,
    email: '',
    titleContains: ''
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];

    if (token === '--apply') {
      args.dryRun = false;
      continue;
    }

    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }

    if (token === '--email') {
      args.email = (argv[i + 1] || '').trim();
      i += 1;
      continue;
    }

    if (token === '--title-contains') {
      args.titleContains = (argv[i + 1] || '').trim();
      i += 1;
      continue;
    }
  }

  return args;
}

function buildWhereClause({ email, titleContains }) {
  const andConditions = [];

  if (email) {
    andConditions.push({ email });
  }

  if (titleContains) {
    andConditions.push({
      title: {
        [Op.like]: `%${titleContains}%`
      }
    });
  }

  if (andConditions.length === 0) {
    return {
      [Op.or]: [
        { email: 'tester@example.com' },
        { title: { [Op.like]: '%test%' } },
        { title: { [Op.like]: '%tester%' } }
      ]
    };
  }

  if (andConditions.length === 1) {
    return andConditions[0];
  }

  return { [Op.and]: andConditions };
}

async function cleanupBooks() {
  const args = parseArgs(process.argv.slice(2));
  const where = buildWhereClause(args);

  try {
    await sequelize.authenticate();

    const matches = await Book.findAll({
      where,
      attributes: ['ID', 'title', 'email'],
      order: [['createdAt', 'DESC']]
    });

    if (matches.length === 0) {
      console.log('No matching books found.');
      process.exit(0);
    }

    console.log(`Matched ${matches.length} books:`);
    for (const book of matches) {
      console.log(`- ${book.ID} | ${book.title} | ${book.email}`);
    }

    if (args.dryRun) {
      console.log('Dry run only. No rows were deleted.');
      console.log('Run again with --apply to delete these records.');
      process.exit(0);
    }

    const deleted = await Book.destroy({ where });
    console.log(`Deleted ${deleted} books.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to clean up books:', error);
    process.exit(1);
  }
}

cleanupBooks();
