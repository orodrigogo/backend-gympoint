import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    return res.json({ list: true });
  }

  async store(req, res) {
    const checkin = await Checkin.create({ student_id: req.params.id });
    return res.json(checkin);
  }
}

export default new CheckinController();
