import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {XAWS} from "./aws";
import {TodoItem} from "../models/TodoItem";
import {Sort} from "../models/Sort";
import {Next} from "../models/Next";


export class TodoAccess {

  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosTable = process.env.TODOS_TABLE,
      private readonly creationDateIndex = process.env.TODOS_CREATION_DATE_INDEX,
      private readonly dueDateIndex = process.env.TODOS_DUE_DATE_INDEX
  ) {
  }

  async getTodos(userId: string, sort: Sort, next?: Next, limit?: number): Promise<{ items: TodoItem[], next: Next }> {
    const nextKey = next ? {userId, todoId: next.todoId} : undefined
    if (nextKey) {
      nextKey[sort] = next.sortKey
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
    const items = result.Items as TodoItem[] || []
    const newNext: Next = result.LastEvaluatedKey? {
      todoId: result.LastEvaluatedKey.todoId,
      sortKey: result.LastEvaluatedKey[sort]
    }: undefined
    return {items, next: newNext}
  }

  async createTodo(todoItem: TodoItem) {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()
  }

  async updateTodo(userId: string, todoId: string, newValues: { [key: string]: any }) {
    const attributesUpdates = {}
    for (let key in newValues) {
      attributesUpdates[key] = {Action: "PUT", Value: newValues[key]}
    }
    await this.docClient.update({
      TableName: this.todosTable,
      Key: {userId, todoId},
      AttributeUpdates: attributesUpdates,
      ReturnValues:"UPDATED_NEW"
    }).promise();
  }

  async deleteTodo(userId: string, todoId: string) {
    await this.docClient.delete({
      TableName: this.todosTable,
      Key: {userId, todoId}
    }).promise();
  }
}
