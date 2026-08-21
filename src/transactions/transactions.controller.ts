import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getAllTransactions(@Req() req: any) {
    return this.transactionsService.getAllTransactions(req.user.sub);
  }

  @Get(':id')
  getOneTransaction(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.transactionsService.getOneTransaction(id, req.user.sub);
  }

  @Post()
  createTransaction(@Body() dto: CreateTransactionDto, @Req() req: any) {
    return this.transactionsService.createTransaction(dto, req.user.sub);
  }

  @Patch(':id')
  updateTransaction(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTransactionDto, @Req() req: any) {
    return this.transactionsService.updateTransaction(id, dto, req.user.sub);
  }

  @Delete(':id')
  deleteTransaction(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.transactionsService.deleteTransaction(id, req.user.sub);
  }
}