import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();
  private finishedExerciesSubscription : Subscription | undefined;

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.finishedExerciesSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises) => {
      if (exercises != null) {
        this.dataSource.data = exercises;
      }
    });
    this.trainingService.getCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    if (this.sort && this.paginator) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator
    }
  }

  fiterExercises(event?: Event) {
    if (event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }

  ngOnDestroy(): void {
    if (this.finishedExerciesSubscription) {
      this.finishedExerciesSubscription.unsubscribe();
    }
  }
}
