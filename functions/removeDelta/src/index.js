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
  apiKey = "de04f1ce3c8e69e091b74bb8ebf1321484eb1c5bd384aaaa9ca201027d0e1dec64de67ae328fab89bc1ca341f0262d8679cd715b89955fed64304063a70d215eb79c33f2a19d290071e1fdc9682a09bfc49f602490974117a7853af2baad0a1a546c9dff999c62964440bdb4ceb0dcba131d4668d0b43dcf4b9c08e3aea949e0";
  endPoint = "http://ec2-43-200-191-107.ap-northeast-2.compute.amazonaws.com:9090/v1";
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
    var response = await database.listDocuments(databaseId, 'hycop_delta', 
	[
		sdk.Query.lessThan('updateTime', yesterdayStr),
		sdk.Query.orderAsc('updateTime')
	]);

    let total = response.total;
    let documentList = response.documents;
    let deleted = 0;
    for(var i=0;i<total;i++) {
      database.deleteDocument(databaseId, 'hycop_delta', documentList[i].$id);
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

