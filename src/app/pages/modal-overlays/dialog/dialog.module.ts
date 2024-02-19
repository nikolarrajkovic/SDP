import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule, NbTreeGridModule,
  NbUserModule,
} from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { FormsRoutingModule } from '../../forms/forms-routing.module';
import { FormsModule } from '@angular/forms';
import {FormModule} from '../../forms/forms.module';
import {ShowcaseDialogComponent} from './showcase-dialog/showcase-dialog.component';
import { ServiceRouteDialogComponent } from './service-route-dialog/service-route-dialog.component';

@NgModule({
  imports: [
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    FormsRoutingModule,
    NbSelectModule,
    NbIconModule,
    FormModule,
    FormsModule,
    NbTreeGridModule,
  ],
  declarations: [
    ShowcaseDialogComponent,
    ServiceRouteDialogComponent,
  ],
})
export class DialogModule { }
