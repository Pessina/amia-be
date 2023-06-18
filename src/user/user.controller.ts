import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { FirebaseAuthGuard } from 'src/auth/guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post()
  async createUser(@Body() userData: Prisma.UserCreateInput) {
    console.log('userData', userData);
    return this.userService.createUser(userData);
  }
}
