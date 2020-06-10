const puppeter = require('puppeteer')
const app = require('express')()
const port = 2000
const url = 'https://consopt.www8.receita.fazenda.gov.br/consultaoptantes'

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
    headless: false,
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
        await page.goto(url, { waitUntil: 'networkidle2' })
        ////page.setIgnoreHTTPSErrors(true);


        await page.type('#Cnpj', cnpj, {delay: 200}) 

        await page.evaluate(async () => {
            let botao = document.getElementById('btnSubmit')
            botao.click()
            await new Promise(r => setTimeout(r, 2000));
            const elementErro = document.querySelector("#conteudoPage > div:nth-child(2) > form > div.alert.alert-danger")
            if (elementErro) {
                return botao.click()
            }
              
        })

      
        // await page.waitFor(2000)
        // await page.evaluate(() => {
        //     document.getElementById('btnMaisInfo').click()
        // })

        await page.waitFor(2000)
        const result = await page.evaluate(() => {
            let registros = {}
            registros.cnpj = document.querySelector("#conteudo > div:nth-child(2) > div.panel-body > span:nth-child(1)").textContent
            registros.empresa = document.querySelector("#conteudo > div:nth-child(2) > div.panel-body > span:nth-child(6)").textContent
            registros.simples_nacional = document.querySelector("#conteudo > div:nth-child(3) > div.panel-body > span:nth-child(1)").textContent
            registros.simei = document.querySelector("#conteudo > div:nth-child(3) > div.panel-body > span:nth-child(3)").textContent
            // registros.opcao_pelo_simples_nacional_anteriores = document.querySelector("#maisInfo > div:nth-child(2) > div.panel-body > span:nth-child(1) > span").textContent
            // registros.enquadramentos_simei_anteriores = document.querySelector("#maisInfo > div:nth-child(2) > div.panel-body > span:nth-child(4) > span").textContent
            // registros.eventos_futuros_simples_nacional = document.querySelector("#spnEvFutSimei").textContent
            // registros.eventos_futuros_simei = document.querySelector("#spnEvFutSimei").textContent
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






