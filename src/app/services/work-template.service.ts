import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class WorkTemplateService {

    private readonly WORK_TEMPLATE_API_URL = 'http://localhost:8080/api/v1/workTemplate';

    constructor(private http: HttpClient) {
    }

    getWorkTemplates(): Observable<any> {
        let url = this.WORK_TEMPLATE_API_URL + "/all";
        return this.http.get(url);
    }

    createWorkTemplate(workflow: any): Observable<any> {
        let url = this.WORK_TEMPLATE_API_URL + "/create";
        return this.http.post(url, workflow);
    }

    updateWorkTemplate(id: string, workflow: any): Observable<any> {
        let url = this.WORK_TEMPLATE_API_URL + `/update/${id}`;
        return this.http.put(url, workflow);
    }

    deleteWorkTemplate(id: string): Observable<any> {
        let url = `${this.WORK_TEMPLATE_API_URL}/delete/${id}`;
        return this.http.delete(url);
    }
}
