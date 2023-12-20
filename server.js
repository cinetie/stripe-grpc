const PROTO_PATH = './payment.proto';
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { createCustomer, createSubscription, getProduct } = require('./stripe');
const dotenv = require('dotenv');
dotenv.config();

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
const paymentProto =  grpc.loadPackageDefinition(packageDefinition);


const server = new grpc.Server();


server.addService(paymentProto.paymentPackage.Payment.service, {
    getPaymentLink: async (call, callback) => {
        const item = await getPaymetLink(call.request)

      callback(null,  item);
    },
  });

  const plans = {
    basic: process.env.STRIPE_BASIC,
    standard: process.env.STRIPE_STANDARD,
    premium: process.env.STRIPE_PREMIUM,
}


  async function getPaymetLink({ name, email }) {
    console.log("I got here", name, email)
      let plan = plans[name];
      console.log(plan)
      const stripePlan = await getProduct(plan);
      console.log(stripePlan, '===== stripe plan =====')
      let stripeUser = await createCustomer(email);
   
      console.log(stripeUser, '==== stripe user =====')
      const stripeSubscription = await createSubscription(
        stripeUser.id,
        stripePlan.default_price
      );
      return {
        link: stripeSubscription.latest_invoice.hosted_invoice_url,
      }
  }

server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server running at http://127.0.0.1:50051");
      server.start();
    }
  );


