const rp = require('request-promise');
const xl = require('excel4node');
const cheerio = require('cheerio');
const first_page = 174
const last_page = 177







async function getData(url, page){

    let rowIndex = 2
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet('Worksheet Name');
    
    const headingColumnNames = [
        "Group",
        "Members",
        "Description"
    ]
    let headingColumnIndex = 1;
    headingColumnNames.forEach(heading => {
        ws.cell(1, headingColumnIndex++)
            .string(heading)
    });

        let myPromise = rp(url)
        var result = await myPromise

        let $ = cheerio.load(result);  //loading of complete HTML body
        var pageMemberCount = 0
        $('div.table-responsive tr').each(function(index){

            const groupname = $(this).find('p.group-name').text()
            const description = $(this).find('td:nth-child(2)').text().trim()
            const members = $(this).find('td:nth-child(3)').text().trim()

            pageMemberCount = Number(pageMemberCount) + Number(members)
            
            const obj = {
                group : groupname,
                description: description,
                members: members,
                //hasVip: vip
            };

            let columnIndex = 1
            Object.keys(obj).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++).string(obj[columnName])
            });

            rowIndex++
            
        });

        wb.write(`telegramcrypto_${page}.xlsx`);
   
}



for (var i = first_page; i <= last_page; i++) {
    
    
    getData(`https://telegramcryptogroups.com/?page=${i}`, i)


}

