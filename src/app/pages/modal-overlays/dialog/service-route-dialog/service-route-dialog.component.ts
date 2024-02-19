import {Component, Input, OnInit} from '@angular/core';
import {DialogType} from '../model/dialog.model';
import {LoadDataChild, LoadDataParent, RuleType} from '../../../tables/table.model';
import {NbDialogRef} from '@nebular/theme';
import {ServiceRouterTableComponent} from '../../../tables/service-router/service-router-table.component';

@Component({
  selector: 'ngx-service-route-dialog',
  templateUrl: './service-route-dialog.component.html',
  styleUrls: ['./service-route-dialog.component.scss'],
})
export class ServiceRouteDialogComponent implements OnInit {
  @Input() title: string;
  @Input() type: DialogType;
  @Input() childData: LoadDataChild;
  @Input() parentData: LoadDataParent;
  @Input() services: string[];

  selectedServiceIndex = '';
  selectedTypeIndex = '';
  typeSelected: RuleType;

  constructor(protected ref: NbDialogRef<ServiceRouterTableComponent>) {}

  ngOnInit(): void {
    if (this.type === DialogType.EDIT) {
      if (this.childData.data.type === RuleType.Default) {
        this.selectedTypeIndex = '0';
      }
      if (this.childData.data.type === RuleType.Timer) {
        this.selectedTypeIndex = '1';
      }
      if (this.childData.data.type === RuleType.EventCount) {
        this.selectedTypeIndex = '2';
      }
    }
  }

  selectedService(event): void {
    this.selectedServiceIndex = event;
  }

  selectedType(selectedTypeIndex): void {
    if (selectedTypeIndex === '0') {
      this.typeSelected = RuleType.Default;
    }
    if (selectedTypeIndex === '1') {
      this.typeSelected = RuleType.Timer;
    }
    if (selectedTypeIndex === '2') {
      this.typeSelected = RuleType.EventCount;
    }
  }

  dismiss(): void {
    this.ref.close();
  }

  create(): void {
    if (this.parentData) {
      const createRoute = {
        name: this.parentData.data.name,
      };
      this.ref.close(createRoute);
    } else {
      const createRule = {
        parentName: this.childData.data.parentName,
        service: this.services[+this.selectedServiceIndex],
        type: this.typeSelected,
        value: this.childData.data.value,
      };
      this.ref.close(createRule);
    }
  }

  update(): void {
    const updateRule = {
      parentName: this.childData.data.parentName,
      service: this.childData.data.service,
      type: this.typeSelected ? this.typeSelected : this.childData.data.type,
      value: this.childData.data.value,
    };
    this.ref.close(updateRule);
  }

  delete(): void {
    if (this.parentData) {
      const deleteRoute = {
        name: this.parentData.data.name,
      };
      this.ref.close(deleteRoute);
    } else {
      const deleteRule = {
        parentName: this.childData.data.parentName,
        service: this.childData.data.service,
      };
      this.ref.close(deleteRule);
    }
  }

  protected readonly RuleType = RuleType;
  protected readonly DialogType = DialogType;
}
