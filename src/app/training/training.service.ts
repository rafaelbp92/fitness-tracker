import { Subject, map } from 'rxjs';

import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[] | null>();
  finishedExercisesChanged = new Subject<Exercise[] | null>();
  loadingAvailableExerciesStateChanged = new Subject<boolean>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | undefined;
  private exercises: Exercise[] = [];

  constructor(private db: Firestore){}

  getAvailableExercises() {
    this.loadingAvailableExerciesStateChanged.next(true);
    this.getAvailableExercisesFromDb().subscribe((exercises: Exercise[]) => {
      this.availableExercises = exercises;
      this.exercisesChanged.next([...this.availableExercises]);
      this.loadingAvailableExerciesStateChanged.next(false);
    }, () => {
      this.loadingAvailableExerciesStateChanged.next(false);
    })
  }

  private getAvailableExercisesFromDb() {
    const availableExercisesCollection = collection(this.db, 'avilable_exercises');
    return collectionData(availableExercisesCollection, {idField: 'id'}).pipe(
      map(exercise => {
        return JSON.parse(JSON.stringify(exercise)) as Exercise[]
      }));
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      ex => ex.id === selectedId
    );
    if (this.runningExercise) {
      this.exerciseChanged.next({ ...this.runningExercise });
    }
  }

  completeExercise() {
    if (this.runningExercise) {
      this.addFinishedExercise({
        ...this.runningExercise,
        date: new Date,
        state: 'completed'
      })
      this.runningExercise = undefined;
      this.exerciseChanged.next(null);
    }
  }

  cancelExercise(progress: number) {
    if (this.runningExercise) {
      this.exercises.push({
        ...this.runningExercise,
        duration: this.runningExercise.duration * (progress / 100),
        calories: this.runningExercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.runningExercise = undefined;
      this.exerciseChanged.next(null);
    }
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    const finishedExercisesCollection = collection(this.db, 'finished_exercises');
    collectionData(finishedExercisesCollection, {idField: 'id'}).pipe(
      map(exercise => {
        return JSON.parse(JSON.stringify(exercise)) as Exercise[]
      })).subscribe(exercises => {
        this.finishedExercisesChanged.next(exercises);
      });
    
  }

  private addFinishedExercise(exercise: Exercise) {
    const finishedExercisesCollection = collection(this.db, 'finished_exercises');
    addDoc(finishedExercisesCollection, exercise);
  }
}
