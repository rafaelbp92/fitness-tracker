import { Subscription, map, take } from 'rxjs';

import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: Firestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  getAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.getAvailableExercisesFromDb().subscribe(
        (exercises: Exercise[]) => {
          this.store.dispatch(new UI.StopLoading());
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        },
        () => {
          this.uiService.showSnackbar(
            'Fetching Exercises failed, please try again later',
            3000,
            undefined
          );
        }
      )
    );
  }

  private getAvailableExercisesFromDb() {
    const availableExercisesCollection = collection(
      this.db,
      'avilable_exercises'
    );
    return collectionData(availableExercisesCollection, { idField: 'id' }).pipe(
      map((exercise) => {
        return JSON.parse(JSON.stringify(exercise)) as Exercise[];
      })
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex) {
          this.finishExercise({
            ...ex,
            date: new Date(),
            state: 'completed',
          });
          this.store.dispatch(new Training.StopTraining());
        }
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex) {
          this.finishExercise({
            ...ex,
            duration: ex.duration * (progress / 100),
            calories: ex.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled',
          });
          this.store.dispatch(new Training.StopTraining());
        }
      });
  }

  getCompletedOrCancelledExercises() {
    const finishedExercisesCollection = collection(
      this.db,
      'finished_exercises'
    );

    this.fbSubs.push(
      collectionData(finishedExercisesCollection, { idField: 'id' })
        .pipe(
          map((exercise) => {
            return JSON.parse(JSON.stringify(exercise)) as Exercise[];
          })
        )
        .subscribe((exercises) => {
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        })
    );
  }

  private finishExercise(exercise: Exercise) {
    const finishedExercisesCollection = collection(
      this.db,
      'finished_exercises'
    );
    addDoc(finishedExercisesCollection, exercise);
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }
}
