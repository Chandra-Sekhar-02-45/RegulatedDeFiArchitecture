import { BrowserProvider, Contract, Eip1193Provider, JsonRpcSigner, parseEther } from "ethers";

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
const IDENTITY_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_IDENTITY_REGISTRY_ADDRESS ?? "0x0000000000000000000000000000000000000000";
const HYBRID_BANK_ADDRESS =
  process.env.NEXT_PUBLIC_HYBRID_BANK_ADDRESS ?? "0x0000000000000000000000000000000000000000";

const identityRegistryAbi = [
  "function isCertified(address user) view returns (bool)",
  "function certify(address user) external",
];

const hybridBankAbi = [
  "function smallTransfer(address to, uint256 amount) external returns (bool)",
  "function largeTransfer(address to, uint256 amount) external returns (bool)",
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

export async function readCertificationStatus(address: string) {
  const provider = await getBrowserProvider();
  const registry = new Contract(
    IDENTITY_REGISTRY_ADDRESS,
    identityRegistryAbi,
    provider
  );
  return registry.isCertified(address) as Promise<boolean>;
}

export async function certifyUser(userAddress: string) {
  const signer = await getSigner();
  const registry = new Contract(IDENTITY_REGISTRY_ADDRESS, identityRegistryAbi, signer);
  const tx = await registry.certify(userAddress);
  return tx.wait();
}

export async function submitSmallTransfer(to: string, amountEth: string) {
  const signer = await getSigner();
  const bank = new Contract(HYBRID_BANK_ADDRESS, hybridBankAbi, signer);
  const tx = await bank.smallTransfer(to, parseEther(amountEth));
  return tx.wait();
}

export async function submitLargeTransfer(to: string, amountEth: string) {
  const signer = await getSigner();
  const sender = await signer.getAddress();
  const registry = new Contract(IDENTITY_REGISTRY_ADDRESS, identityRegistryAbi, signer);
  const isCertified = await registry.isCertified(sender);
  if (!isCertified) {
    const error = new Error("USER_NOT_CERTIFIED");
    error.name = "ComplianceError";
    throw error;
  }

  const bank = new Contract(HYBRID_BANK_ADDRESS, hybridBankAbi, signer);
  const tx = await bank.largeTransfer(to, parseEther(amountEth));
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
  const isCorrectNetwork = chainId === REQUIRED_CHAIN_ID;
  return { isAuthority, isCorrectNetwork };
}

export const contractConfig = {
  REQUIRED_CHAIN_ID,
  AUTHORITY_ADDRESS,
  IDENTITY_REGISTRY_ADDRESS,
  HYBRID_BANK_ADDRESS,
};
