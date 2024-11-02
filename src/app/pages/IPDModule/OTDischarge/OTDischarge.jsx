import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { formatDateTime } from "../SelectValues";
import { useDispatch, useSelector } from "react-redux";
import { selectIPDNo } from "@/src/lib/features/IPDPatient/IpdPatientSlice";
// import { useNavigate } from "react-router-dom";

export const OTDischarge = () => {
  const dispatch = useDispatch();
  const IPDNo = useSelector(selectIPDNo)
  const [otDischargeList, setOTDischargeList] = useState([]);
  // const navigate = useNavigate();
  const handlePrintClick = (PId) => {
    const url = `/pages/IPDModule/OTDischarge/OTDischargePrint?PId=${PId}`;
    window.open(url, "_blank"); // Opens in a new tab
  };
      
  const fetchOtDischarge = async (input) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/fetchOtDischarge",
        {
          IPAID: input,
        }
      );
      setOTDischargeList(response.data.otDischarge);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    if (IPDNo != undefined) fetchOtDischarge(IPDNo);
  }, [IPDNo]);
  return (
    <>
      <Box>
        <Typography variant="h6">OT Discharge List</Typography>
        <Grid container>
          <Grid
            xs={1}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>S.No.</Typography>
          </Grid>
          <Grid
            xs={1}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>Discharge No</Typography>
          </Grid>
          <Grid
            xs={1}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>HRNO</Typography>
          </Grid>
          <Grid
            xs={2}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>Patient Name</Typography>
          </Grid>

          <Grid
            xs={1}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>Admit Date</Typography>
          </Grid>

          <Grid
            xs={1}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>Discharge Date</Typography>
          </Grid>

          <Grid
            xs={1}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>Bed No</Typography>
          </Grid>

          <Grid
            xs={2}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            {" "}
            <Typography fontWeight="bold" fontSize={12}>Format Type</Typography>
          </Grid>

          <Grid
            xs={2}
            border="1px black solid"
            padding={1}
            item
            alignItems="center"
            display="flex"
          >
            <Typography fontWeight="bold" fontSize={12}>Action</Typography>
          </Grid>
        </Grid>
        {otDischargeList.map((discharge, index) => {
          return (
            <Grid container>
              <Grid
                xs={1}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Typography  fontSize={12}>{discharge.AID}</Typography>
              </Grid>
              <Grid
                xs={1}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Typography  fontSize={12}>{discharge.DischargeNo}</Typography>
              </Grid>
              <Grid
                xs={1}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Typography  fontSize={12}>{discharge.HRNo}</Typography>
              </Grid>
              <Grid
                xs={2}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Typography  fontSize={12}>{discharge.PatientName}</Typography>
              </Grid>

              <Grid
                xs={1}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Typography  fontSize={12}>{formatDateTime(discharge.AdmDate).Date}</Typography>
              </Grid>

              <Grid
                xs={1}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Typography  fontSize={12}>{formatDateTime(discharge.Date).Date}</Typography>
              </Grid>

              <Grid
                xs={1}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Typography  fontSize={12}>{discharge.BedNo}</Typography>
              </Grid>

              <Grid
                xs={2}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                {" "}
                <Typography  fontSize={12}>Format Type</Typography>
              </Grid>

              <Grid
                xs={2}
                border="1px black solid"
                // padding={1}
                item
                alignItems="center"
                display="flex"
              >
                <Button onClick={()=>handlePrintClick(discharge.PId)}>Print</Button>
              </Grid>
            </Grid>
          );
        })}
      </Box>
    </>
  );
};
