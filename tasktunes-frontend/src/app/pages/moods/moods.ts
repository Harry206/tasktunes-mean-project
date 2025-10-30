import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-moods',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './moods.html',
  styleUrls: ['./moods.css']
})
export class MoodsComponent implements OnInit {
  task!: string;
  moods: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.task = this.route.snapshot.paramMap.get('task')!;
    this.taskService.getMoods(this.task).subscribe(data => {
      this.moods = data; // ✅ fetched from backend
    });
  }

  goToPlaylist(mood: string) {
    this.router.navigate(['/playlist', this.task, mood]);
  }

  goBack() {
  this.router.navigate(['/tasks']);
}

}
