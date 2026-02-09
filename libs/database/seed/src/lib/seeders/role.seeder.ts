import { DataSource } from 'typeorm';
import { Role } from '@support-center/database/entities';
import { RoleCode } from '@support-center/shared/enum';

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);

  const roles = [
    {
      code: RoleCode.ADMIN,
      name: 'Administrator',
    },
    {
      code: RoleCode.KTV,
      name: 'Kỹ thuật viên',
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({ where: { code: roleData.code } });
    if (!existingRole) {
      const role = roleRepository.create(roleData);
      await roleRepository.save(role);
      console.log(`✓ Created role: ${roleData.name}`);
    }
  }
}
