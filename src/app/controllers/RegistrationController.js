import { addMonths, parseISO } from 'date-fns';
import Plan from '../models/Plan';
import Registration from '../models/Registration';

class RegistraionController {
  async store(req, res) {
    const { start_date } = req.query;

    if (!start_date) {
      return res.status(400).json({ error: 'You need to enter a start date' });
    }

    // Recupero o plano do banco.
    const { duration, price } = await Plan.findByPk(req.params.idPlan);

    // Defino a data final, somando a duracao do plano na data de inicio escolhida pelo aluno.
    const end_date = addMonths(parseISO(start_date), duration);
    // Preço calculado de acordo com o plano e duração.
    const totalPrice = price * duration;

    // Registra o aluno.
    const register = await Registration.create({
      start_date,
      end_date,
      price: totalPrice,
      student_id: req.params.idStudent,
      plan_id: req.params.idPlan,
    });

    return res.json(register);
  }
}

export default new RegistraionController();
