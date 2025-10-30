import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class TasksComponent implements OnInit {
  tasks: string[] = [];

  constructor(private router: Router, private taskService: TaskService) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data; // ✅ fetched from backend
    });
  }

  selectTask(task: string) {
    // Navigate to moods page for the selected task
    this.router.navigate(['/moods', task]);
  }
}

