import { DataSource } from 'typeorm';
import { Account, Profile, Role } from '@support-center/database/entities';
import { RoleCode } from '@support-center/shared/enum';
import * as bcrypt from 'bcryptjs';

export async function seedAdminAccount(dataSource: DataSource): Promise<void> {
  const accountRepository = dataSource.getRepository(Account);
  const profileRepository = dataSource.getRepository(Profile);
  const roleRepository = dataSource.getRepository(Role);

  const adminRole = await roleRepository.findOne({ where: { code: RoleCode.ADMIN } });
  if (!adminRole) {
    throw new Error('Admin role not found. Please seed roles first.');
  }

  const existingAdmin = await accountRepository.findOne({ where: { username: 'admin' } });
  if (!existingAdmin) {
    // Create profile
    const profile = profileRepository.create({
      fullName: 'Administrator',
      avatar: null,
    });
    await profileRepository.save(profile);

    // Create account
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);
    const account = accountRepository.create({
      username: 'admin',
      password: hashedPassword,
      profileId: profile.id,
      roleId: adminRole.id,
      isActive: true,
    });
    await accountRepository.save(account);
    console.log(`✓ Created admin account: admin / Admin@123456`);
  }
}
