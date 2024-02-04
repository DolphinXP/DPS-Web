import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class WorkItemService {

    private readonly WORK_ITEM_API_URL = 'http://localhost:8080/api/v1/workItem';

    constructor(private http: HttpClient) {
    }

    getWorkItems(): Observable<any> {
        let url = this.WORK_ITEM_API_URL + "/all";
        return this.http.get(url);
    }

    createWorkItem(workItem: any): Observable<any> {
        let url = this.WORK_ITEM_API_URL + "/create";
        return this.http.post(url, workItem);
    }

    updateWorkItem(id: string, workItem: any): Observable<any> {
        let url = this.WORK_ITEM_API_URL + `/update/${id}`;
        return this.http.put(url, workItem);
    }

    deleteWorkItem(id: string): Observable<any> {
        let url = `${this.WORK_ITEM_API_URL}/delete/${id}`;
        return this.http.delete(url);
    }
}