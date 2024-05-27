import IDatabase from './IDatabase'
const Database: IDatabase = {
  id: 'license-manager',
  name: 'License Manager',
  author: 'Pedasoft',
  description: {
    en: 'License Manager is a database of all the License Manager in the world.',
    tr: 'License Manager, projedeki tüm License Managerin bir veritabanıdır.',
  },
  seed_admin: {
    name: 'pedasoft',
    email: 'info@pedasoft.com',
    password: 'pedasoft',
  },
  enabled: true,
  version: 1,
  collections: [
    {
      id: 'parameters',
      name: 'Parameters',
      description: {
        en: 'Trainer is a collection of trainers.',
        tr: 'Eğitmenlerin koleksiyonudur.',
      },
      version: 1,
      attributes: [
        {
          key: 'tenant_id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'name',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'is_active',
          type: 'boolean',
          default: false,
          version: 1,
        },
        {
          key: 'is_deleted',
          type: 'boolean',
          default: false,
          version: 1,
        },
        {
          key: 'is_show',
          type: 'boolean',
          default: false,
          version: 1,
        },
      ],
    },
    {
      id: 'account_relation',
      name: 'Account Relation',
      description: {
        en: 'Trainer is a collection of trainers.',
        tr: 'Eğitmenlerin koleksiyonudur.',
      },
      version: 1,
      attributes: [
        // {
        //   "key": 'id',
        //   "type": 'string',
        // },
        {
          key: 'account_id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'tenant_id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'role',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'is_active',
          type: 'boolean',
          default: true,
          version: 1,
        },
        {
          key: 'is_deleted',
          type: 'boolean',
          default: false,
          version: 1,
        },
      ],
    },
    {
      id: 'database_version',
      name: 'Database Version',
      description: {
        en: 'Database Version is a collection of database versions.',
        tr: 'Veritabanı versiyonlarının koleksiyonudur.',
      },
      version: 1,
      attributes: [
        {
          key: 'id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'version',
          type: 'number',
          version: 1,
          size: 256,
        },
        {
          key: 'is_active',
          type: 'boolean',
          version: 1,
          default: true,
        },
        {
          key: 'is_deleted',
          type: 'boolean',
          version: 1,
          default: false,
        },
      ],
    },
    {
      id: 'collection_version',
      name: 'Collection Version',
      description: {
        en: 'Collection Version is a collection of collection versions.',
        tr: 'Koleksiyon versiyonlarının koleksiyonudur.',
      },
      version: 1,
      attributes: [
        {
          key: 'id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'collection_id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'version',
          type: 'number',
          version: 1,
          size: 256,
        },
        {
          key: 'is_active',
          type: 'boolean',
          version: 1,
          default: true,
        },
        {
          key: 'is_deleted',
          type: 'boolean',
          version: 1,
          default: false,
        },
      ],
    },
    {
      id: 'collection_attribute_version',
      name: 'Collection Attribute Version',
      description: {
        en: 'Collection Attribute Version is a collection of collection attribute versions.',
        tr: 'Koleksiyon nitelik versiyonlarının koleksiyonudur.',
      },
      version: 1,
      attributes: [
        {
          key: 'id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'collection_id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'attribute_id',
          type: 'string',
          version: 1,
          size: 256,
        },
        {
          key: 'version',
          type: 'number',
          version: 1,
          size: 256,
        },
        {
          key: 'is_active',
          type: 'boolean',
          version: 1,
          default: true,
        },
        {
          key: 'is_deleted',
          type: 'boolean',
          version: 1,
          default: false,
        },
      ],
    },
    {
      id: 'customer',
      name: 'Customer',
      description: {
        en: '',
        tr: '',
      },
      version: 1,
      attributes: [
        {
          key: 'name',
          type: 'string',
          version: 1,
        },
        {
          key: 'manager_name',
          type: 'string',
          version: 1,
        },
        {
          key: 'manager_email',
          type: 'string',
          version: 1,
        },

        {
          key: 'is_active',
          type: 'boolean',
          version: 1,
          default: true,
        },
        {
          key: 'is_deleted',
          type: 'boolean',
          version: 1,
          default: false,
        },
      ],
    },
    {
      id: 'licence',
      name: 'licence',
      description: {
        en: '',
        tr: '',
      },
      version: 1,
      attributes: [
        {
          key: 'customer_name',
          type: 'string',
          version: 1,
        },
        {
          key: 'customer_id',
          type: 'string',
          version: 1,
        },
        {
          key: 'app',
          type: 'string',
          version: 1,
        },
        {
          key: 'licence_type',
          type: 'string',
          version: 1,
        },
        {
          key: 'start_date',
          type: 'string',
          version: 1,
        },
        {
          key: 'licence_renewal',
          type: 'string',
          version: 1,
        },
        {
          key: 'is_active',
          type: 'boolean',
          version: 1,
          default: true,
        },
      ],
    },
    {
      id: 'licence-extension',
      name: 'licence-extension',
      description: {
        en: '',
        tr: '',
      },
      version: 1,
      attributes: [
        {
          key: 'customer_name',
          type: 'string',
          version: 1,
        },
        {
          key: 'customer_id',
          type: 'string',
          version: 1,
        },

        {
          key: 'app',
          type: 'string',
          version: 1,
        },
        {
          key: 'validity_date',
          type: 'string',
          version: 1,
        },
        {
          key: 'new_validity_date',
          type: 'string',
          version: 1,
        },
        {
          key: 'is_deleted',
          type: 'boolean',
          version: 1,
          default: false,
        },
      ],
    },
  ],
}

export default Database
