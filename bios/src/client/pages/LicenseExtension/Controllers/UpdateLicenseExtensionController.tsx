import react from 'react'
import {
  ReactView,
  Spinner,
  Text,
  UIController,
  UIViewBuilder,
  VStack,
  dayjs,
  useEffect,
  useNavigate,
  useParams,
  useState,
} from '@tuval/forms'
import ILicenseExtension from '../../../../interfaces/ILicenseExtension'
import removeDollarProperties from '../../../assets/Functions/removeDollarProperties'
import React from 'react'
import {
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from '@mui/material'
import Container from '../../../components/Container'
import LicenseExtension from '../../../../server/hooks/licenseExtension/main'
import {
  DatePicker,
  LocalizationProvider,
  DatePickerProps,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ListIcon from '@mui/icons-material/List'
import AppInfo from '../../../../AppInfo'
import Collections from '../../../../server/core/Collections'
import Swal from 'sweetalert2'
import ICustomer from '../../../../interfaces/ICustomer'
import { ID, Query, Services } from '@realmocean/sdk'
import ILicense from '../../../../interfaces/ILicense'
import License from '../../../../server/hooks/license/main'

// const resetForm: ILicenseExtension.IBase = {
//   customer_name: '',
//   customer_id: '',
//   name: '',
//   id: '',
//   app: '',
//   new_validity_date: '',
//   validity_date: '',
//   is_active: true,
//   is_deleted: false,
// }
// const resetForm: ILicense.IBase = {
//   name: '',
//   customer_id: '',
//   customer_name: '',
//   app: '',
//   start_date: null,
//   licence_type: '',
//   licence_renewal: null,
//   is_active: true,
//   is_deleted: false,
// }
const resetForm: ILicense.IBase & ILicenseExtension.IBase = {
  name: '',
  customer_id: '',
  customer_name: '',
  app: '',
  start_date: null,
  licence_type: '',
  licence_renewal: null,
  is_active: true,
  is_deleted: false,
  validity_date: null,
  new_validity_date: null,
}
export class UpdateLicenseExtensionController extends UIController {
  public LoadView() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { license, isLoading } = License.Get(id)
    const { updateLicense } = License.Update()

    return isLoading
      ? VStack(Spinner())
      : UIViewBuilder(() => {
          const [form, setForm] = useState(resetForm)
          // useEffect(() => {
          //   setForm(removeDollarProperties(license))
          //   console.log(removeDollarProperties(license))
          // }, [])
          useEffect(() => {
            if (license) {
              const updatedLicense = removeDollarProperties(license)
              const start_date = updatedLicense.licence_renewal
                ? new Date(updatedLicense.licence_renewal)
                : null
              const licence_renewal = start_date
                ? new Date(
                    start_date.getFullYear() + 1,
                    start_date.getMonth(),
                    start_date.getDate()
                  )
                : null
              updatedLicense.start_date = start_date
              updatedLicense.licence_renewal = licence_renewal
              console.log(removeDollarProperties(license))
              setForm(removeDollarProperties(updatedLicense))
              //   setForm(removeDollarProperties(license))
            }
          }, [])

          // const handleChange = (e: SelectChangeEvent<string>) => {
          //   const { name, value } = e.target
          //   setForm({
          //     ...form,
          //     [name]: value,
          //   })
          // }
          // const handleInputChange = (
          //   e: React.ChangeEvent<HTMLInputElement>
          // ) => {
          //   const { name, value } = e.target
          //   setForm({
          //     ...form,
          //     [name]: value,
          //   })
          // }
          const handleValidityDate = (date: Date | null) => {
            if (date) {
              const newDate = new Date(date)
              newDate.setFullYear(date.getFullYear() + 1)
              setForm({
                ...form,
                start_date: (date as any) || null,
                licence_renewal: (newDate as any) || null,
              })
            }
          }

          const handleDate = (fieldName: string, date: Date | null) => {
            setForm({
              ...form,
              [fieldName]: date,
            })
          }

          const [customers, setCustomers] = useState<ICustomer.IBase[]>([])
          useEffect(() => {
            Services.Databases.listDocuments(
              AppInfo.Name,
              AppInfo.Database,
              Collections.Customer,
              [Query.limit(1000)]
            ).then((documents) => setCustomers(documents.documents as any))
          }, [])

          const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            console.log('Form Verileri', form)

            const data = {
              customer_id: form.customer_id,
              customer_name: form.customer_name,
              app: form.app,
              validity_date: form.start_date,
              new_validity_date: form.licence_renewal,
              is_active: form.is_active,
              is_deleted: form.is_deleted,
            }
            console.log('Data Nesnesi:', data)
            // Update existing license

            updateLicense(
              {
                databaseId: AppInfo.Database,
                collectionId: Collections.License,
                documentId: id,
                data: form,
              },
              async (updateRes) => {
                console.log('License updated', updateRes)

                // Create new license extension
                try {
                  const uniqueId = ID.unique()
                  const createRes = await Services.Databases.createDocument(
                    AppInfo.Name,
                    AppInfo.Database,
                    'licence-extension',
                    uniqueId,
                    {
                      customer_id: form.customer_id,
                      customer_name: form.customer_name,
                      app: form.app,
                      validity_date: form.start_date,
                      new_validity_date: form.licence_renewal,
                      // licence_type: form.licence_type,
                      // is_active: form.is_active,
                      // is_deleted: form.is_deleted,
                    }
                  )
                  console.log('License extension created', createRes)

                  Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Lisans uzatma başarıyla oluşturuldu ve lisans güncellendi!',
                    confirmButtonText: 'OK',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      navigate('/app/license/list')
                    }
                  })
                } catch (error) {
                  console.error('Error creating license extension:', error)
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Bir şeyler yanlış gitti.',
                    confirmButtonText: 'OK',
                  })
                }
              }
            )
          }

          return ReactView(
            <Container>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="tr"
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    justifyContent: 'center',
                  }}
                >
                  <form
                    onSubmit={onSubmit}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      marginTop: '50px',
                      width: '400px',
                    }}
                  >
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        LİSANS UZATMA
                      </h3>
                      <Button
                        variant="contained"
                        startIcon={<ListIcon />}
                        onClick={() => {
                          navigate('/app/license/list')
                        }}
                      >
                        LİSANS LİSTE
                      </Button>
                    </div>
                    <FormControl fullWidth size="small">
                      <InputLabel>Müşteri Adı</InputLabel>
                      <Select
                        name="customer_name"
                        sx={{ backgroundColor: 'white' }}
                        value={form.customer_name}
                        // onChange={handleChange}
                        label="Müşteri Adı"
                        size="small"
                        inputProps={{ readOnly: true }}
                      >
                        {customers.map((customer) => (
                          <MenuItem value={customer.name}>
                            {customer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      sx={{ backgroundColor: 'white' }}
                      label="Uygulamalar:"
                      name="app"
                      type="name"
                      value={form.app}
                      // onChange={handleInputChange}
                      size="small"
                      fullWidth
                      inputProps={{ readOnly: true }}
                    />

                    <DatePicker
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: 'small',
                          required: true,
                          id: 'start_date',
                        },
                      }}
                      value={dayjs(form.start_date)}
                      onChange={(date: any) => handleValidityDate(date.$d)}
                      label="MEVCUT LİSANS GEÇERLİLİK TARİHİ:"
                      sx={{
                        backgroundColor: 'white',
                        width: '100%',
                      }}
                    />

                    <DatePicker
                      format="DD-MM-YYYY"
                      slotProps={{
                        textField: {
                          size: 'small',
                          required: true,
                          id: 'licence_renewal',
                          // disabled: true,
                        },
                      }}
                      label="YENİ LİSANS GEÇERLİLİK TARİHİ:"
                      sx={{
                        backgroundColor: 'white',
                        width: '100%',
                      }}
                      value={dayjs(form.licence_renewal)}
                      onChange={(date: any) => {
                        handleDate('licence_renewal', date)
                      }}
                    />

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '20px',
                      }}
                    >
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<ListIcon />}
                        onClick={() => {
                          navigate('/app/license/list')
                        }}
                        style={{ marginRight: '10px' }}
                      >
                        İptal
                      </Button>
                      <Button variant="contained" type="submit">
                        Seçimi Kaydet
                      </Button>
                    </div>
                  </form>
                </div>
              </LocalizationProvider>
            </Container>
          )
        })
  }
}
