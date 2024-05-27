import {
  ReactView,
  UIController,
  UIView,
  dayjs,
  nanoid,
  useNavigate,
} from '@tuval/forms'
import React, { useEffect, useState } from 'react'
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import ListIcon from '@mui/icons-material/List'
import { Query, Services } from '@realmocean/sdk'
import AppInfo from '../../../../AppInfo'
import Container from '../../../components/Container'
import Swal from 'sweetalert2'
import ILicenseExtension from '../../../../interfaces/ILicenseExtension'
import Collections from '../../../../server/core/Collections'
import ICustomer from '../../../../interfaces/ICustomer'

const resetForm: ILicenseExtension.ICreate = {
  customer_name: '',
  id: '',
  customer_id: '',
  app: '',
  validity_date: null,
  new_validity_date: null,
}

export class CreateLicenseExtensionController extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()
    const handleButtonCLick = () => {
      navigate('/app/license-extension/list')
    }
    const [licenceExtension, SetLicenceExtension] = useState(resetForm)

    const [customers, setCustomers] = useState<ICustomer.IBase[]>([])
    useEffect(() => {
      Services.Databases.listDocuments(
        AppInfo.Name,
        AppInfo.Database,
        Collections.Customer,
        [Query.limit(1000)]
      ).then((documents) => setCustomers(documents.documents as any))
    }, [])

    const handleChange = (e: SelectChangeEvent<string>) => {
      const { name, value } = e.target
      SetLicenceExtension({
        ...licenceExtension,
        [name]: value,
      })
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      SetLicenceExtension({
        ...licenceExtension,
        [name]: value,
      })
    }
    const handleValidityDate = (date: any | null) => {
      var newDate = new Date(Date.parse(date))
      newDate.setFullYear(newDate.getFullYear() + 1)

      SetLicenceExtension({
        ...licenceExtension,
        validity_date: (dayjs(date) as any) || null,
        new_validity_date: (dayjs(newDate) as any) || null,
      })
    }

    const handleDate = (fieldName: string, date: any | null) => {
      SetLicenceExtension({
        ...licenceExtension,
        [fieldName]: date || null,
      })
    }

    const handleCancel = () => {
      SetLicenceExtension(resetForm)
    }
    const handleSave = async (e) => {
      e.preventDefault()
      Services.Databases.createDocument(
        AppInfo.Name,
        AppInfo.Database,
        'licence-extension',
        nanoid(),
        {
          customer_id: licenceExtension.customer_id,
          customer_name: customers.find(
            (x) => x.$id === licenceExtension.customer_id
          ).name,
          app: licenceExtension.app,
          validity_date: licenceExtension.validity_date,
          new_validity_date: licenceExtension.new_validity_date,
        }
      )
        .then(async (res) => {
          console.log(res)
          // Display SweetAlert2 success popup
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Lisans  Uzatma Başarı ile Kayıt Edildi!',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('OK button clicked')
            }
          })
        })
        .catch((error) => {
          console.error('Error creating customer:', error)
          // Display SweetAlert2 error popup if creation fails
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Birşeyler Yanlış Gitti',
            confirmButtonText: 'OK',
          })
        })
      const listCustomer = await Services.Databases.listDocuments(
        AppInfo.Name,
        AppInfo.Database,
        'licence-extension',
        [Query.limit(10000)]
      )
      console.log(listCustomer)
    }

    return ReactView(
      <Container>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="tr">
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            <form
              onSubmit={handleSave}
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
                  Lisans Uzatma yaratma
                </h3>
                <Button
                  variant="contained"
                  startIcon={<ListIcon />}
                  onClick={handleButtonCLick}
                >
                  Lisans Uzatma Listesi
                </Button>
              </div>
              <FormControl fullWidth size="small">
                <InputLabel>Müşteri Adı</InputLabel>
                <Select
                  name="customer_id"
                  sx={{ backgroundColor: 'white' }}
                  value={licenceExtension.customer_id}
                  onChange={handleChange}
                  required
                  size="small"
                  label="Müşteri Adı"
                >
                  {customers.map((customer, i) => (
                    <MenuItem value={customer.$id} key={i}>
                      {customer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                sx={{ backgroundColor: 'white' }}
                label="Uygulamalar:"
                required
                name="app"
                type="name"
                value={licenceExtension.app}
                onChange={handleTextChange}
                size="small"
                fullWidth
              />

              <DatePicker
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    required: true,
                    id: 'validity_date',
                  },
                }}
                label="MEVCUT LİSANS GEÇERLİLİK TARİHİ:"
                sx={{
                  backgroundColor: 'white',
                  width: '100%',
                }}
                value={licenceExtension.validity_date}
                onChange={(date: any) => handleValidityDate(date.$d)}
              />

              <DatePicker
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    size: 'small',
                    id: 'new_validity_date',
                  },
                }}
                label="YENİ LİSANS GEÇERLİLİK TARİHİ:"
                sx={{
                  backgroundColor: 'white',
                  width: '100%',
                }}
                value={licenceExtension.new_validity_date}
                onChange={(date: any) => handleDate('new_validity_date', date)}
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
                  onClick={handleCancel}
                  style={{ marginRight: '10px' }}
                >
                  Seçimi İptal Et
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
  }
}
