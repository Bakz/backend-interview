import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(@InjectRepository(Todo) private todoRepository: Repository<Todo>) {}

  async getAllTodo(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  async postTodo(todo: Todo): Promise<Todo> {
    return await this.todoRepository.save(todo);
  }

  async getTodo(id: string): Promise<Todo> {
    return await this.todoRepository.findOne(id);
  }

  async putTodo(id: string, updatedTodo: Todo): Promise<Todo> {
    const todo = await this.todoRepository.findOne(id);
    return await this.todoRepository.save(Object.assign(todo, updatedTodo));
  }

  async deleteTodo(id: string): Promise<void> {
    await this.todoRepository.softDelete(id);
  }
}

