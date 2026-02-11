import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectWorkspaceDto {
  @ApiProperty({ example: 'uuid-of-workspace' })
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;
}
