import { DeepPartial } from "typeorm";
import { myDataSource } from "../config/config"
import { User } from "../entity/User"

const userRepository = myDataSource.getRepository(User);

export const createUser = async ( input: DeepPartial<User>) => {
  return (await myDataSource.manager.save(
    myDataSource.manager.create(User, input)
  )) as User;
};

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepository.findOne({ 
    where: { id: userId },
    relations: {
      customers: true
    }
  });
};

export const findUser = async (query: any) => {
  return await userRepository.findOneBy(query);
};
