import {
  ReactView,
  UIController,
  UIView,
  VStack,
  UINavigate,
  Spinner,
  useState,
  useNavigate,
  State,
  nanoid,
} from '@tuval/forms'
import React, { useRef } from 'react'
import bgImage from '../../../assets/Values/BackgroundImage'
import { useGetMe, ID, Services } from '@realmocean/sdk'
import AppInfo from '../../../../AppInfo'
import Database from '../../../../server/core/Database'
import Swal from 'sweetalert2'
import {
  ConsoleText,
  ConsoleView,
  Container,
  HeaderLabel,
} from '../Views/SetupView'
import { Toast } from '../../../components/Toast'
import { Umay } from '@tuval/core'
import Collections from '../../../../server/core/Collections'
import { Button, TextField } from '@mui/material'

export class SetupController extends UIController {
  private navigate: any

  @State()
  private helpTexts: string[]

  protected BindRouterParams(routerParams?: any): void {
    this.helpTexts = []
    Services.Databases.get(AppInfo.Name, AppInfo.Database).then((database) => {
      if (database != null) {
        this.navigate('/app/dashboard')
      }
    })
  }

  private pushHelpText(text: string) {
    const helper = this.helpTexts
    helper.push(text)
    this.helpTexts = helper
  }

  public LoadView(): UIView {
    this.navigate = useNavigate()

    const ul = useRef<HTMLUListElement>(null)

    const { me, isLoading: isLoad } = useGetMe('console')

    const [form, setForm] = useState({
      organizationId: ID.unique(),
      organizationName: '',
    })

    const [clicked, setClicked] = useState(false)

    const createDb = async () => {
      setClicked(true)
      try {
        this.pushHelpText('Organizasyon oluşturuluyor...')
        Services.Client.setProject('console')
        Services.Client.setMode(undefined)
        // Services.Teams.get()
        const organization = await Services.Teams.create(
          form.organizationId,
          form.organizationName
        )
        Services.Accounts.updatePrefs({ organization: organization.$id })
        this.pushHelpText('Organizasyon oluşturuldu: ' + organization.name)
        this.pushHelpText('Realm oluşturuluyor...')
        const realm = await Services.Projects.create(
          AppInfo.Name,
          AppInfo.Name,
          organization.$id
        )
        this.pushHelpText('Realm oluşturuldu: ' + realm.name)
        Services.Client.setMode('admin')
        this.pushHelpText('Database oluşturuluyor...')
        const database = await Services.Databases.create(
          realm.$id,
          AppInfo.Database,
          AppInfo.Database
        )
        this.pushHelpText('Database oluşturuldu: ' + database.name)
        const collections = Database.collections
        const tasks = new Umay()
        const crashedStringTasks: {
          projectId: string
          databaseId: string
          collectionId: string
          key: string
          size: number
          required: boolean
        }[] = []
        const crashedBooleanTasks: {
          projectId: string
          databaseId: string
          collectionId: string
          key: string
          required: boolean
          xdefault?: boolean
        }[] = []
        const crashedNumberTasks: {
          projectId: string
          databaseId: string
          collectionId: string
          key: string
          required: boolean
        }[] = []
        for (let i = 0; i < collections.length; i++) {
          tasks.Task(async () => {
            const collection = collections[i]
            ul.current?.scrollTo(0, ul.current.scrollHeight)
            this.pushHelpText('Tablo oluşturuluyor: ' + collection.name)
            const { id, name, attributes, description, version } = collection
            const col = await Services.Databases.createCollection(
              AppInfo.Name,
              database.$id,
              id,
              name,
              [],
              false
            )
            this.pushHelpText('Tablo oluşturuldu: ' + col.name)
            ul.current?.scrollTo(0, ul.current.scrollHeight)
            this.pushHelpText(description.tr)
            for (let j = 0; j < attributes.length; j++) {
              const { key, type } = attributes[j]
              switch (type) {
                case 'string':
                  try {
                    console.log(name, key)
                    await Services.Databases.createStringAttribute(
                      AppInfo.Name,
                      database.$id,
                      col.$id,
                      key,
                      attributes[j].size,
                      false
                    )
                    break
                  } catch (error) {
                    console.log(error)
                    crashedStringTasks.push({
                      projectId: AppInfo.Name,
                      databaseId: database.$id,
                      collectionId: col.$id,
                      key: key,
                      size: 256,
                      required: false,
                    })
                    break
                  }
                case 'boolean':
                  try {
                    console.log(name, key)
                    await Services.Databases.createBooleanAttribute(
                      AppInfo.Name,
                      database.$id,
                      col.$id,
                      key,
                      false,
                      key && key.startsWith('is_active') ? true : false
                    )
                    break
                  } catch (error) {
                    console.log(error)
                    crashedBooleanTasks.push({
                      projectId: AppInfo.Name,
                      databaseId: database.$id,
                      collectionId: col.$id,
                      key: key,
                      required: false,
                      xdefault:
                        key && key.startsWith('is_active') ? true : false,
                    })
                    break
                  }
                case 'number':
                  try {
                    console.log(name, key)
                    await Services.Databases.createIntegerAttribute(
                      AppInfo.Name,
                      database.$id,
                      col.$id,
                      key,
                      false
                    )
                    break
                  } catch (error) {
                    console.log(error)
                    crashedNumberTasks.push({
                      projectId: AppInfo.Name,
                      databaseId: database.$id,
                      collectionId: col.$id,
                      key: key,
                      required: false,
                    })
                    break
                  }
              }
            }
          })
          tasks.Wait(2)
        }
        tasks.Wait(1)

        tasks.Task(async () => {
          for (let i = 0; i < crashedStringTasks.length; i++) {
            console.log(crashedStringTasks[i])
            const { projectId, databaseId, collectionId, key, size, required } =
              crashedStringTasks[i]
            await Services.Databases.createStringAttribute(
              projectId,
              databaseId,
              collectionId,
              key,
              size,
              required
            )
          }
        })
        tasks.Wait(1)
        tasks.Task(async () => {
          for (let i = 0; i < crashedBooleanTasks.length; i++) {
            console.log(crashedBooleanTasks[i])
            const {
              projectId,
              databaseId,
              collectionId,
              key,
              required,
              xdefault,
            } = crashedBooleanTasks[i]
            await Services.Databases.createBooleanAttribute(
              projectId,
              databaseId,
              collectionId,
              key,
              required,
              xdefault
            )
          }
        })
        //
        tasks.Wait(1)

        tasks.Task(async () => {
          for (let i = 0; i < crashedNumberTasks.length; i++) {
            console.log(crashedNumberTasks[i])
            const { projectId, databaseId, collectionId, key, required } =
              crashedNumberTasks[i]
            await Services.Databases.createIntegerAttribute(
              projectId,
              databaseId,
              collectionId,
              key,
              required
            )
          }
        })
        tasks.Wait(1)

        tasks.Task(async () => {
          Services.Databases.createDocument(
            AppInfo.Name,
            AppInfo.Database,
            Collections.Parameters,
            nanoid(),
            {
              name: 'version',
              tenant_id: organization.$id,
            }
          )
          Services.Databases.createDocument(
            AppInfo.Name,
            AppInfo.Database,
            Collections.AccountRelation,
            me?.$id,
            {
              account_id: me?.$id,
              tenant_id: organization.$id,
              role: 'admin',
            }
          )
          tasks.Wait(1)
          tasks.Task(async () => {
            await Services.Databases.createDocument(
              AppInfo.Name,
              AppInfo.Database,
              Collections.DatabaseVersion,
              'database_version',
              {
                id: 'database_version',
                version: Database.version,
                is_active: true,
                is_deleted: false,
              }
            )
          })
          tasks.Wait(1)

          Database.collections.forEach((collection) => {
            tasks.Task(async () => {
              await Services.Databases.createDocument(
                AppInfo.Name,
                AppInfo.Database,
                Collections.CollectionVersion,
                nanoid(),
                {
                  id: collection.id,
                  collection_id: collection.id,
                  version: collection.version,
                  is_active: true,
                  is_deleted: false,
                }
              )
            })
            tasks.Wait(1)

            collection.attributes.forEach((attribute) => {
              tasks.Task(async () => {
                await Services.Databases.createDocument(
                  AppInfo.Name,
                  AppInfo.Database,
                  Collections.CollectionAttributeVersion,
                  nanoid(),
                  {
                    id: collection.id + '_a_' + attribute.key,
                    collection_id: collection.id,
                    attribute_id: attribute.key,
                    version: collection.version,
                    is_active: true,
                    is_deleted: false,
                  }
                )
              })
              tasks.Wait(1)
            })
          })
          tasks.Wait(1)

          this.pushHelpText('License Manager oluşturuldu.')
          ul.current?.scrollTo(0, ul.current.scrollHeight)
          this.pushHelpText('Giriş yapılıyor...')
          ul.current?.scrollTo(0, ul.current.scrollHeight)
          Toast.fire({
            icon: 'success',
            title: 'License Manager oluşturuldu',
          })
        })
        tasks.Wait(1)
        tasks.Task(async () => {
          this.navigate('/app/dashboard')
        })
        tasks.Run()
      } catch (error: any) {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: 'Hata Oluştu',
          text: error.message,
          showCloseButton: true,
          closeButtonAriaLabel: 'Tamam',
        })
      }
    }

    return VStack(
      isLoad
        ? Spinner()
        : me == null
        ? UINavigate('/login')
        : ReactView(
            <div>
              <Container>
                <HeaderLabel>License Manager'e hoşgeldiniz</HeaderLabel>
                <TextField
                  placeholder="Organizasyon Adı Giriniz"
                  value={form.organizationName}
                  disabled={clicked}
                  onChange={(e) =>
                    setForm({ ...form, organizationName: e.target.value })
                  }
                />
                {!clicked ? (
                  <Button fullWidth onClick={createDb} variant="contained">
                    İlerle
                  </Button>
                ) : (
                  <ConsoleView ref={ul}>
                    {this.helpTexts.map((item, i) => (
                      <ConsoleText key={i}>{item}</ConsoleText>
                    ))}
                  </ConsoleView>
                )}
              </Container>
            </div>
          )
    ).background(bgImage)
  }
}
