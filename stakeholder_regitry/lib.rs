#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod stakeholder_regitry {
    use ink::prelude::{string::String, vec::Vec};
    use ink::storage::Mapping;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        AccountAlreadyExists,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    #[derive(Clone)]
    pub enum Role {
        Admin,
        Supplier,
        Manufacturer,
        Distributor,
        Retailer,
        Other,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct Account {
        name: String,
        phone_no: String,
        location: String,
        products: Vec<String>,
        address: AccountId,
        timestamp: Timestamp,
        role: Role,
    }

    impl Default for Account {
        fn default() -> Self {
            Self {
                name: String::new(),
                phone_no: String::new(),
                location: String::new(),
                products: Vec::new(),
                address: AccountId::from([0x0; 32]),
                timestamp: Timestamp::default(),
                role: Role::Other,
            }
        }
    }

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct StakeholderRegitry {
        accounts: Mapping<AccountId, Account>,
        account_count: u64,
        accounts_vec: Vec<AccountId>,
    }

    impl StakeholderRegitry {
        /// Constructor that starts the contract with the given value.
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                accounts: Mapping::new(),
                account_count: 0,
                accounts_vec: Vec::new(),
            }
        }

        #[ink(message)]
        pub fn add_account(
            &mut self,
            name: String,
            phone_no: String,
            location: String,
            products: Vec<String>,
            account_role: String,
        ) -> Result<()> {
            let caller = self.env().caller();
            let accepted_roles = Vec::from([
                "Admin",
                "Supplier",
                "Manufacturer",
                "Distributor",
                "Retailer",
                "Other",
            ]);

            let role = match accepted_roles.iter().position(|r| r == &account_role) {
                Some(index) => match index {
                    0 => Role::Admin,
                    1 => Role::Supplier,
                    2 => Role::Manufacturer,
                    3 => Role::Distributor,
                    4 => Role::Retailer,
                    5 => Role::Other,
                    _ => Role::Other,
                },
                None => Role::Other,
            };
            let account = Account {
                name,
                phone_no,
                location,
                products,
                address: caller,
                timestamp: self.env().block_timestamp(),
                role,
            };

            // check if account already exists
            if self.accounts.contains(caller) {
                return Err(Error::AccountAlreadyExists);
            }
            self.accounts.insert(caller, &account);
            self.accounts_vec.push(caller);
            self.account_count += 1;
            Ok(())
        }

        #[ink(message)]
        pub fn get_account(&self, account_id: AccountId) -> Option<Account> {
            Some(self.accounts.get(account_id).clone().unwrap())
        }

        #[ink(message)]
        pub fn get_account_count(&self) -> u64 {
            self.account_count
        }

        #[ink(message)]
        pub fn get_all_accounts(&self) -> Vec<Account> {
            let mut accounts: Vec<Account> = Vec::new();
            for account_id in self.accounts_vec.iter() {
                let account = self.accounts.get(account_id).clone().unwrap();
                accounts.push(account);
            }

            accounts
        }
    }

    /// Unit tests in Rust are normally defined within such a `#[cfg(test)]`
    /// module and test functions are marked with a `#[test]` attribute.
    /// The below code is technically just normal Rust code.
    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn default_works() {
            let stakeholder_regitry = StakeholderRegitry::new();
            assert_eq!(stakeholder_regitry.account_count, 0);
        }

        /// We test adding an account
        #[ink::test]
        fn add_account() {
            let mut stakeholder_regitry = StakeholderRegitry::new();
            let name = "Proximity Supplies".to_string();
            let phone_no = "0700123456".to_string();
            let location = "Kilifi".to_string();
            let products = Vec::from([String::from("Product 1"), String::from("Product 2")]);
            let account_role = "Admin".to_string();
            let result =
                stakeholder_regitry.add_account(name, phone_no, location, products, account_role);
            assert_eq!(result, Ok(()));
        }

        /// We test getting an account
        #[ink::test]
        fn get_account() {
            let mut stakeholder_regitry = StakeholderRegitry::new();
            let acc = AccountId::from([0x0; 32]);
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(acc);
            let name = "Proximity Supplies".to_string();
            let phone_no = "0700123456".to_string();
            let location = "Kilifi".to_string();
            let products = Vec::from([String::from("Product 1"), String::from("Product 2")]);
            let account_role = "Admin".to_string();
            let result =
                stakeholder_regitry.add_account(name, phone_no, location, products, account_role);
            assert_eq!(result, Ok(()));
            let account = stakeholder_regitry.get_account(AccountId::from([0x0; 32]));
            assert_eq!(account.unwrap().name, "Proximity Supplies".to_string());
        }

        /// We test getting all accounts
        #[ink::test]
        fn get_all_accounts() {
            let mut stakeholder_regitry = StakeholderRegitry::new();
            let name = "Proximity Supplies".to_string();
            let phone_no = "0700123456".to_string();
            let location = "Kilifi".to_string();
            let products = Vec::from([String::from("Product 1"), String::from("Product 2")]);
            let account_role = "Admin".to_string();
            let result =
                stakeholder_regitry.add_account(name, phone_no, location, products, account_role);
            assert_eq!(result, Ok(()));
            let accounts = stakeholder_regitry.get_all_accounts();
            assert_eq!(accounts.len(), 1);
        }

        /// We test getting the account count
        #[ink::test]
        fn get_account_count() {
            let mut stakeholder_regitry = StakeholderRegitry::new();
            let name = "Proximity Supplies".to_string();
            let phone_no = "0700123456".to_string();
            let location = "Kilifi".to_string();
            let products = Vec::from([String::from("Product 1"), String::from("Product 2")]);
            let account_role = "Admin".to_string();
            let result =
                stakeholder_regitry.add_account(name, phone_no, location, products, account_role);
            assert_eq!(result, Ok(()));
            let account_count = stakeholder_regitry.get_account_count();
            assert_eq!(account_count, 1);
        }
    }
}
