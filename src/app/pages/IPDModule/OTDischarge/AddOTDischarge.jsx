import {
  Autocomplete,
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Select,
  Slider,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  convertTimeFormat,
  convertTimeTo12HourFormat,
  extractTimeFromISO,
} from "../SelectValues";

import { TextEditor } from "../../../Const/TextEditor"
import { useDispatch } from "react-redux";
import { assignValue } from "@/src/lib/features/TextEditor/TextEditorSlice";

export const AddOTDischarge = (props) => {
  const dispatch = useDispatch();
  const { setOpen, open, IPDID } = props;
  const handlePrintClick = (ReceiptID) => {
    const url = `/pages/IPDModule/MoneyReceipt?ReceiptID=${ReceiptID}`;
    window.open(url, "_blank"); // Opens in a new tab
  };
  const [html, setHtml] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toISOString().split("T")[1].split("Z")[0]);
  const [MRDDetails, setMRDDetails] = useState({});
  const [selectedFormat, setSelectedFormat] = useState(props.selectedFormat);
  const [otDischargeFormatList, setOtDischargeFormatList] = useState([]);
  const [value, setValue] = useState(props.selectedFormat.Format[1]);
  const [AdmDate, setAdmDate] = useState();
  const [AdmTime, setAdmTime] = useState();
  const [amount, setAmount] = useState(0);
  const [recAmount, setRecAmount] = useState(0);
  const handleClose = () => setOpen(false);
  const [enableBank, setEnableBank] = useState(false);
  const [paymentMethod, setpaymentMethod] = useState("C");
  const [bank, setBank] = useState("65");
  const [trnID, setTrnID] = useState("");
  const [remark, setRemark] = useState("");
  // console.log(
  //   "date",
  //   date,
  //   "time",
  //   time,
  //   "AdmDate",
  //   AdmDate,
  //   "AdmTime",
  //   extractTimeFromISO(MRDDetails.Time)
  // );
  // console.log(AdmDate + new Date(MRDDetails.Time).toTimeString().split(" ")[0]);
  const getMRDDetails = async (input) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/fetchIPDPatientDetails",
        { IPDNo: input }
      );
      console.log("money=", response.data[0]);
      setMRDDetails(response.data[0]);
      setAdmDate(new Date(response.data[0].Date).toISOString().split("T")[0]);
      setAdmTime(
        convertTimeTo12HourFormat(
          new Date(response.data[0].Time).toTimeString().split(" ")[0]
        )
      );

    } catch (error) {
      alert("DB Error");
    }
  };
  const getOTDischargeFormats = async () => {
    try {
      let result = await axios.get("http://localhost:5000/getOTDischargeFormats");
      setOtDischargeFormatList(result.data.OTDischargeFormats)
    } catch (err) {
      alert("DB Error");
    }
  }

  const ResetValues = () => {
    setAmount(0);
    setBank("65");
    setTrnID("");
    setRecAmount(0);
    setDate(new Date().toISOString().split("T")[0]);
    setTime(new Date().toTimeString().split(" ")[0]);
    setpaymentMethod("C");
    setRemark("");
  }

  const SaveMoneyReceipt = async (printStatus) => {
    try {
      let response = await axios.post("http://localhost:5000/addMoneyReceipt", {
        ReceiptDate: date,
        ReceiptTime: time,
        AdmitDate: AdmDate,
        HRNo: MRDDetails.HRNo,
        WardID: MRDDetails.WardID,
        BedID: MRDDetails.BedID,
        PatientName: MRDDetails.PatientName,
        IPDNo: IPDID,
        Address: MRDDetails.Address,
        TotalAmount: recAmount,
        Remark: remark,
        MOD: paymentMethod,
        AccountNo: trnID,
        IPDID: MRDDetails.PrintIPDNo,
        BankID: bank,
      });
      if (response.status === 200) {
        console.log("print", response.data.ReceipdID);
        if (printStatus === true)
          handlePrintClick(response.data.ReceipdID);
        ResetValues();
      }
    } catch (err) {
      alert(err);
    }
  };
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
  useEffect(() => {
    getMRDDetails(IPDID);
    getOTDischargeFormats();
    dispatch(assignValue(props.selectedFormat.Format[1]))
  }, []);

  return MRDDetails != {} ? (
    <Modal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      onClose={handleClose}
      // slots={{ backdrop: StyledBackdrop }}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{
        width: "80%",
        maxHeight: "100vh", // Set max height for modal content
        overflowY: "auto",  // Enable scrolling when content exceeds 90vh
        backgroundColor: "white",
        padding: 2
      }} padding={2}>
        <Grid container>
          <Grid item>
            <Typography fontWeight="bold">OT Discharge</Typography>
          </Grid>
          <Grid
            container
            // border="2px black solid"
            display="flex"
            // height="30vh"
            padding={1}
            justifyContent="start"
            alignItems="flex-start"
          >
            <Grid container display="flex" width="100%">
              <Grid item>
                <Typography fontSize={12} fontWeight="bold">
                  Date:{" "}
                </Typography>
                <TextField
                  fullWidth
                  fontSize={12}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  size="small"
                  type="date"
                />
              </Grid>
              <Grid item marginLeft={1}>
                <Typography fontSize={12} fontWeight="bold">
                  Time:{" "}
                </Typography>
                <TextField
                  fullWidth
                  fontSize={12}
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                  }}
                  size="small"
                  type="time"
                />
              </Grid>
            </Grid>
            <Grid item display="flex" width="100%" marginY={1}>
              <Grid item xs={2}>
                <Typography fontSize={12} fontWeight="bold">
                  Patient Name
                </Typography>
                <TextField
                  placeholder="Name"
                  size="small"
                  value={MRDDetails.PatientName}
                  disabled
                  fontSize={12}
                />
              </Grid>
              <Grid item xs={2} marginLeft={1}>
                <Typography fontSize={12} fontWeight="bold">
                  HRNO
                </Typography>
                <TextField
                  placeholder="HRNO"
                  size="small"
                  value={MRDDetails.HRNo}
                  disabled
                  fontSize={12}
                />
              </Grid>
              <Grid item xs={2} marginLeft={1}>
                <Typography fontSize={12} fontWeight="bold">
                  IPD NO
                </Typography>
                <TextField
                  placeholder="HRNO"
                  size="small"
                  value={IPDID}
                  disabled
                  fontSize={12}
                />
              </Grid>
              <Grid item xs={2} marginLeft={1}>
                <Typography fontSize={12} fontWeight="bold">
                  Admit Date
                </Typography>
                <TextField
                  placeholder="HRNO"
                  size="small"
                  fontSize={12}
                  type="date"
                  value={AdmDate}
                  disabled
                />
              </Grid>
              <Grid item xs={2} marginLeft={1}>
                <Typography fontSize={12} fontWeight="bold">
                  Patient Type
                </Typography>
                <TextField
                  placeholder="HRNO"
                  size="small"
                  value={MRDDetails.CompanyID == "110" ? "Ayushman" : "General"}
                  disabled
                  fontSize={12}
                />
              </Grid>

              <Grid item xs={2} marginLeft={1}>
                <Typography fontSize={12} fontWeight="bold">
                  Bed NO
                </Typography>
                <TextField
                  placeholder="Bed No"
                  size="small"
                  value={MRDDetails.BedNo}
                  disabled
                  fontSize={12}
                />
              </Grid>
            </Grid>
            <Grid item display="flex" width="100%" marginX={1}>
              <Grid item xs={4}>
                <Typography fontSize={12} fontWeight="bold">
                  Format
                </Typography>
                <Autocomplete
                  fullWidth
                  options={otDischargeFormatList}
                  getOptionLabel={(option) =>
                    `${option.DischargeFormatName}`
                  } // Specify which property to use as the label
                  value={selectedFormat}
                  onChange={(event, newValue) => {
                    setSelectedFormat(newValue); // Update the state variable when the value changes
                    if (newValue != null) {
                      console.log("update IPD NO=", newValue.IPAID)
                      console.log("New=", newValue.Format)
                      // setValue(newValue.Format);
                      dispatch(assignValue(newValue.Format))
                    }

                  }}
                  // onInputChange={(event, newInputValue) => {
                  //   console.log("New=", newInputValue)
                  //   setValue(newInputValue); // Call the function while typing
                  // }}
                  renderInput={(params) => <TextField {...params} />}
                  sx={{ width: "100%" }}
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <Typography fontSize={12} fontWeight="bold">
                  Code
                </Typography>
                <Switch
                  checked={html}
                  onChange={(event) => {
                    setHtml(event.target.checked);
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Grid>
            </Grid>
            <Grid container display="flex" width="100%">
              {/* <Typography fontSize={12} fontWeight="bold">
                Remark:{" "}
              </Typography> */}
              <TextEditor value={value} html={html}/>
            </Grid>
            <Grid container marginTop={5}>
              <Button variant="contained" onClick={() => {
                SaveMoneyReceipt(false); handleClose();
              }} disabled={recAmount === 0 ? true : false}> Save</Button>
              <Button
                variant="contained"
                onClick={() => {
                  SaveMoneyReceipt(true); handleClose();
                }}
                style={{ marginLeft: "10px" }}
                disabled={recAmount === 0 ? true : false}
              >
                Save & Print
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  ) : <></>;
};
