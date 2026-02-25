import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  JsonRpcSigner,
  formatUnits,
  parseUnits,
} from "ethers";

export type EthereumLike = Eip1193Provider & {
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
};

declare global {
  interface Window {
    ethereum?: EthereumLike;
  }
}

const REQUIRED_CHAIN_ID = Number(process.env.NEXT_PUBLIC_REQUIRED_CHAIN_ID ?? 31337);
const AUTHORITY_ADDRESS = (process.env.NEXT_PUBLIC_AUTHORITY_ADDRESS ?? "").toLowerCase();
const MODERATOR_ADDRESS = (process.env.NEXT_PUBLIC_MODERATOR_ADDRESS ?? "").toLowerCase();
const IDENTITY_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const PLATFORM_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_PLATFORM_TOKEN_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const TX_CONTROLLER_ADDRESS =
  process.env.NEXT_PUBLIC_TX_CONTROLLER_ADDRESS ?? "0x0000000000000000000000000000000000000000";

const identityRegistryAbi = [
  "function users(address) view returns (bool isVerified, uint256 totalVolume, uint256 riskScore)",
  "function isUserVerified(address user) view returns (bool)",
  "function register(bytes signature) external",
  "function updateVolume(address user, uint256 amount) external",
];

const platformTokenAbi = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function transactionThreshold() view returns (uint256)",
];

const controllerAbi = [
  "function txCounter() view returns (uint256)",
  "function transactions(uint256) view returns (address from, address to, uint256 amount, bool approved, bool executed)",
  "function approveTransaction(uint256 txId) external",
  "function rejectTransaction(uint256 txId) external",
];

function getEthereum(): (EthereumLike & {
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}) | null {
  if (typeof window === "undefined") return null;
  return window.ethereum ?? null;
}

export function hasBrowserProvider() {
  return Boolean(getEthereum());
}

async function getBrowserProvider() {
  const ethereum = getEthereum();
  if (!ethereum) throw new Error("MetaMask is not available in this browser.");
  return new BrowserProvider(ethereum);
}

async function getSigner(): Promise<JsonRpcSigner> {
  const provider = await getBrowserProvider();
  return provider.getSigner();
}

export async function readUserProfile(address: string) {
  const provider = await getBrowserProvider();
  const registry = new Contract(IDENTITY_REGISTRY_ADDRESS, identityRegistryAbi, provider);
  const [isVerified, totalVolume, riskScore] = await registry.users(address);
  return { isVerified, totalVolume, riskScore } as {
    isVerified: boolean;
    totalVolume: bigint;
    riskScore: bigint;
  };
}

export async function registerWithSignature(signature: string) {
  const signer = await getSigner();
  const registry = new Contract(IDENTITY_REGISTRY_ADDRESS, identityRegistryAbi, signer);
  const tx = await registry.register(signature);
  return tx.wait();
}

export async function fetchTokenMeta() {
  const provider = await getBrowserProvider();
  const token = new Contract(PLATFORM_TOKEN_ADDRESS, platformTokenAbi, provider);
  const [decimals, symbol, threshold] = await Promise.all([
    token.decimals(),
    token.symbol(),
    token.transactionThreshold(),
  ]);
  return { decimals, symbol, threshold } as { decimals: number; symbol: string; threshold: bigint };
}

export async function fetchBalance(address: string) {
  const provider = await getBrowserProvider();
  const token = new Contract(PLATFORM_TOKEN_ADDRESS, platformTokenAbi, provider);
  return token.balanceOf(address) as Promise<bigint>;
}

export async function submitTokenTransfer(to: string, amount: string, decimals: number) {
  const signer = await getSigner();
  const token = new Contract(PLATFORM_TOKEN_ADDRESS, platformTokenAbi, signer);
  const parsed = parseUnits(amount, decimals);
  const tx = await token.transfer(to, parsed);
  const receipt = await tx.wait();
  return { receipt, parsed } as { receipt: any; parsed: bigint };
}

export async function fetchTxCounter() {
  const provider = await getBrowserProvider();
  const controller = new Contract(TX_CONTROLLER_ADDRESS, controllerAbi, provider);
  return controller.txCounter() as Promise<bigint>;
}

export type ControllerTx = {
  id: bigint;
  from: string;
  to: string;
  amount: bigint;
  approved: boolean;
  executed: boolean;
};

export async function fetchTransaction(id: bigint): Promise<ControllerTx> {
  const provider = await getBrowserProvider();
  const controller = new Contract(TX_CONTROLLER_ADDRESS, controllerAbi, provider);
  const txn = await controller.transactions(id);
  return {
    id,
    from: txn[0],
    to: txn[1],
    amount: txn[2],
    approved: txn[3],
    executed: txn[4],
  };
}

export async function fetchRecentTransactions(limit = 20): Promise<ControllerTx[]> {
  const counter = await fetchTxCounter();
  const total = Number(counter);
  if (total === 0) return [];
  const start = Math.max(1, total - limit + 1);
  const ids = Array.from({ length: total - start + 1 }, (_, idx) => BigInt(start + idx));
  const provider = await getBrowserProvider();
  const controller = new Contract(TX_CONTROLLER_ADDRESS, controllerAbi, provider);
  const results = await Promise.all(
    ids.map(async (id) => {
      const txn = await controller.transactions(id);
      return {
        id,
        from: txn[0],
        to: txn[1],
        amount: txn[2],
        approved: txn[3],
        executed: txn[4],
      } as ControllerTx;
    })
  );
  return results.reverse();
}

export async function approvePendingTransaction(txId: bigint) {
  const signer = await getSigner();
  const controller = new Contract(TX_CONTROLLER_ADDRESS, controllerAbi, signer);
  const tx = await controller.approveTransaction(txId);
  return tx.wait();
}

export async function rejectPendingTransaction(txId: bigint) {
  const signer = await getSigner();
  const controller = new Contract(TX_CONTROLLER_ADDRESS, controllerAbi, signer);
  const tx = await controller.rejectTransaction(txId);
  return tx.wait();
}

export async function switchToRequiredNetwork() {
  const ethereum = getEthereum();
  if (!ethereum?.request) throw new Error("MetaMask not available.");

  const hexChainId = `0x${REQUIRED_CHAIN_ID.toString(16)}`;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: hexChainId }],
    });
  } catch (error: any) {
    if (error?.code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId,
            chainName: "Local Anvil",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["http://localhost:8545"],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

export async function requestAccounts(): Promise<string[]> {
  const provider = await getBrowserProvider();
  return provider.send("eth_requestAccounts", []);
}

export function deriveWalletFlags(account: string | null, chainId: number | null) {
  const isAuthority = Boolean(account && AUTHORITY_ADDRESS && account.toLowerCase() === AUTHORITY_ADDRESS);
  const isModerator = Boolean(account && MODERATOR_ADDRESS && account.toLowerCase() === MODERATOR_ADDRESS);
  const isCorrectNetwork = chainId === REQUIRED_CHAIN_ID;
  return { isAuthority, isModerator, isCorrectNetwork };
}

export const contractConfig = {
  REQUIRED_CHAIN_ID,
  AUTHORITY_ADDRESS,
  MODERATOR_ADDRESS,
  IDENTITY_REGISTRY_ADDRESS,
  PLATFORM_TOKEN_ADDRESS,
  TX_CONTROLLER_ADDRESS,
};

export function formatAmount(amount: bigint, decimals: number, fractionDigits = 4) {
  return Number.parseFloat(formatUnits(amount, decimals)).toFixed(fractionDigits);
}
