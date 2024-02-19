import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Campaign, ServiceRouter} from './table.model';

@Injectable({
  providedIn: 'root',
})
export class TableService {

  constructor(private http: HttpClient) {}

  getCampaigns(page: number, pageSize: number): Observable<Campaign[]> {
    const options = { params: new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString()) };
    return this.http.get<Campaign[]>(`${environment.environment}Campaigns`, options);
  }

  getServices(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.environment}Services`, {});
  }

  updateCampaign(data: any): Observable<Campaign> {
    const options = { params: new HttpParams()
        .set('name', data.name)
        .set('description', data.description)
        .set('serviceRouterId', data.serviceRouterId)
        .set('operatorService', data.operatorService)
        .set('countryCode', data.countryCode)};
    return this.http.put<Campaign>(`${environment.environment}Campaigns/${data.name}`, {} , options);
  }

  createCampaign(data: any): Observable<Campaign> {
    const options = { params: new HttpParams()
        .set('name', data.name)
        .set('description', data.description)
        .set('serviceRouterId', data.serviceRouterId)
        .set('operatorService', data.operatorService)
        .set('countryCode', data.countryCode)};
    return this.http.post<Campaign>(`${environment.environment}Campaigns`, {} , options);
  }

  uploadFile(name: string, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      // You may need to adjust the content type based on your backend requirements
    });

    return this.http.post(`${environment.environment}Campaigns/${name}/files`, formData, { headers });
  }

  downloadFile(name: string): Observable<ArrayBuffer> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/zip',
      'Accept': 'application/zip',
    });
    return this.http.get(`${environment.environment}Campaigns/${name}/files`,
      { responseType: 'arraybuffer', headers: headers });
  }

  getServiceRouters(page: number, pageSize: number): Observable<ServiceRouter[]> {
    const options = { params: new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString()) };
    return this.http.get<ServiceRouter[]>(`${environment.environment}ServiceRouters`, options);
  }

  createRouter(name: string): Observable<ServiceRouter> {
    const options = { params: new HttpParams().set('name', name) };
    return this.http.post<ServiceRouter>(`${environment.environment}ServiceRouters`, {}, options);
  }

  createRule(routerId: number, operatorService: string, type: string, value: number): Observable<any> {
    const options = { params: new HttpParams()
        .set('operatorService', operatorService)
        .set('type', type)
        .set('value', value.toString())};
    return this.http.post<any>(`${environment.environment}ServiceRouters/${routerId}/routeRules`, {}, options);
  }

  updateRule(routerId: number, operatorService: string, type: string, value: number): Observable<any> {
    const options = { params: new HttpParams()
        .set('type', type)
        .set('value', value.toString())};
    return this.http.put<any>(
      `${environment.environment}ServiceRouters/${routerId}/routeRules/${operatorService}`, {}, options);
  }

  deleteRouter(routerId: number): Observable<any> {
    return this.http.delete<any>(`${environment.environment}ServiceRouters/${routerId}`, {});
  }

  deleteRule(routerId: number, operatorService: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.environment}ServiceRouters/${routerId}/routeRules/${operatorService}`, {});
  }
}
