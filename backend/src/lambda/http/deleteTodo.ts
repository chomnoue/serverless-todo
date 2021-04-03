import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import CreateTodoRequest from "../../requests/CreateTodoRequest";
import {deleteTodo} from "../../businessLogic/todos";
import {middyfy} from "../../utils/lambda";


const deleteTodoHandler: ValidatedEventAPIGatewayHandler<typeof CreateTodoRequest> = async (event): Promise<APIGatewayProxyResult> => {
  await deleteTodo(getUserId(event), event.pathParameters.todoId)
  return formatJSONResponse()
}

export const handler = middyfy(deleteTodoHandler)
