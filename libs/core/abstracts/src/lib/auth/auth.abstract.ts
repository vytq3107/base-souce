import { LoginDto, PaginatedResponseDto, PaginationQueryDto, SelectWorkspaceDto } from '@support-center/core/dtos';
import { Workspace, Account } from '@support-center/database/entities';
import { BaseServiceAbstract } from '../base/base-service.abstract';

// Defining the Interface (Port)
export interface IAuthService extends BaseServiceAbstract<Account> {
  login(loginDto: LoginDto): Promise<any>;
  selectWorkspace(accountId: string, selectWorkspaceDto: SelectWorkspaceDto): Promise<{ accessToken: string; workspace: Workspace }>;
  logout(accountId: string): Promise<{ success: boolean }>;
  getAccounts(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<Account>>;
}

// Defining the Abstract Class (Adapter Base)
export abstract class AuthAbstractService extends BaseServiceAbstract<Account> implements IAuthService {
   abstract login(loginDto: LoginDto): Promise<any>;
   abstract selectWorkspace(accountId: string, selectWorkspaceDto: SelectWorkspaceDto): Promise<{ accessToken: string; workspace: Workspace }>;
   abstract logout(accountId: string): Promise<{ success: boolean }>;
   abstract getAccounts(paginationQuery: PaginationQueryDto): Promise<PaginatedResponseDto<Account>>;
}
