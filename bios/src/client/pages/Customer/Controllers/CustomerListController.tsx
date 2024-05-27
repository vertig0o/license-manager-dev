import React, { ReactNode, useEffect, useState } from 'react'
import {
  ReactView,
  UIController,
  UIView,
  nanoid,
  useNavigate,
} from '@tuval/forms'
import {
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  TablePagination,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridTreeNodeWithRender,
  trTR,
} from '@mui/x-data-grid'
import { Query, Services } from '@realmocean/sdk'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterAlt as FilterAltIcon,
} from '@mui/icons-material'
// import FilterAltIcon from '@mui/icons-material/FilterAlt'
import AppInfo from '../../../../AppInfo'
import Swal from 'sweetalert2'

export class CustomerListController extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()
    const handleButtonCLick = () => {
      navigate('/app/customer/create')
    }

    const [customers, setCustomers] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [isActiveFilter, setIsActiveFilter] = useState(true)

    useEffect(() => {
      Services.Databases.listDocuments(
        AppInfo.Name,
        AppInfo.Database,
        'customer',
        [Query.limit(10000)]
      ).then((res) => {
        setCustomers(res.documents)
      })
    }, [])

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    }

    const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const columns: GridColDef[] = [
      {
        field: 'name',
        headerName: 'MÜŞTERİ ADI',
        flex: 1,
      },
      {
        field: 'manager_name',
        headerName: 'MÜŞTERİ SORUMLUSU AD-SOYAD',
        flex: 1,
      },
      {
        field: 'manager_email',
        headerName: 'MÜŞTERİ SORUMLUSU EMAİL',

        flex: 1,
      },
      {
        field: 'is_active',
        headerName: 'DURUM',

        flex: 1,
        renderCell: (params: GridRenderCellParams<any, any>): ReactNode => (
          <div>
            {params.value ? (
              <Typography style={{ color: 'green' }}>Aktif</Typography>
            ) : (
              <Typography style={{ color: 'red' }}>Pasif</Typography>
            )}
          </div>
        ),
      },
      {
        field: 'actions',
        headerName: 'İŞLEMLER',
        flex: 1,
        renderCell: (params) => (
          <div>
            <IconButton
              onClick={() => {
                navigate('/app/customer/' + params.row.$id)
              }}
              size="small"
              color="primary"
              style={{ marginRight: 10 }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              onClick={() => handleDelete(params.row.$id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ]

    const handleDelete = (customerId: string) => {
      Swal.fire({
        title: 'Emin Misin?',
        text: 'Bunu geri döndüremezsiniz!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Hayır',
        confirmButtonText: 'Evet, sil!',
      }).then((result) => {
        if (result.isConfirmed) {
          Services.Databases.deleteDocument(
            AppInfo.Name,
            AppInfo.Database,
            'customer',
            customerId
          )
            .then(() => {
              setCustomers(
                customers.filter((customer) => customer.$id !== customerId)
              )
              Swal.fire({
                title: 'Silindi!',
                text: 'Seçili eleman silindi.',
                icon: 'success',
              })
            })
            .catch((error) => {
              console.error('Silme işlemi başarısız oldu:', error)
              Swal.fire({
                title: 'Error!',
                text: 'An error occurred while deleting the file.',
                icon: 'error',
              })
            })
        }
      })
    }

    return ReactView(
      <div
        style={{
          backgroundColor: 'rgb(191 207 231 / 30%)',
          padding: '20px',
          height: '100%',
        }}
      >
        <Container maxWidth={false}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}
          >
            <Typography variant="h5" style={{ fontWeight: 'bold' }}>
              Müşteri Listesi
            </Typography>
            <TextField
              variant="outlined"
              placeholder="Müşteri Ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ width: '40%', backgroundColor: 'white' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <div>
              <IconButton
                aria-label="filterAltIcon"
                onClick={() => setIsActiveFilter(!isActiveFilter)}
                style={{ marginLeft: '10px' }}
              >
                <FilterAltIcon />
              </IconButton>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleButtonCLick}
                style={{ marginLeft: '10px' }}
              >
                Müşteri Ekle
              </Button>
            </div>
          </div>

          <DataGrid
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            columns={columns}
            rows={filteredCustomers.filter(
              (x) => x.is_active == isActiveFilter
            )}
            getRowId={(x) => x.$id}
            sx={{ height: 'calc(100vh - 200px)', backgroundColor: 'white' }}
          />
        </Container>
      </div>
    )
  }
}
