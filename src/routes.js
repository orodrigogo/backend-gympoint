import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Neste caso, o Middleware de Autenticação só vai funcionar para as rotas que estão abaixo dele.
routes.use(authMiddleware);
routes.post('/students', StudentController.store);

routes.post('/plans', PlansController.store);
routes.get('/plans', PlansController.index);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.put('/students/:id', StudentController.update);

routes.post('/registrations/:idPlan/:idStudent', RegistrationController.store);

export default routes;
