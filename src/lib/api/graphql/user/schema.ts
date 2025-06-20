import type { IResponseData } from '../schema';

export interface ILoginArgs {
	userId: string;
	password: string;
}

export interface ILoginData {
	isSuccess: boolean;
	accessToken: string;
	loginDate: string;
	workshopId: string;
	lineId: string;
	opCode: string;
}

export interface ILogoutArgs {
	userId: string;
}

export interface ILogoutData {
	isSuccess: boolean;
}

export interface ICreateUserArgs {
	id: string;
	password: string;
	name: string;
	role: string;
}

export interface ICreateUserData {
	id: string;
	name: string;
	password: string;
	role: string;
	createdAt: string;
	updatedAt: string;
	accessToken: string;
}

export interface IUpdateUserArgs {
	id: string;
	password: string;
	name: string;
	role: string;
}

export interface IUpdateUserData {
	id: string;
	name: string;
	password: string;
	role: string;
	createdAt: string;
	updatedAt: string;
	accessToken: string;
}

export interface IGetUserInfoData {
	id: string;
	name: string;
	role: string;
	createdAt: string;
	updatedAt: string;
	accessToken: string;
}

export interface IRemoveUserData {
	id: string;
	name: string;
	password: string;
	role: string;
	createdAt: string;
	updatedAt: string;
	accessToken: string;
}

export type TLoginResponse = IResponseData<ILoginData>;
export type TLogoutResponse = IResponseData<ILogoutData>;
export type TCreateUserResponse = IResponseData<ICreateUserData>;
export type TUpdateUserResponse = IResponseData<IUpdateUserData>;
export type TGetUserInfoResponse = IResponseData<IGetUserInfoData>;
export type TRemoveUserResponse = IResponseData<IRemoveUserData>;
