import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NomadService {
    private readonly NOMAD_API_URL = 'http://localhost:8080/api/v1/nomad';

    constructor(private http: HttpClient) {
    }

    getJobs(): Observable<any> {
        let url = this.NOMAD_API_URL + "/jobs";
        return this.http.get(url);
    }

    startJob(jobData: any): Observable<any> {
        let url = this.NOMAD_API_URL + "/jobs/start";
        return this.http.post(url, jobData);
    }

    stopJob(id: string): Observable<any> {
        let url = this.NOMAD_API_URL + "/jobs/stop/" + id;
        return this.http.delete(url);
    }

    deleteJob(id: string): Observable<any> {
        let url = this.NOMAD_API_URL + "/jobs/delete/" + id;
        return this.http.delete(url);
    }
}
