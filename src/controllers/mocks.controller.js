import MockingService from '../services/mocking.js';
import { petsService, usersService } from "../services/index.js";
import { createHash } from "../utils/index.js";

const getMascotas = async (req, res) => {
    const mascotas = await MockingService.generarMockingPets(50);
    res.send({ status: "success", payload: mascotas });
};

const getUsuarios = async (req, res) => {
    const usuarios = await MockingService.generarUsuarios(50);
    res.send({ status: "success", payload: usuarios });
};

const generateData = async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body; 
        const petList = [];
        const userList = [];

        console.log("Parámetros recibidos:", req.body);

        // Generar mascotas
        if (Number(pets) > 0) {
            const generatedPets = await MockingService.generarMockingPets(Number(pets));
            petList.push(...generatedPets);
        }

        // Generar usuarios
        if (Number(users) > 0) {
            const generatedUsers = await MockingService.generarUsuarios(Number(users));
            userList.push(...generatedUsers);
        }

        // Guardar las mascotas en la base de datos
        if (petList.length > 0) {
            await petsService.create(petList); // Insertar las mascotas generadas
        }

        // Guardar los usuarios en la base de datos
        if (userList.length > 0) {
            await usersService.create(userList); // Insertar los usuarios generados
        }

        // Responder con los datos generados y guardados
        return res.status(201).json({
            message: "Data generated and saved successfully",
            generated: {
                users: userList.length,
                pets: petList.length,
            },
            data: {
                users: userList,
                pets: petList,
            },
        });
    } catch (e) {
        console.error("Error generating data:", e);
        return res.status(500).json({ error: "Failed to generate data" });
    }
};

export default {
    getMascotas,
    getUsuarios,
    generateData
};
