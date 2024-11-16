const { request } = require('express');
const sql = require('mssql/msnodesqlv8');

const replaceDigits2 = (b) => {
    let a='CE00000000';
    // Convert 'a' to an array of characters
    let aArr = a.split(''); // '10000000' as an array
  
    // Convert 'b' to a string and reverse it to start replacing from the ones place -- 1355 -- 5531
    let bStr = b.toString().split('').reverse();
  
    // Iterate over each digit of 'b' and replace the corresponding value in 'aArr'
    for (let i = 0; i < bStr.length; i++) {
      aArr[aArr.length - 1 - i] = bStr[i]; // Replace from rightmost position
    }
  
    // Join the modified array back into a string
    return aArr.join('');
  }

exports.filterServiceMaster = async (req, res) => {
    const like_name = req.body.like_name;
    // console.log(req.body.like_name)
    const request = new sql.Request();
    const query1 = `select SMD.Rate,SM.AID, SM.SID, SM.ServiceName, SM.ReportingName, SM.SubDepartmentID, SM.ReportFormatID, TAX.GSTPre,SM.SampleCollection, SM.SampleID from M_ServiceMaster AS SM
                    JOIN
                    M_ServiceMasterDetails AS SMD
                    ON SM.SID = SMD.SID
                    JOIN
                    V#GSTAccountPre AS TAX
                    ON TAX.AccountLedgerID = SM.TaxAccountID
                    where SM.ServiceName LIKE '%${like_name}%' AND SM.ActiveStatus='Y' AND SMD.Rate > 0`
    try {
        const filtered_Service_list = await request.query(query1);
        // console.log(filtered_patient_list)
        const combinedResults = {
            filtered_Service_list: filtered_Service_list.recordset
        }
        res.json(combinedResults)
    } catch (err) {
        res.status(500).json({ error: "Database Error" })
    }
}

exports.createCaseEntry = async(req, res) => {
    const {IPDID, Rate, Discount, Amount, NetAmount, RecAmount, date, time, UserID, UserName, Entries} = req.body;
    // console.log(req.body);
    const FetchPatientDetailsQuery = `select * from M_IPDAdmission where IPAID='${IPDID}'`;
    const FetchLastCaseEntryQuery = `select TOP 1 * from Trn_CaseEntry ORDER BY CaseID DESC`;
    
    const request = new sql.Request();
    try{
        const PatientDetails = await request.query(FetchPatientDetailsQuery);
        const FetchLastCaseEntry = await request.query(FetchLastCaseEntryQuery);
        // console.log(FetchLastCaseEntry.recordset[0].CaseID + 1);

        const CreateCaseEntryQuery = `INSERT INTO Trn_CaseEntry (BranchID, HospitalID, PatientType, HRNo, CaseID, CaseNo, CaseDate, CaseTime, OPDIPDNo, LabSINo, DeliveryDate, DeliveryTime, PatientName, Gender, Age, Years, Months, Days, DOB, Address, TreatmentUpToDate, Package, MobileNo, CompanyID, DepartmentID, DoctorID, RefDoctorID, SampleCenterID, Total, ServiceCharegePer, ServiceCharegeRs, CancelServiceRs, DiscountPer, DiscountRs, Amount, OldDueAmount, GrandTotal, NetAmount, ReceiptAmount, BalanceAmount, MOD, BankID, ChequeDate, RoomNo, Remark, CheckInUser, CaseStatus, CaseCancel, CaseCancelDate, CaseCancelUserID, EntryType, FYearID, ActiveStatus, DeleteStatus, UserID, RTS, IPAddress, ModifyUserID, ModifyDate, IsUpload, IsUploadRTS, IPDID, DaySrNo, Disc)
VALUES(1, 1000001, 'I', ${PatientDetails.recordset[0].HRNo}, '${FetchLastCaseEntry.recordset[0].CaseID + 1}', '${replaceDigits2(FetchLastCaseEntry.recordset[0].CaseID + 1)}', '${date} 00:00:00.000', '1900-01-01 ${time}:00.000', '${PatientDetails.recordset[0].IPDNo}', '2', '${date} 00:00:00.000', '1900-01-01 ${time}:00.000', '${PatientDetails.recordset[0].PatientName}', '${PatientDetails.recordset[0].Gender}', '0', '${PatientDetails.recordset[0].Year}', '0', '0', '1900-01-01 00:00:00.000', '${PatientDetails.recordset[0].Address}', '1900-01-01 00:00:00.000', 0, '${PatientDetails.recordset[0].PhoneNo}', ${PatientDetails.recordset[0].CompanyID}, 0, 1, 1, 0, ${Rate}, 0.00, 0.00, 0.00, 0.00, ${Discount}, ${NetAmount}, 0.00, ${NetAmount}, ${NetAmount}, 0.00, ${NetAmount}, 'CR', 0, '1900-01-01 00:00:00.000', 'VIP-2', ' ', '${UserName}', 'P', 'N', '1900-01-01 00:00:00.000', 0, 'N', 1, 'Y', 'N', ${UserID}, '${date} ${time}:33.173', '08-BF-B8-74-07-C1', 0, '1900-01-01 00:00:00.000', 'Y', '${date} ${time}:33.173', ${IPDID}, 32, 0.00)`
        const Insert = await request.query(CreateCaseEntryQuery);
        Entries.map(async(Entry, index) => {
            console.log(Entry);
            const CreateCaseEntryDetailQuery = `INSERT INTO Trn_CaseEntryDetails (BranchID, HospitalID, CaseID, EntryID, TestID, Rate, GSTPre, Amount, DelDate, DelTime, Delivery_Days, ActiveStatus, DeleteStatus, UserID, RTS, IPAddress, ModifyUserID, ModifyDate, IsUpload, IsUploadRTS, FYearID, TestCancel, TestCancelDate, TestCancelUserID, IsPrinting, IsStatus, ReportDate, Delivered, DoneByDoctor, DPID, GSTAmount, Discountper, DiscountAmount)
                                                VALUES (1, 1000001, ${FetchLastCaseEntry.recordset[0].CaseID + 1}, 'N', ${Entry.Service.SID}, ${Entry.Rate}, 0, ${Entry.Amount - Entry.Discount}, '${date} 00:00:00.000', '1900-01-01 ${time}:00.000', 0, 'Y', 'N', ${UserID}, '${date} ${time}:00.000', '0,0,0,0', 0, NULL, 'Y', '${date} ${time}:00.000', 1, 'N', NULL, 0, 'Y', 'N', NULL, NULL, NULL, 0, 0.00, 0.00, ${Entry.Discount})`
            const CreateCaseEntryDetail = await request.query(CreateCaseEntryDetailQuery);
        })
        res.json({result: ""});
    }catch(err){
        res.status(500).json({err: err});
    }
}