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
  @ApiOperation({ summary: 'Get all accounts for the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of accounts' })
  getAllAccounts(@Req() req: any) {
    return this.accountsService.getAllAccounts(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an account by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Account found' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  getOneAccount(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.accountsService.getOneAccount(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created' })
  createAccount(@Body() dto: CreateAccountDto, @Req() req: any) {
    return this.accountsService.createAccount(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an account' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Account updated' })
  updateAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAccountDto,
    @Req() req: any,
  ) {
    return this.accountsService.updateAccount(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an account' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  deleteAccount(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.accountsService.deleteAccount(id, req.user.id);
  }
}