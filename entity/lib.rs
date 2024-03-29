#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod entity {
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Handle Errors that might occur during execution of the contract
    #[derive(Debug, PartialEq, Eq, scale::Encode, scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        /// Entity code already exists
        EntityAlreadyExists,
        /// Empty entity code
        EntityEmptyCode,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    #[ink(event)]
    pub struct RawEntityAdded {
        #[ink(topic)]
        raw_entity_id: u64,
        #[ink(topic)]
        entity_code: String,
    }

    #[ink(event)]
    pub struct ProductEntityAdded {
        #[ink(topic)]
        product_entity_id: u64,
        #[ink(topic)]
        entity_code: String,
    }

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct RawEntity {
        name: String,
        quantity: u32,
        unit: String,
        code: String,
        timestamp: Timestamp,
        batch_no: u64,
        owner: AccountId,
        buyer: AccountId,
    }

    impl Default for RawEntity {
        fn default() -> Self {
            Self {
                name: String::new(),
                quantity: 0,
                unit: String::new(),
                code: String::new(),
                timestamp: Timestamp::default(),
                batch_no: 0,
                owner: AccountId::from([0x0; 32]),
                buyer: AccountId::from([0x0; 32]),
            }
        }
    }

    #[derive(scale::Encode, scale::Decode, Debug, PartialEq, Eq, Clone)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct ProductEntity {
        name: String,
        code: String,
        quantity: u64,
        unit: String,
        batch_no: u64,
        timestamp: Timestamp,
        raw_entities: Vec<u64>,
        owner: AccountId,
    }

    impl Default for ProductEntity {
        fn default() -> Self {
            Self {
                name: String::new(),
                code: String::new(),
                quantity: 0,
                unit: String::new(),
                batch_no: 0,
                timestamp: Timestamp::default(),
                raw_entities: Vec::new(),
                owner: AccountId::from([0x0; 32]),
            }
        }
    }

    #[ink(storage)]
    pub struct Entity {
        raw_entities: Mapping<u64, RawEntity>,
        product_entities: Mapping<u64, ProductEntity>,
        raw_entity_count: u64,
        product_entity_count: u64,
        raw_entities_vec: Vec<RawEntity>,
        product_entities_vec: Vec<ProductEntity>,
    }

    impl Default for Entity {
        fn default() -> Self {
            Self::new()
        }
    }

    impl Entity {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                raw_entities: Mapping::new(),
                product_entities: Mapping::new(),
                raw_entity_count: 0,
                product_entity_count: 0,
                raw_entities_vec: Vec::new(),
                product_entities_vec: Vec::new(),
            }
        }

        /// Add a new raw entity to the blockchain
        #[ink(message)]
        pub fn add_raw_entity(
            &mut self,
            name: String,
            quantity: u32,
            unit: String,
            code: String,
            batch_no: u64,
            buyer: AccountId,
        ) -> Result<()> {
            let caller = self.env().caller();
            let timestamp = self.env().block_timestamp();
            let new_code = code.clone();
            let raw_entity = RawEntity {
                name,
                quantity,
                unit,
                code,
                timestamp,
                batch_no,
                owner: caller,
                buyer,
            };
            // TODO check if raw entity already exists, at the moment its not possible to check if a raw entity already exists because ink Mapping does not support iteration yet.

            let raw_entity_id = self.raw_entity_count;
            self.raw_entities.insert(raw_entity_id, &raw_entity);
            // add to vector
            self.raw_entities_vec.push(raw_entity);
            // check if raw_entity_count is posible to increment, if not initialize it with 0
            self.raw_entity_count += 1;

            // Emit an event that the raw entity was added
            self.env().emit_event(RawEntityAdded {
                raw_entity_id,
                entity_code: new_code,
            });

            Ok(())
        }

        /// Get a raw entity by its id
        #[ink(message)]
        pub fn get_raw_entity(&self, raw_entity_id: u64) -> Option<RawEntity> {
            Some(self.raw_entities.get(raw_entity_id).clone().unwrap())
        }

        /// Get a raw entity by its code
        #[ink(message)]
        pub fn get_raw_entity_by_code(&self, code: String) -> Option<RawEntity> {
            for item in self.raw_entities_vec.iter() {
                let raw_item = item.clone();
                if raw_item.code == code {
                    return Some(raw_item);
                }
            }
            None
        }

        /// Get raw entities by their owner
        #[ink(message)]
        pub fn get_raw_entities_by_owner(&self, owner: AccountId) -> Vec<RawEntity> {
            let mut raw_entities = Vec::new();
            // loop through all raw entities
            for item in self.raw_entities_vec.iter() {
                let raw_item = item.clone();
                if raw_item.owner == owner {
                    raw_entities.push(raw_item);
                }
            }
            raw_entities
        }

        /// Get raw entities by their buyer
        #[ink(message)]
        pub fn get_raw_entities_by_buyer(&self, buyer: AccountId) -> Vec<RawEntity> {
            let mut raw_entities = Vec::new();
            // loop through all raw entities
            for item in self.raw_entities_vec.iter() {
                let raw_item = item.clone();
                if raw_item.buyer == buyer {
                    raw_entities.push(raw_item);
                }
            }

            raw_entities
        }

        /// Get raw entities by their batch number
        #[ink(message)]
        pub fn get_raw_entities_by_batch_nos(&self, batch_nos: Vec<u64>) -> Vec<RawEntity> {
            let mut raw_entities = Vec::new();
            // loop through all raw entities
            for item in self.raw_entities_vec.iter() {
                let raw_item = item.clone();
                if batch_nos.contains(&raw_item.batch_no) {
                    raw_entities.push(raw_item);
                }
            }

            raw_entities
        }

        /// Get All Raw Entities
        #[ink(message)]
        pub fn get_all_raw_entities(&self) -> Vec<RawEntity> {
            let mut raw_entities = Vec::new();
            // loop through all raw entities
            for item in self.raw_entities_vec.iter() {
                let raw_item = item.clone();
                raw_entities.push(raw_item);
            }
            raw_entities
        }

        /// Add a new product entity to the blockchain
        #[ink(message)]
        pub fn add_product_entity(
            &mut self,
            name: String,
            code: String,
            quantity: u64,
            unit: String,
            batch_no: u64,
            raw_entities: Vec<u64>,
        ) -> Result<()> {
            let caller = self.env().caller();
            let timestamp = self.env().block_timestamp();
            let new_code = code.clone();
            let product_entity = ProductEntity {
                name,
                code,
                quantity,
                unit,
                batch_no,
                timestamp,
                raw_entities,
                owner: caller,
            };

            // product entity id is the current product entity count, if it does exists, we instantiate it with 0

            let product_entity_id = self.product_entity_count;
            self.product_entities
                .insert(product_entity_id, &product_entity);

            // add to vector
            self.product_entities_vec.push(product_entity);
            // increment product entity count
            self.product_entity_count += 1;
            // Emit an event that the product entity was added
            self.env().emit_event(ProductEntityAdded {
                product_entity_id,
                entity_code: new_code,
            });

            Ok(())
        }

        /// Get a product entity by its id
        #[ink(message)]
        pub fn get_product_entity(&self, product_entity_id: u64) -> Option<ProductEntity> {
            Some(
                self.product_entities
                    .get(product_entity_id)
                    .clone()
                    .unwrap(),
            )
        }

        /// Get a product entity by its code
        #[ink(message)]
        pub fn get_product_entity_by_code(&self, code: String) -> Option<ProductEntity> {
            for item in self.product_entities_vec.iter() {
                let product_item = item.clone();
                if product_item.code == code {
                    return Some(product_item);
                }
            }
            None
        }

        /// Get product entities by their owner
        #[ink(message)]
        pub fn get_product_entities_by_owner(&self, owner: AccountId) -> Vec<ProductEntity> {
            let mut product_entities = Vec::new();
            // loop through all product entities
            for item in self.product_entities_vec.iter() {
                let product_item = item.clone();
                if product_item.owner == owner {
                    product_entities.push(product_item);
                }
            }
            product_entities
        }

        /// Get product entities by their batch number
        #[ink(message)]
        pub fn get_product_entities_by_batch_nos(&self, batch_nos: Vec<u64>) -> Vec<ProductEntity> {
            let mut product_entities = Vec::new();
            // loop through all product entities
            for item in self.product_entities_vec.iter() {
                let product_item = item.clone();
                if batch_nos.contains(&product_item.batch_no) {
                    product_entities.push(product_item);
                }
            }
            product_entities
        }

        /// Get Product Entities by their raw entities
        #[ink(message)]
        pub fn get_product_entities_by_raw_entities(
            &self,
            raw_entities: Vec<u64>,
        ) -> Vec<ProductEntity> {
            let mut product_entities = Vec::new();
            // loop through all product entities
            for item in self.product_entities_vec.iter() {
                let product_item = item.clone();
                if raw_entities.contains(&product_item.raw_entities[0]) {
                    product_entities.push(product_item);
                }
            }
            product_entities
        }

        /// Get All Product Entities
        #[ink(message)]
        pub fn get_all_product_entities(&self) -> Vec<ProductEntity> {
            let mut product_entities = Vec::new();
            // loop through all product entities
            for item in self.product_entities_vec.iter() {
                let product_item = item.clone();
                product_entities.push(product_item);
            }
            product_entities
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
            let entity = Entity::new();
            assert_eq!(entity.raw_entity_count, 0);
        }

        /// We test add raw entity
        #[ink::test]
        fn add_raw_entity_works() {
            let mut entity = Entity::new();
            let name = String::from("Raw Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("RE1");
            let batch_no = 1;
            let buyer = AccountId::from([0x1; 32]);
            let result = entity.add_raw_entity(name, quantity, unit, code, batch_no, buyer);
            assert_eq!(result, Ok(()));
        }

        /// We test get raw entity
        #[ink::test]
        fn get_raw_entity_works() {
            let mut entity = Entity::new();
            let name = String::from("Raw Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("RE1");
            let batch_no = 1;
            let buyer = AccountId::from([0x1; 32]);
            let result = entity.add_raw_entity(name, quantity, unit, code, batch_no, buyer);
            assert_eq!(result, Ok(()));
            let raw_entity = entity.get_raw_entity(0);
            assert_eq!(raw_entity.unwrap().name, String::from("Raw Entity 1"));
        }

        /// We test get raw entity by code
        #[ink::test]
        fn get_raw_entity_by_code_works() {
            let mut entity = Entity::new();
            let name = String::from("Raw Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("RE1");
            let batch_no = 1;
            let buyer = AccountId::from([0x1; 32]);
            let result = entity.add_raw_entity(name, quantity, unit, code, batch_no, buyer);
            assert_eq!(result, Ok(()));
            let raw_entity = entity.get_raw_entity_by_code(String::from("RE1"));
            assert_eq!(raw_entity.unwrap().name, String::from("Raw Entity 1"));
        }

        /// We test get raw entities by owner
        #[ink::test]
        fn get_raw_entities_by_owner_works() {
            let mut entity = Entity::new();
            let name = String::from("Raw Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("RE1");
            let batch_no = 1;
            let buyer = AccountId::from([0x1; 32]);
            let result = entity.add_raw_entity(name, quantity, unit, code, batch_no, buyer);
            assert_eq!(result, Ok(()));
            let raw_entities = entity.get_raw_entities_by_owner(AccountId::from([0x1; 32]));
            assert_eq!(raw_entities[0].name, String::from("Raw Entity 1"));
        }

        /// We test get raw entities by buyer
        #[ink::test]
        fn get_raw_entities_by_buyer_works() {
            let mut entity = Entity::new();
            let name = String::from("Raw Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("RE1");
            let batch_no = 1;
            let buyer = AccountId::from([0x1; 32]);
            let result = entity.add_raw_entity(name, quantity, unit, code, batch_no, buyer);
            assert_eq!(result, Ok(()));
            let raw_entities = entity.get_raw_entities_by_buyer(AccountId::from([0x1; 32]));
            assert_eq!(raw_entities[0].name, String::from("Raw Entity 1"));
        }

        /// We test get raw entities by batch nos
        #[ink::test]
        fn get_raw_entities_by_batch_nos_works() {
            let mut entity = Entity::new();
            let name = String::from("Raw Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("RE1");
            let batch_no = 1;
            let buyer = AccountId::from([0x1; 32]);
            let result = entity.add_raw_entity(name, quantity, unit, code, batch_no, buyer);
            assert_eq!(result, Ok(()));
            let raw_entities = entity.get_raw_entities_by_batch_nos(vec![1]);
            assert_eq!(raw_entities[0].name, String::from("Raw Entity 1"));
        }

        /// We test get all raw entities
        #[ink::test]
        fn get_all_raw_entities_works() {
            let mut entity = Entity::new();
            let name = String::from("Raw Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("RE1");
            let batch_no = 1;
            let buyer = AccountId::from([0x1; 32]);
            let result = entity.add_raw_entity(name, quantity, unit, code, batch_no, buyer);
            assert_eq!(result, Ok(()));
            let raw_entities = entity.get_all_raw_entities();
            assert_eq!(raw_entities[0].name, String::from("Raw Entity 1"));
        }

        /// We test add product entity
        #[ink::test]
        fn add_product_entity_works() {
            let mut entity = Entity::new();
            let name = String::from("Product Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("PE1");
            let batch_no = 1;
            let raw_entities = vec![0];
            let result =
                entity.add_product_entity(name, code, quantity, unit, batch_no, raw_entities);
            assert_eq!(result, Ok(()));
        }

        /// We test get product entity
        #[ink::test]
        fn get_product_entity_works() {
            let mut entity = Entity::new();
            let name = String::from("Product Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("PE1");
            let batch_no = 1;
            let raw_entities = vec![0];
            let result =
                entity.add_product_entity(name, code, quantity, unit, batch_no, raw_entities);
            assert_eq!(result, Ok(()));
            let product_entity = entity.get_product_entity(0);
            assert_eq!(
                product_entity.unwrap().name,
                String::from("Product Entity 1")
            );
        }

        /// We test get product entity by code
        #[ink::test]
        fn get_product_entity_by_code_works() {
            let mut entity = Entity::new();
            let name = String::from("Product Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("PE1");
            let batch_no = 1;
            let raw_entities = vec![0];
            let result =
                entity.add_product_entity(name, code, quantity, unit, batch_no, raw_entities);
            assert_eq!(result, Ok(()));
            let product_entity = entity.get_product_entity_by_code(String::from("PE1"));
            assert_eq!(
                product_entity.unwrap().name,
                String::from("Product Entity 1")
            );
        }

        /// We test get product entities by owner
        #[ink::test]
        fn get_product_entities_by_owner_works() {
            let mut entity = Entity::new();
            let name = String::from("Product Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("PE1");
            let batch_no = 1;
            let raw_entities = vec![0];
            let result =
                entity.add_product_entity(name, code, quantity, unit, batch_no, raw_entities);
            assert_eq!(result, Ok(()));
            let product_entities = entity.get_product_entities_by_owner(AccountId::from([0x1; 32]));
            assert_eq!(product_entities[0].name, String::from("Product Entity 1"));
        }

        /// We test get product entities by batch nos
        #[ink::test]
        fn get_product_entities_by_batch_nos_works() {
            let mut entity = Entity::new();
            let name = String::from("Product Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("PE1");
            let batch_no = 1;
            let raw_entities = vec![0];
            let result =
                entity.add_product_entity(name, code, quantity, unit, batch_no, raw_entities);
            assert_eq!(result, Ok(()));
            let product_entities = entity.get_product_entities_by_batch_nos(vec![1]);
            assert_eq!(product_entities[0].name, String::from("Product Entity 1"));
        }

        /// We test get product entities by raw entities
        #[ink::test]
        fn get_product_entities_by_raw_entities_works() {
            let mut entity = Entity::new();
            let name = String::from("Product Entity 1");
            let quantity = 10;
            let unit = String::from("kg");
            let code = String::from("PE1");
            let batch_no = 1;
            let raw_entities = vec![0];
            let result =
                entity.add_product_entity(name, code, quantity, unit, batch_no, raw_entities);
            assert_eq!(result, Ok(()));
            let product_entities = entity.get_product_entities_by_raw_entities(vec![0]);
            assert_eq!(product_entities[0].name, String::from("Product Entity 1"));
        }
    }
}
