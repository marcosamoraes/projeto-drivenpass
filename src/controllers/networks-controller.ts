import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import networkService, { CreateNetworkParams } from '@/services/networks-service';
import { AuthenticatedRequest } from '@/middlewares';

export async function networksList(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const networks = await networkService.listNetwork(userId);
    return res.status(httpStatus.OK).send(networks);
  } catch (error) {
    next(error);
  }
}

export async function networksShow(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { networkId } = req.params;

  try {
    const networks = await networkService.showNetwork(userId, parseInt(networkId));
    return res.status(httpStatus.OK).send(networks);
  } catch (error) {
    next(error);
  }
}

export async function networksStore(req: AuthenticatedRequest, res: Response) {
  const { title, network, password } = req.body as CreateNetworkParams;
  const { userId } = req;

  try {
    const response = await networkService.createNetwork({ userId, title, network, password });
    return res.status(httpStatus.CREATED).json({
      networkId: response.id,
    });
  } catch (error) {
    if (error.name === 'DuplicatedTitleError') {
      return res.status(httpStatus.CONFLICT).send(error);
    }
    return res.status(httpStatus.BAD_REQUEST).send(error);
  }
}

export async function networksDestroy(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { networkId } = req.params;

  try {
    await networkService.destroyNetwork(userId, parseInt(networkId));
    return res.sendStatus(httpStatus.ACCEPTED);
  } catch (error) {
    next(error);
  }
}
