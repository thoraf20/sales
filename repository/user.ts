import { myDataSource } from "../config/config"
import { User } from "../entity/User"

const userRepository = myDataSource.getRepository(User);

export const createUser = async (input: any) => {
  return (await myDataSource.manager.save(
    myDataSource.manager.create(User, input)
  )) as User;
};

export const findUserByEmail = async ({ email }: { email: string }) => {
  return await userRepository.findOneBy({ email });
};

export const findUserById = async (userId: string) => {
  return await userRepository.findOneBy({ id: userId });
};

export const findUser = async (query: any) => {
  return await userRepository.findOneBy(query);
};
