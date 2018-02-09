export default {
  
  MAX_ATTACHMENT_SIZE: 5000000,
  s3: {
    BUCKET: "user-notes"
  },

  apiGateway: {
    URL: "https://bpx44l6x69.execute-api.us-east-1.amazonaws.com/prod",
    REGION: "us-east-1"
  },
  
  cognito: {
    USER_POOL_ID: "us-east-1_px3etGqZd",
    APP_CLIENT_ID: "1eodcin999sgfh5dejgc0fp4le",
    REGION: "us-east-1",
    IDENTITY_POOL_ID: "us-east-1:473c07e1-9769-4e43-b117-fa89ec6a6cdd",
  }
};