import React, { useState } from 'react'
import {
  ReactView,
  UIController,
  UIView,
  nanoid,
  useNavigate,
} from '@tuval/forms'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { Button, FormControl, InputLabel, Link } from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import TextField from '@mui/material/TextField'
import { Query, Services } from '@realmocean/sdk'
import Container from '../../../components/Container'
import AppInfo from '../../../../AppInfo'
//import Database from '../../server/core/database'
import Swal from 'sweetalert2'
import ICustomer from '../../../../interfaces/ICustomer'

const resetForm: ICustomer.ICreate = {
  manager_email: '',
  manager_name: '',
  name: '',
  is_active: true,
}

export class CreateCustomer extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()
    const handleButtonCLick = () => {
      navigate('/app/customer/list')
    }

    const [customer, setCustomer] = useState(resetForm)

    const handleCancel = () => {
      setCustomer(resetForm)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setCustomer({
        ...customer,
        [name]: value,
      })
    }
    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = e.target
      setCustomer({
        ...customer,
        [name]: checked,
      })
    }
    const handleSave = async (e) => {
      e.preventDefault()
      Services.Databases.createDocument(
        AppInfo.Name,
        AppInfo.Database,
        'customer',
        nanoid(),
        {
          name: customer.name,
          manager_name: customer.manager_name,
          manager_email: customer.manager_email,
          is_active: customer.is_active,
        }
      )
        .then(async (res) => {
          console.log(res)
          // Display SweetAlert2 success popup
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Müşteri Başarı ile Kayıt Edildi!',
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
        'customer',
        [Query.limit(10000)]
      )
      console.log(listCustomer)
    }

    return ReactView(
      <Container>
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
                MÜŞTERİ TANIMLAMA
              </h3>
              <Button
                variant="contained"
                startIcon={<ListIcon />}
                onClick={handleButtonCLick}
              >
                Müşteri Listesi
              </Button>
            </div>

            <TextField
              sx={{ backgroundColor: 'white' }}
              label="Müşteri Adı"
              required
              name="name"
              value={customer.name}
              onChange={handleChange}
              size="small"
              fullWidth
            />

            <TextField
              sx={{ backgroundColor: 'white' }}
              label="Müşteri Sorumlusu Ad-Soyad:"
              required
              name="manager_name"
              value={customer.manager_name}
              onChange={handleChange}
              size="small"
              fullWidth
            />

            <TextField
              sx={{ backgroundColor: 'white' }}
              label="Müşteri Sorumlusu Email:"
              required
              type="email"
              name="manager_email"
              value={customer.manager_email}
              onChange={handleChange}
              size="small"
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  name="is_active"
                  id="is_active"
                  checked={customer.is_active}
                  onChange={handleSwitchChange}
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
      </Container>
    )
  }
}
