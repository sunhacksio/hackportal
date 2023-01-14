export const buttonDatas = [
  { text: 'Hacker Application', path: '/' },
  { text: 'Mentor Application', path: '/' },
  { text: 'Sponsor Application', path: '/' },
];

export const navItems = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'HackerPacks', path: '/hackerpacks' },
  { text: 'Schedule', path: '/schedule' },
];

export const stats = [
  {
    data: '2021 Online Attendies',
    object: '55455',
  },
  {
    data: 'Shocking',
    object: 'statistic 2',
  },
  {
    data: 'Incredible',
    object: 'statistic 3',
  },
];

export const DEFAULT_EVENT_FORM_DATA: ScheduleEvent = {
  description: '',
  title: '',
  page: '',
  type: '',
  track: '',
  location: '',
  speakers: [],
  startDate: new Date(),
  endDate: new Date(),
  Event: -1,
};
