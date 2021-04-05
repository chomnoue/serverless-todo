import * as uuid from 'uuid'
import {TodoAccess} from "../dataLayer/todosAccess"
import {FileAccess} from "../dataLayer/fileAccess"
import {TodoItem} from "../models/TodoItem";
import CreateTodoRequest from "../requests/CreateTodoRequest"
import type {FromSchema} from "json-schema-to-ts"
import UpdateTodoRequest from "../requests/UpdateTodoRequest";
import {Sort} from "../models/Sort";
import {Next} from "../models/Next";

const todosAccess = new TodoAccess()
const fileAccess = new FileAccess()

export async function getTodos(userId: string, sort: Sort = 'createdAt', next?: Next, limit?: number): Promise<{ items: TodoItem[], next: Next }> {
  const todos = await todosAccess.getTodos(userId, sort, next, limit)
  for (const todo of todos.items) {
    todo.attachmentUrl = getAttachmentUrl(userId, todo.todoId)
  }
  return todos
}

function getAttachmentUrl(userId: string, todoId: string) {
  return fileAccess.getGetSignedUrl(fileKey(userId, todoId));
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
  todoItem.attachmentUrl = getAttachmentUrl(userId, todoId)
  return todoItem
}

export async function updateTodo(userId: string, todoId: string, request: FromSchema<typeof UpdateTodoRequest>) {
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
  await todosAccess.updateTodo(userId, todoId, newValues)
}

export async function deleteTodo(userId: string, todoId: string) {
  await todosAccess.deleteTodo(userId, todoId)
}

function fileKey(userId: string, todoId: string): string {
  return `${userId}/${todoId}`
}

export async function generateUploadUrl(userId: string, todoId: string) {
  return fileAccess.getPutSignedUrl(fileKey(userId, todoId))
}

