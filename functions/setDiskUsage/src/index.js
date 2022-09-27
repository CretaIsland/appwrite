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
//{"projectId":"62d79f0b36f4029ce40f","databaseId":"62d79f2e5fda513f4807","endPoint":"http://192.168.10.3/v1","apiKey":"163c3964999075adc6b7317f211855832ebb6d464520446280af0f8bbb9e642ffdcd2588a5141ce3ea0011c5780ce10986ed57b742fdb6a641e2ecf7310512cd5349e61385f856eb4789e718d750e2451c1b1519dd20cdf557b5edc1ae066e28430f5cc3e157abc4a13ad6aa112a48b07ce707341edfdc41d2572e95b4728905","usage":20}

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
  var usage = 0;
  try {
    var payload = JSON.parse(req.payload);
    // from command line arguments
    usage = payload.usage; 
    projectId = payload.projectId;
    databaseId = payload.databaseId; 
    apiKey = payload.apiKey; 
    endPoint = payload.endPoint; 
  } catch (e1) {
    console.warn("Payload are not set");
    // from Appwrite console
    try {
      var variables = JSON.parse(req.variables);
  
      usage = variables.usage;
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
  if(!usage)
  {
    usage = 19;
  }


  client
    .setEndpoint(endPoint)
    .setProject(projectId)
    .setKey(apiKey)
    .setSelfSigned(true);

  try {
    // var response = await database.getDocument(databaseId, 'disk_usage', 'simulator');
    // console.log(response);
    // // res.json({
    // //   usage: response.usage
    // // });
    // var usage = response.usage;
    // if(usage > 98) {
    //   usage = 98;
    // }
    // usage++;

    await database.updateDocument(databaseId, 'disk_usage', 'simulator', {"usage": usage});
    
    res.json({
      "usage": usage
    });


  } catch (error) {
    console.log(error);
    res.json({
      error: error
    });
  }
  
  
};
