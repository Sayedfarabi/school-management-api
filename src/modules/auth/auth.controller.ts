import type { Response } from 'express';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin_user.dto';
import { ResponseMessage } from 'src/common/decorators/response_message.decorator';
import { SignUpDto } from './dto/signup_user.dto';

@Controller({ path: 'api/auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ResponseMessage('User logged in successfully')
  async signIn(
    @Body() data: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.loginUser(data);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // better for frontend apps
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // important
    });

    return {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
      },
    };
  }

  @Post('register')
  @ResponseMessage('User created successfully')
  async signUp(
    @Body() data: SignUpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken, accessToken } =
      await this.authService.registerUser(data);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return {
      statusCode: 201,
      success: true,
      message: 'User created successfully',
      data: {
        accessToken,
      },
    };
  }
}
