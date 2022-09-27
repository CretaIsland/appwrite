const sdk = require("node-appwrite");
/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - request body data as a string
    'variables' - object with function variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/


function addZero(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}

function getYesterday() {
    let today = new Date();
    let yesterday = new Date(today.setDate(today.getDate() -1));

    var year = yesterday.getFullYear();
    var month = addZero(yesterday.getMonth() + 1);
    var day = addZero(yesterday.getDate());
    var hour = addZero(yesterday.getHours());
    var minute = addZero(yesterday.getMinutes());
    var second = addZero(yesterday.getSeconds());

    var retval  = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second + ".000";
    return retval;
}



module.exports = async function (req, res) {
  const client = new sdk.Client();

  // You can remove services you don't use
  //let account = new sdk.Account(client);
  //let avatars = new sdk.Avatars(client);
  let database = new sdk.Databases(client);
  //let functions = new sdk.Functions(client);
  //let health = new sdk.Health(client);
  //let locale = new sdk.Locale(client);
  //let storage = new sdk.Storage(client);
  //let teams = new sdk.Teams(client);
  //let users = new sdk.Users(client);

  var projectId = "";
  var databaseId = "";
  var apiKey = "";
  var endPoint = "";
  try {
    var payload = JSON.parse(req.payload);
    // from command line arguments
    projectId = payload.projectId;
    databaseId = payload.databaseId; 
    apiKey = payload.apiKey; 
    endPoint = payload.endPoint; 
  } catch (e1) {
    console.warn("Payload are not set");
    // from Appwrite console
    try {
      var variables = JSON.parse(req.variables);
  
      projectId = variables.projectId;
      databaseId = variables.databaseId;
      apiKey = variables.apiKey;
      endPoint = variables.endPoint;
    } catch (e2) {
      console.warn("variables are not set");
   }
  }

  if (!projectId || !databaseId || !apiKey || !endPoint ) {
  projectId = "hycopTest";
  databaseId = "hycopTestDB";
  apiKey = "a3d5ba69e4972a10ee68903c2a91f0fe349754849831613d5505d9ddfa1cb87ac9031588975ea6eca28c5afbceba18bc762f824dd0fdbe12c0b8c6c2b7fe61fd5ab8b8cac2d365f6c805116dafc06cd37e1a7e2cd03a898662ca20db7640b606eb7cd0ae806d433531b997a1d48babac24800fa8b0a1b93b81df6c68db8f01b8";
  endPoint = "http://ec2-3-37-163-220.ap-northeast-2.compute.amazonaws.com:9090/v1";
  }

  client
    .setEndpoint(endPoint)
    .setProject(projectId)
    .setKey(apiKey)
    .setSelfSigned(true);

  let yesterdayStr = getYesterday();
  //strftime('%Y-%m-%d %I:%M:%S.000', tm)
  //let yesterdayStr = '2022-09-27 15:41:31.621';

  try {
    var response = await database.listDocuments(databaseId, 'creta_delta', 
	[
		sdk.Query.lessThan('updateTime', yesterdayStr),
		sdk.Query.orderAsc('updateTime')
	]);

    let total = response.total;
    let documentList = response.documents;
    let deleted = 0;
    for(var i=0;i<total;i++) {
      database.deleteDocument(databaseId, 'creta_delta', documentList[i].$id);
      deleted = deleted + 1;
    }
    //let velog = JSON.parse(response);
    res.json({
      deleted: deleted
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
    });
  }
  
  
};

