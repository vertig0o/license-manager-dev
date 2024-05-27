import {
  HStack,
  ReactView,
  Spinner,
  Text,
  UIController,
  UINavigate,
  UIView,
  UIViewBuilder,
  VStack,
  cCenter,
  nanoid,
  useNavigate,
} from '@tuval/forms'
import { PortalMenu } from '../../../components/PortalMenu'
import React, { useEffect, useState } from 'react'
import { Query, Services, useGetMe } from '@realmocean/sdk'
import AccountRelation from '../../../../server/hooks/accountRelation/Main'
import Main from '../../../../server/hooks/main/Main'
import { Umay } from '@tuval/core'
import Database from '../../../../server/core/Database'
import AppInfo from '../../../../AppInfo'
import Collections from '../../../../server/core/Collections'
import { Toast } from '../../../components/Toast'
import { Dialog, DialogContent } from '@mui/material'
export class DashboardViewController extends UIController {
  public LoadView(): UIView {
    window.document.title = 'Raporlar'
    const { me, isLoading } = useGetMe('console')

    const { required, isLoading: isLoadingDb } = Main.SetupRequired()

    const { listAccountRelation } = AccountRelation.List()

    const navigate = useNavigate()

    return isLoading || isLoadingDb
      ? VStack(Spinner())
      : UIViewBuilder(() => {
          const [isUpdate, setIsUpdate] = useState(false)

          const updateVersion = async (dbVersion: number) => {
            const updateVersion = dbVersion + 1
            const updateVersionTask = new Umay()
            Database.collections
              .filter((collection) => collection.version == updateVersion)
              .forEach((collection) => {
                updateVersionTask.Task(async () => {
                  try {
                    setIsUpdate(true)
                    console.log('version', updateVersion)
                    await Services.Databases.createCollection(
                      AppInfo.Name,
                      AppInfo.Database,
                      collection.id,
                      collection.name
                    )
                  } catch (error) {
                    console.log(error)
                  }
                })
                updateVersionTask.Wait(1)
                updateVersionTask.Task(async () => {
                  try {
                    await Services.Databases.createDocument(
                      AppInfo.Name,
                      AppInfo.Database,
                      Collections.CollectionVersion,
                      collection.id,
                      {
                        id: collection.id,
                        collection_id: collection.id,
                        version: updateVersion,
                        is_active: true,
                        is_deleted: false,
                      }
                    )
                  } catch (error) {
                    console.log(error)
                  }
                })
                updateVersionTask.Wait(1)
                collection.attributes.forEach((attr) => {
                  updateVersionTask.Task(async () => {
                    try {
                      if (attr.type === 'string') {
                        await Services.Databases.createStringAttribute(
                          AppInfo.Name,
                          AppInfo.Database,
                          collection.id,
                          attr.key,
                          256,
                          false
                        )
                      } else if (attr.type === 'number') {
                        await Services.Databases.createIntegerAttribute(
                          AppInfo.Name,
                          AppInfo.Database,
                          collection.id,
                          attr.key,
                          false
                        )
                      } else if (attr.type === 'boolean') {
                        await Services.Databases.createBooleanAttribute(
                          AppInfo.Name,
                          AppInfo.Database,
                          collection.id,
                          attr.key,
                          false,
                          attr.default
                        )
                      }
                    } catch (error) {
                      console.log(error)
                    }
                  })
                  updateVersionTask.Wait(1)
                  updateVersionTask.Task(async () => {
                    try {
                      await Services.Databases.createDocument(
                        AppInfo.Name,
                        AppInfo.Database,
                        Collections.CollectionAttributeVersion,
                        nanoid(),
                        {
                          id: collection.id + '_a_' + attr.key,
                          collection_id: collection.id,
                          attribute_id: attr.key,
                          version: updateVersion,
                          is_active: true,
                          is_deleted: false,
                        }
                      )
                    } catch (error) {
                      console.log(error)
                    }
                  })
                  updateVersionTask.Wait(1)
                })
              })
            updateVersionTask.Wait(2)

            const updateAttributes = []
            Database.collections.forEach((collection) => {
              collection.attributes.forEach((attr) => {
                if (attr.version == updateVersion) {
                  updateAttributes.push({
                    ...attr,
                    collection_id: collection.id,
                  })
                }
              })
            })
            updateAttributes.forEach((attr) => {
              updateVersionTask.Task(async () => {
                try {
                  if (attr.type === 'string') {
                    await Services.Databases.createStringAttribute(
                      AppInfo.Name,
                      AppInfo.Database,
                      attr.collection_id,
                      attr.key,
                      256,
                      false
                    )
                  } else if (attr.type === 'number') {
                    await Services.Databases.createIntegerAttribute(
                      AppInfo.Name,
                      AppInfo.Database,
                      attr.collection_id,
                      attr.key,
                      false
                    )
                  } else if (attr.type === 'boolean') {
                    await Services.Databases.createBooleanAttribute(
                      AppInfo.Name,
                      AppInfo.Database,
                      attr.collection_id,
                      attr.key,
                      false,
                      attr.default
                    )
                  }
                } catch (error) {
                  console.log(error)
                }
              })
              updateVersionTask.Wait(1)
              updateVersionTask.Task(async () => {
                try {
                  await Services.Databases.createDocument(
                    AppInfo.Name,
                    AppInfo.Database,
                    Collections.CollectionAttributeVersion,
                    nanoid(),
                    {
                      id: attr.collection_id + '_a_' + attr.key,
                      collection_id: attr.collection_id,
                      attribute_id: attr.key,
                      version: updateVersion,
                      is_active: true,
                      is_deleted: false,
                    }
                  )
                } catch (error) {
                  console.log(error)
                }
              })
              updateVersionTask.Wait(1)
            })

            updateVersionTask.Wait(2)
            updateVersionTask.Task(async () => {
              await Services.Databases.updateDocument(
                AppInfo.Name,
                AppInfo.Database,
                Collections.DatabaseVersion,
                'database_version',
                {
                  version: updateVersion,
                }
              )
            })

            updateVersionTask.Wait(1)
            updateVersionTask.Task(async () => {
              setIsUpdate(false)
              Toast.fire({
                icon: 'success',
                title: 'Veritabanı Güncellendi',
              })
            })
            updateVersionTask.Wait(1)
            updateVersionTask.Task(async () => {
              window.location.reload()
            })
            updateVersionTask.Run()
          }

          useEffect(() => {
            if (me?.prefs?.organization == null) {
              Services.Databases.listDocuments(
                AppInfo.Name,
                AppInfo.Database,
                Collections.Parameters
              ).then((result) => {
                Services.Client.setProject('console')
                Services.Client.setMode(undefined)
                Services.Accounts.updatePrefs({
                  organization: result.documents[0].tenant_id,
                })
                window.location.reload()
              })
            }
            Services.Databases.listDocuments(
              AppInfo.Name,
              AppInfo.Database,
              Collections.AccountRelation,
              [Query.equal('account_id', me.$id)]
            ).then((result) => {
              const data = result.documents[0]
              const role = data?.role
              localStorage.setItem('role', role)
            })
            Services.Databases.getDocument(
              AppInfo.Name,
              AppInfo.Database,
              Collections.DatabaseVersion,
              'database_version'
            ).then((database_version) => {
              const dbVersion: number = database_version.version
              if (dbVersion != Database.version) {
                updateVersion(dbVersion)
              }
            })
          }, [])
          return me == null
            ? UINavigate('/login')
            : required
            ? UINavigate('/app/setup')
            : HStack(
                PortalMenu('Raporlar'),
                VStack({ alignment: cCenter })(
                  ReactView(
                    <div>
                      <Dialog open={isUpdate} fullScreen>
                        <DialogContent>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <h3>
                              Güncelleme yapılıyor, lütfen bekleyiniz ve sayfayı
                              yenilemeyiniz.
                            </h3>
                          </div>
                        </DialogContent>
                      </Dialog>
                      a
                    </div>
                  )
                ).padding('10px')
              )
                .width('100%')
                .height('100%')
        })
  }
}
