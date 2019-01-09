module.exports = {


  friendlyName: 'Wxpay',


  description: 'Wxpay payment.',


  inputs: {
    body: {
      type: 'string',
      example: '宝马5系2017款530，进口版，无划痕，无事故。',
      description: '商品描述',
    },
    tradeNo: {
      type: 'string',
      example: '20185646878461456',
      description: '商户产生的订单号'
    },
    totalFee: {
      type: 'string',
      example: '100.00',
      description: '商品总金额'
    }

  },


  exits: {

  },


  fn: async function (inputs) {

    var appid="wxe78321de5f6234fe";
    var mch_id="1508392321";  //需要确认一下mch_id ，微信开放平台
    //var body=inputs.body;  在正式上线时，请使用这个
    var body="宝马730"
    var nonce_str=WXPayUtilies.createNonceStr();
    var spbill_create_ip='60.31.46.82';
    var trade_type='APP';
    //var out_trade_no=inputs.tradeNo;  在正式上线时，请使用这个
    var out_trade_no='56456789456';
    //var total_fee=inputs.totalFee; 在正式上线时，请使用这个
    var total_fee='0.01';   
    var notify_url='http://www.cheshoudang/payment/weixinurl';
    var mchkey="h2yFqyTf1hAlJDta57wYSh15dK5M1Egl";  //请在商户平台再次确认该签名秘钥，并使用最终的

    //let sign = wxpay.paysignjsapi(appid,body,mch_id,nonce_str,notify_url,out_trade_no,spbill_create_ip,total_fee,trade_type,mchkey);
    let sign =WXPayUtilies.paysignjsapi(
      appid,
      body,
      mch_id,
      nonce_str,
      notify_url,
      out_trade_no,
      spbill_create_ip,
      total_fee,
      trade_type,
      mchkey
      );
    
    //组装xml数据
    var formData  = "<xml>";
    formData  += "<appid>"+appid+"</appid>";  //appid
    formData  += "<body>宝马730</body>";
    formData  += "<mch_id>"+mch_id+"</mch_id>";  //商户号
    formData  += "<nonce_str>"+nonce_str+"</nonce_str>"; //随机字符串，不长于32位。
    formData  += "<notify_url>"+notify_url+"</notify_url>";
    formData  += "<out_trade_no>"+out_trade_no+"</out_trade_no>";
    formData  += "<spbill_create_ip>"+spbill_create_ip+"</spbill_create_ip>";
    formData  += "<total_fee>"+total_fee+"</total_fee>";
    formData  += "<trade_type>"+trade_type+"</trade_type>";
    formData  += "<sign>"+sign+"</sign>";
    formData  += "</xml>";
    console.log(formData);
    var rq=require('request-promise');
    var rqOpts={
      method:'post',
      uri:'https://api.mch.weixin.qq.com/pay/unifiedorder',
      body:formData
    }
    // await rq.post(rqOpts).then(function(res){
    //   console.log(res);
    // });
    // All done.
    return sign;

  }


};

var WXPayUtilies = {
 
  //把金额转为分
  getmoney: function (money) {
      return parseFloat(money) * 100;
  },

  // 随机字符串产生函数  
  createNonceStr: function () {
      return Math.random().toString(36).substr(2, 15);
  },

  // 时间戳产生函数  
  createTimeStamp: function () {
      return parseInt(new Date().getTime() / 1000) + '';
  },

  //签名加密算法
  paysignjsapi: function (appid, body, mch_id, nonce_str, notify_url, out_trade_no, spbill_create_ip, total_fee, trade_type, mchkey) {
      var ret = {
          appid: appid,
          mch_id: mch_id,
          nonce_str: nonce_str,
          body: body,
          notify_url: notify_url,
          out_trade_no: out_trade_no,
          spbill_create_ip: spbill_create_ip,
          total_fee: total_fee,
          trade_type: trade_type
      };
      //console.log('ret==', ret);
      var string = raw(ret);
      var key = mchkey;
      string = string + '&key=' + key;
      console.log('string=', string);
      var crypto = require('crypto');
      return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
  },
  //签名加密算法,第二次的签名
  paysignjsapifinal: function (appid,mch_id,prepayid,noncestr,timestamp,mchkey) {
      var ret = {
          appid: appid,
          partnerid: mch_id,
          prepayid: prepayid,
          package: 'Sign=WXPay',
          noncestr: noncestr,
          timestamp: timestamp,
      };
      console.log('retretret==', ret);
      var string = raw(ret);
      var key = mchkey;
      string = string + '&key=' + key;
      console.log('stringstringstring=', string);
      var crypto = require('crypto');
      return crypto.createHash('md5').update(string, 'utf8').digest('hex').toUpperCase();
  },
  getXMLNodeValue: function (xml) {
      // var tmp = xml.split("<"+node_name+">");
      // console.log('tmp',tmp);
      // var _tmp = tmp[1].split("</"+node_name+">");
      // console.log('_tmp',_tmp);
      // return _tmp[0];
      xmlreader.read(xml, function (errors, response) {
          if (null !== errors) {
              console.log(errors)
              return;
          }
          console.log('长度===', response.xml.prepay_id.text().length);
          var prepay_id = response.xml.prepay_id.text();
          console.log('解析后的prepay_id==',prepay_id);
          return prepay_id;
      });
  }

}

function raw(args) {
  var keys = Object.keys(args);
  keys = keys.sort()
  var newArgs = {};
  keys.forEach(function (key) {
      newArgs[key] = args[key];
  });
  var string = '';
  for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
}


