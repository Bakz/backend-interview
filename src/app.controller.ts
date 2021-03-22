import { Controller, Get, Render } from '@nestjs/common';
import { TodoService } from './todo/todo.service';

@Controller()
export class IndexController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @Render('index')
  async index() {
    return {todo: await this.todoService.getAllTodo()};
  }
}
