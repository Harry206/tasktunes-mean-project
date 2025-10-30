import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist.html',
  styleUrls: ['./playlist.css']
})
export class PlaylistComponent implements OnInit {
  task!: string;
  mood!: string;

  songs: { title: string; artist: string; link: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {
    this.task = this.route.snapshot.params['task'];
    this.mood = this.route.snapshot.params['mood'];

    this.taskService.getPlaylist(this.task, this.mood)
      .subscribe((data: any[]) => {
        this.songs = data.map(song => ({
          title: song.title,
          artist: song.artist,
          link: song.url
        }));
      });
  }

  goBack() {
    this.router.navigate(['/moods', this.task]);
  }

  // --- Shuffle button ---
  shuffleSong() {
    if (this.songs.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.songs.length);
    const card = document.querySelectorAll('.song-card')[randomIndex] as HTMLElement;
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.add('highlight');
      setTimeout(() => card.classList.remove('highlight'), 1500);
    }
  }
}
