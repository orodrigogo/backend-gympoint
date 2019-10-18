module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('users', 'provider', 'admin'); // 'myTable', 'oldName', 'newName'
  },

  down: queryInterface => {
    return queryInterface.renameColumn('users', 'admin', 'provider');
  },
};
