import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/user-find.dto';
import { ChangPasswordDto, UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from '../auth/dto/auth-create.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async checkValidUser(
    data: FindUserDto | string | number,
    deleted: boolean = false,
  ) {
    let existUser: Users;

    if (typeof data === 'number') {
      if (deleted) existUser = await this.findDeletedUserById(data);
      else existUser = await this.findUserById(data);
    } else if (typeof data === 'string') {
      const userId = parseInt(data) || 0;
      if (!userId) throw new BadRequestException('Invalid query!');

      existUser = await this.findUserById(userId);
    } else existUser = await this.findUser(data);
    if (!existUser) throw new BadRequestException('This use is not exist!');

    return existUser;
  }

  findDeletedUserById(id: number) {
    return this.userRepository
      .createQueryBuilder('users')
      .withDeleted()
      .where('users.id = :id', { id: id })
      .getOne();
  }

  findUserById(id: number): Promise<Users> {
    return this.userRepository.findOneBy({ id: id });
  }

  findUser(findQuery: FindUserDto): Promise<Users> {
    return this.userRepository.findOneBy({ username: findQuery.username });
  }

  updateUser(updateQuery: UserDto) {
    return this.userRepository.save(updateQuery);
  }

  deleteUser(id: number) {
    return this.userRepository.softDelete({ id: id });
  }

  createUser(createQuery: UserDto) {
    return this.userRepository.save(createQuery);
  }
}
