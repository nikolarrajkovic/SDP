export enum RuleType {
  Default = 'Default',
  Timer = 'Timer',
  EventCount = 'EventCount',
}

export enum OperatorService {
  Ingame = 'Ingame',
  Playono = 'Playono',
}

export interface RouteRule {
  serviceRouterId: number;
  serviceRouter?: ServiceRouter;
  operatorService: OperatorService;
  type: RuleType;
  value: number;
}


export interface ServiceRouter {
  id: number;
  name: string;
  rules: RouteRule[];
}

export interface CampaignTablePreview {
  name: string;
  description: string;
  operatorService: string;
  serviceRouterName: string;
  countryCode: string;
}

export interface Campaign {
  id: number;
  name: string;
  description: string;
  previewURL?: string;
  serviceRouterId: number;
  serviceRouter: ServiceRouter;
  operatorService: OperatorService;
  activeServiceStarted: string;
  eventsCount: number;
  countryCode:	string;
  file?: File;
}

export interface ServiceRouterPreview {
  name?: string;
  parentName?: string;
  service?: OperatorService;
  type?: RuleType;
  value?: number;
  add?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export interface LoadDataParent {
  data: ServiceRouterPreview;
  children?: LoadDataChild[];
}

export interface LoadDataChild {
  data: ServiceRouterPreview;
}
