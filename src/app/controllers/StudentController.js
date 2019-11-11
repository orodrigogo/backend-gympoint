import * as Yup from 'yup';
import { Op } from 'sequelize';

import Student from '../models/Student';
import User from '../models/User';

class StudentController {
  async index(req, res) {
    // Se o parametro page não for informado, será por padrão 1.
    const { searchName, page = 1 } = req.query;

    // Caso não seja passado o searchName por parametro. Retorna todos.
    if (!searchName) {
      return res.json(
        await Student.findAll({
          limit: 5, // numero de registros por paginação.
          offset: (page - 1) * 5, // conta para pular as páginas de 5 em 5.
        })
      );
    }

    // ilike = é o like case insensitive. Ou seja, vai encontrar nomes com letras maisculas e minusculas.
    const students = await Student.findAll({
      where: { name: { [Op.iLike]: `%${searchName}%` } },
      limit: 5, // numero de registros por paginação.
      offset: (page - 1) * 5, // conta para pular as páginas de 5 em 5.
    });

    return res.json(students);
  }

  async store(req, res) {
    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.string(),
      height: Yup.string(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.json({ error: 'Student exists' });
    }

    const stundent = await Student.create(req.body);

    return res.json(stundent);
  }

  async update(req, res) {
    // Verificando se o aluno existe.
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(401).json({ error: 'Student not exist.' });
    }

    // Denição do padrão de objeto com Yup.
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.string(),
      height: Yup.string(),
    });

    // Validação de campos com o Yup.
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails.' });
    }

    const returnUpdate = await student.update(req.body);

    return res.json(returnUpdate);
  }

  async delete(req, res) {
    // Verificando se o usuário um ADM.
    const isAdmin = await User.findOne({
      where: { id: req.userId, admin: true },
    });

    if (!isAdmin) {
      return res
        .status(400)
        .json({ error: 'Only Admins can delete a student' });
    }

    // Verificando se o usuário existe
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: "Student don't exists" });
    }

    await student.destroy(student);
    return res.json({ deleted: true });
  }

  async load(req, res) {
    const student = await Student.findByPk(req.params.id);
    return res.json(student);
  }
}

export default new StudentController();
