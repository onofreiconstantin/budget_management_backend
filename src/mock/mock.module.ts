import { Module } from '@nestjs/common';
import { MockService } from './mock.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mock } from './mock.entity';
import { MockController } from './mock.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Mock])],
  providers: [MockService],
  controllers: [MockController],
})
export class MockModule {}
