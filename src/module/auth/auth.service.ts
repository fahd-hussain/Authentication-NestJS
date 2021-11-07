import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { AuthRepository } from '../auth/repository/auth.repository';
import { UserEntity } from '../user/entity/user.entity';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authRepository: AuthRepository,
  ) {}

  register = async (registerDTO: RegisterDTO) => {
    try {
      const user: UserEntity = await this.authRepository.register(registerDTO);

      if (user) {
        return user.toResponseObject();
      }
    } catch (error) {
      if (error.errno === 1062) {
        throw new HttpException('Email already exist', HttpStatus.CONFLICT);
      }

      throw error;
    }
  };

  login = async (loginDTO: LoginDTO) => {
    try {
      const { email, password } = loginDTO;
      const user: UserEntity = await this.userRepository.getUserByEmail({
        email,
      });

      if (!user) {
        throw new HttpException(
          'Email/password is incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const compare = this.authRepository.comparePassword({ user, password });

      if (!compare) {
        throw new HttpException(
          'Email/password is incorrect',
          HttpStatus.UNAUTHORIZED,
        );
      }

      return user.toResponseObject();
    } catch (error) {
      throw error;
    }
  };
}
