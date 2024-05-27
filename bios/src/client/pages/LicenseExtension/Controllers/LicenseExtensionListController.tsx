import React, { useEffect, useState } from 'react'
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
  TextField,
  InputAdornment,
  Typography,
  IconButton,
  TablePagination,
} from '@mui/material'
import { Query, Services } from '@realmocean/sdk'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'
import AppInfo from '../../../../AppInfo'
import { DataGrid, trTR } from '@mui/x-data-grid'
import Swal from 'sweetalert2'
import Collections from '../../../../server/core/Collections'
import ILicense from '../../../../interfaces/ILicense'

export class LicenseExtensionListController extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()
    const handleButtonCLick = () => {
      navigate('/app/license-extension/create')
    }

    const [licenceExtension, setLicenceExtension] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0) // Sayfa numarası state'i ekleniyor
    const [rowsPerPage, setRowsPerPage] = useState(5) // Sayfa başına satır sayısı state'i ekleniyor

    useEffect(() => {
      Services.Databases.listDocuments(
        AppInfo.Name,
        AppInfo.Database,
        'licence-extension',
        [Query.limit(10000)]
      ).then((res) => {
        setLicenceExtension(res.documents)
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
    const filteredLicenceExtension = licenceExtension.filter((item) =>
      item.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const columns = [
      { field: 'customer_name', headerName: 'MÜŞTERİ', flex: 1 },
      { field: 'app', headerName: 'UYGULAMA', flex: 1 },
      {
        field: 'validity_date',
        headerName: 'LiSANS BAŞLAMA TARİHİ',
        flex: 1,
        valueGetter: (params) => {
          return new Date(params.value).toLocaleDateString('tr-TR')
        },
      },
      {
        field: 'new_validity_date',
        headerName: ' LiSANS GEÇERLİLİK TARİHİ',
        flex: 1,
        valueGetter: (params) => {
          return new Date(params.value).toLocaleDateString('tr-TR')
        },
      },

      {
        field: 'actions',
        headerName: 'İŞLEMLER',
        flex: 1,
        renderCell: (params) => (
          <div>
            {/* <IconButton
              onClick={() => {
                navigate('/app/license-extension/' + params.row.$id)
              }}
              size="small"
              color="primary"
              style={{ marginRight: 10 }}
            >
              <EditIcon />
            </IconButton> */}
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
            'licence-extension',
            customerId
          )
            .then(() => {
              setLicenceExtension(
                licenceExtension.filter(
                  (licences) => licences.$id !== customerId
                )
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
        style={{ backgroundColor: '#BFCFE7', padding: '20px', height: '100%' }}
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
              Lisans Uzatma Listesi
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleButtonCLick}
              style={{ marginLeft: '10px' }}
            >
              Lisans Uzatma Ekle
            </Button>
          </div>

          <DataGrid
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            columns={columns}
            rows={licenceExtension}
            getRowId={(x) => x.$id}
            sx={{ height: '700px', backgroundColor: 'white' }}
          />
        </Container>
      </div>
    )
  }
}
