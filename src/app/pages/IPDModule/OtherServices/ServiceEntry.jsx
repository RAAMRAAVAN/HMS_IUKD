import { Delete, EditNote, Print, Restore, SystemUpdateAlt, ViewAgenda } from "@mui/icons-material"
import { Grid, IconButton, TextField, Typography } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react"

export const ServiceEntry = (props) => {
  let [AID, setAID] = useState(props.AID);
  let [Rate, setRate] = useState(props.Rate);
  let [Qty, setQty] = useState(props.Qty);
  let [Discount, setDiscount] = useState(props.Discount);
  // let [VisitDate, setVisitDate] = useState(new Date(props.VisitDate)
  // .toISOString()
  // .split("T")[0]);
  let [NetAmount, setNetAmount] = useState(Rate * Qty);
  let [Amount, setAmount] = useState((Rate * Qty) - Discount);
  let [User, setUser] = useState(props.User);
  let [reportingName, setReportingName] = useState(props.ReportingName);
  let [ActiveStatus, setActiveStatus] = useState(props.ActiveStatus);
  let [DeleteStatus, setDeleteStatus] = useState(props.DeleteStatus);
  // const [ReceiptCancel, setReceiptCancel] = useState(props.ReceiptCancel)

  console.log("ActiveStatus, DeleteStatus",AID,ActiveStatus, DeleteStatus)

  const UpdateServiceDetails = async(A, D) => {
    // alert("Update", {AID: AID,ActiveStatus: ActiveStatus, DeleteStatus: DeleteStatus, Qty: Qty, Discount: Discount, Amount: Amount, Rate: Rate, NetAmount: NetAmount,User: "1"});
    try{
      let result = await axios.post('http://192.168.1.32:5000/UpdateServiceDetails', {AID: AID,ActiveStatus: A, DeleteStatus: D, Qty: Qty, Discount: Discount, Amount: Amount, Rate: Rate, NetAmount: NetAmount,User: "1"})
    } catch (err) {
      console.log(err);
    } 
    alert("Entry Updated")
  }

  useEffect(()=>{
    setAmount((Rate * Qty) - Discount);
    setNetAmount(Rate * Qty);
    // UpdateServiceDetails();
  },[Rate, Discount, Qty, Amount, User, ActiveStatus, DeleteStatus]);
    return(<> 
    <Grid container backgroundColor={ActiveStatus === "N"?"#f7bed3":"white"}>
        {/* <Grid
              xs={1}
              border="1px black solid"
              padding={1}
              item
              alignItems="center"
              display="flex"
            >
              <Typography fontWeight="bold" fontSize={10}>S.No.</Typography>
            </Grid> */}
        <Grid
          xs={1}
          border="1px black solid"
          padding={1}
          item
          alignItems="center"
          display="flex"
        >
          <Typography fontWeight="bold" fontSize={10}>
            {/* {ReceiptID} */}
          </Typography>
        </Grid>
        <Grid
          xs={2}
          border="1px black solid"
        //   padding={1}
          item
          alignItems="center"
          display="flex"
        >
          {/* <TextField fontWeight="bold" value={VisitDate} onChange={(e)=>{setVisitDate(e.target.value)}} fontSize={10} type="date" size="small" padding={0} style={{margin:"0"}} fullWidth/> */}
        </Grid>
        <Grid
          xs={2}
          border="1px black solid"
          padding={1}
          item
          alignItems="center"
          display="flex"
        >
          <Typography fontWeight="bold" fontSize={12}>
            {reportingName}
          </Typography>
        </Grid>
        <Grid
          xs={1}
          border="1px black solid"
          // padding={1}
          item
          alignItems="center"
          display="flex"
        >
          <TextField value={Qty} onChange={(e)=>{setQty(e.target.value)}} size="small"/>
        </Grid>

        <Grid
          xs={1}
          border="1px black solid"
          // padding={1}
          item
          alignItems="center"
          display="flex"
        >
          {/* <Typography fontWeight="bold" fontSize={10}>{Rate}</Typography> */}
          <TextField value={Rate} onChange={(e)=>{setRate(e.target.value)}} fontSize={10} size="small"/>
        </Grid>

        <Grid
          xs={1}
          border="1px black solid"
          // padding={1}
          item
          alignItems="center"
          display="flex"
        >
          <TextField value={Discount} onChange={(e)=>{setDiscount(e.target.value)}} size="small"/>
        </Grid>

        <Grid
          xs={1}
          border="1px black solid"
          // padding={1}
          item
          alignItems="center"
          display="flex"
        >
          <TextField value={Amount} size="small"/>
        </Grid>

        <Grid
          xs={1}
          border="1px black solid"
          padding={1}
          item
          alignItems="center"
          display="flex"
        >
          <Typography fontWeight="bold" fontSize={10}>
            {User}
          </Typography>
        </Grid>

        <Grid
          xs={1}
          border="1px black solid"
          padding={1}
          item
          alignItems="center"
          display="flex"
        >
          <Typography fontWeight="bold" fontSize={10}>
            {/* {Remark} */}
          </Typography>
        </Grid>

        <Grid
          xs={1}
          border="1px black solid"
          paddingX={1}
          item
          alignItems="center"
          display="none"
          justifyContent="space-between"
        >
          <IconButton
            aria-label="delete"
            size="small"
            style={{ padding: "0", margin: "0", display:"none" }}
            //   onClick={() => handleUpdateOpen(receipt.ReceiptID)}
          >
            <EditNote
              size="small"
              style={{
                padding: "0",
                margin: "0",
                display: "flex",
                height: "20px",
              }}
            />
          </IconButton>

          <IconButton
            aria-label="delete"
            size="small"
            style={{ padding: "0", margin: "0" }}
            // onClick={()=>{setActiveStatus("N");setDeleteStatus("Y"); UpdateServiceDetails("N", "Y");}}
          >
            <Delete
              size="small"
              style={{
                padding: "0",
                margin: "0",
                display: "flex",
                height: "20px",
              }}
            />
          </IconButton>

          <IconButton
            aria-label="delete"
            size="small"
            style={{ padding: "0", margin: "0"}}
            // onClick={()=>{setActiveStatus("Y");setDeleteStatus("N"); UpdateServiceDetails("Y", "N")}}
          >
            <Restore
              size="small"
              style={{
                padding: "0",
                margin: "0",
                display: "flex",
                height: "20px",
              }}
            />
          </IconButton>

          <IconButton
            aria-label="delete"
            size="small"
            style={{ padding: "0", margin: "0" }}
              
          >
            <SystemUpdateAlt
              size="small"
              style={{
                padding: "0",
                margin: "0",
                display: "flex",
                height: "20px",
              }}
              onClick={()=>UpdateServiceDetails(ActiveStatus, DeleteStatus)}
            />
          </IconButton>
        </Grid>
      </Grid>
    </>)
}