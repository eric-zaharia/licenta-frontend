import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/user';

const ACCESS_TOKEN_KEY = "accessToken";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private jwtHelper = new JwtHelperService();
    private decodedToken: any;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        const token = this.getTokens().accessToken;
        if (token) {
            this.decodeToken(token);
        }
    }

    public login(login: LoginRequest) {
        this.http.post('api/v1/auth/authenticate', login).subscribe( {
            next: (response: any) => {
                this.saveTokenDetails(response.token);
                // this.router.navigateByUrl("/home");
            },
            error: (error) => {
                // show error message
            }
        });
    }

    public logout() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        this.decodedToken = null;
        this.removeUserDetails();
    }

    public isAuthenticated(): boolean {
        const accessToken = this.getTokens().accessToken;
        return accessToken != null && this.isTokenValid(accessToken);
    }

    public getUserDetails(): User {
        let user = localStorage.getItem("user");
        if (user) {
            return JSON.parse(user);
        }

        return {
            username: "",
            name: "",
            email: ""
        };
    }

    private saveTokenDetails(token: string) {
        this.setToken(token);
        let email = this.decodedToken.sub;
        let name = this.decodedToken.name;
        let username = this.decodedToken.username;

        this.setUserDetails({ username: username, name: name, email: email })
    }

    private setUserDetails(user: User) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    private removeUserDetails() {
        localStorage.removeItem("user");
    }

    private setToken(token: string) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        this.decodeToken(token);
    }

    private getTokens(): any {
        return { accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) }
    }

    private decodeToken(token: string): void {
        this.decodedToken = this.jwtHelper.decodeToken(token);
    }

    private isTokenValid(token: string) {
        return this.jwtHelper.isTokenExpired(token);
    }
}
