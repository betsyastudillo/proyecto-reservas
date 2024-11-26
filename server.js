const express = require('express');
const app = express();
const cors = require('cors');

const PORT = 3000;

const corsOptions = {
  origin: 'http://127.0.0.1:5500', // Cambia esto si usas otro puerto u origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
};

app.use(cors(corsOptions));

app.use(express.json());
let reservas = [];
let salasDisponibles = [
  {id: 101, nombre: "Sala1", capacidad: 25, estado: "Activa"},
  {id: 102, nombre: "Sala2", capacidad: 50, estado: "Activa"},
  {id: 103, nombre: "Sala3", capacidad: 75, estado: "Activa"},
  {id: 104, nombre: "Sala4", capacidad: 100, estado: "Activa"},
];
let salas = [];
//----------RESERVAS-----------------//
//Get reservas
//id-nombre-fechaInicio-fechaFin-hora
app.get('/reservas', (req, res) =>{
  res.json(reservas);
});
app.get('/reservas/:id', (req,res) =>{
  const id = parseInt(req.params.id);
  const reservaId = reservas.find((reserva) => reserva.id === id );
  if(!reservaId){
    return res.status(404).json({mensaje: "No se pudo encontrar la reserva"});
  }
  res.json(reservaId);
})
//post reservas
app.post('/reservas', (req, res) =>{
  const nuevaReserva = req.body;
  if(!nuevaReserva.id || !nuevaReserva.nombre || !nuevaReserva.fechaInicio || !nuevaReserva.fechaFin || !nuevaReserva.salaId){
    res.status(400).json({mensaje: 'Todos los campos son requeridos'});
    return;
  }
  reservas.push(nuevaReserva);
  res.json({mensaje: 'Reserva añadida correctamente', reserva: nuevaReserva});
});
/*
{
  "id": 1,
  "nombre": "Claudia",
  "fechaInicio": "12-01-2024",
  "fechaFin": "24-02-2024",
  "salaId": 2
}
 */
//put reservas
app.put('/reservas/:id', (req,res)=>{
  const idReserva = parseInt(req.params.id);
  const indice = reservas.findIndex(reserva => reserva.id === idReserva);
  if(indice == -1){
    res.status(404).json({mensaje: 'No se encontró la reserva'});
    return;
  }
  reservas[indice] = req.body;
  res.json({mensaje: 'Reserva actualizada correctamente'});
});

//delete
app.delete('/reservas/:id', (req,res)=>{
  const idReserva = parseInt(req.params.id);
  const indice = reservas.findIndex(reserva => reserva.id === idReserva);
  if(indice == -1){
    res.status(404).json({mensaje: 'No se encontró la reserva'});
    return;
  }
  const reservaEliminada = reservas.splice(indice, 1);
  res.json({mensaje: 'Reserva eliminada correctamente', reserva: reservaEliminada});
});


//----------SALAS-----------------//
//Get salas
//id-nombre-capacidad-estado
app.get('/salas', (req, res) =>{
  res.json(salas);
});
// PARA SALAS DISPONIBLES----
app.get('/salas/disponibles', (req,res) =>{
  res.json(salasDisponibles);
});
app.get('/salas/disponibles/:id', (req,res) =>{
  const id = parseInt(req.params.id);
  const salaId = salasDisponibles.find((sala) => sala.id === id );
  if(!salaId){
    return res.status(404).json({mensaje: "No se pudo encontrar la sala"});
  }
  res.json(salaId);
})
app.put('/salas/disponibles/:id', (req,res) =>{
  const idsala = parseInt(req.params.id);
  const indice = salasDisponibles.findIndex(sala => sala.id === idsala);
  if(indice == -1){
    res.status(404).json({mensaje: 'No se encontró la sala'});
    return;
  }
  salasDisponibles[indice] = req.body;
  res.json({mensaje: 'sala actualizada correctamente'});
})
app.get('/salas/:id', (req,res) =>{
  const id = parseInt(req.params.id);
  const salaId = salas.find((sala) => sala.id === id );
  if(!salaId){
    return res.status(404).json({mensaje: "No se pudo encontrar la sala"});
  }
  res.json(salaId);
})

//post salas
app.post('/salas', (req, res) =>{
  const nuevaSala = req.body;
  const salaExistente = salas.find((sala) => sala.id === nuevaSala.id);
  if (salaExistente) {
    res.status(400).json({ mensaje: 'La sala con este ID ya existe' });
    return;
  }
  if(!nuevaSala.id || !nuevaSala.nombre || !nuevaSala.capacidad || !nuevaSala.estado){
    res.status(400).json({mensaje: 'Todos los campos son requeridos'});
    return;
  }
  salas.push(nuevaSala);
  res.json({mensaje: 'sala añadida correctamente', sala: nuevaSala});
});
//put salas

app.put('/salas/:id', (req,res)=>{
  const idsala = parseInt(req.params.id);
  const indice = salas.findIndex(sala => sala.id === idsala);
  if(indice == -1){
    res.status(404).json({mensaje: 'No se encontró la sala'});
    return;
  }
  salas[indice] = req.body;
  res.json({mensaje: 'sala actualizada correctamente'});
});

//delete
app.delete('/salas/:id', (req,res)=>{
  const idsala = parseInt(req.params.id);
  const indice = salas.findIndex(sala => sala.id === idsala);
  if(indice == -1){
    res.status(404).json({mensaje: 'No se encontró la sala'});
    return;
  }
  const salaEliminada = salas.splice(indice, 1);

  const indiceReserva = reservas.findIndex(reserva => reserva.salaId === idsala);
  if (indiceReserva == -1) {
    return res.status(404).json({mensaje: "No se encontró la reserva asociada a esta sala"});
  }
  reservas.splice(indiceReserva, 1);
  res.json({
    mensaje: 'Sala y su reserva asociada eliminadas correctamente',
    sala: salaEliminada,
  });
});

// REINICIAR SALAS
app.post('/reiniciar', (req,res) =>{
  salasDisponibles = [
    {id: 101, nombre: "Sala1", capacidad: 25, estado: "Activa"},
    {id: 102, nombre: "Sala2", capacidad: 50, estado: "Activa"},
    {id: 103, nombre: "Sala3", capacidad: 75, estado: "Activa"},
    {id: 104, nombre: "Sala4", capacidad: 100, estado: "Activa"},
  ];
  salas = [];
  reservas = [];
  res.status(200).send("Salas reiniciadas");
})
//LLAMAR AL PUERTO
app.listen(PORT, ()=>{
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
});