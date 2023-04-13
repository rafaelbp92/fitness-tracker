import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StopTrainingComponent } from './stop-training/stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer : any;

  constructor(private dialog: MatDialog, private trainingService: TrainingService) {

  }

  ngOnInit(){
    this.startOrResumeTraining();
  }

  startOrResumeTraining() {
    const step = this.trainingService.getRunningExercise().duration;
    if (step) {
      this.timer = setInterval(() => {
        this.progress += 5;
        if (this.progress >= 100) {
          clearInterval(this.timer);
          this.trainingService.completeExercise();
        }
      }, step / 100 * 1000);
    }
  }
    
  stopWorkout() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTraining();
      }
    });
  }
}