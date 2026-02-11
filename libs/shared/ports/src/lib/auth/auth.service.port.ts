import { LoginDto, SelectWorkspaceDto } from '@support-center/core/dtos';
import { Workspace } from '@support-center/database/entities';

export interface IAuthService {
  login(loginDto: LoginDto): Promise<any>;
  selectWorkspace(accountId: string, selectWorkspaceDto: SelectWorkspaceDto): Promise<{ accessToken: string; workspace: Workspace }>;
  logout(accountId: string): Promise<{ success: boolean }>;
}

export const IAuthService = Symbol('IAuthService'); // Token for DI
