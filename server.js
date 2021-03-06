const path = require('path')
const express = require('express')
const request = require('request')
const proxy = require('proxy-middleware')
const fs = require('fs')
const https = require('https')

const environmentsMock = require('./src/test/mockend/environmentsMock')
const resourcesMock = require('./src/test/mockend/resourcesMock')
const applications = require('./src/test/mockend/applicationsMock')
const resourceTypes = require('./src/test/mockend/resourceTypesMock')
const nodesMock = require('./src/test/mockend/nodesMock')


const config = require('./config')
console.log("ext", config.externalResources)
const selftest = require('./selftest')


const app = new express();

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.dev.js');

const serverOptions = {
    quiet: true,
    noInfo: false,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: webpackConfig.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    stats: {colors: true},
    historyApiFallback: true
}

const compiler = webpack(webpackConfig);

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));
app.use(express.static(__dirname + "/dist"))

app.get('/config', (req, res) => {
    res.json(config.externalResources)
})

app.get("/mockapi/applications", (req, res) => {
    sendJson(res, applications)
})

app.get("/mockapi/environments", (req, res) => {
    sendJson(res, environmentsMock.findEnvironments(req.query))
})

app.get("/mockapi/resources/types/", (req, res) => {
    sendJson(res, resourceTypes)
})

app.get("/mockapi/resources", (req, res) => {
    sendJson(res, resourcesMock.findResources(req.query))
})

app.get("/mockapi/nodes/types", (req, res) => {
    sendJson(res, nodesMock.types)
})


app.get('/mockapi/nodes/:hostname', (req, res) => {
    sendJson(res, nodesMock.getNode(req.params.hostname))

})

app.get("/mockapi/nodes", (req, res) => {
    console.log("der", req.params)
    sendJson(res, nodesMock.getNodes())
})



app.get('/selftest', selftest.selftest)

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './dist/index.html'));
})

function sendJson(res, json) {
    if(!json){
        res.status(404).send("Found notn for you dawg")
        return
    }
    else if(Array.isArray(json)) {
        res.set('total_count', json.length)
    }
        res.json(json)


}

app.listen(config.server.port, config.server.host, (err) => {
    if (err) {
        console.error(err);
        return
    }
    console.info('----\n==> ✅  Webpack Development server is running on %s:%s.', config.server.host, config.server.port);
})


