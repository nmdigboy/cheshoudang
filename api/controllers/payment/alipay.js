

module.exports = {


  friendlyName: 'Alipay',


  description: 'Alipay payment.',


  inputs: {
    body: {
      type: 'string',
      example: '宝马5系2017款530，进口版，无划痕，无事故。',
      description: '对交易信息的具体描述，最大长度128',
    },
    subject: {
      type: 'string',
      example: '2017款宝马5系',
      description: '商品标题、订单标题，最大长度256'
    },
    out_trade_no: {
      type: 'string',
      example: '2018122092938834',
      description: '产品订单号，最大长度64'
    },
    total_amount: {
      type: 'string',
      example: '425000.00',
      description: '订单总金额，精确到小数点后两位'
    }

  },


  exits: {

  },


  fn: async function (inputs) {
    var moment=require('moment');
    let params = new Map();
    params.set('app_id', '2018120162374692');
    params.set('method', 'alipay.trade.app.pay');
    params.set('charset', 'utf-8');
    params.set('sign_type', 'RSA2');
    params.set('timestamp', moment().format('YYYY-MM-DD HH:mm:ss'));
    params.set('version', '1.0');
    params.set('notify_url', 'http://www.cheshoudang.com/payment/alipayurl');
    //params.set('biz_content', this._buildBizContent(inputs.body, inputs.subject, inputs.out_trade_no, inputs.total_amount));
    params.set('biz_content', _buildBizContent('宝马', '产品介绍', '201521546879', '0.1'));

    //1.获取所有请求参数，不包括字节类型参数，如文件、字节流，剔除sign字段，剔除值为空的参数
    //[...paramsMap]用来将paramsMap构造一个数组
    let paramsList = [...params].filter(([k1, v1]) => k1 !== 'sign' && v1);
    //2.按照字符的键值ASCII码递增排序
    paramsList.sort();
    //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
    let paramsString = paramsList.map(([k, v]) => `${k}=${v}`).join('&');

    let Singed= await _buildSign(params);

    let secString=paramsString+"&sign="+Singed;
    //console.log(secString);
    //console.log(encodeURI(secString));
    // 完成后将返回给前端一个签名好的参数字符串，将这个字符串POST给阿里的支付宝网关url：https://openapi.alipay.com/gateway.do.
    return encodeURI(secString);
    // All done.
  }

};

  //将内容进行签名
  function _buildSign(paramsMap) {
    //var path=require('path');
    //var fs=require('fs');
    //1.获取所有请求参数，不包括字节类型参数，如文件、字节流，剔除sign字段，剔除值为空的参数
    //[...paramsMap]用来将paramsMap构造一个数组
    let paramsList = [...paramsMap].filter(([k1, v1]) => k1 !== 'sign' && v1);
    //2.按照字符的键值ASCII码递增排序
    paramsList.sort();
    //3.组合成“参数=参数值”的格式，并且把这些参数用&字符连接起来
    let paramsString = paramsList.map(([k, v]) => `${k}=${v}`).join('&');
    //let dir=__dirname.replace('api\\controllers\\payment','');
    
    //let privatPath = path.join(dir, 'assets', 'keys', 'app_private.pem');//应用私钥
    //let privateKey1 = fs.readFileSync(privatPath, 'utf8');
    //console.log(privateKey1);
    let privateKey='-----BEGIN RSA PRIVATE KEY-----\r\nMIIEpAIBAAKCAQEAzNIjpW0bGd820KDXtRQGDmKHGtpXiGerwTH9g6szBVLkuEa5vvR10IijvjJGY2Rs1Rvxo37U0dFI88940RrAyhyLeVjkKJntQF9FsBSlt8656zgsUaxsOYgmZ+ivGCENothDKCLa+a5dD1xVmuIj+ECwyO7dn1WWWCtYvXDmEGtHV8ge+vatI9P4eR+AOBMxE42DI7mfp9OWNyyPEpTV5Mpc8cAWHvhptreZpXJ4i81wjrTYh5iZenhsbDe6QRr/F8LVORtlawgaApZlSlVxPjNkH6su3t6UrGNQYCZjWg0vd1G/IW0MzsWFnDUWdlu8We3ru2pzVtziZmGZ1hmzQwIDAQABAoIBAASk5yYDGVA23XlRjFKQx6pf1YxoUv/GygAxb/wiT5/ZR1JeWCvaQymdT4kqfqoWRtl2Lr50S8MOKcdNdwHWx3RNvWPc/h9ljhmdj2j0ruVCDLkmpuqbLEEJs0U742x6o2KD4NHyKGDs8TM99rryUbp5TQjhUakhOa16HiL9glnw6mM0B6Qfps8Cmlsslq7TW+c3fLMT6nX9UZl8Vj7/G6/gPx+l5rX9tk6aiaqsVGNyaf+Ax46Menme4CxHq+QGdp25YvAw/L1gsP5CqwjJDNpcAxxxPm085Gr8YkVCcTFzl3kuY5dCvnNoi9EbHEnDrAONEg9v1ABpgNcK7/HP2EECgYEA7SYriWiLLrC2DokEbe3zcRUIRueg45aPfDv4NPMtFJIanIWj23HshLOBcsW3MBDjrAAD3hbX8Dal+penAt/sPJJkMVNLXLM8zhA97t6lE4tHc9RHSSFQWBkZ3OxWb3ZlX7uqtGNYIHb0keu9TyE1uiu5QO6aq7BVzStvBoVVmXMCgYEA3RocRDte7fg21J1ATq/CQGlviwoH7mNOgj22o0gsX/2YJm1P2YgbWRI55TN1KCGJY8Dcja27UQsVUp8v3l2tGVCnOdlr9FOg2m0QOpAyUsZpchx4a6/kFrIogJtQDAaqEGAGsZCLJzwUnfTfl6JVmDF24zf8Us6UpjD+du7zSvECgYEA2G7RpSKIhCA6x6E9LabRWw868ptLNuqeIWAJ8ylMp02AhAFjvk+G8MVzCvBvc6q2Xq/U18g5Y748VSw6/GCpFc71Kh8+1GewwtAH9g200tV2bLv8Iz4IOZ8O/5WifS+s7WY1MVTJhTeLlfF0YNeKVVK6TAx3lOHmLM3LEkR2DwkCgYBITF9t2FQkUIPtZjY/BK3qTg/RUUhipUpowDFWlyUbhlsYRapUoXL/3zvbPMZUhxLb8ZatJWAZEhy41aDbf5o4quzjt7rbO/VfN0aVP82Uz5hvXevqmqtk2IDx/Ndh91Po4t2NdoxqGfVL6WSrusNubs5HYmk50p888Mxkq6IWoQKBgQCI2XNfQkdn+3HNG80rt74WBENO9T2HigMDLrSNdwn91quyzjkEYOcxQp/1CJNoG3pPCHM4Dvx4PGaMoUaOtrxEE6r9ZrcWvXOC7Ed0umDYc6moFgsWj3DXBQopiKhPU39uixYyaHFjsqeiYZoj8/5tU4xUBnBWyouoOObLdPYYsw==\r\n-----END RSA PRIVATE KEY-----'
    let signType = paramsMap.get('sign_type');
    return _signWithPrivateKey(signType, paramsString, privateKey);
  }


  //签名方法
  function _signWithPrivateKey(signType, content, privateKey) {
    let sign;
    if (signType.toUpperCase() === 'RSA2') {
        sign = crypto.createSign("RSA-SHA256");
    } else if (signType.toUpperCase() === 'RSA') {
        sign = crypto.createSign("RSA-SHA1");
    } else {
        throw new Error('请传入正确的签名方式，signType：' + signType);
    }
    sign.update(content);
    return sign.sign(privateKey, 'base64');
  }

  function _buildBizContent(body, subject, outTradeNo, totalAmount) {
    let bizContent = {
      body: body,
      subject: subject,
      out_trade_no: outTradeNo,
      total_amount: totalAmount,
      product_code: 'QUICK_MSECURITY_PAY',
    };

    return JSON.stringify(bizContent);
  }