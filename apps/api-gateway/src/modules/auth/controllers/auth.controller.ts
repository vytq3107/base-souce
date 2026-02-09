import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '@support-center/data-access';
import { LoginDto, SelectWorkspaceDto } from '@support-center/core/dtos';
import { JwtAuthGuard } from '@support-center/core/guards';
import { User } from '@support-center/core/decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('select-workspace')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Select a workspace to work in' })
  @HttpCode(HttpStatus.OK)
  async selectWorkspace(
    @User('sub') accountId: string,
    @Body() selectWorkspaceDto: SelectWorkspaceDto
  ) {
    return this.authService.selectWorkspace(accountId, selectWorkspaceDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @HttpCode(HttpStatus.OK)
  async logout(@User('sub') accountId: string) {
    return this.authService.logout(accountId);
  }
}
