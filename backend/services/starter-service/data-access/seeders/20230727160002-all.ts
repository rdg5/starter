module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert users
    await queryInterface.bulkInsert('User', [
      {
        username: 'user1',
        email: 'user1@example.com',
        password: 'password1',
        verifiedAt: null,
        verificationToken: 'token1',
        verificationTokenExpiresAt: new Date(),
        forgottenPasswordToken: 'token1',
        forgottenPasswordTokenExpiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: 'password2',
        verifiedAt: null,
        verificationToken: 'token2',
        verificationTokenExpiresAt: new Date(),
        forgottenPasswordToken: 'token2',
        forgottenPasswordTokenExpiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: 'password3',
        verifiedAt: null,
        verificationToken: 'token3',
        verificationTokenExpiresAt: new Date(),
        forgottenPasswordToken: 'token3',
        forgottenPasswordTokenExpiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert permissions
    await queryInterface.bulkInsert('Permission', [
      { ability: 'Read', createdAt: new Date(), updatedAt: new Date() },
      { ability: 'Write', createdAt: new Date(), updatedAt: new Date() },
      { ability: 'Delete', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert teams
    await queryInterface.bulkInsert('Team', [
      { name: 'Team A', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Team B', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Team C', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert roles
    await queryInterface.bulkInsert('Role', [
      { role: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { role: 'Member', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert User-Permission associations
    await queryInterface.bulkInsert('UserPermission', [
      {
        userId: 1,
        permissionId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 2,
        permissionId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        userId: 3,
        permissionId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Insert User-Team associations
    await queryInterface.bulkInsert('UserTeam', [
      { userId: 1, teamId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, teamId: 2, createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, teamId: 3, createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Insert User-Role associations
    await queryInterface.bulkInsert('UserRole', [
      { userId: 1, roleId: 1, createdAt: new Date(), updatedAt: new Date() },
      { userId: 2, roleId: 2, createdAt: new Date(), updatedAt: new Date() },
      { userId: 3, roleId: 2, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface) {
    // Delete all data from the tables in reverse order to avoid foreign key constraints
    await queryInterface.bulkDelete('UserPermission', null, {});
    await queryInterface.bulkDelete('UserTeam', null, {});
    await queryInterface.bulkDelete('UserRole', null, {});
    await queryInterface.bulkDelete('User', null, {});
    await queryInterface.bulkDelete('Permission', null, {});
    await queryInterface.bulkDelete('Team', null, {});
    await queryInterface.bulkDelete('Role', null, {});
  },
};
