import { DataSource } from 'typeorm';
import { Department, Workspace, WorkspaceMember, Account } from '@support-center/database/entities';

export async function seedDepartmentsAndWorkspaces(dataSource: DataSource): Promise<void> {
  const departmentRepository = dataSource.getRepository(Department);
  const workspaceRepository = dataSource.getRepository(Workspace);
  const workspaceMemberRepository = dataSource.getRepository(WorkspaceMember);
  const accountRepository = dataSource.getRepository(Account);

  // Create department
  let department = await departmentRepository.findOne({ where: { code: 'SUPPORT' } });
  if (!department) {
    department = departmentRepository.create({
      code: 'SUPPORT',
      name: 'Phòng Hỗ Trợ Khách Hàng',
      description: 'Phòng chịu trách nhiệm hỗ trợ khách hàng',
    });
    await departmentRepository.save(department);
    console.log(`✓ Created department: ${department.name}`);
  }

  // Create workspace
  let workspace = await workspaceRepository.findOne({
    where: { departmentId: department.id, name: 'Workspace Mặc Định' },
  });
  if (!workspace) {
    workspace = workspaceRepository.create({
      departmentId: department.id,
      name: 'Workspace Mặc Định',
      description: 'Workspace dành cho tất cả KTV',
    });
    await workspaceRepository.save(workspace);
    console.log(`✓ Created workspace: ${workspace.name}`);
  }

  // Add admin to workspace
  const adminAccount = await accountRepository.findOne({ where: { username: 'admin' } });
  if (adminAccount) {
    const existingMember = await workspaceMemberRepository.findOne({
      where: { accountId: adminAccount.id, workspaceId: workspace.id },
    });
    if (!existingMember) {
      const member = workspaceMemberRepository.create({
        accountId: adminAccount.id,
        workspaceId: workspace.id,
      });
      await workspaceMemberRepository.save(member);
      console.log(`✓ Added admin to workspace`);
    }
  }
}
