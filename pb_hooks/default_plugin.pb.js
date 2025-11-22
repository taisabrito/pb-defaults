/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/_/defaults", (e) => {

    const html = $template.loadFiles(`${__hooks}/default-plugin/page-default-fields.html`).render()

    return e.html(200, html)

})

routerAdd("GET", "/api/default-fields", (e) => {
    try {
        let file = $os.readFile(`default.json`)
        return e.json(200, JSON.parse(toString(file)))
    } catch (error) {
        return e.json(200, {})    
    }
}, $apis.requireSuperuserAuth())

routerAdd("POST", "/api/default-fields", (e) => {

    let body = e.requestInfo().body

    let json = JSON.stringify(body, null, 2)

    let codigoFinal = ""

    //Fazer loop para gerar o código JS
    for (let collectionName in body) {
        let fields = body[collectionName]
        codigoFinal += generateCode(collectionName, fields)
    }

    function generateCode(collectionName, fields) {

        let code = ""

        for (let fieldName in fields) {
            let fieldValue = fields[fieldName]
            code += "    e.record.set(\"" + fieldName + "\", " + JSON.stringify(fieldValue) + ")\n"
        }

        return `onRecordCreateExecute((e) => {
${code}
    e.next()
}, "${collectionName}")\n\n`;

    }

    //Pegar cada coleção e seus campos

    try {
        $os.writeFile(`${__hooks}/default-values.pb.js`, codigoFinal, 0o644);
    } catch (error) {
        console.log("Erro ao salvar o arquivo de código: " + toString(error))
    }
    
    try {
        $os.writeFile(`default.json`, json, 0o644);
    } catch (error) {
        console.log("Erro ao salvar o arquivo JSON: " + toString(error))
    }

    return e.string(200, codigoFinal)

}, $apis.requireSuperuserAuth())
