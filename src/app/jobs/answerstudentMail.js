import Mail from '../../lib/Mail';

class AnswerstudentMail {
  get key() {
    return 'answerstudentMail';
  }

  async handle({ data }) {
    const { info_help_order } = data;

    console.log('A fila executou!');

    await Mail.sendMail({
      to: `${info_help_order.student.name} <${info_help_order.student.email}>`,
      subject: 'Sua pergunta foi respondida',
      template: 'answerstudent',
      context: {
        student: info_help_order.student.name,
        question: info_help_order.question,
        answer: info_help_order.answer,
      },
    });
  }
}

export default new AnswerstudentMail();
