import type {APIGatewayProxyEvent, APIGatewayProxyResult, Handler} from 'aws-lambda'

import type {FromSchema} from "json-schema-to-ts"

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayHandler<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: Record<string, unknown>, statusCode: number = 200, addHeaders:  { [key: string]: string; } = {}) => {
  const headers = {
    'Access-Control-Allow-Origin': '*'
  }
  return {
    statusCode: statusCode,
    body: JSON.stringify(response),
    headers: {...headers, ...addHeaders}
  }
}
