import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private readonly WORKFLOW_API_URL = 'http://localhost:8080/api/v1/workflow';

  constructor(private http: HttpClient) {
  }

  getWorkflows(): Observable<any> {
    let url = this.WORKFLOW_API_URL + "/all";
    return this.http.get(url);
  }

  createWorkflow(workflow: any): Observable<any> {
    let url = this.WORKFLOW_API_URL + "/create";
    return this.http.post(url, workflow);
  }

  updateWorkflow(id: string, workflow: any): Observable<any> {
    let url = this.WORKFLOW_API_URL + `/update/${id}`;
    return this.http.put(url, workflow);
  }
}
