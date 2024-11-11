const { request } = require('express');
const sql = require('mssql/msnodesqlv8');

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