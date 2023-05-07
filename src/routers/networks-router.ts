import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { createNetworkSchema } from '@/schemas/networks-schemas';
import { networksDestroy, networksList, networksShow, networksStore } from '@/controllers/networks-controller';

const networksRouter = Router();

networksRouter.all('/*', authenticateToken);
networksRouter.get('/', networksList);
networksRouter.get('/:networkId', networksShow);
networksRouter.post('/', validateBody(createNetworkSchema), networksStore);
networksRouter.delete('/:networkId', networksDestroy);

export { networksRouter };
