import {DataTypes, Model} from 'sequelize';
import {dbConnection} from './db';

type ModelAttrs = {
  entry: string;
  data: Record<string, any>;
};

type ModelCreationAttrs = ModelAttrs;

class ProfileModel
  extends Model<ModelAttrs, ModelCreationAttrs>
  implements ModelAttrs
{
  public entry!: string;
  public data!: Record<string, any>;
}

ProfileModel.init(
  {
    entry: {
      type: DataTypes.TEXT,
      field: 'entry',
      allowNull: false,
      primaryKey: true,
    },
    data: {
      type: DataTypes.JSONB,
      field: 'data',
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection.sequelize,
    tableName: 'profile',
    timestamps: true,
  }
);

export {ProfileModel};
