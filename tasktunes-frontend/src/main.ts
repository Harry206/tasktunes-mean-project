import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { TasksComponent } from './app/pages/tasks/tasks';
import { MoodsComponent } from './app/pages/moods/moods';
import { PlaylistComponent } from './app/pages/playlist/playlist';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

const routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' as const },
  { path: 'tasks', component: TasksComponent },
  { path: 'moods/:task', component: MoodsComponent },
  { path: 'playlist/:task/:mood', component: PlaylistComponent },
  { path: '**', redirectTo: '/tasks', pathMatch: 'full' as const }
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule) // ✅ THIS IS KEY
  ]
});
