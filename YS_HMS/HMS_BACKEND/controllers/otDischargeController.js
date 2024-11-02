const { request } = require('express');
const sql = require('mssql/msnodesqlv8');
exports.fetchOtDischarge = async(req, res) => {
    const {IPAID} = req.body;
    // console.log("IPD NO", IPDNo)
    const request = new sql.Request();
    const query = `select IPAD.Date AS AdmDate, IPAD.Time AS AdmTime, IPAD.Year, IPAD.Month, IPAD.Days, IPAD.PhoneNo,OTD.* from Trn_OTDischarge AS OTD
join 
M_IPDAdmission AS IPAD
on IPAD.IPDNo=OTD.IPDNO
where OTD.IPDID='${IPAID}'`
    try{
        const otDischarge = await request.query(query);
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
