import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/user-find.dto';
import { UserDto } from './dto/user.dto';
import { MESSAGE_CONSTANT } from 'src/config/app.constant';

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  isOwnAccount(conditions: boolean) {
    if (conditions)
      throw new BadRequestException(
        MESSAGE_CONSTANT.permission.notOwn('account'),
      );
  }
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
      if (!userId)
        throw new BadRequestException(MESSAGE_CONSTANT.param.invalid('userid'));

      existUser = await this.findUserById(userId);
    } else existUser = await this.findUser(data);
    if (!existUser)
      throw new BadRequestException(MESSAGE_CONSTANT.targetNonExist('user'));

    return existUser;
  }

  findDeletedUserById(id: number) {
    return this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.roles', 'roles')
      .withDeleted()
      .where('users.id = :id', { id: id })
      .getOne();
  }

  findUserById(id: number): Promise<Users> {
    return this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.roles', 'roles')
      .select(['users', 'roles.id', 'roles.title'])
      .where('users.id = :id', { id: id })
      .getOne();
  }

  findUser(findQuery: FindUserDto): Promise<Users> {
    return this.userRepository.findOneBy({ username: findQuery.username });
  }

  async findUserByFilter(skip: number, limit: number) {
    const users = this.userRepository
      .createQueryBuilder('users')
      .innerJoinAndSelect('users.roles', 'roles')
      .select([
        'users.username',
        'users.firstname',
        'users.lastname',
        'users.id',
        'users.gender',
        'users.avatar',
        'roles.title',
      ]);
    return {
      users: await users
        .limit(limit)
        .skip(skip)
        .orderBy('users.id', 'ASC')
        .getMany(),
      max: await users.getCount(),
    };
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
