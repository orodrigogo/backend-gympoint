import Sequelize, { Model } from 'sequelize';
import { isBefore, isAfter } from 'date-fns';

class Registration extends Model {
  static init(sequelize) {
    super.init(
      {
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
        price: Sequelize.FLOAT,
        /**
         * Campo boolean true/false na listagem de matrículas indicando
         * se a matrícula está ativa ou não, ou seja, se a data de término é posterior
         * à atual e a data de início inferior (utilizando um campo VIRTUAL).
         */
        is_active: {
          type: Sequelize.VIRTUAL,
          get() {
            return (
              isBefore(this.start_date, new Date()) &&
              isAfter(this.end_date, new Date())
            );
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Plan, { foreignKey: 'plan_id', as: 'plan' });
  }
}

export default Registration;
