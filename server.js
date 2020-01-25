require('isomorphic-fetch');
const dotenv = require('dotenv');
dotenv.config();
const Koa = require('koa');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');
const koaBodyParse = require('koa-bodyparser');
const { receiveWebhook, registerWebhook } = require('@shopify/koa-shopify-webhooks');
const getSubscriptionUrl = require('./server/getSubscriptionUrl');
const Cookies = require('js-cookie')

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev:true });
const handle = app.getRequestHandler();

const firebase = require('firebase')

const firebaseConfig = {
  apiKey: "AIzaSyB8P_0Oqwt41nMPPNuC-eafN4TokB5-Qn8",
  authDomain: "pickmaster-3000.firebaseapp.com",
  databaseURL: "https://pickmaster-3000.firebaseio.com",
  projectId: "pickmaster-3000",
  storageBucket: "pickmaster-3000.appspot.com",
  messagingSenderId: "326130267937",
  appId: "1:326130267937:web:8e2dd183cc04f1d4eff060",
  measurementId: "G-FCD8BMZ0LE"
}

if(!firebase.apps.length)
  firebase.initializeApp(firebaseConfig)
else
  firebase.app();

const initializePickmasterDatabase = shop => {
  ref = firebase.database().ref('/')
  shopName = shop.replace("myshopify.com","").replace(".","")

  ref.child(shopName).child("PMOrders").child("PMOrders").set("PMOrders")
  ref.child(shopName).child("History").child("History").set("History")
  ref.child(shopName).child("PMOrdersWarning").child("PMOrdersWarning").set("PMOrdersWarning")
}

const checkPmOrdersNeedCancel = (pmOrders) => new Promise((resolve, reject) => {
  try {
    let pmOrder = null
    Object.keys(pmOrders).forEach((key, i) => {
      if(pmOrders[key].status!=="CANCELLED" && pmOrders[key].status!=="REMAKE")
        pmOrder = pmOrders[key]
    })
    resolve(pmOrder)
  } catch (error) {
    reject(error)
  }
})

const {
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_KEY,
  HOST,
  SHOP
} = process.env;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();
  server.use(session(server));

  server.keys = [SHOPIFY_API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ['read_products', 'write_products', 'read_customers', 'read_orders', 'write_orders',
              'read_fulfillments', 'write_fulfillments', 'read_locations'],
      async afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, { httpOnly: false });
        ctx.cookies.set("accessToken", accessToken);

        const registration = await registerWebhook({
          address: `${HOST}/webhooks/orders/cancelled`,
          topic: 'ORDERS_CANCELLED',
          accessToken,
          shop,
          apiVersion: ApiVersion.October19
        });

        if (registration.success) {
          console.log('Successfully registered webhook!');
        } else {
          console.log('Failed to register webhook', registration.result);
        }

        initializePickmasterDatabase(shop);

        await getSubscriptionUrl(ctx, accessToken, shop);
      }
    })
  );

  const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET_KEY });

  router.post('/webhooks/orders/cancelled', webhook, async (ctx) => {
    console.log('\n\n: ', ctx.state.webhook)
    console.log('\n\n PLAYPLOAD ID ', ctx.state.webhook.payload.id);
    let pmOrderCancellSku = ctx.state.webhook.payload.id
    try {
      let pmOrders = await getRegisterPMCancelled(pmOrderCancellSku)
      console.log("1",pmOrders);
      if(pmOrders && Object.keys(pmOrders).length){
        let pmOrder = await checkPmOrdersNeedCancel(pmOrders)
        console.log("2",pmOrder);
        if(pmOrder)
          addSfyOrderToPMOrdersWarnings(pmOrder.pmOrderSku, pmOrder.pmOrderNumber, pmOrder.status,
          "The shopify order from this Pickmaster Order has be cancelled. Cancelled this PM Order to")
      }
    } catch (error) {
      console.log(error)
    }
  });

  server.use(graphQLProxy({ version: ApiVersion.April19 }));

  const dbRef = () => firebase.database().ref(`/${SHOP.replace("myshopify.com","").replace(".","")}`)

  const getRegisterPMCancelled = id => new Promise((resolve, reject) => {
    try {
        dbRef().child('PMOrders').orderByChild("sfyOrderSku").equalTo(id.toString())
        .once("value", dataReaded => {resolve(dataReaded.val())})
    } catch (e) {
      console.log(e)
      reject(e)
    }
  })

  const addSfyOrderToPMOrdersWarnings = (pmOrderSku, pmOrderNumber, status, warningMessage) => new Promise((resolve, reject) =>{
    let data = {pmOrderSku, pmOrderNumber, status, warningMessage}
    console.log(data)

    dbRef().child("PMOrdersWarning").child(pmOrderSku).set(data, err => {
      if(err)
        reject(err)
    })
  })

  router.get('/api/:object', async (ctx) => {
    console.log("\n\nQuerry", ctx.request.query);

    let queryes = ctx.request.query, textQuery = ""
    if(Object.keys(queryes).length){
      Object.keys(queryes).forEach((k,i)=> {
        textQuery += `${i>0?"&":"?"}${k}=${queryes[k]}`
      })
      console.log("textQuery", textQuery);
    }


    console.log( "https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/" + ctx.params.object + textQuery);
    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/" + ctx.params.object + textQuery, {
          headers: {
            "Content-Type":"application/json",
            "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
          },
      })
          .then(response => response.json())
          .then(json => json)
      ctx.body = {
          status: 'success',
          data: results
      }
    } catch (err) {
      console.log(err)
    }
  })

  router.get('/api/product/:id', async (ctx) => {
    console.log( "https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/products/" + ctx.params.id + ".json");
    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/products/" + ctx.params.id + ".json", {
          headers: {
            "Content-Type":"application/json",
            "X-Shopify-Access-Token": ctx.cookies.get('accessToken'),
          },
      })
          .then(response => response.json())
          .then(json => json)
      ctx.body = {
          status: 'success',
          data: results
      }
    } catch (err) {
      console.log(err)
    }
  })

  router.post('/postcreatefulfillment/:object', async (ctx) => {
    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/orders/" + ctx.params.object + "/fulfillments.json");
    console.log(JSON.stringify(ctx.request.body));

    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/orders/" + ctx.params.object + "/fulfillments.json", {
        method: 'POST',
        headers: {
          "Content-Type":"application/json",
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken')
        },
        body: JSON.stringify(ctx.request.body)
      })
          .then(response => response.json())
          .then(json => json)
      ctx.body = {
          status: 'success',
          data: results
      }
    } catch (err) {
      console.log(err)
    }
  })

  router.put('/putupdatefulfillment/:sfyOrderSku/:fulfillmentId', async (ctx) => {

    console.log("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/orders/" + ctx.params.sfyOrderSku + "/fulfillments/" + ctx.params.fulfillmentId + ".json");
    console.log(JSON.stringify(ctx.request.body));

    try {
      const results = await fetch("https://" + ctx.cookies.get('shopOrigin') + "/admin/api/2019-10/orders/" + ctx.params.sfyOrderSku + "/fulfillments/" + ctx.params.fulfillmentId + ".json", {
        method: 'PUT',
        headers: {
          "Content-Type":"application/json",
          "X-Shopify-Access-Token": ctx.cookies.get('accessToken')
        },
        body: JSON.stringify(ctx.request.body)
      })
          .then(response => response.json())
          .then(json => json)
      ctx.body = {
          status: 'success',
          data: results
      }
    } catch (err) {
      console.log(err)
    }
  })

  router.get('*', verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
    return;
  });

  server.use(koaBodyParse());
  server.use(router.allowedMethods());
  server.use(router.routes());

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
