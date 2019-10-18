module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('registrations', 'id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('registrations', 'id');
  },
};
