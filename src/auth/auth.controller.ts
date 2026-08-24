import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type {
  AuthenticatedRequest,
  AuthenticatedUser,
} from './interfaces/authenticated-user.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { Public } from '../common/decorators/public.decorator';
import { PermissionsGuard } from './guards/permissions.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: LoginDto, @Req() request: AuthenticatedRequest) {
    return this.authService.login(dto, request.ip);
  }

  @Get('me')
  @Permissions('auth:me')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  me(@CurrentUser() user: AuthenticatedUser) {
    return { user };
  }

  @Patch('me')
  @Permissions('auth:me')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return { user: await this.authService.updateProfile(user.id, dto) };
  }

  @Post('logout')
  @Permissions('auth:logout')
  @UseGuards(PermissionsGuard)
  @ApiBearerAuth()
  async logout(@Req() request: AuthenticatedRequest) {
    await this.authService.logout(request.authSessionToken ?? '');

    return {
      message: 'Session closed successfully.',
    };
  }
}
