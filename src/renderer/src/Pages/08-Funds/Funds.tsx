import Header from "@renderer/components/Header/Header"
import decrypt from "@renderer/components/Helper/Helper"
import axios from "axios"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Sidebar } from "primereact/sidebar"
import { useEffect, useState } from "react"
import { ToastContainer } from "react-toastify"
import { FilterMatchMode } from "primereact/api"
import { Button } from "primereact/button"
import ProductInputNew from "@renderer/components/ProductsInputs/ProductInputNew"

const Funds = () => {

    const [userLists, setUserLists] = useState([]);

    const [username, setUsername] = useState("");

    const [loadingStatus, setLoadingStatus] = useState(true);

    const loadData = () => {
        try {

            axios.get(import.meta.env.VITE_API_URL + "/adminRoutes/getBankFundList", {
                headers: {
                    Authorization: localStorage.getItem("token"),
                    "Content-Type": "application/json",
                },
            }).then((response: any) => {

                const data = decrypt(
                    response.data[1],
                    response.data[0],
                    import.meta.env.VITE_ENCRYPTION_KEY
                );


                console.log(data)

                if (data.success) {
                    setLoadingStatus(false);
                    setUsername(data.name[0].refUserFname + " " + data.name[0].refUserLname);
                    setUserLists(data.BankFund);
                }

            })

        } catch (e: any) {
            console.log(e);

        }
    }

    useEffect(() => {
        loadData();
    }, [])

    const TransactionAmount = (rowData: any) => {
        return (<><div>{rowData.refbfTransactionAmount} ₹</div></>)
    }

    const [newData, setNewData] = useState(false);


    const closeSidebarNew = () => {
        setNewData(false);
        loadData();
    }

    const Status = (rowData: any) => {
        return (
            <>
                {
                    rowData.refbfTrasactionType === "credit" ? (
                        <div style={{ padding: "5px", backgroundColor: "#00b600", color: "#fff", borderRadius: "10px", fontSize: "0.8rem", textAlign: "center" }}>Credit</div>
                    ) : (
                        <div style={{ padding: "5px", backgroundColor: "#f95f5f", color: "#fff", borderRadius: "10px", fontSize: "0.8rem", textAlign: "center" }}>Debit</div>
                    )
                }
            </>
        )

    }




    return (
        <>
            <ToastContainer />
            <Header userName={username} pageName={"Funds"} />
            {
                loadingStatus ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", color: "#f95005", height: "92vh", width: "100%" }}>
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: "5rem" }}></i>
                    </div>
                ) : (
                    <div className="contentPage">


                        {/* New User Button - Start */}

                        <Button label="Add Funds" onClick={() => { setNewData(true) }} />

                        {/* New User Button - End */}


                        {/* Datatable - Start */}

                        <div className="mt-5">
                            <DataTable paginator rows={5} value={userLists} showGridlines scrollable emptyMessage={<div style={{ textAlign: 'center' }}>No Records Found</div>} tableStyle={{ minWidth: '50rem', overflow: "auto" }}>
                                <Column field="createdAt" header="Transaction Date"></Column>
                                <Column body={TransactionAmount} header="Transaction Amount"></Column>
                                <Column field="refBankId" header="Bank Name"></Column>
                                <Column field="refFundType" header="Fund Type"></Column>
                                <Column body={Status} field="refbfTrasactionType" header="Action"></Column>
                            </DataTable>
                        </div>

                        {/* Datatable - End */}


                        {/* New User Side Bar - Start */}

                        <Sidebar visible={newData} style={{ width: "80vw" }} position="right" onHide={() => setNewData(false)}>

                            <ProductInputNew closeSidebarNew={closeSidebarNew} />

                        </Sidebar>

                        {/* New User Side Bar - End */}

                    </div>
                )
            }
        </>
    )
}

export default Funds