import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable()
export class DataService {
    private baseUri = 'http://localhost:3000/delivery';

  // private baseUri: string = this..urlApi + 'client';
  
  constructor(private http: HttpClient) { }

  getAllClients() {
    return this.http.get(this.baseUri);
  }

  registerClient(params = {}) {
    return this.http.post(this.baseUri, params);
  }

  deleteAll() {
    return this.http.delete(this.baseUri);
  }

}