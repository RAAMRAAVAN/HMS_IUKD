const { request } = require('express');
const sql = require('mssql/msnodesqlv8');

exports.getIPDCollection = (req, res) => {
  const fromDate=req.body.fromDate;
  const toDate=req.body.toDate;
  const userID = req.body.Uid;
  // console.log(fromDate, toDate)
  const request = new sql.Request();
  const query =  `/****** Script for SelectTopNRows command from SSMS  ******/
  SELECT MOD, SUM(RecAmount) as TotalRate FROM [KH_20232024].[dbo].[Trn_IPDMoneyReceipt] 
  where ActiveStatus='Y' AND DeleteStatus='N' AND ReceiptCancel='N' AND
  ReceiptDate BETWEEN '${fromDate} 00:00:00.000' AND '${toDate} 23:59:59.000' AND UserID='${userID}'
  Group By MOD with rollup`;

   

  request.query(query, (err, result) => {
    if (err) {
      // console.log(err);
      return res.status(500).json({ error: "Database query error" });
    } else {
      // console.log(result);
      return res.json(result.recordset);
    }
  });
};

exports.filterPatient = async (req, res) => {
  const like_name = req.body.like_name;
  // console.log(req.body.like_name)
  const request = new sql.Request();
  const query1 = `select * from M_PatientMaster where PatientName like '%${like_name}%' AND ActiveStatus='Y'`
  const query2 = `SELECT 
    *
FROM 
    (
        SELECT 
            *,
            CAST(Date AS DATETIME) + CAST(Time AS DATETIME) AS CombinedDateTime,
            ROW_NUMBER() OVER (PARTITION BY HRNo ORDER BY CAST(Date AS DATETIME) + CAST(Time AS DATETIME) DESC) AS rn
        FROM 
            M_PatientMaster
        WHERE 
            (PatientName LIKE '%${like_name}%' OR
            HRNo LIKE '%${like_name}%')
            AND ActiveStatus = 'Y'
    ) AS subquery
WHERE 
    rn = 1;
`
  const query3 = `SELECT 
    *
FROM 
    (
        SELECT 
			PM.AID, PM.HRNo, PM.OPDNo, PM.TitleID, PM.PatientName, PM.Gender, PM.Year, PM.Month, PM.Days, PM.RelationName, PM.Address, PM.DistictID, PM.PinCode, PM.ContactNo, PM.OccupationID, PM.RelationID, PM.PatientStatus, PM.ReligionID, PM.MaritalStatus,
            OM.OID AS OccupationOID, 
            OM.OccupationName,     
			DM.DID,
			DM.DistrictName,
			SM.StateId,
      DM.CountryId,
			SM.StateName,
            CAST(Date AS DATETIME) + CAST(Time AS DATETIME) AS CombinedDateTime,
            ROW_NUMBER() OVER (PARTITION BY HRNo ORDER BY CAST(Date AS DATETIME) + CAST(Time AS DATETIME) DESC) AS rn
        FROM 
            M_PatientMaster AS PM
		join 
		M_OccupationMaster AS OM
		ON PM.OccupationID = OM.OID
		join
		M_DistrictMaster AS DM
		ON PM.DistictID = DM.DID
		join
		M_StateMaster AS SM
		ON DM.StateId = SM.StateId
        WHERE 
            (PM.PatientName LIKE '%${like_name}%' OR
            PM.HRNo LIKE '%${like_name}%')
    ) AS subquery
WHERE 
    rn = 1;`
  try{
    const filtered_patient_list = await request.query(query3);
    // console.log(filtered_patient_list)
    const combinedResults = {
      filtered_patients: filtered_patient_list.recordset
    }
    res.json(combinedResults)
  } catch (err) {
    res.status(500).json({error: "Database Error"})
  }
}
exports.patientAdmissionResources = async(req, res) => {
  const fromDate = req.body.fromDate;
  const request = new sql.Request();
  const query1 = `select OID, OccupationName from M_OccupationMaster where ActiveStatus='Y' and DeleteStatus='N'`
  const query2 = `select *, Name as label from V#ADMType`
  const query3 = `select Code, LedgerName from V#TravelAgent_Company`
  const query4 = `select AID, DrId, DoctorName from M_DoctorMaster where ActiveStatus='Y'`
  const query5 = `select * from M_DistrictMaster where ActiveStatus='Y'`
  const query6 = `select * from M_StateMaster where ActiveStatus='Y'`
  const query7 = `select DM.AID, DM.CountryId, DM.StateId, DM.DID, DM.DistrictName, SM.StateName from M_DistrictMaster as DM
JOIN
M_StateMaster SM
ON
DM.StateId = SM.StateId
where DM.ActiveStatus='Y'`
  // const query7 = `select * from M_PatientMaster where PatientName like '%sunil%' AND ActiveStatus='Y'`
  try {
    const occupation_list = await request.query(query1);
    const admitTypeList = await request.query(query2);
    const insuranceCompanyList = await request.query(query3);
    const DoctorNameList = await request.query(query4);
    const DistrictList = await request.query(query7);
    const StateList = await request.query(query6);
    // const Patient = await request.query(query7);

    const combinedResults = {
      occupations : occupation_list.recordset,
      admitType : admitTypeList.recordset,
      insuranceCompany : insuranceCompanyList.recordset,
      doctorName: DoctorNameList.recordset,
      District: DistrictList.recordset,
      State: StateList.recordset,
      // PatientList: Patient.recordset
    }
    res.json(combinedResults)
  } catch (err) {
    res.status(500).json({error: "Database Error"})
  }
}


