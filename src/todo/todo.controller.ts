import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo } from './todo.entity';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllTodo() {
    return await this.todoService.getAllTodo();
  }

  @Post()
  async postTodo(@Body() todo: Todo) {
    return await this.todoService.postTodo(todo);
  }

  //
  @Get(':id')
  async getTodo(@Param('id') id: string) {
    return await this.todoService.getTodo(id);
  }

  @Put(':id')
  async putTodo(@Param('id') id: string, @Body() todo: Todo) {
    return await this.todoService.putTodo(id, todo);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTodo(@Param('id') id: string) {
    return await this.todoService.deleteTodo(id);
  }
}