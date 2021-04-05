import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {getTodos} from "../../businessLogic/todos";
import {Sort} from "../../models/Sort";
import {Next} from "../../models/Next";

const getTodosHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const nextTodoId = event.queryStringParameters?.nextTodoId
  const nextSortKey = event.queryStringParameters?.nextSortKey
  const next: Next = nextTodoId && nextSortKey ? {todoId: nextTodoId, sortKey: nextSortKey} : undefined
  const sort = event.queryStringParameters?.sort as Sort || 'createdAt'
  const limitStr = event.queryStringParameters?.limit
  const limit = limitStr ? Number(limitStr) : undefined
  const todos = await getTodos(getUserId(event), sort, next, limit)
  return formatJSONResponse(todos)
}

export const handler = middyfy(getTodosHandler)
