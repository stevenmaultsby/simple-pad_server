import {DataTypes, Model} from 'sequelize';
import {dbConnection} from './db';

type ModelAttrs = {
  entry: string;
  user: string;
  root: string;
  type: string;
  page: string;
  domain: string;
  data: Record<string, any>;
};

type ModelCreationAttrs = ModelAttrs;

class RedactorEntryModel
  extends Model<ModelAttrs, ModelCreationAttrs>
  implements ModelAttrs
{
  public entry!: string;
  public user!: string;
  public root!: string;
  public type!: string;
  public page!: string;
  public domain!: string;
  public data!: Record<string, any>;

  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;
}

RedactorEntryModel.init(
  {
    entry: {
      type: DataTypes.TEXT,
      field: 'entry',
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.TEXT,
      field: 'type',
      allowNull: false,
    },
    user: {
      type: DataTypes.TEXT,
      field: 'user',
      allowNull: false,
    },
    root: {
      type: DataTypes.TEXT,
      field: 'root',
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
    tableName: 'redactor_entry',
    timestamps: true,
    indexes: [
      {
        fields: ['entry', 'user'],
        unique: true,
        name: 'redactor_entry_user_index',
      },
      {
        fields: ['page'],
        name: 'redactor_entry_page_index',
      },
    ],
  }
);

export {RedactorEntryModel};
