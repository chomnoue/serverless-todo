import 'source-map-support/register'

import CreateTodoRequest from '../../requests/CreateTodoRequest'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {createTodo} from "../../businessLogic/todos"
import {middyfy} from "../../utils/lambda";
import type {APIGatewayProxyResult} from "aws-lambda";

const createTodoHandler: ValidatedEventAPIGatewayHandler<typeof CreateTodoRequest> = async (event): Promise<APIGatewayProxyResult> => {
  const item = await createTodo(getUserId(event), event.body)
  return formatJSONResponse({item})
}

export const handler = middyfy(createTodoHandler)
