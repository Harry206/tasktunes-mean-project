import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

export interface Song {
  title: string;
  artist: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api'; // your backend URL

  constructor(private http: HttpClient) {}

  getTasks(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/tasks`);
  }

  getMoods(task: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/moods/${task}`);
  }

  getPlaylist(task: string, mood: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/playlists/${task}/${mood}`);
  }
}
