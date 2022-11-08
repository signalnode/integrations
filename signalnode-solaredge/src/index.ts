import SolarEdgeClient from 'solaredge-client';
import { SignalNodeModule, UIConfig } from '@signalnode/types';
import { Job } from '@signalnode/types/dist/job';

let solarEdgeClient: SolarEdgeClient;

type Config = {
  apiKey: string;
  siteId: number;
};

const SolarEdgeAddon: SignalNodeModule = {
  getUIConfig: (): UIConfig => ({
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
      name: 'totalEnergy',
      description: 'Total generated energy',
      value: 0,
      unit: 'wh',
      interval: ['*/10', '*', '*', '*', '*', '*'],
      job: async (config: Config) => {
        // const res = await solarEdgeClient.getOverview(config.siteId);
        // return res.owerview.lifeTimeData;
        return 'Test';
      },
    },
    {
      name: 'test',
      description: 'test',
      value: 0,
      unit: 'wh',
      interval: ['*/10', '*', '*', '*', '*', '*'],
      job: (config: Config) => {
        // const res = await solarEdgeClient.getOverview(config.siteId);
        // return res.owerview.lifeTimeData;
        return 'Test';
      },
    },
  ],
  // registerJobs: () => [
  //   {
  //     interval: 1000,
  //     job: async () => {
  //       const res = await solarEdgeClient.getEnergy({ siteId: 123, startDate: '123', endDate: '123', timeUnit: 'DAY' });
  //       return ['test', res.energy.values[0].value];
  //     },
  //   },
  // ],
  run: (config: Config) => {
    console.log('Addon started');

    solarEdgeClient = new SolarEdgeClient(config.apiKey);
  },
};

export default SolarEdgeAddon;
