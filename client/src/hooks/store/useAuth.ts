import { AccountRole, IAccount } from "@/types/Account";
import { createWithEqualityFn } from "zustand/traditional";
import { createJSONStorage, subscribeWithSelector, persist } from "zustand/middleware";
import _ from "lodash";

export interface IAuthStore {
	hasAccount: boolean;
	setHasAccount: (hasAccount: boolean) => void;
	account: IAccount | null;
	setAccount: (account: IAccount | null) => void;
	whichAccount: () => AccountRole;
	logout: () => void;
}

/**
 * A hook to access the auth store
 * @returns the auth store
 */

const useAuth = createWithEqualityFn(
	subscribeWithSelector(
		persist<IAuthStore>(
			(set, get) => ({
				hasAccount: false,
				setHasAccount: (hasAccount: boolean) => set({ hasAccount }),
				account: null,
				setAccount: (account: IAccount | null) => set({ account }),
				whichAccount: () => {
					const account = get().account;
					if (account === null) return AccountRole.Other;
					return account.role;
				},
				logout: () => {
					set((state) => _.omit(state, ["account"]), true);
				},
			}),
			{
				name: "agritrace-trc-auth",
				storage: createJSONStorage(() => localStorage),
			}
		)
	)
);

export default useAuth;