exports.postIPDAdmission = async(req, res) => {
  const {HospitalID, BranchID, HRNo, Date, Time, OPDStatus, Patient, OPDNo, TitleID, PatientName, OccupationID, Gender, MaritialStatus, Age, Year, Month, Days, DOB, Address, Pincode, RelegionID, CityID, DistrictID, In_Insurance, InsuranceID, InsRefDate,RelationName, RelationID, PhoneNo, CompanyID, AdmitType, BedID, WardID, MedicalDr, UnderDr, UnderDr_2, RefDrID, ShiftID, PackageID, ImagePath, ActiveStatus, DeleteStatus, UserID, RTS, IPAddress, ModifyUser, ModifyDate, IsUpload, IsUploadRTS, FYearID, Discharge, IsFinalBill, DischargeDateTime, PackageRate, RegStatus, InsurCompID, PO, PS} = req.body;
  let newIPAID = null;
  // console.log("Admission",HospitalID, BranchID, HRNo, Date, Time, OPDStatus, Patient, OPDNo, TitleID, PatientName, OccupationID, Gender, MaritialStatus, Age, Year, Month, Days, DOB, Address, Pincode, RelegionID, CityID, DistrictID, In_Insurance, InsuranceID, InsRefDate,RelationName, RelationID, PhoneNo, CompanyID, AdmitType, BedID, WardID, MedicalDr, UnderDr, UnderDr_2, RefDrID, ShiftID, PackageID, ImagePath, ActiveStatus, DeleteStatus, UserID, RTS, IPAddress, ModifyUser, ModifyDate, IsUpload, IsUploadRTS, FYearID, Discharge, IsFinalBill, DischargeDateTime, PackageRate, RegStatus, InsurCompID, PO, PS)
  // console.log("teest",HospitalID, BranchID, HRNo, Date, Time, OPDStatus, Patient, OPDNo, TitleID, PatientName, OccupationID, Gender, MaritialStatus, Age, Year, Month, Days, DOB, Address, Pincode, RelegionID, CityID, DistrictID, In_Insurance, InsuranceID, InsRefDate, RelatioID, PhoneNo, CompanyID, AdmitTYpe, BedID, WardID, MedicalDr, UnderDr, UnderDr_2, RefDrID, ShiftID, PackageID, ImagePath, ActiveStatus, DeleteStatus, UserID, RTS, IPAddress, ModifyUser, ModifyDate, IsUpload, IsUploadRTS, FYearID, Discharge, IsFinalBill, DischargeDateTime, PackageRate, RegStatus, InsurCompID, PO, PS)
  // console.log(MaritialStatus)
  const request = new sql.Request();
  const LastAdmissionDetails = `select TOP 1 * from M_IPDAdmission ORDER BY IPAID DESC `;
  
  try {
  // Execute first query
  const LastAdmissionDetail = await request.query(LastAdmissionDetails);
  const InsertNewAdmission = await request.query(`INSERT INTO M_IPDAdmission (IPAID, HospitalID, BranchID, HRNo, IPDNo,Date, Time, OPDStatus, Patient, OPDNo, TitelID, PatientName, OccupationID, Gender, MaritalStatus, Age, Year, Month, Days, DOB, Address, Pincode, ReligionID, CityID, DistictID, In_Insurance, InsuranceID, InsRefDate, RelationName, RelationID, PhoneNo, CompanyID, ADMType, BedID, WardID, MedicalDr, UnderDr, UnderDr_2, RefDrID, ShiftID, PackageID, ImagePath, ActiveStatus, DeleteStatus, UserID, RTS, IPAddress, ModifyUserID, ModifyDate, IsUpload, IsUploadRTS, FYearID, Discharge, IsFinalBill, DischargeDateTime, PackageRate,PrintIPDNo, RegStatus, InsurCompID, PO, PS)
    VALUES (${LastAdmissionDetail.recordset[0].IPAID + 1},${HospitalID}, ${BranchID}, '${HRNo}', 'IPD/23-24/${LastAdmissionDetail.recordset[0].IPAID + 1}','${Date} 00:00:00.000', '1900-01-01 ${Time}.000', '${OPDStatus}', '${Patient}', '${OPDNo}', ${TitleID}, '${PatientName}','${OccupationID}', '${Gender}', '${MaritialStatus}', '${Age}', '${Year}', '${Month}', '${Days}', '2014-04-01 00:00:00.000', '${Address}', '${Pincode}', '${RelegionID}', '${CityID}', '${DistrictID}', 'N', '0', '${Date} 00:00:00.000','${RelationName}', '${RelationID}', '${PhoneNo}', '${CompanyID}', '${AdmitType}', '${BedID}', '${WardID}', '${UnderDr}', '${UnderDr}', '${UnderDr}', '${UnderDr}', '0', '0', '../ItemImages/No-image-found.jpg', 'Y', 'N', '1', '${Date} ${Time}.400', '00-15-5D-F1-68-98', '0', NULL, 'Y', '${Date} ${Time}.010', '1', 'N', 'N', NULL, '0', '${LastAdmissionDetail.recordset[0].IPAID + 1}','B', '0', '${PO}', '${PS}')`
  );
  const newIPAID = LastAdmissionDetail.recordset[0].IPAID + 1;
  const BedAssign = await request.query(`update M_BedMaster set BedStatus='B', IPDHRNo='${HRNo}' where BedID='${BedID}'`)

  const combinedResult = {
    newIPAID: `${LastAdmissionDetail.recordset[0].IPAID + 1}`,
    inputs: req.body,
    lastRecord: LastAdmissionDetail.recordset,
    InsertStatus: InsertNewAdmission

  }
res.json(combinedResult);
} catch (err) {
    // console.log(err);
    res.status(500).json({ error: err });
}
};

