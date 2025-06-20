import type { IGraphqlQueryOpts } from '$lib/common/graphql';

export const loginQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'login',
	operationName: 'login',
	selectFields: ['isSuccess', 'accessToken', 'loginDate', 'workshopId', 'lineId', 'opCode']
};

export const logoutQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'logout',
	operationName: 'logout',
	selectFields: ['isSuccess']
};

export const createUserQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'createUser',
	operationName: 'createUser',
	selectFields: ['createdAt', 'id', 'name', 'password', 'role', 'updatedAt']
};

export const updateUserQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'updateUser',
	operationName: 'updateUser',
	selectFields: ['createAt', 'userId', 'userName', 'userRole', 'updateAt']
};

export const removeUserQueryOption: IGraphqlQueryOpts = {
	queryType: 'mutation',
	queryName: 'removeUser',
	operationName: 'removeUser',
	selectFields: ['result']
};

export const getUserInfoQueryOption: IGraphqlQueryOpts = {
	queryType: 'query',
	queryName: 'user',
	operationName: 'user',
	selectFields: ['userId', 'userName', 'userRole', 'createAt', 'updateAt']
};

export const subscribeUserQueryOption: IGraphqlQueryOpts = {
	queryType: 'subscription',
	queryName: 'subscribeUser',
	operationName: 'subscribeUser',
	selectFields: ['id', 'name', 'role']
};
