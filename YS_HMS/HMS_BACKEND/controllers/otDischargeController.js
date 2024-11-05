const { request } = require('express');
const sql = require('mssql/msnodesqlv8');
exports.fetchOtDischarge = async(req, res) => {
    const {IPAID} = req.body;
    // console.log("IPD NO", IPDNo)
    const request = new sql.Request();
    const query = `select FORM.DischargeFormatName, FORM.DischargeFormatId,FORM.Format,IPAD.Date AS AdmDate, IPAD.Time AS AdmTime, IPAD.Year, IPAD.Month, IPAD.Days, IPAD.PhoneNo,OTD.* from Trn_OTDischarge AS OTD
join 
M_IPDAdmission AS IPAD
on IPAD.IPAID=OTD.PId
join
M_OTDischargeFormatMaster AS FORM
on OTD.FormatType=FORM.DischargeFormatId
where OTD.IPDID='${IPAID}'`
    try{
        const otDischarge = await request.query(query);
        console.log("Discharge", otDischarge)
        //   const doctorVisits = await request.query(query2);
        res.json({otDischarge: otDischarge.recordset})
    }catch (err){
        res.status(500).json({error: "Database Error"})
    }
}

exports.fetchOtDischargeDetails = async(req, res) => {
    const {PId} = req.body;
    // console.log("PId NO", PId)
    const request = new sql.Request();
    const query = `select IPAD.Date AS AdmDate, IPAD.Time AS AdmTime, IPAD.Year, IPAD.Month, IPAD.Days, IPAD.PhoneNo,OTD.* from Trn_OTDischarge AS OTD
join 
M_IPDAdmission AS IPAD
on IPAD.IPDNo=OTD.IPDNO
where OTD.PId='${PId}'`
    try{
        const otDischarge = await request.query(query);
        //   const doctorVisits = await request.query(query2);
        res.json({otDischarge: otDischarge.recordset})
    }catch (err){
        res.status(500).json({error: "Database Error"})
    }
}

exports.getOTDischargeFormats = async(req, res) => {
    const query=`select DischargeFormatId, DischargeFormatName, Format from M_OTDischargeFormatMaster where ActiveStatus='Y'`;
    const request = new sql.Request();
    try{
        const OTDischargeFormats = await request.query(query);
        res.json({OTDischargeFormats: OTDischargeFormats.recordset});
    }catch (err){
        res.statue(500).json({error: "Database Error"});
    }
}