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

  try {
    var response = await database.getDocument(databaseId, 'disk_usage', 'simulator');
    console.log(response);
    //let velog = JSON.parse(response);
    res.json({
      usage: response.usage
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: error,
    });
  }
  
  
};

