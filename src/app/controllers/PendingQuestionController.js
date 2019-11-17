import Student from '../models/Student';
import HelpOrders from '../models/HelpOrders';

class HelpOrdersController {
  async index(req, res) {
    const { page = 1 } = req.query;

    // Numero de limites por paginas.
    const pageSize = 8;

    const help_orders = await HelpOrders.findAll({
      limit: pageSize, // numero de registros por paginação.
      offset: (page - 1) * pageSize, // conta para pular as páginas de 5 em 5.
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
