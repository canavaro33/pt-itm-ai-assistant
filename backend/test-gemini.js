const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI('AQ.Ab8RN6KE2ku0U2MXnAX-I5O6JjadF73XHkdc_z-bf-A5OvOOTw');
  try {
    const models = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log("Got model object");
    // Unfortunately SDK doesn't expose ListModels directly easily, let's just make a REST call to check
  } catch (e) {
    console.error(e);
  }
}
test();
