import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@ApiTags('accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  getAllAccounts(@Req() req: any) {
    return this.accountsService.getAllAccounts(req.user.sub);
  }

  @Get(':id')
  getOneAccount(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.accountsService.getOneAccount(id, req.user.sub);
  }

  @Post()
  createAccount(@Body() dto: CreateAccountDto, @Req() req: any) {
    return this.accountsService.createAccount(dto, req.user.sub);
  }

  @Patch(':id')
  updateAccount(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccountDto, @Req() req: any) {
    return this.accountsService.updateAccount(id, dto, req.user.sub);
  }

  @Delete(':id')
  deleteAccount(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.accountsService.deleteAccount(id, req.user.sub);
  }
}