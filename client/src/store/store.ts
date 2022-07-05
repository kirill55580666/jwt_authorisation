import axios, { AxiosError } from "axios";
import {makeAutoObservable} from "mobx";
import { API_URL } from "../http";
import { AuthResponse } from "../models/AuthResponse";
import {IUser} from "../models/IUser";
import AuthService from "../services/AuthService";

export default class Store {
    user = {} as IUser
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this)
    }
    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string): Promise<void> {
        try {
            const response = await AuthService.login(email, password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        }
        catch (error) {
            if (error instanceof AxiosError)
                console.log(error.response?.data?.message)
            else
                console.log(error)
        }
    }
    async registration(email: string, password: string): Promise<void> {
        try {
            const response = await AuthService.registration(email, password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setAuth(true)
            this.setUser(response.data.user)
        }
        catch (error) {
            if (error instanceof AxiosError)
                console.log(error.response?.data?.message)
            else
                console.log(error)
        }
    }
    async logout(): Promise<void> {
        try {
            const response = await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({} as IUser)
        }
        catch (error) {
            if (error instanceof AxiosError)
                console.log(error.response?.data?.message)
            else
                console.log(error)
        }
    }
    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (error) {
            if (error instanceof AxiosError)
                console.log(error.response?.data?.message)
            else
                console.log(error)
        } finally {
            this.setLoading(false);
        }
    }
}