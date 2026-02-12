import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, minimum: 1, maximum: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 10;

  @ApiPropertyOptional({ example: 'admin' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt', enum: ['createdAt', 'username', 'fullName'], default: 'createdAt' })
  @IsIn(['createdAt', 'username', 'fullName'])
  @IsOptional()
  sortBy: 'createdAt' | 'username' | 'fullName' = 'createdAt';

  @ApiPropertyOptional({ example: 'DESC', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}
