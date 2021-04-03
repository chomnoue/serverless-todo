import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'

import UpdateTodoRequest from '../../requests/UpdateTodoRequest'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {updateTodo} from "../../businessLogic/todos";

const updateTodosHandler: ValidatedEventAPIGatewayHandler<typeof UpdateTodoRequest> = async (event): Promise<APIGatewayProxyResult> => {
  await updateTodo(getUserId(event), event.pathParameters.todoId, event.body)
  return formatJSONResponse()
}

export const handler = middyfy(updateTodosHandler)
