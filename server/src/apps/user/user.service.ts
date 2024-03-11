import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import { FindUserDto } from './dto/user-find.dto';
import { UpdateUserDto } from './dto/user-update.dto';
import { CreateUserDto } from '../auth/dto/auth-create.dto';

@Injectable()
export class UserServices {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  findUser(findQuery: FindUserDto): Promise<Users> {
    return this.userRepository.findOneBy({ username: findQuery.username });
  }

  updateUser(updateQuery: UpdateUserDto) {
    return this.userRepository.save(updateQuery);
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id: id });
  }

  createUser(createQuery: CreateUserDto, roleid: number) {
    return this.userRepository.save({ roleid, ...createQuery });
  }
}
