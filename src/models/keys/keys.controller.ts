import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterKeyDto } from './dto/register-key.dto';
import { KeysService } from './keys.service';

@Controller('keys')
export class KeysController {
  constructor(private keysService: KeysService) {}

  @Post(':userId')
  async create(
    @Param('userId') userId: string,
    @Body() registerKeyDto: RegisterKeyDto,
  ) {
    return await this.keysService.register(userId, registerKeyDto);
  }

  @Get('list/:userId')
  async list(@Param('userId') userId: string) {
    return await this.keysService.list(userId);
  }
}
