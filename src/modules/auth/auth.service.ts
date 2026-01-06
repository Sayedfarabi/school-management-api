/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto } from './dto/signin_user.dto';
import { SignUpDto } from './dto/signup_user.dto';
import * as bcrypt from 'bcrypt';
import { jwtHelpers } from 'src/common/helpers/jwt_helper';
import { StringValue } from 'ms';
import { Secret } from 'jsonwebtoken';
import { UserRole } from 'generated/prisma/enums';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private generateAccessToken(userId: string, email: string, role: string) {
    const accessToken = jwtHelpers.generateToken(
      {
        id: userId,
        email,
        role,
      },
      this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET') as Secret,
      this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRES_IN',
      ) as StringValue,
    );
    return accessToken;
  }

  private generateRefreshToken(userId: string, email: string, role: string) {
    const refreshToken = jwtHelpers.generateToken(
      {
        id: userId,
        email,
        role,
      },
      this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET') as Secret,
      this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      ) as StringValue,
    );
    return refreshToken;
  }

  async loginUser(data: SignInDto) {
    try {
      // find user by email
      const user = await this.prisma.user.findUnique({
        where: { email: data.email },
      });
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      // compare password
      const isCorrectPassword: boolean = await bcrypt.compare(
        data.password,
        user.password_hash,
      );

      if (!isCorrectPassword) {
        throw new HttpException('Invalid credentials', 401);
      }

      // generate access token
      const accessToken = this.generateAccessToken(
        user.id,
        user.email,
        user.role,
      );

      // generate refresh token
      const refreshToken = this.generateRefreshToken(
        user.id,
        user.email,
        user.role,
      );

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException('Login failed', 400);
    }
  }

  async registerUser(data: SignUpDto) {
    try {
      // only allow non-student roles to register
      if (data.role === UserRole.Student) {
        throw new HttpException('Invalid role for registration', 400);
      }

      // check if user already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data?.email },
      });

      if (existingUser) {
        throw new HttpException('User already exists', 409);
      }

      // hash password
      const hashedPassword = await bcrypt.hash(data?.password, 12);

      // create user
      const user = await this.prisma.user.create({
        data: {
          name: data?.name,
          email: data?.email,
          phone: data?.phone,
          password_hash: hashedPassword,
          role: data?.role,
        },
      });

      // generate access token
      const accessToken = this.generateAccessToken(
        user.id,
        user.email,
        user.role,
      );

      // generate refresh token
      const refreshToken = this.generateRefreshToken(
        user.id,
        user.email,
        user.role,
      );
      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new HttpException('Registration failed', 400);
    }
  }
}
