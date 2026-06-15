const Sequelize = require('sequelize');

const sequelize = new Sequelize('books_portal', 'books_user', 'books_user_password', {
  dialect: 'mysql',
  dialectOptions: {
    authPlugins: {
      mysql_clear_password() {
        return () => 'books_user_password';
      }
    }
  }
});

module.exports = sequelize;