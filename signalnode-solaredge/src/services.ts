import SolarEdgeClient from 'solaredge-client';
import { Config } from '.';

export const fetchPowerFlow = async (solarEdgeClient: SolarEdgeClient, config: Config) => {
  const res = await solarEdgeClient.getPowerFlow(config.siteId);
  const result = {
    currentImport: 0,
    currentExport: 0,
    currentConsumption: 0,
    currentSelfConsumption: 0,
    currentProduction: 0,
  };

  res.siteCurrentPowerFlow.connections.forEach((connection) => {
    if (connection.from === 'GRID' && connection.to === 'Load') {
      result.currentImport = res.siteCurrentPowerFlow.GRID.currentPower;
      result.currentConsumption = res.siteCurrentPowerFlow.LOAD.currentPower;
    } else if (connection.from === 'LOAD' && connection.to === 'Grid') {
      result.currentExport = res.siteCurrentPowerFlow.GRID.currentPower;
      result.currentConsumption = res.siteCurrentPowerFlow.LOAD.currentPower;
      // currentSelfConsumption = res.siteCurrentPowerFlow.LOAD.currentPower;
    } else if (connection.from === 'PV' && connection.to === 'Load') {
      result.currentProduction = res.siteCurrentPowerFlow.PV!.currentPower;
      result.currentSelfConsumption =
        res.siteCurrentPowerFlow.LOAD.currentPower > res.siteCurrentPowerFlow.PV!.currentPower
          ? res.siteCurrentPowerFlow.PV!.currentPower
          : res.siteCurrentPowerFlow.LOAD.currentPower;
    }
  });
  return result;
};
