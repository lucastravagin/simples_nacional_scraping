const puppeter = require('puppeteer')
const app = require('express')()
const port = 2000
const url = 'https://consopt.www8.receita.fazenda.gov.br/consultaoptantes'

const chromeOptions = {
    headless: false,
    defaultViewport: null
}

let scrape = async () => {

    try {
        const browser = await puppeter.launch(chromeOptions)
        const page = await browser.newPage()
        await page.goto(url, { waitUntil: 'networkidle2' })


        await page.evaluate(() => {
            document.querySelector("#Cnpj").value = '42278473000103'
        })

        await page.waitFor(3000)

        await page.evaluate(() => {
            document.getElementById('btnSubmit').click()
        })

        // await page.waitFor(2000)
        // await page.evaluate(() => {
        //     document.getElementById('btnMaisInfo').click()
        // })

        await page.waitFor(3000)
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


scrape().then((value) => console.log(value))


const browser = await puppeter.launch({args: ['--no-sandbox']})
