import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class WorkExecutionService {

    private readonly WORK_EXECUTION_API_URL = 'http://localhost:8080/api/v1/workexecution';

    constructor(private http: HttpClient) {
    }

    getWorkExecutions(): Observable<any> {
        let url = this.WORK_EXECUTION_API_URL + "/all";
        return this.http.get(url);
    }

    createWorkExecution(workExecution: any): Observable<any> {
        let url = this.WORK_EXECUTION_API_URL + "/create";
        return this.http.post(url, workExecution);
    }

    updateWorkExecution(id: string, workExecution: any): Observable<any> {
        let url = this.WORK_EXECUTION_API_URL + `/update/${id}`;
        return this.http.put(url, workExecution);
    }

    deleteWorkExecution(id: string): Observable<any> {
        let url = `${this.WORK_EXECUTION_API_URL}/delete/${id}`;
        return this.http.delete(url);
    }
}