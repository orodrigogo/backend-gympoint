import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import PendingQuestionController from './app/controllers/PendingQuestionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

// Neste caso, o Middleware de Autenticação só vai funcionar para as rotas que estão abaixo dele.
routes.use(authMiddleware);
routes.post('/students', StudentController.store);
routes.get('/students', StudentController.index);
routes.delete('/students/:id', StudentController.delete);
routes.get('/students/:id', StudentController.load);

routes.post('/plans', PlansController.store);
routes.get('/plans', PlansController.index);
routes.put('/plans/:id', PlansController.update);
routes.delete('/plans/:id', PlansController.delete);

routes.put('/students/:id', StudentController.update);

routes.post('/registrations/:idPlan/:idStudent', RegistrationController.store);
routes.delete('/registrations/:id', RegistrationController.delete);
routes.put('/registrations/:id', RegistrationController.update);
routes.get('/registrations', RegistrationController.index);

routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/help-orders', HelpOrdersController.store);
routes.get('/students/:id/help-orders', HelpOrdersController.index);
routes.put('/students/help-orders/:id/answer', HelpOrdersController.update);

routes.get('/pendingquestions/', PendingQuestionController.index);

export default routes;