exports.updateIPDAdmission = async(req, res) => {
  const {HRNo, IPDNo,Patient, TitleID, PatientName, OccupationID, Gender, MaritialStatus, Age, Year, Month, Days, DOB, Address, Pincode, RelegionID, CityID, DistrictID, In_Insurance, InsuranceID, RelationName, RelationID, PhoneNo, CompanyID, UnderDr, PO, PS} = req.body;
  // console.log(PhoneNo)
  const request = new sql.Request();
  const query = `update M_IPDAdmission set PatientName='${PatientName}', TitelID='${TitleID}', Year='${Year}', Month='${Month}', Days='${Days}', Gender='${Gender}',
  OccupationID='${OccupationID}',
  Address='${Address}',
  PO='${PO}',
  PS='${PS}',
  DistictID='${DistrictID}',
  Pincode='${Pincode}',
  ReligionID='${RelegionID}',
  CompanyID='${CompanyID}',
  MaritalStatus='${MaritialStatus}',
  PhoneNo='${PhoneNo}',
  MedicalDr='${UnderDr}',
  UnderDr='${UnderDr}'
  where HRNo='${HRNo}'`

  const query1 = `update M_IPDAdmission set CompanyID='${CompanyID}',
  In_Insurance='${In_Insurance}',
  InsuranceID='${InsuranceID}',
  RelationName='${RelationName}',
  RelationID='${RelationID}'
  where IPDNo='${IPDNo}'`
  // const query2 = `update Trn_MoneyReceipt set PatientName='${PatientName}',  where HRNo='${HRNo}'`
  try {
  const UpdateAdmissionDetails = await request.query(query);
  const UpdateIPDDetails = await request.query(query1);

  const combinedResult = {
    UpdateStatus: UpdateAdmissionDetails,
    UpdateStatus2: UpdateIPDDetails
  }
res.json(combinedResult);
} catch (err) {
    // console.log(err);
    res.status(500).json({ error: err });
}
};

