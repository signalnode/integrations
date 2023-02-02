import { SignalNodeAddon } from '@signalnode/types';
import SolarEdgeClient from 'solaredge-client';

let solarEdgeClient: SolarEdgeClient;

type Config = {
  apiKey: string;
  siteId: string;
};

type PropertyNames = 'currentExport' | 'currentConsumption' | 'currentSelfConsumption' | 'currentImport';

const SolarEdgeAddon: SignalNodeAddon<Config, PropertyNames> = {
  configLayout: {
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
  },
  properties: [
    {
      name: 'currentExport',
      description: 'Current exported energy',
      value: 0,
      unit: 'W',
      useHistory: true,
    },
    {
      name: 'currentConsumption',
      description: 'Current energy consumption',
      value: 0,
      unit: 'W',
      useHistory: true,
    },
    {
      name: 'currentSelfConsumption',
      description: 'Current self energy consumption',
      value: 0,
      unit: 'W',
      useHistory: true,
    },
    {
      name: 'currentImport',
      description: 'Current imported energy',
      value: 0,
      unit: 'W',
      useHistory: true,
    },
  ],
  tasks: [
    {
      interval: ['*/15', '*', '*', '*', '*'],
      run: async (config: Config) => {
        const res = await solarEdgeClient.getPowerFlow(config.siteId);
        let currentExport = 0;
        let currentConsumption = 0;
        let currentSelfConsumption = 0;
        let currentImport = 0;

        res.siteCurrentPowerFlow.connections.forEach((connection) => {
          if (connection.from === 'GRID' && connection.to === 'Load') {
            currentImport = res.siteCurrentPowerFlow.GRID.currentPower;
          } else if (connection.from === 'PV' && connection.to === 'Load') {
            currentSelfConsumption = res.siteCurrentPowerFlow.PV!.currentPower;

            const energyExport = res.siteCurrentPowerFlow.PV!.currentPower - res.siteCurrentPowerFlow.LOAD.currentPower;
            currentExport = energyExport > 0 ? energyExport : 0;
          }
        });
        currentConsumption = res.siteCurrentPowerFlow.LOAD.currentPower;

        return {
          currentImport,
          currentConsumption,
          currentSelfConsumption,
          currentExport,
        };
      },
    },
  ],
  start: async (config) => {
    console.log('Config:', config);
    solarEdgeClient = new SolarEdgeClient(config.apiKey);
  },
};

export default SolarEdgeAddon;
