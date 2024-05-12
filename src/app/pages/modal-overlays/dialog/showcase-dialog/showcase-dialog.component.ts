import {Component, Input, OnInit} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DialogType } from '../model/dialog.model';
import {Campaign, CampaignTablePreview, OperatorService, RouteRule, ServiceRouter} from '../../../tables/table.model';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements OnInit {
  file: File;
  selectedRouterIndex = '';
  selectedServiceIndex = '';
  serviceRouterIds: number[];

  selectedRouterId: number;
  selectedOperatorService: OperatorService;

  services: string[] = [];

  @Input() title: string;
  @Input() type: DialogType;
  @Input() data: Campaign;
  @Input() text: string;
  @Input() serviceRouters: ServiceRouter[];

  constructor(protected ref: NbDialogRef<CampaignTablePreview>) {}

  ngOnInit() {
    if (this.type === DialogType.DELETE) {
      return;
    }
    this.serviceRouterIds = this.data.serviceRouter.rules.map(rule => rule.serviceRouterId);
    if (this.serviceRouterIds.length > 0) {
      this.selectedRouterIndex = this.serviceRouters.find(router => router.id === this.data.serviceRouter.id)
        .id.toString();
      this.selectedRouterId = this.data.serviceRouter.rules[0].serviceRouterId;
      this.selectRouterId(this.selectedRouterId);
    }
    this.selectedOperatorService = this.data.operatorService;
  }

  dismiss() {
    this.ref.close();
  }

  update() {
    const updateData = {
      name: this.data.name,
      description: this.data.description,
      serviceRouterId: this.selectedRouterId,
      operatorService: this.selectedOperatorService.toString(),
      countryCode: this.data.countryCode,
      file: this.file,
    };
    this.ref.close(updateData);
  }

  create() {
    const createData = {
      name: this.data.name,
      description: this.data.description,
      serviceRouterId: this.selectedRouterId,
      operatorService: this.selectedServiceIndex,
      countryCode: this.data.countryCode,
      file: this.file,
    };
    this.ref.close(createData);
  }

  selectRouterId(event: any): void {
    this.selectedRouterId = +event;
    this.services = this.serviceRouters.find(router => router.id === this.selectedRouterId).rules
      .map(rule => rule.operatorService);
    if (this.services.length === 1) {
      this.selectedServiceIndex = this.services[0];
    } else {
      this.selectedServiceIndex = this.services.find(os => os === this.data.operatorService);
    }
  }

  fileUploaded(event: any): void {
    this.file = event.target.files[0];
  }

  selectedService(event: any): void {
    this.selectedServiceIndex = event;
  }

  protected readonly DialogType = DialogType;
}
