import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {getTodos} from "../../businessLogic/todos";
import {Sort} from "../../models/Sort";

const getTodosHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const next = event.queryStringParameters.next
  const sort = event.queryStringParameters.sort as Sort || 'createdAt'
  const todos = getTodos(getUserId(event), sort, next)
  return formatJSONResponse(todos)
}

export const handler = middyfy(getTodosHandler)
