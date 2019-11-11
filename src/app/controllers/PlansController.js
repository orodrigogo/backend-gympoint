import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class PlansController {
  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verificando se o usuário um ADM.
    const isAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!isAdmin) {
      return res
        .status(400)
        .json({ error: 'Only Admins can register a new plans' });
    }

    /**
     * VERIFICANDO SE O PLANO JÁ EXISTE!
     */
    const plan = await Plan.findOne({ where: { title: req.body.title } });
    if (plan) {
      return res.status(400).json({ error: 'Plan already exists' });
    }

    const { title, duration, price } = await Plan.create(req.body);
    return res.json({
      title,
      duration,
      price,
    });
  }

  async index(req, res) {
    const plan = await Plan.findAll();
    return res.json(plan);
  }

  async load(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    return res.json(plan);
  }

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Verificando se o usuário um ADM.
    const isAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!isAdmin) {
      return res
        .status(400)
        .json({ error: 'Only Admins can update a new plans' });
    }

    // Verificando se o plano existe
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json({ error: "Plan don't exists" });
    }

    const { id, title, duration, price } = await plan.update(req.body);
    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    // Verificando se o usuário um ADM.
    const isAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!isAdmin) {
      return res.status(400).json({ error: 'Only Admins can delete a plans' });
    }

    // Verificando se o plano existe
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json({ error: "Plan don't exists" });
    }

    await plan.destroy(plan);
    return res.json({ deleted: true });
  }
}

export default new PlansController();
