import { Credential } from '@prisma/client';
import credentialRepository from '@/repositories/credential-repository';
import { cryptrUtil } from '@/utils/cryptr-utils';
import { DuplicatedTitleError, notFoundError } from '@/errors';

async function listCredential(userId: number) {
  const credentials = await credentialRepository.listCredential(userId);
  if (credentials.length === 0) {
    throw notFoundError();
  }

  credentials.map((credential) => (credential.password = cryptrUtil.decrypt(credential.password)));
  return credentials;
}

async function showCredential(userId: number, credentialId: number) {
  const credential = await credentialRepository.findById(credentialId);
  if (!credential || credential.userId !== userId) {
    throw notFoundError();
  }

  credential.password = cryptrUtil.decrypt(credential.password);
  return credential;
}

export async function createCredential({
  userId,
  title,
  url,
  username,
  password,
}: CreateCredentialParams): Promise<Credential> {
  await validateUniqueTitleOrFail(userId, title);

  const hashedPassword = cryptrUtil.encrypt(password);
  return credentialRepository.create({
    userId,
    title,
    url,
    username,
    password: hashedPassword,
  });
}

async function destroyCredential(userId: number, credentialId: number) {
  const credential = await credentialRepository.findById(credentialId);
  if (!credential || credential.userId !== userId) {
    throw notFoundError();
  }

  await credentialRepository.destroy(credentialId);
}

async function validateUniqueTitleOrFail(userId: number, title: string) {
  const credentialWithSameTitle = await credentialRepository.findByTitle(userId, title);
  if (credentialWithSameTitle) {
    throw DuplicatedTitleError();
  }
}

export type CreateCredentialParams = Pick<Credential, 'userId' | 'title' | 'url' | 'username' | 'password'>;

const credentialService = {
  listCredential,
  showCredential,
  createCredential,
  destroyCredential,
};

export default credentialService;
