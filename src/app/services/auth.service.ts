import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';
import { User } from '../models/user';

@Injectable()
export class AuthService {
	constructor(private http: Http) {

	}

	signin(username:string, password:string) {
		return this.http.post('http://127.0.0.1:8000/api/auth/login',
			{username: username, password: password},
			{headers: new Headers({'Accept': 'application/json'})})
			.map(
				(response: Response)=>{
					const token = response.json().access_token;
					const token_type = response.json().token_type;
					const expires_in = response.json().expires_in;
					const base64Url = token.split('.')[1];
					const base64 = base64Url.replace('-','+').replace('_','/');
					return {token:token, decoded: JSON.parse(window.atob(base64)), token_type:token_type, expires_in:expires_in};
				}
			)
			.do(
				tokenData => {
					localStorage.setItem('token', tokenData.token);
					localStorage.setItem('token_type', tokenData.token_type);
					localStorage.setItem('expires_in', tokenData.expires_in);

				});
	}

	me():Observable<User>{
		var tokenData = localStorage.getItem('token');
		return this.http.post('http://127.0.0.1:8000/api/auth/me?token='+tokenData,{},
			{headers: new Headers({'X-Requested-With': 'XMLHttpRequest'})})
		.map((response:Response)=> response.json())
		.do(
				userData => {
					localStorage.setItem('user', userData);
				})
		;
	}


}