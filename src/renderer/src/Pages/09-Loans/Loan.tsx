import Header from '@renderer/components/Header/Header'
import decrypt from '@renderer/components/Helper/Helper'
import axios from 'axios'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { FilterMatchMode } from 'primereact/api'
import CustomerInputsUpdate from '@renderer/components/CustomerInputs/CustomerInputsUpdate'
import { Button } from 'primereact/button'
import CustomerInputNew from '@renderer/components/CustomerInputs/CustomerInputNew'
import Addnewloan from '@renderer/components/Addnewloan/Addnewloan'

const Loan = () => {
  const [userLists, setUserLists] = useState([])

  const [username, setUsername] = useState('')

  const [loadingStatus, setLoadingStatus] = useState(true)

  const loadData = () => {
    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + '/adminRoutes/getPersonList',
          {
            roleId: 3
          },
          {
            headers: {
              Authorization: localStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          }
        )
        .then((response: any) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          )

          console.log(data)

          if (data.success) {
            setLoadingStatus(false)
            setUsername(data.name[0].refUserFname + ' ' + data.name[0].refUserLname)
            setUserLists(data.data)
            console.log(data.data)
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const AddressBody = (rowData: any) => {
    return (
      <>
        {rowData.refUserAddress}, {rowData.refUserDistrict}, {rowData.refUserState} -{' '}
        {rowData.refUserPincode}
      </>
    )
  }

  const StatusBody = (rowData: any) => {
    return (
      <>
        {rowData.refActiveStatus === 'active' ? (
          <div
            style={{
              padding: '5px',
              backgroundColor: '#00b600',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '0.8rem',
              textAlign: 'center'
            }}
          >
            Active
          </div>
        ) : (
          <div
            style={{
              padding: '5px',
              backgroundColor: '#f95f5f',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '0.8rem',
              textAlign: 'center'
            }}
          >
            Inactive
          </div>
        )}
      </>
    )
  }

  const CustomerId = (rowData: any) => {
    return (
      <>
        <div
          onClick={() => {
            setUpdateData(true)
            setUserDetailsLoadData(rowData)
            setUpdateUserId({ id: rowData.refUserId, custId: rowData.refCustId })
          }}
          style={{ color: '#f95005', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {rowData.refCustId}
        </div>
      </>
    )
  }

  const [newData, setNewData] = useState(false)

  const [updateData, setUpdateData] = useState(false)
  const [userDetailsLoanData, setUserDetailsLoadData] = useState('')
  const [updateUserId, setUpdateUserId] = useState({
    id: '',
    custId: ''
  })

  const closeSidebarUpdate = () => {
    setUpdateData(false)
    loadData()
  }

  const closeSidebarNew = () => {
    setNewData(false)
    loadData()
  }

  //   Filter Data - Start

  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  })

  const [globalFilterValue, setGlobalFilterValue] = useState('')

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }

    _filters['global'].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  //Filter Data - End

  return (
    <>
      <ToastContainer />
      <Header userName={username} pageName={'Loan'} />
      {loadingStatus ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#f95005',
            height: '92vh',
            width: '100%'
          }}
        >
          <i className="pi pi-spin pi-spinner" style={{ fontSize: '5rem' }}></i>
        </div>
      ) : (
        <div className="contentPage">
          {/* New User Button - Start */}

          {/* <Button label="New Loan" onClick={() => { setNewData(true) }} /> */}

          {/* New User Button - End */}

          {/* Search Input - Start */}
          <div
            style={{
              width: '100%',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
            <IconField style={{ width: '30%' }} iconPosition="left">
              <InputIcon className="pi pi-search"></InputIcon>
              <InputText
                placeholder="Search Customers"
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
              />
            </IconField>
          </div>
          {/* Search Input - End */}

          {/* Datatable - Start */}

          <div>
            <DataTable
              filters={filters}
              paginator
              rows={5}
              value={userLists}
              showGridlines
              scrollable
              emptyMessage={<div style={{ textAlign: 'center' }}>No Records Found</div>}
              tableStyle={{ minWidth: '50rem', overflow: 'auto' }}
            >
              <Column style={{ minWidth: '3rem' }} body={CustomerId} header="User ID"></Column>
              <Column
                style={{ minWidth: '8rem' }}
                field="refUserFname"
                header="First Name"
              ></Column>
              <Column style={{ minWidth: '8rem' }} field="refUserLname" header="Last Name"></Column>
              <Column
                style={{ minWidth: '8rem' }}
                field="refUserMobileNo"
                header="Phone Number"
              ></Column>
              <Column style={{ minWidth: '10rem' }} field="refUserEmail" header="Email"></Column>
              <Column style={{ minWidth: '10rem' }} body={AddressBody} header="Address"></Column>
              <Column
                style={{ minWidth: '8rem' }}
                field="refAadharNo"
                header="Aadhar Number"
              ></Column>
              <Column style={{ minWidth: '8rem' }} field="refPanNo" header="Pan Number"></Column>
              <Column body={StatusBody} header="Status"></Column>
            </DataTable>
          </div>

          {/* Datatable - End */}

          {/* Update Side Bar - Start */}

          <Sidebar
            visible={updateData}
            style={{ width: '80vw' }}
            position="right"
            onHide={() => setUpdateData(false)}
          >
            <Addnewloan
              custId={updateUserId.custId}
              id={updateUserId.id}
              userDetailsLoanData={userDetailsLoanData}
              closeSidebarUpdate={closeSidebarUpdate}
            />
          </Sidebar>

          {/* Update Side Bar - End */}
        </div>
      )}
    </>
  )
}

export default Loan
