import Student from '../models/Student';
import HelpOrders from '../models/HelpOrders';

class HelpOrdersController {
  async index(req, res) {
    const help_orders = await HelpOrders.findAll({
      where: {
        answer: null,
      },
      // Fazendo o relacionamento.
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });

    return res.json(help_orders);
  }
}

export default new HelpOrdersController();
