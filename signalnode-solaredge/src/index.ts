import { EventBus, SignalNodeIntegration } from '@signalnode/types';
import SolarEdgeClient from 'solaredge-client';
import { fetchPowerFlow } from './services';

let solarEdgeClient: SolarEdgeClient;

export type Config = {
  apiKey: string;
  siteId: string;
};

type PropertyNames = 'currentExport' | 'currentConsumption' | 'currentSelfConsumption' | 'currentProduction' | 'currentImport';

const SolarEdgeIntegration: SignalNodeIntegration<Config, PropertyNames> = {
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
      name: 'currentImport',
      description: 'Current imported energy',
      value: 0,
      unit: 'kW',
      type: 'Plain',
      useHistory: true,
    },
    {
      name: 'currentExport',
      description: 'Current exported energy',
      value: 0,
      unit: 'kW',
      type: 'Plain',
      useHistory: true,
    },
    {
      name: 'currentConsumption',
      description: 'Current energy consumption',
      value: 0,
      unit: 'kW',
      type: 'Plain',
      useHistory: true,
    },
    {
      name: 'currentSelfConsumption',
      description: 'Current energy consumption',
      value: 0,
      unit: 'kW',
      type: 'Plain',
      useHistory: true,
    },
    {
      name: 'currentProduction',
      description: 'Current self energy consumption',
      value: 0,
      unit: 'kW',
      type: 'Plain',
      useHistory: true,
    },
  ],
  //   tasks: [
  //     {
  //       interval: ['*/15', '*', '*', '*', '*'],
  //       run: async (config: Config) => {
  //         const res = await solarEdgeClient.getPowerFlow(config.siteId);
  //         const result = {
  //           currentImport: 0,
  //           currentExport: 0,
  //           currentConsumption: 0,
  //           currentSelfConsumption: 0,
  //           currentProduction: 0,
  //         };

  //         res.siteCurrentPowerFlow.connections.forEach((connection) => {
  //           if (connection.from === 'GRID' && connection.to === 'Load') {
  //             result.currentImport = res.siteCurrentPowerFlow.GRID.currentPower;
  //             result.currentConsumption = res.siteCurrentPowerFlow.LOAD.currentPower;
  //           } else if (connection.from === 'LOAD' && connection.to === 'Grid') {
  //             result.currentExport = res.siteCurrentPowerFlow.GRID.currentPower;
  //             result.currentConsumption = res.siteCurrentPowerFlow.LOAD.currentPower;
  //             // currentSelfConsumption = res.siteCurrentPowerFlow.LOAD.currentPower;
  //           } else if (connection.from === 'PV' && connection.to === 'Load') {
  //             result.currentProduction = res.siteCurrentPowerFlow.PV!.currentPower;
  //             result.currentSelfConsumption =
  //               res.siteCurrentPowerFlow.LOAD.currentPower > res.siteCurrentPowerFlow.PV!.currentPower
  //                 ? res.siteCurrentPowerFlow.PV!.currentPower
  //                 : res.siteCurrentPowerFlow.LOAD.currentPower;
  //           }
  //         });
  //         return result;
  //       },
  //     },
  //   ],
  start: async (eventBus, serviceManager, config) => {
    solarEdgeClient = new SolarEdgeClient(config.apiKey);

    serviceManager.registerService(async () => {
      const results = await fetchPowerFlow(solarEdgeClient, config);
      for (const key in results) {
        eventBus.emit(key, results[key as keyof typeof results]);
      }
    }, ['*/1', '*', '*', '*', '*']);
  },
};

export default SolarEdgeIntegration;