exports.fetchIPDPatient = async (req, res) => {
  const {IPDNo} = req.body;
  const request = new sql.Request();
  const query = `select * from M_IPDAdmission where IPDNo='${IPDNo}'`
  const query2 = `select BM.BedNo, UM.FirstName,WM.WardName,OM.OID AS OccupationOID, DoM.DoctorName,
            OM.OccupationName, DM.CountryID,DID,DM.DistrictName,SM.StateId, SM.StateName,PM.* from M_IPDAdmission as PM join
		M_DistrictMaster AS DM
		ON PM.DistictID = DM.DID
		join
		M_StateMaster AS SM
		ON DM.StateId = SM.StateId
		join 
		M_OccupationMaster AS OM
		ON PM.OccupationID = OM.OID
    join
    M_DoctorMaster AS DoM
    ON DoM.DrId=PM.UnderDr
    join
		M_WardMaster as WM
		ON PM.WardID = WM.WardID
    join 
		M_BedMaster as BM
		ON BM.BedID = PM.BedID
	join
		M_UserMaster AS UM
		ON UM.UId = PM.UserID
		where IPAID='${IPDNo}' `
  // console.log(query)
  try {
    const PatientDetails = await request.query(query2);
    res.json(PatientDetails.recordset)
  } catch (err) {
    res.status(500).json({error: err})
  }
}

exports.filterIPDPatient = async (req, res) => {
  const like_name = req.body.like_name;
  // console.log(req.body.like_name)
  const request = new sql.Request();
  const query1 = `select * from M_IPDAdmission where (PatientName LIKE '%${like_name}%' OR
            HRNo LIKE '%${like_name}%') ORDER BY Date DESC`
  const query2 = `SELECT 
    *
FROM 
    (
        SELECT 
            *,
            CAST(Date AS DATETIME) + CAST(Time AS DATETIME) AS CombinedDateTime,
            ROW_NUMBER() OVER (PARTITION BY HRNo ORDER BY CAST(Date AS DATETIME) + CAST(Time AS DATETIME) DESC) AS rn
        FROM 
            M_PatientMaster
        WHERE 
            (PatientName LIKE '%${like_name}%' OR
            HRNo LIKE '%${like_name}%')
            AND ActiveStatus = 'Y'
    ) AS subquery
WHERE 
    rn = 1;
`
  const query3 = `SELECT 
    *
FROM 
    (
        SELECT 
			PM.AID, PM.HRNo, PM.OPDNo, PM.TitleID, PM.PatientName, PM.Gender, PM.Year, PM.Month, PM.Days, PM.RelationName, PM.Address, PM.DistictID, PM.PinCode, PM.ContactNo, PM.OccupationID, PM.RelationID, PM.PatientStatus, PM.ReligionID, PM.MaritalStatus,
            OM.OID AS OccupationOID, 
            OM.OccupationName,     
			DM.DID,
			DM.DistrictName,
			SM.StateId,
      DM.CountryId,
			SM.StateName,
            CAST(Date AS DATETIME) + CAST(Time AS DATETIME) AS CombinedDateTime,
            ROW_NUMBER() OVER (PARTITION BY HRNo ORDER BY CAST(Date AS DATETIME) + CAST(Time AS DATETIME) DESC) AS rn
        FROM 
            M_PatientMaster AS PM
		join 
		M_OccupationMaster AS OM
		ON PM.OccupationID = OM.OID
		join
		M_DistrictMaster AS DM
		ON PM.DistictID = DM.DID
		join
		M_StateMaster AS SM
		ON DM.StateId = SM.StateId
        WHERE 
            (PM.PatientName LIKE '%${like_name}%' OR
            PM.HRNo LIKE '%${like_name}%')
    ) AS subquery
WHERE 
    rn = 1;`
  try{
    const filtered_patient_list = await request.query(query1);
    // console.log(filtered_patient_list)
    const combinedResults = {
      filtered_patients: filtered_patient_list.recordset
    }
    res.json(combinedResults)
  } catch (err) {
    res.status(500).json({error: "Database Error"})
  }
}

exports.checkAdmissionStatus = async(req, res) => {
  const {HRNo} = req.body;
  const request = new sql.Request();
  const query = `select * from M_BedMaster where IPDHRNo='${HRNo}'`;
  try{
    const AdmissionStatus = await request.query(query);
    console.log(AdmissionStatus.recordset.length);
    res.json({NoOfAdmission: AdmissionStatus.recordset.length})
  }catch(err){
    res.status(500).json({err: "Database Error"});
  }
}

exports.filterIPDPatientAuto = async (req, res) => {
  const like_name = req.body.like_name;
  // console.log(req.body.like_name)
  const request = new sql.Request();
  const query1 = `select IPAID, HRNo, PatientName, Date from M_IPDAdmission where (PatientName LIKE '%${like_name}%' OR
            HRNo LIKE '%${like_name}%') AND RegStatus='B' AND Discharge='N' ORDER BY Date DESC`
  try{
    const filtered_patient_list = await request.query(query1);
    // console.log(filtered_patient_list)
    const combinedResults = {
      filtered_patients: filtered_patient_list.recordset
    }
    res.json(combinedResults)
  } catch (err) {
    res.status(500).json({error: "Database Error"})
  }
}