import React, { useEffect, useState } from 'react'
import {
  ReactView,
  UIController,
  UIView,
  dayjs,
  nanoid,
  useNavigate,
} from '@tuval/forms'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import 'dayjs/locale/tr'
import ListIcon from '@mui/icons-material/List'
import {
  FormControl,
  InputLabel,
  TextField,
  Switch,
  Button,
  FormControlLabel,
} from '@mui/material'
import Swal from 'sweetalert2'
import { Query, Services } from '@realmocean/sdk'
import AppInfo from '../../../../AppInfo'
import Container from '../../../components/Container'
import ILicense from '../../../../interfaces/ILicense'
import ICustomer from '../../../../interfaces/ICustomer'
import Collections from '../../../../server/core/Collections'

const resetForm: ILicense.ICreate = {
  name: '',
  customer_name: '',
  customer_id: '',
  id: '',
  app: '',
  start_date: null,
  licence_type: '',
  licence_renewal: null,
  licence_renewal_type: null,
  is_active: true,
}

export class CreateLicenseController extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()
    const handleButtonCLick = () => {
      navigate('/app/license/list')
    }

    const [license, setLicense] = useState(resetForm)
    const [customers, setCustomers] = useState<ICustomer.IBase[]>([])
    const [hireSelected, setHireSelected] = useState(false)
    const [selectedApps, setSelectedApps] = useState<string[]>([])

    useEffect(() => {
      Services.Databases.listDocuments(
        AppInfo.Name,
        AppInfo.Database,
        Collections.Customer,
        [Query.limit(1000)]
      ).then((documents) => setCustomers(documents.documents as any))
    }, [])

    // const handleChange = (e: SelectChangeEvent<string>) => {
    //   const { name, value } = e.target

    //   if (name === 'licence_type' && value === 'Kiralama') {
    //     setHireSelected(true)
    //   } else if (name === 'licence_renewal') {
    //     setHireSelected(true) // "licence_renewal" seçeneği seçildiğinde de "hireSelected" durumunu true yap
    //   } else {
    //     setHireSelected(false)
    //   }

    //   setLicense({
    //     ...license,
    //     [name]: value,
    //   })
    // }

    const calcRenewalDate = (name, value) => {
      const newState = { ...license, [name]: value }
      let startDate = name === 'start_date' ? value : license.start_date
      let renewal_type =
        name === 'licence_renewal_type' ? value : license.licence_renewal_type
      let type = name === 'licence_type' ? value : license.licence_type
      if (
        (type === 'Kiralama' ? renewal_type !== null : type !== null) &&
        startDate !== null
      ) {
        let sayi = 1
        if (type === 'Kiralama')
          if (renewal_type === '6 AYLIK') {
            sayi = 6
          } else if (renewal_type === '3 AYLIK') {
            sayi = 3
          }
        newState.licence_renewal = dayjs(startDate)
          .add(
            sayi,
            renewal_type === 'YILLIK' || type !== 'Kiralama' ? 'year' : 'month'
          )
          .toDate() as any
      } else {
        newState.licence_renewal = null
      }
      setLicense(newState)
    }

    const handleChange = (e: SelectChangeEvent<string>) => {
      const { name, value } = e.target

      if (name === 'licence_renewal_type' || name === 'licence_type') {
        if (name === 'licence_type') {
          if (value === 'Kiralama') setHireSelected(true)
          else setHireSelected(false)
        }
        calcRenewalDate(name, value)
      } else {
        const newState = { ...license, [name]: value }
        setLicense(newState)
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setLicense({
        ...license,
        [name]: value,
      })
    }

    const handleDate = (fieldName: string, date: any | null) => {
      if (fieldName === 'start_date') {
        calcRenewalDate(fieldName, date)
      } else
        setLicense({
          ...license,
          [fieldName]: date || null,
        })
    }
    // const handleRenewal = (fieldName: string, date: any | null) => {
    //   var newDate = new Date(Date.parse(date))
    //   newDate.setFullYear(newDate.getFullYear() + 1)
    //   newDate.setMonth(newDate.getMonth() + 6)
    //   newDate.setMonth(newDate.getMonth() + 1)
    //   newDate.setMonth(newDate.getMonth() + 3)
    //   setLicense({
    //     ...license,
    //     start_date: (dayjs(date) as any) || null,
    //     licence_renewal: (dayjs(newDate) as any) || null,
    //   })
    // }

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target
      setLicense({
        ...license,
        [name]: checked,
      })
    }

    const handleCancel = () => {
      setLicense(resetForm)
    }

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const existingLicenses = await Services.Databases.listDocuments(
        AppInfo.Name,
        AppInfo.Database,
        'licence',
        [
          Query.equal('customer_id', license.customer_id),
          Query.equal('app', license.app),
        ]
      )
      // Aynı müşteri ve uygulama için mevcut lisans var mı kontrolü
      if (existingLicenses.total > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Hata',
          text: 'Bu müşteri için bu uygulama zaten seçilmiş',
          confirmButtonText: 'Tamam',
        })
        return
      }

      Services.Databases.createDocument(
        AppInfo.Name,
        AppInfo.Database,
        'licence',
        nanoid(),
        {
          customer_id: license.customer_id,
          customer_name: customers.find((x) => x.$id === license.customer_id)
            .name,
          app: license.app,
          licence_type: license.licence_type,
          start_date: license.start_date,
          licence_renewal: license.licence_renewal,
          is_active: license.is_active,
        }
      )
        .then(async (res) => {
          console.log(res)
          // Display SweetAlert2 success popup
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Lisans Başarı ile Kayıt Edildi!',
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
        'licence',
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
                  LİSANS TANIMLAMA
                </h3>
                <Button
                  variant="contained"
                  startIcon={<ListIcon />}
                  onClick={handleButtonCLick}
                >
                  LİSANS TANIMLAMA LİSTESİ
                </Button>
              </div>

              <FormControl fullWidth size="small">
                <InputLabel>Müşteri Adı</InputLabel>
                <Select
                  name="customer_id"
                  sx={{ backgroundColor: 'white' }}
                  value={license.customer_id}
                  onChange={handleChange}
                  label="Müşteri Adı"
                  size="small"
                  required
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
                label="Uygulamalar"
                required
                name="app"
                type="name"
                value={license.app}
                onChange={handleInputChange}
                size="small"
                fullWidth
              />
              <FormControl fullWidth size="small">
                <InputLabel>Lisans Türü</InputLabel>
                <Select
                  // id="licence_type"
                  name="licence_type"
                  sx={{ backgroundColor: 'white' }}
                  value={license.licence_type}
                  onChange={handleChange}
                  size="small"
                  label="Lisans Türü"
                  required
                >
                  {/* <MenuItem value="">Lisans Türü</MenuItem> */}
                  <MenuItem value="Kiralama">Kiralama</MenuItem>
                  <MenuItem value="Satınalma">Satınalma</MenuItem>
                </Select>
              </FormControl>

              <FormControl>
                <DatePicker
                  slotProps={{
                    textField: {
                      size: 'small',
                      required: true,
                      id: 'start_date',
                    },
                  }}
                  label="LİSANS BAŞLAMA TARİHİ"
                  sx={{
                    backgroundColor: 'white',
                  }}
                  value={license.start_date}
                  onChange={(date: any) => handleDate('start_date', date.$d)}
                />
              </FormControl>

              {/*Kiralama Durumunda Aktif  */}
              {hireSelected && (
                <FormControl fullWidth size="small">
                  <InputLabel>LİSANS YENİLEME PERİYODU</InputLabel>
                  <Select
                    name="licence_renewal_type"
                    sx={{ backgroundColor: 'white' }}
                    value={license.licence_renewal_type}
                    onChange={handleChange}
                    //displayEmpty
                    label="LİSANS YENİLEME PERİYODU"
                    required
                  >
                    <MenuItem value="YILLIK">YILLIK</MenuItem>
                    <MenuItem value="6 AYLIK">6 AYLIK</MenuItem>
                    <MenuItem value="3 AYLIK">3 AYLIK</MenuItem>
                    <MenuItem value="AYLIK">AYLIK</MenuItem>
                  </Select>
                </FormControl>
              )}

              <FormControlLabel
                control={
                  <Switch
                    name="is_active"
                    id="is_active"
                    checked={license.is_active}
                    onChange={handleChange}
                  />
                }
                label={handleSwitchChange ? 'Aktif' : 'Pasif'}
              />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
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
