import { Network } from '@prisma/client';
import { DuplicatedTitleError } from './errors';
import networkRepository from '@/repositories/network-repository';
import { cryptrUtil } from '@/utils/cryptr-utils';
import { notFoundError } from '@/errors';

async function listNetwork(userId: number) {
  const networks = await networkRepository.listNetwork(userId);

  networks.map((network) => (network.password = cryptrUtil.decrypt(network.password)));
  return networks;
}

async function showNetwork(userId: number, networkId: number) {
  const network = await networkRepository.findById(networkId);
  if (!network || network.userId !== userId) {
    throw notFoundError();
  }

  network.password = cryptrUtil.decrypt(network.password);
  return network;
}

export async function createNetwork({ userId, title, network, password }: CreateNetworkParams): Promise<Network> {
  await validateUniqueTitleOrFail(userId, title);

  const hashedPassword = cryptrUtil.encrypt(password);
  return networkRepository.create({
    userId,
    title,
    network,
    password: hashedPassword,
  });
}

async function destroyNetwork(userId: number, networkId: number) {
  const network = await networkRepository.findById(networkId);
  if (!network || network.userId !== userId) {
    throw notFoundError();
  }

  await networkRepository.destroy(networkId);
}

async function validateUniqueTitleOrFail(userId: number, title: string) {
  const networkWithSameTitle = await networkRepository.findByTitle(userId, title);
  if (networkWithSameTitle) {
    throw DuplicatedTitleError();
  }
}

export type CreateNetworkParams = Pick<Network, 'userId' | 'title' | 'network' | 'password'>;

const networkService = {
  listNetwork,
  showNetwork,
  createNetwork,
  destroyNetwork,
};

export * from './errors';
export default networkService;
