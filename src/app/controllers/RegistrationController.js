import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Plan from '../models/Plan';
import Student from '../models/Student';
import User from '../models/User';
import Registration from '../models/Registration';

import newregistrationMail from '../jobs/newregistrationMail';
import Queue from '../../lib/Queue';

class RegistraionController {
  async index(req, res) {
    // Verificando se o usuário um ADM.
    const isAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!isAdmin) {
      return res.status(400).json({ error: 'Only Admins can list registers' });
    }

    const registers = await Registration.findAll({
      attributes: ['id', 'end_date', 'price', 'created_at', 'updated_at'],
      // Fazendo o relacionamento.
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    return res.json(registers);
  }

  async store(req, res) {
    // Verificando se o usuário um ADM.
    const isAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!isAdmin) {
      return res.status(400).json({ error: 'Only Admins can add registers' });
    }

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

    // Recuperando as info do aluno para usar no envio de email.
    const info_registration = await Registration.findOne({
      where: { id: register.id },

      // Fazendo o relacionamento.
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'price'],
        },
      ],
    });

    // Enviar e-mail para o aluno com a confirmação de matrícula.
    await Queue.add(newregistrationMail.key, {
      info_registration,
    });

    return res.json(info_registration);
  }

  async delete(req, res) {
    // Verificando se o usuário um ADM.
    const isAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!isAdmin) {
      return res
        .status(400)
        .json({ error: 'Only Admins can delete a registers' });
    }

    // Verificando se a matricula existe
    const register = await Registration.findByPk(req.params.id);
    if (!register) {
      return res.status(400).json({ error: "Register don't exists" });
    }

    await register.destroy(register);
    return res.json({ deleted: true });
  }

  async update(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
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
        .json({ error: 'Only Admins can update registers' });
    }

    const { start_date, student_id, plan_id } = req.body;

    if (!start_date) {
      return res.status(400).json({ error: 'You need to enter a start date' });
    }

    // Recuperando o registro.
    const register = await Registration.findByPk(req.params.id);

    if (!register) {
      return res.status(401).json({ error: 'Registration not found' });
    }

    // Recupero o plano do banco.
    const { duration, price } = await Plan.findByPk(plan_id);

    // Defino a data final, somando a duracao do plano na data de inicio escolhida pelo aluno.
    const end_date = addMonths(parseISO(start_date), duration);
    // Preço calculado de acordo com o plano e duração.
    const totalPrice = price * duration;

    // Registra o aluno.
    register.update(
      {
        start_date,
        end_date,
        price: totalPrice,
        student_id,
        plan_id,
      },
      { where: { id: req.params.id } }
    );

    return res.json(register);
  }
}

export default new RegistraionController();
