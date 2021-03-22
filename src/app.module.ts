import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';
import { IndexController} from './app.controller';
import { TodoService } from './todo/todo.service';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TodoModule
  ],
  controllers: [IndexController],
  providers: [TodoService]
})
export class AppModule {
  constructor(private connection: Connection) {}
}
