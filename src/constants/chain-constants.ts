export enum NetworkNames {
  Mainnet = "mainnet",
  Goerli = "goerli",
  Xdai = "xdai",
  Sokol = "sokol",
  Bsc = "bsc",
  BscTest = "bscTest",
  Fantom = "fantom",
  FantomTest = "fantomTest",
  Matic = "matic",
  Mumbai = "mumbai",
  Aurora = "aurora",
  AuroraTest = "auroraTest",
  Avalanche = "avalanche",
  Fuji = "fuji",
  Optimism = "optimism",
  Arbitrum = "arbitrum",
  Moonbeam = "moonbeam",
  Moonbase = "moonbase",
  Celo = "celo",
  CeloTest = "celoTest",
  Etherspot = "etherspot",
  Fuse = "fuse",
  FuseSparknet = "fuseSparknet",
  ArbitrumNova = "arbitrumNova",
  ArbitrumNitro = "arbitrumNitro",
  NeonDevnet = "neonDevnet",
  OptimismGoerli = "optimismGoerli",
  LocalA = "localA",
  LocalB = "localB",
  LocalH = "localH",
}

enum CHAIN_ID {
  ETHEREUM_MAINNET = 1,
  POLYGON = 137,
  BINANCE = 56,
  XDAI = 100,
  AVALANCHE = 43114,
  OPTIMISM = 10,
  ARBITRUM = 42161,
  AURORA = 1313161554,
  FANTOM = 250,
  CELO = 42220,
  MOONBEAM = 1284,
  FUSE = 122,
}

interface INetworkData {
  id: CHAIN_ID;
  name: NetworkNames;
  rpcUrl: string;
}

type ISupportedNetworks = Record<CHAIN_ID, INetworkData>;

export const supportedNetworks: ISupportedNetworks = {
  [CHAIN_ID.ETHEREUM_MAINNET]: {
    id: CHAIN_ID.ETHEREUM_MAINNET,
    name: NetworkNames.Mainnet,
    rpcUrl: "https://mainnet.infura.io/v3/" + process.env.REACT_APP_INFURA_KEY,
  },
  [CHAIN_ID.XDAI]: {
    id: CHAIN_ID.XDAI,
    name: NetworkNames.Xdai,
    rpcUrl: "https://rpc.gnosischain.com/",
  },
  [CHAIN_ID.BINANCE]: {
    id: CHAIN_ID.BINANCE,
    name: NetworkNames.Bsc,
    rpcUrl: "https://bsc-dataseed1.binance.org",
  },
  [CHAIN_ID.FANTOM]: {
    id: CHAIN_ID.FANTOM,
    name: NetworkNames.Fantom,
    rpcUrl: "https://rpc.ftm.tools/",
  },
  [CHAIN_ID.POLYGON]: {
    id: CHAIN_ID.POLYGON,
    name: NetworkNames.Matic,
    rpcUrl: "https://polygon-rpc.com",
  },
  [CHAIN_ID.AURORA]: {
    id: CHAIN_ID.AURORA,
    name: NetworkNames.Aurora,
    rpcUrl: "https://mainnet.aurora.dev",
  },
  [CHAIN_ID.AVALANCHE]: {
    id: CHAIN_ID.AVALANCHE,
    name: NetworkNames.Avalanche,
    rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
  },
  [CHAIN_ID.OPTIMISM]: {
    id: CHAIN_ID.OPTIMISM,
    name: NetworkNames.Optimism,
    rpcUrl: "https://mainnet.optimism.io",
  },
  [CHAIN_ID.ARBITRUM]: {
    id: CHAIN_ID.ARBITRUM,
    name: NetworkNames.Arbitrum,
    rpcUrl: "https://rpc.ankr.com/arbitrum",
  },
  [CHAIN_ID.CELO]: {
    id: CHAIN_ID.CELO,
    name: NetworkNames.Celo,
    rpcUrl: "https://rpc.ankr.com/celo",
  },
  [CHAIN_ID.FUSE]: {
    id: CHAIN_ID.FUSE,
    name: NetworkNames.Fuse,
    rpcUrl: "https://rpc.fuse.io",
  },
  [CHAIN_ID.MOONBEAM]: {
    id: CHAIN_ID.MOONBEAM,
    name: NetworkNames.Moonbeam,
    rpcUrl: "https://rpc.api.moonbeam.network",
  },
};
