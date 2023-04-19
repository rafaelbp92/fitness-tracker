import { Component, OnDestroy, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  exercisesSubscription: Subscription | undefined;
  constructor(private trainingService: TrainingService){}

  ngOnInit(): void {
    //this.exercises = this.trainingService.getAvailableExercises();
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      if (exercises) {
        this.exercises = exercises;
      }
    }); 
    this.trainingService.getAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercisesSubscription?.unsubscribe();
  }
}
