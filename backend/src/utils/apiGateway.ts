import type {APIGatewayProxyResult, APIGatewayProxyWithLambdaAuthorizerEvent, Handler} from 'aws-lambda'

import type {FromSchema} from "json-schema-to-ts"

type ValidatedAPIGatewayProxyEvent<S> =
    Omit<APIGatewayProxyWithLambdaAuthorizerEvent<any>, 'body'>
    & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayHandler<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = (response: any = undefined, statusCode: number = 200, addHeaders: { [key: string]: string; } = {}) => {
  const headers = {
    'Access-Control-Allow-Origin': '*'
  }
  return {
    statusCode: statusCode,
    body: response ? JSON.stringify(response) : undefined,
    headers: {...headers, ...addHeaders}
  }
}

export function getUserId(event: ValidatedAPIGatewayProxyEvent<any>): string {
  return event.requestContext.authorizer.principalId
}
