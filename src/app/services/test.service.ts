import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly TEST_API_URL = 'http://localhost:8080/api/v1/test';
  constructor(private http: HttpClient) { }
  getTests() : Observable<any>{
    let url = this.TEST_API_URL + "/all";
    return this.http.get(url);
  }
}
