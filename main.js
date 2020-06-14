const puppeter = require('puppeteer')
const app = require('express')()
const port = 2000
const url = ''

app.listen(port, function () {
    console.log(`app listen on port ${port}`)
})

app.get('/', async (req, res) => {
    try {
        var cnpj = req.query.cnpj

         await scrape(cnpj).then((value)=>{
            if (value == undefined) res.status(500).send({Erro: 'Erro no processamento da requisção, tente novamente'})
            res.status(200).json(value)
         })
        
    } catch (error) {
        console.log(error)
        res.status(404).json({Erro: 'CNPJ não encontrado'})
    }

})

const chromeOptions = {
    headless: true,
    defaultViewport: null,
    args: ['--enable-features=NetworkService'],
    ignoreHTTPSErrors: true
}



// {
//     args: ['--enable-features=NetworkService'],
//     headless: true,
//     ignoreHTTPSErrors: true,
//   }
let scrape = async (cnpj) => {

    try {
        const browser = await puppeter.launch(chromeOptions)
        const page = await browser.newPage()
        await page.setExtraHTTPHeaders({'Cookie': 'PHPSESSID=dgiv4u2sgcrc9qs4ufr1a7l0t6; _ga=GA1.3.2043463382.1591812169; _gid=GA1.3.1041996287.1591812169; _fbp=fb.2.1591812169909.1641639227; check-sf=false; check-sn=true; check-pt=false'});
        await page.goto(`http://www.sintegraws.com.br/api/v1/execute-api-tela2.php?cnpj=${cnpj}&plugin=SN`, { waitUntil: 'networkidle2' })
        

        let bodyHTML = await page.evaluate(() => document.body.innerHTML);
        
        const result = await page.evaluate(() => {
            let registros = {}
            registros.code = "0",
            registros.status = "OK",
            registros.message = "Pesquisa realizada com sucesso.",
            registros.data_consulta = document.querySelector("#conteudo > h5 > span").textContent
            registros.cnpj = document.querySelector("#conteudo > div:nth-child(2) > div.panel-body > span:nth-child(1)").textContent.trim()
            registros.nome_empresarial = document.querySelector("#conteudo > div:nth-child(2) > div.panel-body > span:nth-child(6)").textContent.trim()
            registros.situacao_simples_nacional = document.querySelector("#conteudo > div:nth-child(3) > div.panel-body > span:nth-child(1)").textContent.trim()
            registros.situacao_simei = document.querySelector("#conteudo > div:nth-child(3) > div.panel-body > span:nth-child(3)").textContent
            registros.situacao_simples_nacional_anterior = document.querySelector("#conteudo > div:nth-child(6) > div.panel-body > span:nth-child(1) > span").textContent.trim()
            registros.situacao_simei_anterior = document.querySelector("#conteudo > div:nth-child(6) > div.panel-body > span:nth-child(4) > span").textContent.trim()
            registros.eventos_futuros_simples_nacional = document.querySelector("#spnEvFutSimei").textContent.trim()
            registros.eventos_futuros_simples_simei = document.querySelector("#spnEvFutSimei").textContent.trim()
            return registros
        })

        //await page.waitForSelector('#btnMaisInfo')
        // await page.waitFor(4000)
        // await page.evaluate(() => {
        //     document.getElementById('btnMaisInfo').click()
        // })

        browser.close()
        return result

    } catch (error) {
         console.log(error)
     }
 }








