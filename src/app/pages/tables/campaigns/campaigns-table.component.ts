import { Component, OnInit } from '@angular/core';
import { ShowcaseDialogComponent } from '../../modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { DialogType } from '../../modal-overlays/dialog/model/dialog.model';
import { TableService } from '../table.service';
import {Campaign, CampaignTablePreview, OperatorService, ServiceRouter} from '../table.model';
import { LocalDataSource } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-campaigns',
  templateUrl: './campaigns-table.component.html',
  styleUrls: ['./campaigns-table.component.scss'],
})
export class CampaignsTableComponent implements OnInit {
  settings = {
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      operatorService: {
        title: 'Operator service',
        type: 'string',
      },
      serviceRouterName: {
        title: 'Service router name',
        type: 'string',
      },
      countryCode: {
        title: 'Country code',
        type: 'string',
      },
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-cloudy"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmDelete: true,
    },
    pager: {
      display: true,
      perPage: 10,
    },
    actions: {
      position: 'right',
    },
    mode: 'external',
  };
  campaigns: Campaign[] = [];
  campaignsPreviews: CampaignTablePreview[] = [];

  source: LocalDataSource = new LocalDataSource();
  serviceRouters: ServiceRouter[] = [];
  pageSize = 10;

  constructor(private dialogService: NbDialogService,
              private tableService: TableService,
  ) {}

  ngOnInit() {
    this.initCampaigns();
    this.source.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.pageChange(change.paging.page);
      }
    });
    this.tableService.getServiceRouters(0, 100).subscribe(res => {
      this.serviceRouters = res;
    });

  }

  initCampaigns(): void {
    this.tableService.getCampaigns(0, this.pageSize * 2).subscribe(res => {
      if (this.source) {
        this.source.empty().then();
      }
      if (this.source.count() > 0) {
        this.createCampaignTablePreviewDTO(res).forEach(d => this.source.add(d));
        this.source.getAll()
          .then(d => this.source.load(d));
      } else {
        this.source.load(this.createCampaignTablePreviewDTO(res));
      }
      this.campaigns = res;
    });
  }

  pageChange(pageIndex) {
    if (pageIndex * this.pageSize === this.source.count()) {
      this.tableService.getCampaigns(pageIndex, this.pageSize).subscribe(data => {
        if (this.source.count() > 0) {
          this.createCampaignTablePreviewDTO(data).forEach(d => this.source.add(d));
          this.source.getAll()
            .then(d => this.source.load(d));
        } else
          this.source.load(this.createCampaignTablePreviewDTO(data));
        this.campaigns = [ ...this.campaigns, ...data ];
      });
    }
  }

  createCampaignTablePreviewDTO(campaigns: Campaign[]): CampaignTablePreview[] {
    const campaignsPreview: CampaignTablePreview[] = [];
    campaigns.forEach(campaign => {
      campaignsPreview.push(this.transformToCampaignPreviewDTO(campaign));
    });
    return campaignsPreview;
  }

  transformToCampaignPreviewDTO(campaign: Campaign): CampaignTablePreview {
    return {
      name: campaign.name,
      description: campaign.description,
      operatorService: this.getOperationServiceString(campaign.operatorService),
      serviceRouterName: campaign.serviceRouter.name,
      countryCode: campaign.countryCode,
    };
  }

  getOperationServiceString(os: OperatorService | any): string {
    switch (os) {
      case OperatorService.Ingame:
        return 'Ingame';
      case OperatorService.Playono:
        return 'Playono';
      default:
        return os.toString();
    }
  }

  openCampaign(event): void {
    const campaign = this.campaigns.find(camp => camp.name === event.data.name);
    window.open(`${environment.endpoint}${campaign.previewURL}`, '_blank');
  }

  update(event): void {
    const dialog = this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Edit campaign',
        type: DialogType.EDIT,
        data: this.campaigns.find(campaign => campaign.name === event.data.name),
        serviceRouters: this.serviceRouters,
      },
    }).onClose.subscribe(res => {
      if (res) {
        this.updateCampaign(res);
      }
    });
  }

  updateCampaign(updatedCampaign: any) {
    this.tableService.updateCampaign(updatedCampaign).subscribe(res => {
      const index = this.campaigns.findIndex(campaign => campaign.name === res.name);
      this.campaigns[index] = { ...res };
      this.campaignsPreviews = this.createCampaignTablePreviewDTO(this.campaigns);
    });
    if (updatedCampaign.file) {
      this.uploadFile(updatedCampaign.name, updatedCampaign.file);
    }
    this.initCampaigns();
  }

  create(event): void {
    const dialog = this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: 'Create campaign',
        type: DialogType.CREATE,
        data: {
          id: 0,
          name: '',
          description: '',
          serviceRouterId: 0,
          serviceRouter: {
            id: 0,
            name: '',
            rules: [],
          },
          operatorService: undefined,
          activeServiceStarted: '',
          eventsCount: 0,
          countryCode:	'',
        },
        serviceRouters: this.serviceRouters,
      },
    }).onClose.subscribe(res => {
      if (res) {
        this.createCampaign(res);
      }
    });
  }

  createCampaign(createdCampaign: any) {
    this.tableService.createCampaign(createdCampaign).subscribe(res => {
      this.campaigns.push({ ...res });
      this.campaignsPreviews = this.createCampaignTablePreviewDTO(this.campaigns);
      if (res.file) {
        this.uploadFile(res.name, res.file);
      }
      this.initCampaigns();
    });
  }

  uploadFile(name: string, file: File): void {
    this.tableService.uploadFile(name, file).subscribe();
  }

  downloadFile(event) {
    this.tableService.downloadFile(event.data.name).subscribe((data: ArrayBuffer) => {
        this.saveFile(data, event);
    });
  }

  private saveFile(data: ArrayBuffer, event: any) {
    const blob = new Blob([data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.download = `${event.data.name}.zip`;
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
