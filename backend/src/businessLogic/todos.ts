import * as uuid from 'uuid'
import {TodoAccess} from "../dataLayer/todosAccess"
import {FileAccess} from "../dataLayer/fileAccess"
import {TodoItem} from "../models/TodoItem";
import CreateTodoRequest from "../requests/CreateTodoRequest"
import type {FromSchema} from "json-schema-to-ts"
import UpdateTodoRequest from "../requests/UpdateTodoRequest";
import {Sort} from "../models/Sort";

const todosAccess = new TodoAccess()
const fileAccess = new FileAccess()

export async function getTodos(userId: string, sort: Sort = 'createdAt', next?: string, limit?: number): Promise<{ items: TodoItem[], next?: string }> {
  const todos = await todosAccess.getTodos(userId, sort, next, limit)
  for (const todo of todos.items) {
    todo.attachmentUrl = fileAccess.getGetSignedUrl(todo.todoId)
  }
  return todos
}

export async function createTodo(userId: string, request: FromSchema<typeof CreateTodoRequest>): Promise<TodoItem> {
  const todoId: string = uuid.v4()
  const todoItem: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    name: request.name,
    dueDate: request.dueDate
  }
  await todosAccess.createTodo(todoItem)
  todoItem.attachmentUrl = fileAccess.getGetSignedUrl(todoId)
  return todoItem
}

export async function updateTodo(userId: string, todoId: string, request: FromSchema<typeof UpdateTodoRequest>) {
  const todoItem = await todosAccess.getTodo(todoId)
  if (userId !== todoItem.userId) {
    throw Error(`User ${userId} cannot update todo ${todoId}`)
  }
  const newValues: { [key: string]: any } = {}
  if (request.name) {
    newValues.name = request.name
  }
  if (request.dueDate) {
    newValues.dueDate = request.dueDate
  }
  if ('done' in request) {
    newValues.done = request.done
  }
  await todosAccess.updateTodo(todoId, newValues)
}

export async function deleteTodo(userId: string, todoId: string) {
  const todoItem = await todosAccess.getTodo(todoId)
  if (userId !== todoItem.userId) {
    throw Error(`User ${userId} cannot delete todo ${todoId}`)
  }
  await todosAccess.deleteTodo(todoId)
}

export async function generateUploadUrl(userId: string, todoId: string) {
  const todoItem = await todosAccess.getTodo(todoId)
  if (userId !== todoItem.userId) {
    throw Error(`User ${userId} cannot upload attachment for todo ${todoId}`)
  }
  return fileAccess.getPutSignedUrl(todoId)
}

