import { Router } from 'express';

import { createUserSchema } from '@/schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { createCredentialSchema } from '@/schemas/credentials-schemas';
import {
  credentialsDestroy,
  credentialsList,
  credentialsShow,
  credentialsStore,
} from '@/controllers/credentials-controller';

const credentialsRouter = Router();

credentialsRouter.all('/*', authenticateToken);
credentialsRouter.get('/', credentialsList);
credentialsRouter.get('/:credentialId', credentialsShow);
credentialsRouter.post('/', validateBody(createCredentialSchema), credentialsStore);
credentialsRouter.delete('/:credentialId', validateBody(createUserSchema), credentialsDestroy);

export { credentialsRouter };
