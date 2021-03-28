import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {XAWS} from "./aws";
import {TodoItem} from "../models/TodoItem";
import {Next} from "../models/Next";


export class TodoAccess {

  constructor(
      private readonly docClient: DocumentClient = XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly creationDateIndex = process.env.TODOS_CREATION_DATE_INDEX,
      private readonly dueDateIndex = process.env.TODOS_DUE_DATE_INDEX
  ) {
  }

  async getTodos(userId: string, sort: 'createdAt' | 'dueDate' = 'createdAt', next?: Next, limit?: number): Promise<{ items: TodoItem[], next?: Next }> {
    console.log('Getting all groups')
    const nextKey = next ? {...next} : undefined
    if (nextKey) {
      nextKey['userId'] = userId
    }
    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: sort === 'createdAt' ? this.creationDateIndex : this.dueDateIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ExclusiveStartKey: nextKey,
      Limit: limit
    }).promise()

    const items = result.Items as TodoItem[]
    return {items, next: result.LastEvaluatedKey as Next}
  }

  async getTodo(todoId: string): Promise<TodoItem> {
    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {todoId}
    }).promise()
    return result.Item as TodoItem
  }

  async createTodo(todoItem: TodoItem) {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
  }

  async updateTodo(todoId: string, newValues: { [key: string]: any }) {
    let updateExpression = 'set '
    const updateValues = {}
    for (let key in newValues) {
      const keyVar = `:${key}`
      updateExpression += `${key}=${keyVar},`
      const value = newValues[key]
      updateValues[keyVar] = value
    }
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {todoId},
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: updateValues
    }).promise()
  }

  async deleteTodo(todoId: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {todoId}
    })
  }
}
