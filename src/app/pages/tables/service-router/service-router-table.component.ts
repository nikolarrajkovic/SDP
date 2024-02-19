import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {
  NbDialogService,
  NbSortDirection,
  NbSortRequest,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
} from '@nebular/theme';
import {
  LoadDataChild,
  LoadDataParent,
  OperatorService,
  RuleType,
  ServiceRouter,
  ServiceRouterPreview,
} from '../table.model';
import {TableService} from '../table.service';
import {
  ServiceRouteDialogComponent,
} from '../../modal-overlays/dialog/service-route-dialog/service-route-dialog.component';
import {DialogType} from '../../modal-overlays/dialog/model/dialog.model';
import {ScrollDispatcher} from '@angular/cdk/overlay';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

@Component({
  selector: 'ngx-service-router',
  templateUrl: './service-router-table.component.html',
  styleUrls: ['./service-router-table.component.scss'],
})
export class ServiceRouterTableComponent implements OnInit {
  customColumn = 'name';
  defaultColumns = [ 'service', 'type', 'value' ];
  actionColumn = 'actions';
  allColumns = [ this.customColumn, ...this.defaultColumns, this.actionColumn ];

  dataSource: NbTreeGridDataSource<ServiceRouterPreview>;

  sortColumn: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  loadData: LoadDataParent[] = [];
  serviceRouters: ServiceRouter[] = [];
  services: string[];

  page = 0;
  pageSize = 10;
  hasMore = true;

  destroy$ = new Subject<void>();

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<ServiceRouterPreview>,
              private tableService: TableService,
              private dialogService: NbDialogService,
              private scrollDispatcher: ScrollDispatcher,
              private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    this.loadMore();
    this.tableService.getServices().subscribe(services => this.services = services);
  }

  loadMore(): void {
    this.getServiceRouters();
    this.page++;
  }

  getServiceRouters(pages: number = null, pageSize: number = null): void {
    this.tableService.getServiceRouters(this.page, this.pageSize).subscribe(res => {
      if (pages && pageSize) {
        this.page = pages;
        this.pageSize = pageSize;
      }
      this.serviceRouters = this.serviceRouters.concat(res);
      res.forEach(sr => this.loadData.push(this.createServiceRouterPreview(sr)));
      this.dataSource = this.dataSourceBuilder.create(this.loadData);
      if (res.length === 0 || res.length < this.pageSize) {
        this.hasMore = false;
        return;
      }
    });
  }

  createServiceRouterPreview(serviceRouter: ServiceRouter): LoadDataParent {
    const rules: LoadDataChild[] = [];
    serviceRouter.rules.forEach(rule => rules.push({
      data: {
        parentName: serviceRouter.name,
        service: rule.operatorService,
        type: rule.type,
        value: rule.value,
        add: false,
        edit: true,
        delete: true,
      },
    }));
    return {
      data: {
        name: serviceRouter.name,
        add: true,
        edit: false,
        delete: true,
      },
      children: rules,
    };
  }

  create(event: any): void {
    if (!event) {
      const dialog = this.dialogService.open(ServiceRouteDialogComponent, {
        context: {
          title: 'Add Router',
          type: DialogType.CREATE,
          parentData: {
            data: {
              name: '',
            },
          },
          services: this.services,
        },
      }).onClose.subscribe(res => {
        if (res) {
          this.createRouter(res.name);
        }
      });
    } else {
      const dialog = this.dialogService.open(ServiceRouteDialogComponent, {
        context: {
          title: 'Add Rule',
          type: DialogType.CREATE,
          childData: {
            data: {
              parentName: event.data.name,
            },
          },
          services: this.services,
        },
      }).onClose.subscribe(res => {
        if (res) {
          this.createRule(res);
        }
      });
    }
  }

  createRouter(name: string): void {
    this.tableService.createRouter(name).subscribe(res => {
      this.refreshTable();
    });
  }

  createRule(newRule: any): void {
    const routeId = this.serviceRouters.find(router => router.name === newRule.parentName).id;
    this.tableService.createRule(routeId, newRule.service, newRule.type, newRule.value).subscribe(res => {
      this.refreshTable();
    });
  }

  refreshTable(): void {
    const pageSize = 10;
    const mod = this.serviceRouters.length % pageSize;
    const div = this.serviceRouters.length / pageSize;
    const pages = mod > 0 ? div + 1 : div;
    this.page = 0;
    this.pageSize = pages * pageSize;
    this.serviceRouters = [];
    this.loadData = [];
    this.getServiceRouters(pages, pageSize);
  }

  update(event: any): void {
    const dialog = this.dialogService.open(ServiceRouteDialogComponent, {
      context: {
        title: 'Edit Router',
        type: DialogType.EDIT,
        childData: {
          data: {
            parentName: event.data.parentName,
            service: event.data.service,
            type: event.data.type,
            value: event.data.value,
          },
        },
        services: this.services,
      },
    }).onClose.subscribe(res => {
      if (res) {
        this.updateRule(res);
      }
    });
  }

  updateRule(updatedRule: any): void {
    console.log(updatedRule);
    const routeId = this.serviceRouters.find(router => router.name === updatedRule.parentName).id;
    this.tableService.updateRule(routeId, updatedRule.service, updatedRule.type, updatedRule.value).subscribe(res => {
      this.refreshTable();
    });
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  delete(event: any): void {
    if (event.children) {
      const dialog = this.dialogService.open(ServiceRouteDialogComponent, {
        context: {
          title: 'Delete Router',
          type: DialogType.DELETE,
          parentData: {
            data: {
              name: event.data.name,
            },
          },
        },
      }).onClose.subscribe(res => {
        if (res) {
          this.deleteRouter(res);
        }
      });
    } else {
      const dialog = this.dialogService.open(ServiceRouteDialogComponent, {
        context: {
          title: 'Delete Rule',
          type: DialogType.DELETE,
          childData: {
            data: {
              parentName: event.data.parentName,
              service: event.data.service,
            },
          },
          services: this.services,
        },
      }).onClose.subscribe(res => {
        if (res) {
          this.deleteRule(res);
        }
      });
    }
  }

  deleteRouter(deletedRouter: any): void {
    const routeId = this.serviceRouters.find(router => router.name === deletedRouter.name).id;
    this.tableService.deleteRouter(routeId).subscribe(res => {
      this.refreshTable();
    });
  }

  deleteRule(deletedRule: any): void {
    const routeId = this.serviceRouters.find(router => router.name === deletedRule.parentName).id;
    this.tableService.deleteRule(routeId, deletedRule.service).subscribe(res => {
      this.refreshTable();
    });
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline"></nb-icon>
    </ng-template>
  `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
