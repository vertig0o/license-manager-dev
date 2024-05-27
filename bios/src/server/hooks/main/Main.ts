import {
  useCreateDatabase,
  useGetDatabase,
  useCreateRealm,
  useCreateCollection,
  useCreateStringAttribute,
  useCreateBooleanAttribute,
  useCreateOrganization,
  Models,
  useCreateTeam,
} from '@realmocean/sdk'
import AppInfo from '../../../AppInfo'

namespace Main {
  export const GetDatabase = () => {
    const { database, isLoading } = useGetDatabase(
      AppInfo.Name,
      AppInfo.Database
    )
    return { database, isLoading }
  }

  // todo
  export const SetupRequired = () => {
    const { database, isLoading, isError, error } = useGetDatabase(
      AppInfo.Name,
      AppInfo.Database
    )
    if (!isLoading && isError) {
      return {
        required: error.code == 404,
        isLoading: false,
      }
    }
    return {
      required: false,
      isLoading: isLoading,
    }
  }

  export const CreateOrganization = ({
    orgId,
    name,
  }: {
    orgId: string
    name: string
  }) => {
    const { createTeam, error, isError, isLoading, isSuccess } =
      useCreateOrganization()
    createTeam({ id: orgId, name: name }, (data) => {
      if (!isLoading && isSuccess) {
        return {
          organization: data,
          isLoading: isLoading,
          error: error,
          isError: isError,
          isSuccess: isSuccess,
        }
      }
    })
  }

  export const CreateRealm = (orgId: string) => {
    let realm: Models.Realm
    const { createRealm, isLoading, error, isError, isSuccess } =
      useCreateRealm()
    createRealm(
      { name: AppInfo.Name, organizationId: orgId },
      (data) => (realm = data)
    )
    return {
      realm: realm,
      isLoading: isLoading,
      error: error,
      isError: isError,
      isSuccess: isSuccess,
    }
  }

  export const CreateDatabase = () => {
    let database: Models.Database
    const { createDatabase, isLoading, error, isError, isSuccess } =
      useCreateDatabase(AppInfo.Name)
    createDatabase(
      { name: AppInfo.Database, category: AppInfo.Name, enabled: true },
      (data) => (database = data)
    )
    return {
      database: database,
      isLoading: isLoading,
      error: error,
      isError: isError,
      isSuccess: isSuccess,
    }
  }

  export const CreateCollection = ({
    dbId,
    collectionName,
  }: {
    dbId: string
    collectionName: string
  }) => {
    let collection
    const { createCollection, isSuccess, error, isError, isLoading } =
      useCreateCollection(AppInfo.Name)
    createCollection(
      { databaseId: dbId, name: collectionName },
      (data) => (collection = data)
    )
    return {
      collection: collection,
      isLoading: isLoading,
      error: error,
      isError: isError,
      isSuccess: isSuccess,
    }
  }

  export const CreateAttribute = ({
    key,
    dbId,
    collectionId,
    attributeType,
    required,
    xdefault,
  }: {
    key: string
    dbId: string
    collectionId: string
    attributeType: 'string' | 'boolean'
    required: false
    xdefault: true
  }) => {
    let attribute
    if (attributeType == 'string') {
      const { createStringAttribute, isLoading, error, isError, isSuccess } =
        useCreateStringAttribute(AppInfo.Name)
      createStringAttribute(
        {
          databaseId: dbId,
          collectionId: collectionId,
          key: key,
          size: 255,
          required: required,
        },
        (data) => (attribute = data)
      )
      return {
        attribute: attribute,
        isLoading: isLoading,
        error: error,
        isError: isError,
        isSuccess: isSuccess,
      }
    } else if (attributeType == 'boolean') {
      const { createBooleanAttribute, isLoading, error, isError, isSuccess } =
        useCreateBooleanAttribute(AppInfo.Name)
      createBooleanAttribute(
        {
          databaseId: dbId,
          collectionId: collectionId,
          key: key,
          required: false,
          xdefault: xdefault,
        },
        (data) => (attribute = data)
      )
      return {
        attribute: attribute,
        isLoading: isLoading,
        error: error,
        isError: isError,
        isSuccess: isSuccess,
      }
    }
  }
}

export default Main
