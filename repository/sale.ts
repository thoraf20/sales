import { DeepPartial } from "typeorm";
import { myDataSource } from "../config/config"
import { Sale } from "../entity/Sales";

const saleRepository = myDataSource.getRepository(Sale);

export const addSale = async ( input: DeepPartial<Sale>) => {
  return (await myDataSource.manager.save(
    myDataSource.manager.create(Sale, input)
  )) as Sale;
};

export const findSalesByCustomerId = async (customerId: string) => {
  return await saleRepository.find({ 
    where: { customerId },
    relations: {
      customers: true
    }
  });
};

export const findSalesById = async (saleId: string) => {
  return await saleRepository.findOne({ 
    where: { id: saleId },
  });
};

export const findSales = async (query: any) => {
  return await saleRepository.findOneBy(query);
};

export const updateSale = async (id: string, data) => {
  return await saleRepository.update(
    { id },
    { ...data } 
  );
};

export const deleteSale = async (id: string) => {
  return await saleRepository.delete({ id });
};