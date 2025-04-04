import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PasswordService {

    constructor(
        private http: HttpClient
    ) {
    }

    getAllUserPasswords() {
        return this.http.get('api/v1/password/all/user');
    }

    uploadPassword(body: {}) {
        return this.http.post('api/v1/password', body);
    }
}
