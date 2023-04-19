import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import { Firestore, collection,collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises: Observable<any> | undefined;
  constructor(private trainingService: TrainingService,
    private db: Firestore){}

  ngOnInit(): void {
    //this.exercises = this.trainingService.getAvailableExercises(); 

    const availableExercisesCollection = collection(this.db, 'avilable_exercises');
    this.exercises = collectionData(availableExercisesCollection, {idField: 'id'});
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
