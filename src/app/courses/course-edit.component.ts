import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { faSave, faBan } from "@fortawesome/free-solid-svg-icons";

import { CoursesFacade } from "./courses.facade";

@Component({
  selector: "app-course-edit",

  template: `
    <section class="container">
      <section class="card">
        <form *ngIf="facade.course$ | async as course">
          <fieldset class="form-group row">
            <label class="col-form-label col-sm-2" for="title">Title</label>
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                name="title"
                [(ngModel)]="course.title"
                placeholder="Enter title of course taken"
              />
            </div>
          </fieldset>

          <fieldset class="form-group row">
            <label class="col-form-label col-sm-2" for="instructor"
              >Instructor</label
            >
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                name="instructor"
                [(ngModel)]="course.instructor"
                placeholder="Enter name of course's intructor"
              />
            </div>
          </fieldset>

          <fieldset class="form-group row">
            <label class="col-form-label col-sm-2" for="path">Path</label>
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                name="path"
                [(ngModel)]="course.path"
                list="path-helpers"
                placeholder="Enter techical path of course (ex: Angular or React)"
              />
              <datalist id="path-helpers">
                <option
                  *ngFor="let path of facade.paths$ | async"
                  value="{{ path.name }}"
                ></option>
              </datalist>
            </div>
          </fieldset>

          <fieldset class="form-group row">
            <label class="col-form-label col-sm-2" for="source">Source</label>
            <div class="col-sm-6">
              <input
                type="text"
                class="form-control"
                name="source"
                list="source-helpers"
                [(ngModel)]="course.source"
                placeholder="Enter where the course was sourced from (ex: Pluralsite)"
              />
              <datalist id="source-helpers">
                <option
                  *ngFor="let source of facade.sources$ | async"
                  value="{{ source.name }}"
                ></option>
              </datalist>
            </div>
          </fieldset>

          <div class="form-group row form-buttons">
            <button
              class="btn btn-primary mr-sm-2"
              (click)="facade.saveCourse(saveId)"
              title="Save"
            >
              <fa-icon [icon]="faSave"></fa-icon> Save
            </button>
            <a
              class="btn btn-secondary"
              (click)="facade.cancelEdit()"
              title="Cancel"
            >
              <fa-icon [icon]="faBan"></fa-icon> Cancel
            </a>
          </div>
        </form>
      </section>
    </section>
  `,

  styles: [
    `
      section .card {
        margin-top: 30px;
        padding-left: 15px;
        padding-right: 15px;
      }

      .form-buttons {
        margin-left: 3px;
      }
    `,
  ],
})
export class CourseEditComponent implements OnInit {
  faSave = faSave;
  faBan = faBan;
  saveId = "";

  constructor(private route: ActivatedRoute, public facade: CoursesFacade) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.saveId = params.id;
      this.facade.loadCourse(params.id);
    });
  }
}
