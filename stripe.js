const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

 const createCustomer = async (email) => {
  const customer = await stripe.customers.create({
    email,
  });
  console.log(`INFO: STRIPE: CREATE: ${customer.id}`);
  return customer;
};

 const getCustomer = async (id) => {
  const customer = await stripe.customers.retrieve(id);
  console.log(`INFO: STRIPE: GET: ${customer.id}`);
  return customer;
};

 const createSubscription = async (customerId, priceId, useCoupon) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
    coupon: useCoupon ? process.env.STRIPE_PREMIUM_COUPON : undefined,
  });
  return subscription;
};

 const getSubscription = async (id) => {
  const subscription = await stripe.subscriptions.retrieve(id);
  return subscription;
};

 const getProduct = async (id) => {
  const product = await stripe.products.retrieve(id);
  return product;
};

 const updateSubscription = async (id, priceId) => {
  const subscription = await stripe.subscriptions.update(id, {
    items: [{ price: priceId }],
  });
  return subscription;
};

 const getUserSubscriptions = async (customerId) => {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
  });
  return subscriptions;
};

 const cancelSubscription = async (id) => {
  const subscription = await stripe.subscriptions.del(id);
  return subscription;
};

module.exports = {
  createCustomer,
  getCustomer,
  createSubscription,
  getSubscription,
  getProduct,
  updateSubscription,
  getUserSubscriptions,
  cancelSubscription,
};