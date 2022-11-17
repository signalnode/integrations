import { SignalNodeModule } from '@signalnode/types';
import SolarEdgeClient from 'solaredge-client';

let solarEdgeClient: SolarEdgeClient;

type Config = {
  apiKey: string;
  siteId: string;
};

type Entity = 'lifeTimeEnergy' | 'lastYearEnergy' | 'lastMonthEnergy' | 'lastDayEnergy' | 'currentPower';

const SolarEdgeAddon: SignalNodeModule<Config, Entity> = {
  getUIConfig: () => ({
    columnTemplate: 'auto auto',
    rowTemplate: 'auto auto',
    gap: 20,
    elements: [
      {
        type: 'input',
        name: 'apiKey',
        label: 'API Key',
        options: {
          columnStart: '1',
          rowStart: '1',
        },
      },
      {
        type: 'input',
        name: 'siteId',
        label: 'Site ID',
        options: {
          columnStart: '2',
          rowStart: '1',
        },
      },
    ],
  }),
  getEntities: () => [
    {
      name: 'currentPower',
      description: 'Current power',
      value: 0,
      unit: 'w',
    },
    {
      name: 'lastDayEnergy',
      description: 'Last day energy',
      value: 0,
      unit: 'wh',
    },
  ],
  registerJobs: () => [
    {
      interval: ['*/10', '*', '*', '*', '*', '*'],
      job: async (config: Config) => {
        const res = await solarEdgeClient.getOverview(config.siteId);
        return [['currentPower', res.owerview.currentPower.power]];
      },
    },
  ],
  run: (config) => {
    console.log('Addon started');

    solarEdgeClient = new SolarEdgeClient(config.apiKey);
  },
};

export default SolarEdgeAddon;
