const express= require ('express');
const app = express();
const cors = require ('cors');
app.use (cors());
app.use(express.json());

const db= require ('./connection');


   app.get("/api/mediciones/:sensor_idsensor", async (req, res) => {
    try {
        const { sensor_idsensor } = req.params;
        const resultado = await db.query("SELECT * FROM mediciones WHERE sensor_idsensor = $1", [sensor_idsensor]);
        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.json({ mensaje: "Error en el servidor" });
    }
   });


  app.post('/api/login', async (req, res) => {
    try {
      const { Usuario, Contrasenia } = req.body;
  
      const { rows } = await db.query("SELECT * FROM usuarios WHERE usuario = $1", [Usuario]);
  
      if (rows.length === 0) {
        return res.json({ mensaje: "Usuario no encontrado" });
      }
      const usuario = rows[0];
  
      if (Contrasenia !== usuario.contrasenia) {
        return res.json({ mensaje: "Contraseña incorrecta" });
      }
      res.json({ mensaje: "Login exitoso", usuario });
    } catch (error) {
      console.error(error);
      res.json({ mensaje: "Error en el servidor" });
    }
  });

  
//consultas selec por id y tablas completas
app.get("/api/consultaIdUsuarios/:idusuarios", async (request, response) => {
    try {
        const resultado = await db.query("select * from usuarios where idusuarios = $1" ,[request.params.idusuarios]  );
        console.log(resultado.rows);
        
    } catch (error) {
        console.log(error);
    }
    response.send("respuesta");
});

app.get("/api/consultaIdDispositivos/:iddispositivo", async (request, response) => {
    try {
        const resultado = await db.query("select * from dispositivo where iddispositivo = $1" ,[request.params.iddispositivo]  );
        console.log(resultado.rows);
        
    } catch (error) {
        console.log(error);
    }
    response.send("respuesta");
});

app.get("/api/selectTablas/:tabla", async (request, response) => {
    try {
        const { tabla } = request.params;
        const resultado = await db.query(`SELECT * FROM ${tabla}`);
        console.log(resultado.rows);
        response.json(resultado.rows); 
    } catch (error) {
        console.log(error);
    }
});

//funciones update, delete, insert 


app.post("/api/insertarUsuario", async (request, response) => {
    try {
        const { Id_dispositivo, Nombre, Apellido, Correo, Usuario, Contraseña, Tipo } = request.body;
        const query = `insert into usuarios ( dispositivo_iddispositivo, nombre, apellido, correo, usuario, contrasenia, tipo )
            values ($1, $2, $3, $4, $5, $6, $7) `;

        await db.query(query, [Id_dispositivo, Nombre, Apellido, Correo, Usuario, Contraseña, Tipo]);

        response.json({ mensaje: "Usuario insertado correctamente" }); 
    } catch (error) {
        console.log(error);
    }
});

app.post("/api/insertarDispositivo", async (request, response) => {
    try {
        const { Ubicacion } = request.body;
        const query = `insert into dispositivo (ubicacion)
            values ($1) `;

        await db.query(query, [Ubicacion]);

        response.json({ mensaje: "Dispositivo insertado correctamente" }); 
    } catch (error) {
        console.log(error);
    }
});

app.put("/api/actualizarUsuarios", async (request, response) => {
    try {
        const { Idusuarios, Dispositivo_iddispositivo, Nombre, Apellido, Correo, Usuaurio, Contrasenia, Tipo } = request.body;

        const query = `update usuarios set dispositivo_iddispositivo = $1, nombre = $2, apellido = $3, correo = $4, usuario =$5, contrasenia =$6, tipo =$7 WHERE idusuarios = $8`;

        await db.query(query, [Dispositivo_iddispositivo, Nombre, Apellido, Correo, Usuario, Contrasenia, Tipo,Idusuarios]);

        response.json({ mensaje: "Usuario actualizado correctamente" });
    } catch (error) {
        console.log(error);
    }
});

app.put("/api/actualizarDispositivo", async (request, response) => {
    try {
        const { Iddispositivo, Ubicacion } = request.body;

        const query = `update dispositivo set ubicacion = $1  where iddispositivo = $2`;

        await db.query(query, [Ubicacion, Iddispositivo]);

        response.json({ mensaje: "Dispositivo actualizado correctamente" });
    } catch (error) {
        console.log(error);
    }
});

app.delete("/api/eliminarUsuarios/:idusuarios", async (request, response) => {
    try {
        
        const resultado = await db.query("delete from usuarios where idusuarios = $1" ,[request.params.idusuarios]  );
       
        response.json({ mensaje: "Usuario eliminado correctamente" });

    } catch (error) {

        console.log(error);
        
    }
});

app.delete("/api/eliminarDispositivos/:iddispositivo", async (request, response) => {
    try {
        const resultado = await db.query("delete from dispositivo where iddispositivo = $1" ,[request.params.iddispositivo]  );
       
        response.json({ mensaje: "Dispositivo eliminado correctamente" });

    } catch (error) {

        console.log(error);
        
    }
});

app.listen(4000,(err)=>{
    console.log("Si escucha el puerto 4000");
})
