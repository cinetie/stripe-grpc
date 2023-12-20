
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "./payment.proto";

const options = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };
  
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
  const paymentProto = grpc.loadPackageDefinition(packageDefinition);
  const Payment = paymentProto.paymentPackage.Payment;
  console.log(Payment, '==')

  const client = new Payment(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  client.getPaymentLink({ name: "basic", email: "test@test.com"}, (error, response) => {
    if (error) console.log(error);
    console.log(response);
  }
    );