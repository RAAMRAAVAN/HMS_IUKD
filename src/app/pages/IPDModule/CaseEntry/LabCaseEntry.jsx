import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { styled, css } from "@mui/system";

import {
  Check,
  Delete,
  Edit,
  EditNote,
  Print,
  SaveAlt,
  ViewAgenda,
} from "@mui/icons-material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectIPDNo } from "@/src/lib/features/IPDPatient/IpdPatientSlice";
import { useEffect, useState } from "react";
import { setMOP } from "../SelectValues";
import {CreateNewCaseEntry} from "./CreateNew/CreateNewCaseEntry"

export const LabCaseEntry = (props) => {
  const dispatch = useDispatch();
  const IPDNo = useSelector(selectIPDNo)
  const [CaseEntryList, setCaseEntryList] = useState([]);
  const [open, setOpen] = useState(false);
  console.log("CaseEntryList", CaseEntryList)
  const fetchIPDCaseEntry = async () => {
    try {
      const result = await axios.post("http://192.168.1.108:5000/fetchIPDCaseEntry", { IPAID: IPDNo });
      setCaseEntryList(result.data.IPDCaseEntry);
    } catch (err) {
      alert(err);
    }
  }
  useEffect(() => {
    fetchIPDCaseEntry();
  }, [])
  return (
    <>
      <CreateNewCaseEntry open={open} setOpen={setOpen}/>
      <Box display="flex" justifyContent="space-between" width="97vw" paddingY={1}>
        <Typography fontWeight="bold">Case Entry</Typography>
        <Button variant="contained" size="small" onClick={()=>{setOpen(!open)}}>Add</Button>
      </Box>
      <Box display="flex" width="97vw" flexDirection="column">
        <Grid container display="flex" width="100%">
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">S.No</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Case No</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Date</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Time</Typography>
          </Grid>
          <Grid xs={2} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Doctor</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">User</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">MOD</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Total</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Discount Rs</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Amount</Typography>
          </Grid>
          <Grid xs={1} item border="1px black solid" padding={1}>
            <Typography fontSize={12} fontWeight="bold">Action</Typography>
          </Grid>
        </Grid>
        {CaseEntryList.map((CaseEntry, index) => {
          return (<Grid container>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} >{index + 1}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} >{CaseEntry.CaseNo}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} noWrap>{new Date(CaseEntry.CaseDate).toISOString().split("T")[0]}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} noWrap>{new Date(CaseEntry.CaseTime).toISOString().split("T")[1].split(".")[0]}</Typography>
            </Grid>
            <Grid xs={2} item border="1px black solid" padding={1}>
              <Typography fontSize={12} noWrap>{CaseEntry.DoctorName}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} >{CaseEntry.FirstName}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} >{setMOP(CaseEntry.MOD)}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} >{CaseEntry.GrandTotal}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} >{CaseEntry.DiscountRs}</Typography>
            </Grid>
            <Grid xs={1} item border="1px black solid" padding={1}>
              <Typography fontSize={12} >{CaseEntry.NetAmount}</Typography>
            </Grid>
            <Grid
              xs={1}
              border="1px black solid"
              paddingX={1}
              item
              alignItems="center"
              display="flex"
              justifyContent="space-between"
            >
              <IconButton
                aria-label="delete"
                size="small"
                style={{ padding: "0", margin: "0" }}
              // onClick={() => handleUpdateOpen(receipt.ReceiptID)}
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
              // onClick={() => deleteIPDMoneyReceipt(receipt.ReceiptID)}
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
                style={{ padding: "0", margin: "0" }}
              // onClick={() => handlePrintClick(receipt.ReceiptID)}
              >
                <ViewAgenda
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
              // onClick={() => handlePrintClick(receipt.ReceiptID)}
              >
                <Print
                  size="small"
                  style={{
                    padding: "0",
                    margin: "0",
                    display: "flex",
                    height: "20px",
                  }}
                />
              </IconButton>
            </Grid>
          </Grid>)
        })}
      </Box>
    </>
  );
};
