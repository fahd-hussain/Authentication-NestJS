import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationDTO, PaginationSDTO } from 'src/shared/dto/pagination.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiQuery({ type: PaginationSDTO })
  @Get()
  getUsers(@Query() paginationDTO: PaginationDTO) {
    return this.userService.getUsers(paginationDTO);
  }
}
