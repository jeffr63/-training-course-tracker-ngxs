import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AdminComponent } from "./admin.component";
import { CanActivateAdmin } from "../auth/canActiveateAdmin.guard";
import { PathEditComponent } from "./path-edit.component";
import { PathListComponent } from "./path-list.component";
import { PathsFacade } from "./paths.facade";
import { SharedModule } from "../shared/shared.module";
import { SourceEditComponent } from "./source-edit.component";
import { SourceListComponent } from "./source-list.component";
import { SourcesFacade } from "./sources.facade";

const routes = [
  {
    path: "",
    children: [
      { path: "", component: AdminComponent },
      { path: "sources", component: SourceListComponent },
      { path: "sources/:id", component: SourceEditComponent },
      { path: "paths", component: PathListComponent },
      { path: "paths/:id", component: PathEditComponent },
    ],
    canActivate: [CanActivateAdmin],
  },
];

@NgModule({
  declarations: [
    AdminComponent,
    PathListComponent,
    PathEditComponent,
    SourceListComponent,
    SourceEditComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    NgbModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [PathsFacade, SourcesFacade],
})
export class AdminModule {}
