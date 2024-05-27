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
  TextField,
  InputAdornment,
  Typography,
  IconButton,
} from '@mui/material'
import { Query, Services } from '@realmocean/sdk'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterAlt as FilterAltIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material'
import AppInfo from '../../../../AppInfo'
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  trTR,
} from '@mui/x-data-grid'
import Swal from 'sweetalert2'
import Collections from '../../../../server/core/Collections'
import ILicenseExtension from '../../../../interfaces/ILicenseExtension'

export class LicenseListController extends UIController {
  public LoadView(): UIView {
    const navigate = useNavigate()
    const [licences, setLicences] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0) // Sayfa numarası state'i ekleniyor
    const [rowsPerPage, setRowsPerPage] = useState(5) // Sayfa başına satır sayısı state'i ekleniyor
    const [isActiveFilter, setIsActiveFilter] = useState(true)

    useEffect(() => {
      Services.Databases.listDocuments(
        AppInfo.Name,
        AppInfo.Database,
        'licence',
        [Query.limit(10000)]
      ).then((res) => {
        Services.Databases.listDocuments(
          AppInfo.Name,
          AppInfo.Database,
          'licence-extension',
          [Query.limit(10000)]
        ).then((res2) => {
          for (let i = 0; i < res.documents.length; i++) {
            let newVal = res.documents[i].new_validity_date
            for (let i2 = 0; i2 < res2.documents.length; i2++) {
              if (
                !!res2.documents[i2].new_validity_date &&
                res2.documents[i2].customer_id ==
                  res.documents[i].customer_id &&
                res2.documents[i2].app == res.documents[i].app &&
                (!newVal ||
                  new Date(newVal) <
                    new Date(res2.documents[i2].new_validity_date))
              ) {
                newVal = res2.documents[i2].new_validity_date
              }
            }
            res.documents[i].new_validity_date = newVal
          }
          setLicences(res.documents)
        })
      })
    }, [])

    const handleButtonCLick = () => {
      navigate('/app/license/create')
    }

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage)
    }
    const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setRowsPerPage(parseInt(event.target.value, 10))
      setPage(0)
    }
    const filteredLicences = licences.filter(
      (licence) =>
        licence.customer_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (isActiveFilter ? licence.is_active : true)
    )

    const columns: GridColDef[] = [
      { field: 'customer_name', headerName: 'MÜŞTERİ', flex: 1 },
      {
        field: 'app',
        headerName: 'UYGULAMA',
        flex: 1,
      },
      {
        field: 'licence_type',
        headerName: 'LİSANS TÜRÜ',
        flex: 1,
      },
      {
        field: 'start_date',
        headerName: 'LİSANS BAŞLAMA TARİHİ',
        flex: 1,
        valueGetter: (params) => {
          return new Date(params.value).toLocaleDateString('tr-TR')
        },
      },
      {
        field: 'licence_renewal',
        headerName: 'LiSANS GEÇERLİLİK TARİHİ',
        flex: 1,
        valueGetter: (params) => {
          return new Date(params.value).toLocaleDateString('tr-TR')
        },
      },
      // {
      //   field: 'new_validity_date',
      //   headerName: 'LİSANS GEÇERLİLİK TARİHİ',
      //   flex: 1,
      //   valueGetter: (params) => {
      //     return new Date(params.value).toLocaleDateString('tr-TR')
      //   },
      // },

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
                navigate('/app/license-extension/' + params.row.$id)
              }}
              size="small"
              color="primary"
            >
              <DescriptionIcon />
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
            'licence',
            customerId
          )
            .then(() => {
              setLicences(
                licences.filter((licences) => licences.$id !== customerId)
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
              Lisans Listesi
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
                Yeni Lisans Ekle
              </Button>
            </div>
          </div>

          <DataGrid
            localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
            columns={columns}
            rows={filteredLicences.filter((x) => x.is_active == isActiveFilter)}
            getRowId={(x) => x.$id}
            sx={{ height: '700px', backgroundColor: 'white' }}
          />
        </Container>
      </div>
    )
  }
}
