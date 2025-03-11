import Header from '@renderer/components/Header/Header'
import decrypt from '@renderer/components/Helper/Helper'
import axios from 'axios'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { InputText } from 'primereact/inputtext'
import { Sidebar } from 'primereact/sidebar'
import { useEffect, useState } from 'react'
import { Slide, toast, ToastContainer } from 'react-toastify'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import { TabPanel, TabView } from 'primereact/tabview'
import { FloatLabel } from 'primereact/floatlabel'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'

// import React from 'react';

const Addnewloan = ({ custId, id, userDetailsLoanData, closeSidebarUpdate }) => {
  console.log('id', id)
  console.log('userDetailsLoanData', userDetailsLoanData.refUserId)
  const [userLists, setUserLists] = useState([])
  const refLoanStatus = [
    { name: 'Active', code: 'active' },
    { name: 'Inactive', code: 'inactive' }
  ]
  const [bankOptions, setBankOptions] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [inputs, setInputs]: any = useState({
    refBankName: '',
    refBankAccountNo: '',
    refBankAddress: '',
    refBalance: 0,
    refProductId: '',
    refLoanAmount: '',
    refLoanDueDate: '',
    refPayementType: '',
    refRepaymentStartDate: '',
    refLoanStatus: '',
    refLoanStartDate: '',
    refBankId: '',
    refLoanBalance: '',
    isInterestFirst: '',
    userId: '',
    refProductName:''
  })

  const [username, setUsername] = useState('')

  const [loadingStatus, setLoadingStatus] = useState(true)

  const [userData, setUserData] = useState({
    refProductId: '',
    refProductName: '',
    refProductDuration: '',
    refProductInterest: '',
    refProductDescription: '',
    refProductStatus: ''
  })

  const Addnewloan = async () => {
    setSubmitLoading(true)

    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + '/adminRoutes/addLoan',
          {
            refProductId: userData.refProductId,
            refLoanAmount: inputs.refLoanAmount,
            refLoanDueDate: inputs.refLoanDueDate,
            refPayementType: inputs.refPayementType,
            refRepaymentStartDate: inputs.refRepaymentStartDate,
            refLoanStatus: inputs.refLoanStatus,
            refLoanStartDate: inputs.refLoanStartDate,
            refBankId: inputs.refBankId,
            refLoanBalance: inputs.refLoanBalance,
            isInterestFirst: inputs.isInterestFirst,
            userId: userDetailsLoanData.refUserId
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

          setSubmitLoading(false)
          console.log('setSubmitLoading', setSubmitLoading)

          if (data.success) {
            toast.success('Successfully Added', {
              position: 'top-right',
              autoClose: 2999,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Slide
            })

            closeSidebarUpdate()
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  const loadData = () => {
    try {
      axios
        .get(import.meta.env.VITE_API_URL + '/adminRoutes/getLoanList', {
          headers: {
            Authorization: localStorage.getItem('token'),
            'Content-Type': 'application/json'
          }
        })
        .then((response: any) => {
          const data = decrypt(
            response.data[1],
            response.data[0],
            import.meta.env.VITE_ENCRYPTION_KEY
          );
  
        
  
          if (data.success) {
            console.log('Fetched Loan Data:----------->', data);
           
            setLoadingStatus(false);
          }
        });
    } catch (e: any) {
      console.log(e);
    }
  };
  
  useEffect(() => {
    loadData()

    setInputs((prevState) => ({
      ...prevState,
      custId: custId
    }))
  }, [custId])

  const CustomerId = (rowData: any) => {
    return (
      <>
        <div
          onClick={() => {
            setUpdateData(true)
            setUserData({
              refProductId: rowData.refProductId,
              refProductName: rowData.refProductName,
              refProductDuration: rowData.refProductDuration,
              refProductInterest: rowData.refProductInterest,
              refProductDescription: rowData.refProductDescription,
              refProductStatus: rowData.refProductStatus
            })
          }}
          style={{ color: '#f95005', textDecoration: 'underline', cursor: 'pointer' }}
        >
          {rowData.refProductName}
        </div>
      </>
    )
  }

  const InterestPercentage = (rowData: any) => {
    return (
      <>
        <div>{rowData.refProductInterest} %</div>
      </>
    )
  }

  const ProductDuration = (rowData: any) => {
    return (
      <>
        <div>{rowData.refProductDuration} Months</div>
      </>
    )
  }

  const [newData, setNewData] = useState(false)

  const [updateData, setUpdateData] = useState(false)

  // const closeSidebarUpdate = () => {
  //     setUpdateData(false);
  //     loadData();
  // }

  // const closeSidebarNew = () => {
  //     setNewData(false);
  //     loadData();
  // }

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

  const StatusBody = (rowData: any) => {
    return (
      <>
        {rowData.refProductStatus === 'active' ? (
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
  const handleNewUser = async () => {
    setSubmitLoading(true)

    try {
      axios
        .post(
          import.meta.env.VITE_API_URL + '/adminRoutes/addBankAccount',
          {
            refBankName: inputs.refBankName,
            refBankAccountNo: inputs.refBankAccountNo,
            refBankAddress: inputs.refBankAddress,
            refBalance: inputs.refBalance
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
          console.log('data----------->295', data)

          setSubmitLoading(false)

          if (data.success) {
            toast.success('Successfully Added', {
              position: 'top-right',
              autoClose: 2999,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: 'light',
              transition: Slide
            })

            closeSidebarUpdate()
          }
        })
    } catch (e: any) {
      console.log(e)
    }
  }

  const handleInput = (e: any) => {
    const { name, value } = e.target

    setInputs((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setInputs((prevState) => ({
      ...prevState,
      refbfTransactionDate: today
    }))

    const fetchBankDetails = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + '/adminRoutes/getBankList',
          {
            headers: {
              Authorization: localStorage.getItem('token'),
              'Content-Type': 'application/json'
            }
          }
        )

        const data = decrypt(
          response.data[1],
          response.data[0],
          import.meta.env.VITE_ENCRYPTION_KEY
        )

        if (data.success) {
          const bankData = data.BankFund.map((item: any) => ({
            bankname: item.refBankName,
            id: item.refBankId
          }))
          setBankOptions(bankData)
        }
      } catch (error) {
        console.log('Error fetching bank details:', error)
      }
    }

    fetchBankDetails()
  }, [])

  return (
    <div className="card">
      <TabView>
        <TabPanel header="History">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              style={{ width: '20%' }}
              label="Add New Loan"
              raised
              onClick={() => setShowForm(true)}
            />

            {showForm && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  Addnewloan()
                }}
              >
                <div style={{ width: '100%', display: 'flex', gap: '20px', marginTop: '35px' }}>
                  <FloatLabel style={{ width: '100%' }}>
                    <Dropdown
                      name="refProductId"
                      style={{ width: '100%', minWidth: '100%', padding: '0' }}
                      value={userData.refProductId}
                      options={userLists}
                      optionLabel="refProductName"
                      optionValue="refProductId"
                      onChange={(e) => setUserData({ ...userData, refProductId: e.value })}
                      filter
                      required
                    />
                    <label>Select Product</label>
                  </FloatLabel>

                  <FloatLabel style={{ width: '100%' }}>
                    <InputText
                      type="number"
                      id="refLoanAmount"
                      name="refLoanAmount"
                      value={inputs.refLoanAmount}
                      onChange={(e: any) => {
                        handleInput(e)
                      }}
                      required
                    />
                    <label htmlFor="refLoanAmount">Enter Price</label>
                  </FloatLabel>
                </div>
                <div style={{ width: '100%', display: 'flex', gap: '20px', marginTop: '35px' }}>
                  <FloatLabel style={{ width: '100%' }}>
                    <Calendar
                      dateFormat="dd/mm/yy"
                      name="refLoanDueDate"
                      style={{ width: '100%' }}
                      value={inputs.refLoanDueDate ? new Date(inputs.refLoanDueDate) : null}
                      id="refLoanDueDate"
                      onChange={(e: any) => {
                        handleInput(e)
                      }}
                      required
                    />
                    <label htmlFor="refLoanDueDate">Loan due date</label>
                  </FloatLabel>

                  <FloatLabel style={{ width: '100%' }}>
                    <InputText
                      type="text"
                      id="refPayementType"
                      name="refPayementType"
                      value={inputs.refPayementType}
                      onChange={(e: any) => {
                        handleInput(e)
                      }}
                      required
                    />
                    <label htmlFor="refPayementType">Enter Payment type</label>
                  </FloatLabel>
                </div>
                <div style={{ width: '100%', display: 'flex', gap: '20px', marginTop: '35px' }}>
                  <FloatLabel style={{ width: '100%' }}>
                    <Calendar
                      dateFormat="dd/mm/yy"
                      name="refRepaymentStartDate"
                      style={{ width: '100%' }}
                      value={
                        inputs.refRepaymentStartDate ? new Date(inputs.refRepaymentStartDate) : null
                      }
                      id="refRepaymentStartDate"
                      onChange={(e: any) => {
                        handleInput(e)
                      }}
                      required
                    />
                    <label htmlFor="refRepaymentStartDate">Payment start date</label>
                  </FloatLabel>

                  <FloatLabel style={{ width: '100%' }}>
                    <Dropdown
                      name="refLoanStatus"
                      style={{ width: '100%', minWidth: '100%' }}
                      value={inputs.refLoanStatus}
                      options={refLoanStatus}
                      optionLabel="name"
                      optionValue="code"
                      onChange={(e: any) => {
                        handleInput(e)
                      }}
                      required
                    />
                    <label htmlFor="lname">Active Status</label>
                  </FloatLabel>
                </div>
                <div style={{ width: '100%', display: 'flex', gap: '20px', marginTop: '35px' }}>
                  <FloatLabel style={{ width: '100%' }}>
                    <Calendar
                      dateFormat="dd/mm/yy"
                      name="refLoanStartDate"
                      style={{ width: '100%' }}
                      value={inputs.refLoanStartDate ? new Date(inputs.refLoanStartDate) : null}
                      id="refLoanStartDate"
                      onChange={(e: any) => {
                        handleInput(e)
                      }}
                      required
                    />
                    <label htmlFor="refLoanStartDate">Loan start date</label>
                  </FloatLabel>

                  <FloatLabel style={{ width: '100%' }}>
                    <Dropdown
                      name="refBankId"
                      style={{ width: '100%', minWidth: '100%' }}
                      value={inputs.refBankId}
                      options={bankOptions}
                      optionLabel="bankname"
                      optionValue="id"
                      onChange={(e: any) => handleInput(e)}
                      required
                    />
                    <label htmlFor="refBankId"> Choose Bank</label>
                  </FloatLabel>
                </div>
                <div style={{ width: '100%', display: 'flex', gap: '20px', marginTop: '35px' }}>
                  <FloatLabel style={{ width: '100%' }}>
                    <InputText
                      id="refLoanBalance"
                      name="refLoanBalance"
                      value={inputs.refLoanBalance}
                      onChange={(e: any) => {
                        handleInput(e)
                      }}
                      required
                    />
                    <label htmlFor="refLoanBalance">Loan Balance</label>
                  </FloatLabel>

                  <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                    <label>Is Interest First:</label>
                    <div>
                      <input
                        type="radio"
                        id="interestFirstYes"
                        name="isInterestFirst"
                        value="true"
                        checked={inputs.isInterestFirst === 'true'}
                        onChange={(e) => setInputs({ ...inputs, isInterestFirst: e.target.value })}
                        required
                      />
                      <label htmlFor="interestFirstYes">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="interestFirstNo"
                        name="isInterestFirst"
                        value="false"
                        checked={inputs.isInterestFirst === 'false'}
                        onChange={(e) => setInputs({ ...inputs, isInterestFirst: e.target.value })}
                        required
                      />
                      <label htmlFor="interestFirstNo">No</label>
                    </div>
                  </div>
                </div>

                <div>
                  {' '}
                  {submitLoading ? (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '35px'
                      }}
                    >
                      <i
                        className="pi pi-spin pi-spinner"
                        style={{ fontSize: '2rem', color: '#f95005' }}
                      ></i>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '35px'
                      }}
                    >
                      <Button
                        style={{ width: '20%' }}
                        type="submit"
                        severity="success"
                        label="Submit"
                      />
                    </div>
                  )}{' '}
                </div>
              </form>
            )}

            <div style={{marginTop:"35px"}}>
              {' '}
              {/* Datatable - Start */}
              <DataTable value={userLists} paginator rows={10} loading={loadingStatus}>
  <Column field="columnID" header="Product ID" />
  <Column field="refLoanAmount" header="Loan Amount" />
  <Column field="refLoanDueDate" header="Due Date" />
  <Column field="refRepaymentStartDate" header="Repayment Start" />
  <Column field="refLoanStatus" header="Status" />
  <Column field="refLoanStartDate" header="Loan Start Date" />
  <Column field="refLoanBalance" header="Loan Balance" />
  <Column field="isInterestFirst" header="Interest First" />
</DataTable>

              {/* Datatable - End */}
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Closed">
          <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </TabPanel>
      </TabView>
    </div>
  )
}

export default Addnewloan
