import {DataTypes, Model} from 'sequelize';
import {dbConnection} from './db';

type ModelAttrs = {
  entry: string;
  user: string;
  page: string;
  domain: string;
  data: Record<string, any>;
};

type ModelCreationAttrs = ModelAttrs;

class SelectionModel
  extends Model<ModelAttrs, ModelCreationAttrs>
  implements ModelAttrs
{
  public entry!: string;
  public user!: string;
  public page!: string;
  public domain!: string;
  public data!: Record<string, any>;
}

SelectionModel.init(
  {
    entry: {
      type: DataTypes.TEXT,
      field: 'entry',
      allowNull: false,
      primaryKey: true,
    },
    user: {
      type: DataTypes.TEXT,
      field: 'user',
      allowNull: true,
    },
    domain: {
      type: DataTypes.TEXT,
      field: 'domain',
      allowNull: true,
    },
    page: {
      type: DataTypes.TEXT,
      field: 'page',
      allowNull: true,
    },
    data: {
      type: DataTypes.JSONB,
      field: 'data',
      allowNull: true,
    },
  },
  {
    sequelize: dbConnection.sequelize,
    tableName: 'selection',
    timestamps: true,
    indexes: [
      {
        fields: ['user'],
        name: 'selection_entry_user_index',
      },
      {
        fields: ['page'],
        name: 'selection_entry_page_index',
      },
    ],
  }
);

export {SelectionModel};
