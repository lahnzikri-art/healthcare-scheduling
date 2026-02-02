import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';
import { AuthResponse } from './dto/auth.response';
import { User } from '../users/user.model';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('data') data: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(data);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('data') data: LoginInput): Promise<AuthResponse> {
    return this.authService.login(data);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async validateToken(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
