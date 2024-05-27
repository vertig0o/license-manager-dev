import react from 'react'
import {
  ReactView,
  Spinner,
  Text,
  UIController,
  UIViewBuilder,
  VStack,
  useEffect,
  useNavigate,
  useParams,
  useState,
} from '@tuval/forms'
import Customer from '../../../../server/hooks/customer/main'
import Container from '../../../components/Container'
import removeDollarProperties from '../../../assets/Functions/removeDollarProperties'
import ICustomer from '../../../../interfaces/ICustomer'
import React from 'react'
import {
  Button,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from '@mui/material'
import ListIcon from '@mui/icons-material/List'
import AppInfo from '../../../../AppInfo'
import Collections from '../../../../server/core/Collections'
import Swal from 'sweetalert2'

const resetForm: ICustomer.IBase = {
  name: '',
  manager_email: '',
  manager_name: '',
  is_active: true,
  is_deleted: false,
}

export class UpdateCustomerController extends UIController {
  public LoadView() {
    const navigate = useNavigate()
    const { id } = useParams()
    const { customer, isLoading } = Customer.Get(id)
    const { updateCustomer } = Customer.Update()

    return isLoading
      ? VStack(Spinner())
      : UIViewBuilder(() => {
          const [form, setForm] = useState(resetForm)
          useEffect(() => {
            setForm(removeDollarProperties(customer))
            console.log(removeDollarProperties(customer))
          }, [])

          const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target
            setForm({
              ...form,
              [name]: value,
            })
          }
          const handleSwitchChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const { name, checked } = e.target
            setForm({
              ...form,
              [name]: checked,
            })
          }
          const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            updateCustomer(
              {
                databaseId: AppInfo.Database,
                collectionId: Collections.Customer,
                documentId: id,
                data: form,
              },
              (data) => {
                console.log('güncellendi', data)
                Swal.fire({
                  icon: 'success',
                  title: 'Başarılı!',
                  text: 'Müşteri bilgileri başarıyla güncellendi.',
                })
                  .then(() => {
                    navigate('/app/customer/list')
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
              }
            )
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
                      MÜŞTERİ GÜNCELLEME
                    </h3>
                  </div>

                  <TextField
                    sx={{ backgroundColor: 'white' }}
                    label="Müşteri Adı"
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />

                  <TextField
                    sx={{ backgroundColor: 'white' }}
                    label="Müşteri Sorumlusu Ad-Soyad:"
                    required
                    name="manager_name"
                    value={form.manager_name}
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
                    value={form.manager_email}
                    onChange={handleChange}
                    size="small"
                    fullWidth
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        name="is_active"
                        id="is_active"
                        checked={form.is_active}
                        onChange={handleSwitchChange}
                      />
                    }
                    label={handleSwitchChange ? 'Aktif' : 'Pasif'}
                  />
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<ListIcon />}
                      onClick={() => {
                        navigate('/app/customer/list')
                      }}
                      style={{ marginRight: '10px' }}
                    >
                      İptal
                    </Button>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                      }}
                    >
                      Seçimi Kaydet
                    </button>
                  </div>
                </form>
              </div>
            </Container>
          )
        })
  }
}
