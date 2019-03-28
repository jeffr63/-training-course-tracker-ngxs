import { State, Action, StateContext, Selector } from '@ngxs/store';
import { catchError, map } from 'rxjs/operators';

import { Course } from '../course';
import { CoursesService } from '../courses.service';
import {
  Delete, DeleteSuccess, DeleteFail,
  GetCourse, GetCourseSuccess, GetCourseFail,
  GetTotal, GetTotalSuccess, GetTotalFail,
  Load, LoadSuccess, LoadFail,
  Save, SaveSuccess, SaveFail, NewCourse,
} from './course.actions';

export interface CoursesStateModel {
  courses: Course[];
  currentCourse: Course;
  totalCourses: number;
  error: string;
}

@State<CoursesStateModel>({
  name: 'courses',
  defaults: {
    courses: [],
    currentCourse: null,
    totalCourses: 0,
    error: '',
  }
})
export class CoursesState {

  constructor(private coursesService: CoursesService) { }

  @Selector()
  static getCourses(state: CoursesStateModel) {
    return state.courses;
  }

  @Selector()
  static getError(state: CoursesStateModel) {
    return state.error;
  }

  @Selector()
  static getCourse(state: CoursesStateModel) {
    return state.currentCourse;
  }

  @Selector()
  static getTotalCourses(state: CoursesStateModel) {
    return state.totalCourses;
  }

  @Action(Delete)
  public delete({ dispatch, patchState }: StateContext<CoursesStateModel>, { payload }: Delete) {
    patchState({
      error: ''
    });
    return this.coursesService.deleteCourse(payload.id).pipe(
      map(_course => {
        return dispatch([
          new DeleteSuccess(),
          new Load({ current: payload.current, pageSize: payload.pageSize }),
          new GetTotal()
        ]);
      }),
      catchError(error => {
        return dispatch(new DeleteFail(error));
      })
    );
  }

  @Action(DeleteFail)
  public deleteFail({ patchState }: StateContext<CoursesStateModel>, { payload }: DeleteFail) {
    patchState({
      error: payload
    });
  }

  @Action(DeleteSuccess)
  public deleteSuccess({ patchState }: StateContext<CoursesStateModel>) {
    patchState({
      error: ''
    });
  }

  @Action(GetCourse)
  public getCourse({ dispatch, patchState }: StateContext<CoursesStateModel>, { payload }: GetCourse) {
    patchState({
      error: ''
    });
    return this.coursesService.getCourse(payload).pipe(
      map(course => {
        return dispatch(new GetCourseSuccess(course));
      }),
      catchError(error => {
        return dispatch(new GetCourseFail(error));
      })
    );
  }

  @Action(GetCourseFail)
  public getCourseFail({ patchState }: StateContext<CoursesStateModel>, { payload }: GetCourseFail) {
    patchState({
      currentCourse: null,
      error: payload
    });
  }

  @Action(GetCourseSuccess)
  public getCourseSuccess({ patchState }: StateContext<CoursesStateModel>, { payload }: GetCourseSuccess) {
    patchState({
      currentCourse: payload,
      error: ''
    });
  }

  @Action(GetTotal)
  public getTotal({ dispatch, patchState }: StateContext<CoursesStateModel>) {
    patchState({
      error: ''
    });
    return this.coursesService.getCourses().pipe(
      map((courses: Course[]) => {
        return dispatch(new GetTotalSuccess(courses.length));
      }),
      catchError(error => {
        return dispatch(new GetTotalFail(error));
      })
    );
  }

  @Action(GetTotalFail)
  public getTotalFail({ patchState }: StateContext<CoursesStateModel>, { payload }: GetTotalFail) {
    patchState({
      totalCourses: 0,
      error: payload
    });
  }

  @Action(GetTotalSuccess)
  public getTotalSuccess({ patchState }: StateContext<CoursesStateModel>, { payload }: GetTotalSuccess) {
    patchState({
      totalCourses: payload,
      error: ''
    });
  }

  @Action(Load)
  public load({ dispatch, patchState }: StateContext<CoursesStateModel>, { payload }: Load) {
    patchState({
      error: ''
    });
    return this.coursesService.getCoursesPaged(payload.current, payload.pageSize).pipe(
      map((courses: Course[]) => {
        return dispatch(new LoadSuccess(courses));
      }),
      catchError(error => {
        return dispatch(new LoadFail(error));
      })
    );
  }

  @Action(LoadFail)
  public loadFail({ patchState }: StateContext<CoursesStateModel>, { payload }: LoadFail) {
    patchState({
      courses: [],
      error: payload
    });
  }

  @Action(LoadSuccess)
  public loadSuccess({ patchState }: StateContext<CoursesStateModel>, { payload }: LoadSuccess) {
    patchState({
      courses: payload,
      error: ''
    });
  }

  @Action(NewCourse)
  public newCourse({ patchState }: StateContext<CoursesStateModel>) {
    const initCourse = {
      id: null,
      title: '',
      instructor: '',
      path: '',
      source: ''
    };
    patchState({
      currentCourse: initCourse
    });
  }

  @Action(Save)
  public save({ dispatch, getState, patchState }: StateContext<CoursesStateModel>) {
    patchState({
      error: ''
    });
    const state = getState();
    return this.coursesService.saveCourse(state.currentCourse).pipe(
      map((course: Course) => {
        return dispatch([
          new SaveSuccess(course),
          new GetTotal()
        ]);
      }),
      catchError(error => {
        return dispatch(new SaveFail(error));
      })
    );
  }

  @Action(SaveFail)
  public saveFail({ patchState }: StateContext<CoursesStateModel>, { payload }: SaveFail) {
    patchState({
      courses: [],
      error: payload
    });
  }

  @Action(SaveSuccess)
  public saveSuccess({ getState, patchState }: StateContext<CoursesStateModel>, { payload }: SaveSuccess) {
    const state = getState();
    const updatedCourses = state.courses.map(
      item => payload.id === item.id ? payload : item);
    patchState({
      courses: updatedCourses,
      currentCourse: null,
      error: ''
    });
  }

}
