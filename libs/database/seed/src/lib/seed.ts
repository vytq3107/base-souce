import { DataSource } from 'typeorm';
import { seedRoles } from './seeders/role.seeder';
import { seedAdminAccount } from './seeders/admin.seeder';
import { seedDepartmentsAndWorkspaces } from './seeders/department-workspace.seeder';

export async function runSeeders(dataSource: DataSource): Promise<void> {
  console.log('🌱 Starting database seeding...\n');

  try {
    await seedRoles(dataSource);
    console.log('');

    await seedAdminAccount(dataSource);
    console.log('');

    await seedDepartmentsAndWorkspaces(dataSource);
    console.log('');

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}
