const fs = require('fs/promises')
const { writeFileSync, existsSync, readFileSync } = require('fs')
const querystring = require('querystring')
const jsqr = require('jsqr')
const Jimp = require('jimp')
const axios = require('axios').default
const YAML = require('yaml')

const IMAGE_URL = process.cwd() + '/image'
const DATA_URL = process.cwd() + '/data.json'

const file = readFileSync('./config.yml', 'utf8')
const config = YAML.parse(file)
console.log(config);

let AUTHORIZATION = config.token
let map = []

const instance = axios.create({
  baseURL: 'http://27.37.67.47/admin/',
  timeout: 50000,
  headers: {
    "Authorization": AUTHORIZATION
  }
});

async function bootstrap() {
  console.log(`1、读取文件夹里面的二维码 -> url地址 解析params -> 存储成json`);
  if (!existsSync(DATA_URL)) {
    await readImagesQRCodeToDingURL();
    console.log(`completed!`);
  } else {
    const data = await fs.readFile(DATA_URL, 'utf8')
    map = JSON.parse(data)
    console.log(`文件已存在`);
  }

  console.log(`2、发起请求`);
  let i = 0;
  const timer = setInterval(async function () {
    if (i === map.length - 1) clearInterval(timer)
    const element = map[i];
    const obj = {
      "seqCode": `{\"formType\":\"ClassmatesEvaluation\",\"transcriptId\":${element.params.transcriptId}}`,
      "formData": `{\"morality\":90,\"intelligence\":90,\"physique\":90,\"aesthetics\":90,\"labour\":90}`,
      "hash": `${element.params.hash}`
    }
    const response = await instance.post('/ReflectionMeeting/submitEvaluationForm', obj)
    console.log(`${element.key}: ${response.data.msg}`);
    i += 1
  }, config.timeout)
}

async function readImagesQRCodeToDingURL() {
  const images = await fs.readdir(IMAGE_URL)

  for (const image of images) {
    const { width, height, data } = await getImageData(IMAGE_URL + `/${image}`)
    const { data: realUrl } = jsqr(data, width, height);
    const urlObj = querystring.decode(realUrl);

    let params = {}
    Object.keys(urlObj).forEach(item => {
      const value = urlObj[item]
      const paramsString = value.split(',')[1]
      const [transcriptIdKV, hashKV] = paramsString.split('&')

      params = {
        transcriptId: transcriptIdKV.split(':')[1].slice(0, -1),
        hash: hashKV.split('=')[1]
      }
    })

    map.push({
      key: image,
      url: realUrl,
      params: params
    })
  }

  writeFileSync(process.cwd() + '/data.json', JSON.stringify(map), 'utf8')
}

async function getImageData(imgUrl) {
  const { bitmap } = await Jimp.read(imgUrl)

  return {
    width: bitmap.width,
    height: bitmap.height,
    data: bitmap.data,
  }
}

bootstrap()
