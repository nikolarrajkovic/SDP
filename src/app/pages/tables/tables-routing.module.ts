import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TablesComponent } from './tables.component';
import { CampaignsTableComponent } from './campaigns/campaigns-table.component';
import { ServiceRouterTableComponent } from './service-router/service-router-table.component';

const routes: Routes = [{
  path: '',
  component: TablesComponent,
  children: [
    {
      path: 'campaigns',
      component: CampaignsTableComponent,
    },
    {
      path: 'service-router',
      component: ServiceRouterTableComponent,
    },
    {
      path: '',
      redirectTo: 'campaigns',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TablesRoutingModule { }

export const routedComponents = [
  TablesComponent,
  CampaignsTableComponent,
  ServiceRouterTableComponent,
];
