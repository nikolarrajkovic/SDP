import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Tables & Data',
    icon: 'grid-outline',
    children: [
      {
        title: 'Campaign table',
        link: '/pages/tables/campaigns',
      },
      {
        title: 'Service router table',
        link: '/pages/tables/service-router',
      },
    ],
  },
];
