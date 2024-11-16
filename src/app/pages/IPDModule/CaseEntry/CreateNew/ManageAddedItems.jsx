import { useSelector } from "react-redux"
import { selectCaseEntryItems } from "@/src/lib/features/IPDCaseEntry/IpdCaseEntrySlice";
import { AddedItems } from "./AddedItems"
import { Button, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
export const ManageAddedItems = () => {
  const Entries = useSelector(selectCaseEntryItems);
  const [TotalRate, setTotalRate] = useState(0);
  const [TotalGST, setTotalGST] = useState(0);
  const [TotalAmount, setTotalAmount] = useState(0);
  const [TotalDiscount, setTotalDiscount] = useState(0);
  const [enableBank, setEnableBank] = useState(false);
  const [paymentMethod, setpaymentMethod] = useState("C");
  const [bank, setBank] = useState("65");
  const [trnID, setTrnID] = useState("");
  const [remark, setRemark] = useState("");
  console.log("Manage Entries=", Entries);

  const CalculateCharges = () => {
    setTotalRate(Entries.reduce((acc, Entry)=>{return(acc+ Entry.Rate)}, 0));
    setTotalGST(0);
    setTotalAmount(Entries.reduce((acc, Entry)=>{return(acc+ Entry.Amount)}, 0));
    setTotalDiscount(Entries.reduce((acc, Entry)=>{return(acc+ Entry.Discount)}, 0))
  }
  useEffect(() => {
    const UpdateBankMenu = () => {
      switch (paymentMethod) {
        case "C":
          setEnableBank(false);
          break;
        default:
          setEnableBank(true);
      }
    };
    UpdateBankMenu();
  }, [paymentMethod]);
  useEffect(()=>{
    CalculateCharges();
  },[Entries])
  return (<><Grid item display="flex" width="100%" marginY={1}>
    <Grid item xs={2}>
      <Typography fontSize={12} fontWeight="bold">
        Total Rate
      </Typography>
      <TextField
        placeholder="Amount"
        size="small"
        value={TotalRate}
        onChange={(e) => {
          // setAmount(e.target.value);
        }}
        // disabled
        fontSize={12}
      />
    </Grid>

    <Grid item xs={2}>
      <Typography fontSize={12} fontWeight="bold">
        Total GST
      </Typography>
      <TextField
        placeholder="Amount"
        size="small"
        value={TotalGST}
        onChange={(e) => {
          // setAmount(e.target.value);
        }}
        // disabled
        fontSize={12}
      />
    </Grid>

    <Grid item xs={2}>
      <Typography fontSize={12} fontWeight="bold">
        Total Amount
      </Typography>
      <TextField
        placeholder="Amount"
        size="small"
        value={TotalAmount}
        onChange={(e) => {
          // setAmount(e.target.value);
        }}
        // disabled
        fontSize={12}
      />
    </Grid>

    <Grid item xs={2}>
      <Typography fontSize={12} fontWeight="bold">
        Total Discount
      </Typography>
      <TextField
        placeholder="Amount"
        size="small"
        value={TotalDiscount}
        onChange={(e) => {
          // setAmount(e.target.value);
        }}
        // disabled
        fontSize={12}
      />
    </Grid>

    <Grid item xs={2}>
      <Typography fontSize={12} fontWeight="bold">
        Grand Total
      </Typography>
      <TextField
        placeholder="Amount"
        size="small"
        value={TotalAmount - TotalDiscount}
        onChange={(e) => {
          // setAmount(e.target.value);
        }}
        // disabled
        fontSize={12}
      />
    </Grid>
</Grid>
<Grid item display="flex" width="100%" marginY={1}>
    <Grid item xs={2} >
      <Typography fontSize={12} fontWeight="bold">
        Receive Amount
      </Typography>
      <TextField
        placeholder="Receive Amount"
        size="small"
        fontSize={12}
        // value={recAmount}
        onChange={(e) => {
          // setRecAmount(e.target.value);
        }}
      />
    </Grid>
    <Grid item xs={2} marginLeft={1}>
      <Typography fontSize={12} fontWeight="bold">
        MOD
      </Typography>
      <Select
        style={{ display: "flex", width: "100%" }}
        value={paymentMethod}
        label="Payment Method"
        onChange={(event) => {
          setpaymentMethod(event.target.value);
        }}
        size="small"
      >
        <MenuItem value="C">Cash</MenuItem>
        <MenuItem value="CA">Card</MenuItem>
        <MenuItem value="CH">UPI</MenuItem>
        <MenuItem value="NB">Net Banking</MenuItem>
        <MenuItem value="B">BTC</MenuItem>
        <MenuItem value="CR">Credit</MenuItem>
      </Select>
    </Grid>
    <Grid item xs={2} marginLeft={1}>
      <Typography fontSize={12} fontWeight="bold">
        Bank Name
      </Typography>
      <Select
        style={{ display: "flex", width: "100%" }}
        value={bank}
        label="Payment Method"
        onChange={(event) => {
          setBank(event.target.value);
        }}
        size="small"
        disabled={!enableBank}
      >
        <MenuItem value="65">ICICI Bank</MenuItem>
        <MenuItem value="63">HDFC Bank</MenuItem>
      </Select>
    </Grid>
    <Grid item xs={2} marginLeft={1}>
      <Typography fontSize={12} fontWeight="bold">
        Trans No
      </Typography>
      <TextField
        placeholder="0000"
        size="small"
        value={trnID}
        onChange={(e) => {
          setTrnID(e.target.value);
        }}
        disabled={!enableBank}
        fontSize={12}
      />
    </Grid>
  </Grid>
    <Grid container display="flex" width="100%">
      <Typography fontSize={12} fontWeight="bold">
        Remark:{" "}
      </Typography>
      <TextField
        fullWidth
        fontSize={12}
        value={remark}
        onChange={(e) => {
          setRemark(e.target.value);
        }}
        size="small"
      />
    </Grid>
    <Grid container marginTop={5}>
      <Button variant="contained" 
      // onClick={() => {
      //   SaveMoneyReceipt(false); handleClose();
      // }} 
      // disabled={recAmount === 0 ? true : false}
      > Save</Button>
      <Button
        variant="contained"
        // onClick={() => {
        //   SaveMoneyReceipt(true); handleClose();
        // }}
        style={{ marginLeft: "10px" }}
        // disabled={recAmount === 0 ? true : false}
      >
        Save & Print
      </Button>
    </Grid></>)
}