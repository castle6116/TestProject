import type { ExecutionResult } from 'graphql';
import { GraphQLClient, gql } from 'graphql-request';
import { createClient, type Client } from 'graphql-ws';
import { WebSocket } from 'ws';
import { logger } from './logger';

export let graphqlClient: GraphQLClient | null = null;
let graphqlWsClient: Client | null = null;

//#region Export Function
// graphql Client (query & mutation & subscription) 생성
export function createGraphqlClient(url: string) {
	if (graphqlClient) {
		// graphqlClient가 존재하면 return
		logger.info('GraphQL Client Already Exists');

		return;
	}

	graphqlClient = new GraphQLClient(url);

	// if (localStorage.getItem(COOKIE_KEY)) {
	// 	const authInfo = localStorage.getItem(COOKIE_KEY);

	// 	setHeaders({ authorization: `Bearer ${authInfo}` });
	// }
}

// graphql Client (query & mutation & subscription) 생성
export function createGraphqlWsClient(url: string): void {
	if (graphqlWsClient) {
		// graphqlWsClient 가 존재하면 return
		logger.info('GraphQL WebSocket Client Already Exists');

		return;
	}

	graphqlWsClient = createClient({
		webSocketImpl: WebSocket,
		url: url.replace('http', 'ws')
	});
}

// request (query & mutation)
export async function request<T>(option: IGraphqlQueryOpts, signal?: AbortSignal): Promise<T> {
	// graphqlClient가 없으면 throw error
	if (!graphqlClient) {
		throw new Error('GraphQL Client Not Exist');
	}
	graphqlClient.requestConfig.signal = signal;
	return graphqlClient.request<T>(makeQueryString(option), { signal });
}

// subscription
export async function subscribe<T>(
	option: IGraphqlQueryOpts,
	callback: (result: ExecutionResult<T, unknown>) => void
) {
	// graphqlWsClient가 없으면 throw error
	if (!graphqlWsClient) {
		throw new Error('GraphQL WebSocket Client Not Exist');
	}

	const subsc = graphqlWsClient!.iterate({
		query: makeQueryString(option)
	});
	logger.info(`GraphQL Subscribe Success (${option.operationName})`);

	for await (const result of subsc) {
		callback(result as Record<string, T>);
	}
}

export function setHeaders(headers: { [key: string]: string }): void {
	// graphqlClient가 없으면 throw error
	if (!graphqlClient) {
		throw new Error('GraphQL Client Not Exist');
	}

	graphqlClient?.setHeaders(headers);
}

export function unsubscribe() {
	if (!graphqlWsClient) {
		throw new Error('GraphQL WebSocket Client Not Exist');
	}

	graphqlWsClient?.dispose();
}
//#endregion

//#region Private Function
// request query string 생성
export function makeQueryString(option: IGraphqlQueryOpts): string {
	const selectString = option.selectFields.join(',');
	if (option.arguments) {
		return generateGqlStringWithArgs(option, selectString);
	} else {
		return generateGqlStringWithoutArgs(option, selectString);
	}
}

// option 에 따라 query string 생성 (arguments 있을 때)
function generateGqlStringWithArgs(option: IGraphqlQueryOpts, selectString: string): string {
	const { inputType, inputArgs } = option.arguments!;
	const convertedArgs = parseArgs(inputType, inputArgs);
	const { queryType, queryName, operationName } = option;

	return gql`
		${queryType} ${operationName} {
			response: ${queryName}(${convertedArgs}) {
				${selectString}			
			}
		}
	`;
}

// option 에 따라 query string 생성 (arguments 없을 때)
function generateGqlStringWithoutArgs(option: IGraphqlQueryOpts, selectString: string): string {
	const { queryType, queryName, operationName } = option;
	return gql`
		${queryType} ${operationName} {
			response: ${queryName} {
				${selectString}			
			}
		}
	`;
}

// inputType 과 inputArgs 가 각각 배열인지 단일 값인지에 따라 query string 생성
function parseArgs(inputType: string | string[], inputArgs: any): string {
	// inputArgs 가 배열일 때
	if (Array.isArray(inputArgs)) {
		// inputType 이 배열일 때
		if (Array.isArray(inputType)) {
			return parseArgsArrayWithTypes(inputType, inputArgs);
		}

		// inputType 이 배열이 아닐 때, inputArgs 를 하나의 배열로 변환
		if (!Array.isArray(inputType)) {
			return `${inputType}: [${inputArgs.map(parseSingleArg).join(', ')}]`;
		}

		return '';
	}
	// inputArgs 가 배열이 아닐 때
	else {
		return parseSingleArgWithType(inputType as string, inputArgs);
	}
}

// inputType 과 inputArgs 가 이 배열일 때 query string 생성
function parseArgsArrayWithTypes(inputTypes: string[], inputArgs: any[]): string {
	return inputArgs.map((arg, idx) => `${inputTypes[idx]}: ${parseSingleArg(arg)}`).join(', ');
}

// inputArgs 가 배열이 아닐 때 query string 생성
function parseSingleArgWithType(type: string, arg: any): string {
	return `${type}: ${parseSingleArg(arg)}`;
}

// inputArgs 가 배열이 아닐 때, type 별 query string 생성
function parseSingleArg(arg: any): string {
	if (typeof arg === 'string') return arg.includes('enum/') ? arg.split('enum/')[1] : `"${arg}"`;
	if (typeof arg === 'number') return arg.toString();
	if (arg == null) return 'null';
	if (typeof arg === 'object') return parseObjectToGqlArgs(arg);
	return '';
}

// object 타입의 args 를 query string 으로 변환
function parseObjectToGqlArgs(args: { [key: string]: any }): string {
	const argString = Object.entries(args)
		.map(([key, value]) => {
			if (typeof value === 'string')
				return `${key}: ${value.includes('enum/') ? value.split('enum/')[1] : `"${value}"`}`;
			if (Array.isArray(value)) return `${key}: [${value.map(parseSingleArg).join(', ')}]`;
			if (typeof value === 'object') return `${key}: ${parseObjectToGqlArgs(value)}`;
			return `${key}: ${value}`;
		})
		.join(', ');
	return `{${argString}}`;
}

//#endregion

//#region Interface & Type
export interface IGraphqlQueryOpts {
	queryType: TQueryType;
	queryName: string;
	operationName: string;
	selectFields: string[];
	arguments?: null | IGraphqlQueryArgs<
		string | number | { [key: string]: string | number } | Object
	>;
}

interface IGraphqlQueryArgs<T> {
	inputType: string | string[];
	inputArgs: T | T[] | null;
}

export type TQueryType = 'query' | 'mutation' | 'subscription';
//#endregion

export default {
	createGraphqlClient,
	createGraphqlWsClient,
	setHeaders,
	request,
	subscribe,
	unsubscribe,
	makeQueryString
};
