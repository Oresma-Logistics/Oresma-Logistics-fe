export type Wallets = {
  success: false;
  message: string;
  count: number;
  wallets: Wallet[];
};

export type SingleWallet = {
  success: false;
  message: string;
  wallet: Wallet;
};

export interface Wallet {
  _id: string;
  userId: {
    email: string;
    _id: string;
  };
  balance: 0;
  currency: "NGN" | "USD";
  status: string;
  isPinSet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AllAvailableBanks {
  success: false;
  message: string;
  count: number | string;
  banks: AvailableBank[];
}

export interface AvailableBank {
  id: string | number;
  name: string;
  code: string;
  slug?: string;
  longcode?: string;
}

export interface BankDetails {
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

export interface AdminWalletSummaryResponse {
  success: boolean;
  message: string;
  data: {
    overview: {
      totalWallets: number;
      totalBalance: number;
      averageBalance: number;
      totalTransactions: number;
    };
    statusBreakdown: {
      active: number;
      suspended: number;
      frozen: number;
      closed: number;
    };
    currencyBreakdown: {
      currency: string;
      totalBalance: number;
      walletCount: number;
    }[];
  };
}
