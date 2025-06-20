import {
	createUserQueryOption,
	getUserInfoQueryOption,
	loginQueryOption,
	logoutQueryOption,
	removeUserQueryOption,
	updateUserQueryOption
} from './query';
import type { ILoginArgs, TLoginResponse, TLogoutResponse } from './schema';
import graphqlHelper from '$lib/common/graphql';

// 로그인
export async function login(args: ILoginArgs): Promise<TLoginResponse> {
	loginQueryOption.arguments = {
		inputType: 'loginUserInput',
		inputArgs: { ...args }
	};

	const res = await graphqlHelper.request<TLoginResponse>(loginQueryOption);

	return res;
}

// 로그아웃
export async function logout(userId: string): Promise<TLogoutResponse> {
	logoutQueryOption.arguments = {
		inputType: 'logoutUserInput',
		inputArgs: {
			userId
		}
	};
	let res = await graphqlHelper.request<TLogoutResponse>(logoutQueryOption);
	return res;
}

// 사용자 생성
export async function createUser(
	userId: string,
	password: string,
	userName: string,
	userRole: string
) {
	createUserQueryOption.arguments = {
		inputType: 'createUserInput',
		inputArgs: {
			userId,
			password,
			userName,
			userRole
		}
	};
	let res = await graphqlHelper.request(createUserQueryOption);
	return res;
}

// 사용자 정보 수정
export async function updateUser(
	userId: string,
	password: string,
	userName: string,
	userRole: number
) {
	updateUserQueryOption.arguments = {
		inputType: ['userId', 'updateUserInput'],
		inputArgs: [
			userId,
			{
				password,
				userName,
				userRole
			}
		]
	};
	let res = await graphqlHelper.request(updateUserQueryOption);
	return res;
}

// 사용자 삭제
export async function removeUser(userId: string) {
	removeUserQueryOption.arguments = {
		inputType: 'removeUserInput',
		inputArgs: {
			userId
		}
	};
	let res = await graphqlHelper.request(removeUserQueryOption);
	return res;
}

// 사용자 정보 조회
export async function getUserInfo(userId: string) {
	getUserInfoQueryOption.arguments = {
		inputType: 'userId',
		inputArgs: userId
	};
	let res = await graphqlHelper.request(getUserInfoQueryOption);
	return res;
}
