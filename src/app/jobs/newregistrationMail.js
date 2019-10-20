import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt'; // Para colocar mês traduzido na formatação.
import Mail from '../../lib/Mail';
import formatMoney from '../../utils/formatMoney';

class NewregistrationMail {
  get key() {
    return 'newregistrationMail';
  }

  async handle({ data }) {
    const { info_registration } = data;

    console.log('A fila executou!');

    await Mail.sendMail({
      to: `${info_registration.student.name} <${info_registration.student.email}>`,
      subject: 'Matrícula Confirmada',
      template: 'newregistration',
      context: {
        student: info_registration.student.name,
        plan: info_registration.plan.title,
        price: formatMoney(info_registration.plan.price),
        endOfDate: format(
          parseISO(info_registration.end_date),
          "'dia' dd 'de' MMMM' de 'yyyy'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NewregistrationMail();
