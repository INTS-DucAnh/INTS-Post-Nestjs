import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from 'src/entity/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles) private readonly roleRepository: Repository<Roles>,
  ) {}

  getListRole() {
    return this.roleRepository.findBy({});
  }
}
