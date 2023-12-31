// Remover isso aqui depois
const Receitas = require("./entities/receitas");

const express = require("express");
const cors = require("cors");

const { getAuthToken } = require("./auth");

// Import Entity 
const {practitionerData} = require("./entities/practitionerEntity")


// Import Controllers
const {
  getPatients,
  postPatient,
  getPatientById,
} = require("./controllers/patientController");

const {
  practitionerMapFhirToApi,
  practitionerMapApiToFhir,
  getPractitioners,
  postPractitioner,
} = require("./controllers/practitionerController");



const app = express();
const port = 3000 || process.env.PORT;

app.use(cors());

//#region REQUEST PATIENTS
// GET ALL -> REQUEST PATIENTS
app.get("/teste", async (req, res) => {

  // alert("Bati aqui");
  console.log('API - Get All Patients - Exit')
  res.json({response: "Deu certo!!!"})
});

// GET ALL -> REQUEST PATIENTS
app.get("/patient", async (req, res) => {

  console.log('API - Get All Patients')
  const accessToken = await getAuthToken();
  const data = await getPatients(accessToken);
  
  res.json(data?.entry || []); //ele automaticamente já faz o retorno. Deve ser por conta da função callback arrow function
  console.log(data.entry) //.entry é de fato os dados de todos os pacientem sem informações adicionais que possue no data
  console.log('API - Get All Patients - Exit')
});

// GET BY ID -> REQUEST PATIENTS
app.get("/patient/:id", async (req, res) => {
  console.log('API - Get By Id Patient')
  const patientId = req.params.id;
  const accessToken = await getAuthToken();
  const data = await getPatientById(patientId, accessToken);

  res.json(data);
  console.log(data)
  console.log('API - Get By Id Patient - Exit')
});

app.post("/patient", async (req, res) => {
  console.log('Chegei na api')
  // const accessToken = await getAuthToken();
  // const patientId = await postPatient(accessToken, req.body);

  // console.log(patientOperation);

  // // res.json({ patientId });
  // res.json({ patientOperation });
  
});
//#endregion

//#region REQUEST PRACTITIONER

// GET ALL -> REQUEST PATIENTS
app.get("/practitioner", async (req, res) => {
  console.log('API - Get All Practitioner')
  const accessToken = await getAuthToken();
  const data = await getPractitioners(accessToken);
  
  console.log(data?.entry)
  console.log('API - Get All Practitioner - Exit')
  const lstDoutores = practitionerMapFhirToApi(data?.entry); //data?.entry é o practitioner do FHIR
  
  res.json(lstDoutores || []);
});

// POST -> REQUEST PRACTITIONER
app.post("/practitioner", async (req, res) => {
  console.log('entrei no post')
  const accessToken = await getAuthToken();

  console.log(req.body);

  const practitionerId = await postPractitioner(accessToken, req.body);

  // console.log(patientOperation);

  res.json({ practitionerId });

});
//#endregion

//#region REQUEST RECEITAS
app.get("/receitas", async (req, res) => {
  console.log(Receitas);
  res.json(Receitas);
});
//#endregion

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
});

module.exports = app;