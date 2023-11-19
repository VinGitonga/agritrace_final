#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod transactions {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Errors that might occur while calling this contract
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Transaction does not exist
        TransactionDoesNotExist,
        /// Invalid Buyer
        InvalidBuyer,
        /// Invalid Seller
        InvalidSeller,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[ink(event)]
    pub struct TransactionEvent {
        #[ink(topic)]
        entity: EntityPurchase,
        #[ink(topic)]
        buyer: AccountId,
        #[ink(topic)]
        seller: AccountId,
    }

    #[ink(event)]
    pub struct ProductTransactionEvent {
        #[ink(topic)]
        product: ProductPurchase,
        #[ink(topic)]
        buyer: AccountId,
        #[ink(topic)]
        seller: AccountId,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    #[derive(Clone)]
    pub enum TransactionStatus {
        Initiated,
        InProgress,
        Completed,
        Reverted,
        Reject,
    }

    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    #[derive(Clone)]
    pub enum TransactionType {
        Entity,
        Product,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct EntityPurchase {
        entity_code: String,
        quantity: u32,
        quantity_unit: String,
        batch_no: u64,
        created_at: Timestamp,
        buyer: AccountId,
        seller: AccountId,
        status: TransactionStatus,
        updated_at: Timestamp,
    }

    #[derive(scale::Decode, scale::Encode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct ProductPurchase {
        product_code: String,
        quantity: u32,
        quantity_unit: String,
        batch_no: Vec<u64>,
        created_at: Timestamp,
        buyer: AccountId,
        seller: AccountId,
        status: TransactionStatus,
        updated_at: Timestamp,
        serial_no: String,
    }

    impl Default for ProductPurchase {
        fn default() -> Self {
            Self {
                product_code: String::new(),
                quantity: 0,
                quantity_unit: String::new(),
                batch_no: Vec::new(),
                created_at: Timestamp::default(),
                buyer: AccountId::from([0x0; 32]),
                seller: AccountId::from([0x0; 32]),
                status: TransactionStatus::Initiated,
                updated_at: Timestamp::default(),
                serial_no: String::new(),
            }
        }
    }

    #[ink(storage)]
    pub struct Transactions {
        entity_purchases: Mapping<String, EntityPurchase>,
        product_purchases: Mapping<String, ProductPurchase>,
        entity_purchase_count: u64,
        product_purchase_count: u64,
        entity_purchase_vec: Vec<String>,
        product_purchase_vec: Vec<String>,
    }

    impl Transactions {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                entity_purchases: Mapping::new(),
                product_purchases: Mapping::new(),
                entity_purchase_count: 0,
                product_purchase_count: 0,
                entity_purchase_vec: Vec::new(),
                product_purchase_vec: Vec::new(),
            }
        }

        #[ink(message)]
        pub fn initiate_sell_entity(
            &mut self,
            entity_code: String,
            quantity: u32,
            quantity_unit: String,
            batch_no: u64,
            buyer: AccountId,
        ) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let status = TransactionStatus::Initiated;

            let transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity,
                quantity_unit,
                batch_no,
                created_at: timestamp.clone(),
                buyer,
                seller,
                status: status.clone(),
                updated_at: timestamp.clone(),
            };

            self.entity_purchases
                .insert(entity_code.clone(), &transaction.clone());

            self.entity_purchase_vec.push(entity_code.clone());

            self.env().emit_event(TransactionEvent {
                entity: transaction,
                buyer,
                seller,
            });

            self.entity_purchase_count += 1;
            Ok(())
        }

        #[ink(message)]
        pub fn purchase_entity(&mut self, entity_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let buyer = self.env().caller();
            let transaction = self.entity_purchases.get(&entity_code).unwrap();

            // check if transaction exists
            if transaction.entity_code.is_empty() {
                return Err(Error::TransactionDoesNotExist);
            }

            // check if buyer is valid

            if transaction.buyer != buyer {
                return Err(Error::InvalidBuyer);
            }

            let status = TransactionStatus::InProgress;

            let new_transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no,
                created_at: transaction.created_at.clone(),
                buyer: buyer.clone(),
                seller: transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
            };

            self.entity_purchases
                .insert(entity_code.clone(), &new_transaction.clone());

            self.env().emit_event(TransactionEvent {
                entity: transaction.clone(),
                buyer,
                seller: transaction.seller.clone(),
            });
            Ok(())
        }

        #[ink(message)]
        pub fn complete_entity_purchase(&mut self, entity_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let transaction = self.entity_purchases.get(&entity_code).unwrap();

            // confirm seller
            if transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }

            let status = TransactionStatus::Completed;

            let new_transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no,
                created_at: transaction.created_at.clone(),
                buyer: transaction.buyer.clone(),
                seller: seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
            };

            self.entity_purchases
                .insert(entity_code.clone(), &new_transaction.clone());

            self.env().emit_event(TransactionEvent {
                entity: transaction.clone(),
                buyer: transaction.buyer.clone(),
                seller,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn revert_entity_purchase(&mut self, entity_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let transaction = self.entity_purchases.get(&entity_code).unwrap();

            // confirm seller
            if transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }

            let status = TransactionStatus::Reverted;

            let new_transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no,
                created_at: transaction.created_at.clone(),
                buyer: transaction.buyer.clone(),
                seller: seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
            };

            self.entity_purchases
                .insert(entity_code.clone(), &new_transaction.clone());

            self.env().emit_event(TransactionEvent {
                entity: transaction.clone(),
                buyer: transaction.buyer.clone(),
                seller,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn reject_entity_purchase(&mut self, entity_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let buyer = self.env().caller();
            let transaction = self.entity_purchases.get(&entity_code).unwrap();

            // confirm buyer
            if transaction.buyer != buyer {
                return Err(Error::InvalidBuyer);
            }

            let status = TransactionStatus::Reject;

            let new_transaction = EntityPurchase {
                entity_code: entity_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no,
                created_at: transaction.created_at.clone(),
                buyer: buyer.clone(),
                seller: transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
            };

            self.entity_purchases
                .insert(entity_code.clone(), &new_transaction.clone());

            self.env().emit_event(TransactionEvent {
                entity: transaction.clone(),
                buyer,
                seller: transaction.seller.clone(),
            });
            Ok(())
        }

        #[ink(message)]
        pub fn get_entity_purchase(&self, entity_code: String) -> Option<EntityPurchase> {
            Some(self.entity_purchases.get(&entity_code).clone().unwrap())
        }

        #[ink(message)]
        pub fn get_entity_purchase_count(&self) -> u64 {
            self.entity_purchase_count
        }

        #[ink(message)]
        pub fn get_entity_purchase_transactions(&self) -> Vec<EntityPurchase> {
            let mut transactions = Vec::new();
            for entity_code in self.entity_purchase_vec.iter() {
                let transaction = self.entity_purchases.get(entity_code).unwrap();
                transactions.push(transaction.clone());
            }
            transactions
        }

        #[ink(message)]
        pub fn get_entity_purchase_transactions_by_seller(
            &self,
            seller: AccountId,
        ) -> Vec<EntityPurchase> {
            let mut transactions = Vec::new();
            for entity_code in self.entity_purchase_vec.iter() {
                let transaction = self.entity_purchases.get(entity_code).unwrap();
                if transaction.seller == seller {
                    transactions.push(transaction.clone());
                }
            }
            transactions
        }

        #[ink(message)]
        pub fn get_entity_purchase_transactions_by_buyer(
            &self,
            buyer: AccountId,
        ) -> Vec<EntityPurchase> {
            let mut transactions = Vec::new();
            for entity_code in self.entity_purchase_vec.iter() {
                let transaction = self.entity_purchases.get(entity_code).unwrap();
                if transaction.buyer == buyer {
                    transactions.push(transaction.clone());
                }
            }
            transactions
        }

        #[ink(message)]
        pub fn sell_product(
            &mut self,
            product_code: String,
            quantity: u32,
            quantity_unit: String,
            batch_no: Vec<u64>,
            buyer: AccountId,
            serial_no: String,
        ) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let status = TransactionStatus::Initiated;

            let prod_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity,
                quantity_unit,
                batch_no,
                created_at: timestamp.clone(),
                buyer,
                seller,
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no,
            };

            self.product_purchases
                .insert(product_code.clone(), &prod_transaction);

            self.product_purchase_count += 1;

            self.product_purchase_vec.push(product_code.clone());

            self.env().emit_event(ProductTransactionEvent {
                product: prod_transaction,
                buyer,
                seller,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn purchase_product(&mut self, product_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let buyer = self.env().caller();
            let transaction = self.product_purchases.get(&product_code).unwrap();

            // check if transaction exists
            if transaction.product_code.is_empty() {
                return Err(Error::TransactionDoesNotExist);
            }

            // check if buyer is valid

            if transaction.buyer != buyer {
                return Err(Error::InvalidBuyer);
            }

            let status = TransactionStatus::InProgress;

            let new_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no.clone(),
                created_at: transaction.created_at.clone(),
                buyer: buyer.clone(),
                seller: transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no: transaction.serial_no.clone(),
            };

            self.product_purchases
                .insert(product_code.clone(), &new_transaction.clone());

            self.env().emit_event(ProductTransactionEvent {
                product: transaction.clone(),
                buyer,
                seller: transaction.seller.clone(),
            });
            Ok(())
        }

        #[ink(message)]
        pub fn complete_product_purchase(&mut self, product_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let transaction = self.product_purchases.get(&product_code).unwrap();

            // confirm seller
            if transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }

            let status = TransactionStatus::Completed;

            let new_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no.clone(),
                created_at: transaction.created_at.clone(),
                buyer: transaction.buyer.clone(),
                seller: seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no: transaction.serial_no.clone(),
            };

            self.product_purchases
                .insert(product_code.clone(), &new_transaction.clone());

            self.env().emit_event(ProductTransactionEvent {
                product: transaction.clone(),
                buyer: transaction.buyer.clone(),
                seller,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn revert_product_purchase(&mut self, product_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let seller = self.env().caller();
            let transaction = self.product_purchases.get(&product_code).unwrap();

            // confirm seller
            if transaction.seller != seller {
                return Err(Error::InvalidSeller);
            }

            let status = TransactionStatus::Reverted;

            let new_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no.clone(),
                created_at: transaction.created_at.clone(),
                buyer: transaction.buyer.clone(),
                seller: seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no: transaction.serial_no.clone(),
            };

            self.product_purchases
                .insert(product_code.clone(), &new_transaction.clone());

            self.env().emit_event(ProductTransactionEvent {
                product: transaction.clone(),
                buyer: transaction.buyer.clone(),
                seller,
            });
            Ok(())
        }

        #[ink(message)]
        pub fn reject_product_purchase(&mut self, product_code: String) -> Result<()> {
            let timestamp = self.env().block_timestamp();
            let buyer = self.env().caller();
            let transaction = self.product_purchases.get(&product_code).unwrap();

            // confirm buyer
            if transaction.buyer != buyer {
                return Err(Error::InvalidBuyer);
            }

            let status = TransactionStatus::Reject;

            let new_transaction = ProductPurchase {
                product_code: product_code.clone(),
                quantity: transaction.quantity,
                quantity_unit: transaction.quantity_unit.clone(),
                batch_no: transaction.batch_no.clone(),
                created_at: transaction.created_at.clone(),
                buyer: buyer.clone(),
                seller: transaction.seller.clone(),
                status: status.clone(),
                updated_at: timestamp.clone(),
                serial_no: transaction.serial_no.clone(),
            };

            self.product_purchases
                .insert(product_code.clone(), &new_transaction.clone());

            self.env().emit_event(ProductTransactionEvent {
                product: transaction.clone(),
                buyer,
                seller: transaction.seller.clone(),
            });
            Ok(())
        }

        #[ink(message)]
        pub fn get_product_purchase(&self, product_code: String) -> Option<ProductPurchase> {
            Some(self.product_purchases.get(&product_code).clone().unwrap())
        }

        #[ink(message)]
        pub fn get_product_purchase_count(&self) -> u64 {
            self.product_purchase_count
        }

        #[ink(message)]
        pub fn get_product_purchase_transactions(&self) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for product_code in self.product_purchase_vec.iter() {
                let transaction = self.product_purchases.get(product_code).unwrap();
                transactions.push(transaction.clone());
            }
            transactions
        }

        #[ink(message)]
        pub fn get_product_purchase_transactions_by_seller(
            &self,
            seller: AccountId,
        ) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for product_code in self.product_purchase_vec.iter() {
                let transaction = self.product_purchases.get(product_code).unwrap();
                if transaction.seller == seller {
                    transactions.push(transaction.clone());
                }
            }
            transactions
        }

        #[ink(message)]
        pub fn get_product_purchase_transactions_by_buyer(
            &self,
            buyer: AccountId,
        ) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for product_code in self.product_purchase_vec.iter() {
                let transaction = self.product_purchases.get(product_code).unwrap();
                if transaction.buyer == buyer {
                    transactions.push(transaction.clone());
                }
            }
            transactions
        }

        #[ink(message)]
        pub fn get_product_purchase_transactions_by_serial_no(
            &self,
            serial_no: String,
        ) -> Vec<ProductPurchase> {
            let mut transactions = Vec::new();
            for product_code in self.product_purchase_vec.iter() {
                let transaction = self.product_purchases.get(product_code).unwrap();
                if transaction.serial_no == serial_no {
                    transactions.push(transaction.clone());
                }
            }
            transactions
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
            let transactions = Transactions::new();
            assert_eq!(transactions.entity_purchase_count, 0);
            assert_eq!(transactions.product_purchase_count, 0);
        }

        /// We test adding an entity purchase
        #[ink::test]
        fn add_entity_purchase() {
            let mut transactions = Transactions::new();
            let entity_code = "Entity 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = 1;
            let buyer = AccountId::from([0x0; 32]);
            let result = transactions.initiate_sell_entity(
                entity_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no,
                buyer,
            );
            assert_eq!(result, Ok(()));
        }

        /// We test getting an entity purchase
        #[ink::test]
        fn get_entity_purchase() {
            let mut transactions = Transactions::new();
            let entity_code = "Entity 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = 1;
            let buyer = AccountId::from([0x0; 32]);
            let result = transactions.initiate_sell_entity(
                entity_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no,
                buyer,
            );
            assert_eq!(result, Ok(()));
            let transaction = transactions.get_entity_purchase(entity_code);
            assert_eq!(transaction.unwrap().entity_code, "Entity 1".to_string());
        }

        /// We test getting all entity purchases
        #[ink::test]
        fn get_all_entity_purchases() {
            let mut transactions = Transactions::new();
            let entity_code = "Entity 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = 1;
            let buyer = AccountId::from([0x0; 32]);
            let result = transactions.initiate_sell_entity(
                entity_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no,
                buyer,
            );
            assert_eq!(result, Ok(()));
            let transactions = transactions.get_entity_purchase_transactions();
            assert_eq!(transactions.len(), 1);
        }

        /// We test getting the entity purchase count
        #[ink::test]
        fn get_entity_purchase_count() {
            let mut transactions = Transactions::new();
            let entity_code = "Entity 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = 1;
            let buyer = AccountId::from([0x0; 32]);
            let result = transactions.initiate_sell_entity(
                entity_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no,
                buyer,
            );
            assert_eq!(result, Ok(()));
            let entity_purchase_count = transactions.get_entity_purchase_count();
            assert_eq!(entity_purchase_count, 1);
        }

        /// We test adding a product purchase
        #[ink::test]
        fn add_product_purchase() {
            let mut transactions = Transactions::new();
            let product_code = "Product 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = Vec::from([1, 2, 3]);
            let buyer = AccountId::from([0x0; 32]);
            let serial_no = "Serial 1".to_string();
            let result = transactions.sell_product(
                product_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no.clone(),
                buyer,
                serial_no.clone(),
            );
            assert_eq!(result, Ok(()));
        }

        /// We test getting a product purchase
        #[ink::test]
        fn get_product_purchase() {
            let mut transactions = Transactions::new();
            let product_code = "Product 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = Vec::from([1, 2, 3]);
            let buyer = AccountId::from([0x0; 32]);
            let serial_no = "Serial 1".to_string();
            let result = transactions.sell_product(
                product_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no.clone(),
                buyer,
                serial_no.clone(),
            );
            assert_eq!(result, Ok(()));
            let transaction = transactions.get_product_purchase(product_code);
            assert_eq!(transaction.unwrap().product_code, "Product 1".to_string());
        }

        /// We test getting all product purchases
        #[ink::test]
        fn get_all_product_purchases() {
            let mut transactions = Transactions::new();
            let product_code = "Product 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = Vec::from([1, 2, 3]);
            let buyer = AccountId::from([0x0; 32]);
            let serial_no = "Serial 1".to_string();
            let result = transactions.sell_product(
                product_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no.clone(),
                buyer,
                serial_no.clone(),
            );
            assert_eq!(result, Ok(()));
            let transactions = transactions.get_product_purchase_transactions();
            assert_eq!(transactions.len(), 1);
        }

        /// We test getting the product purchase count
        #[ink::test]
        fn get_product_purchase_count() {
            let mut transactions = Transactions::new();
            let product_code = "Product 1".to_string();
            let quantity = 10;
            let quantity_unit = "Kg".to_string();
            let batch_no = Vec::from([1, 2, 3]);
            let buyer = AccountId::from([0x0; 32]);
            let serial_no = "Serial 1".to_string();
            let result = transactions.sell_product(
                product_code.clone(),
                quantity,
                quantity_unit.clone(),
                batch_no.clone(),
                buyer,
                serial_no.clone(),
            );
            assert_eq!(result, Ok(()));
            let product_purchase_count = transactions.get_product_purchase_count();
            assert_eq!(product_purchase_count, 1);
        }
    }
}
