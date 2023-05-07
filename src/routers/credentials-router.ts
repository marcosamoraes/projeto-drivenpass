import { Router } from 'express';

import { authenticateToken, validateBody } from '@/middlewares';
import { createCredentialSchema } from '@/schemas';
import { credentialsDestroy, credentialsList, credentialsShow, credentialsStore } from '@/controllers';

const credentialsRouter = Router();

credentialsRouter.all('/*', authenticateToken);
credentialsRouter.get('/', credentialsList);
credentialsRouter.get('/:credentialId', credentialsShow);
credentialsRouter.post('/', validateBody(createCredentialSchema), credentialsStore);
credentialsRouter.delete('/:credentialId', credentialsDestroy);

export { credentialsRouter };
