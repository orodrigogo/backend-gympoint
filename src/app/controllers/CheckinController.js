import { Op } from 'sequelize';
import { subDays, setMinutes, setHours, setSeconds } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: {
        student_id: req.params.id,
      },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const startDay = subDays(
      setSeconds(setMinutes(setHours(Date.now(), 0), 0), 0),
      7 // Subtraindo 7 dias. Por exemplo, se hoje é dia 10 a busca será = 10 a 3.
    );
    const endDay = setSeconds(setMinutes(setHours(Date.now(), 23), 59), 0);

    // O usuário só pode fazer 5 checkins dentro de um período de 7 dias corridos.
    const countCheckin = await Checkin.count({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [startDay, endDay],
        },
      },
    });

    if (countCheckin > 5) {
      return res.status(401).json({
        error: 'You can only 5 checkins in 7 days',
      });
    }

    const checkin = await Checkin.create({ student_id: req.params.id });

    return res.json(checkin);
  }
}

export default new CheckinController();
