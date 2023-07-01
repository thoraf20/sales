import { DeepPartial } from "typeorm";
import { myDataSource } from "../config/config"
import { Customer } from "../entity/Customer";

const customerRepository = myDataSource.getRepository(Customer);

export const createCustomer = async ( input: DeepPartial<Customer>) => {
  return (await myDataSource.manager.save(
    myDataSource.manager.create(Customer, input)
  )) as Customer;
};

export const findCustomerByEmail = async ({ email }: { email: string }) => {
  return await customerRepository.findOneBy({ email });
};
export const findCustomerByPhoneNumber = async ({ phoneNumber }: { phoneNumber: string }) => {
  return await customerRepository.findOneBy({ phoneNumber });
};
export const findCustomerByFullName = async ({ fullName }: { fullName: string }) => {
  return await customerRepository.findOneBy({ fullName });
};

export const findCustomerById = async (customerId: string) => {
  return await customerRepository.findOneBy({ id: customerId });
};

export const findCustomer = async (query: any) => {
  return await customerRepository.findOneBy(query);
};

export const updateCustomer = async (id: string, data: { phoneNumber: string}) => {
  return await customerRepository.update(
    { id },
    { ...data } 
  );
};