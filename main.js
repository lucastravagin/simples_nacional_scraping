const request = require('request');
const app = require('express')()
const port = 2000;


app.listen(port, function () {
    console.log(`app listening on port ${port}`)
})


app.get('/', async (req, res) => {
    var cnpj = req.query.cnpj
    var token = '7012C9B1-4323-44F2-9185-0C3BDFB29A72'

    let optionsCNPJ = {
        'method': 'GET',
        'url': `https://www.sintegraws.com.br/api/v1/execute-api.php?token=${token}&cnpj=${cnpj}&plugin=SN`
    }
    let registros = await getRegistros(optionsCNPJ)

    res.status(200).send(registros);

})

const getRegistros = (optionsCNPJ) => {
    return new Promise((resolve, reject) => {
        request(optionsCNPJ, (error, response) => {
            if (error) return reject(err);
            try {
                resolve(JSON.parse(response.body))
            } catch (error) {
                reject(error)
            }
        })
    })
}