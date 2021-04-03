import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {generateUploadUrl} from "../../businessLogic/todos";
import {middyfy} from "../../utils/lambda";

const generateUpdateUrlHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const uploadUrl = generateUploadUrl(getUserId(event), event.pathParameters.todoId)
  return formatJSONResponse({uploadUrl})
}

export const handler = middyfy(generateUpdateUrlHandler)
