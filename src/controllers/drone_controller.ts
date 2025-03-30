import { Request, Response } from 'express';
import Drone from '../models/drone_models.js';
import mongoose from 'mongoose';
import {
  createDrone,
  getDrones,
  getDroneById,
  updateDrone,
  deleteDrone,
  getDronesByCategory,
  getDronesByPriceRange,
  addReviewToDrone
} from '../service/drone_service.js';

// Crear un nuevo dron
export const createDroneHandler = async (req: Request, res: Response) => {
  try {
    const droneData = { ...req.body }; // sin req.user
    const drone = await createDrone(droneData);
    res.status(201).json(drone);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error al crear el dron' });
  }
};

// Get all drones with pagination
export const getDronesHandler = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const data = await getDrones(page, limit);
        res.status(200).json(data);

    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error al obtener drones" });
    }
};

// Obtener un dron por ID
export const getDroneByIdHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let drone = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            drone = await getDroneById(id);
        }

        if (!drone) {
            drone = await Drone.findOne({ id }); 
        }

        if (!drone) {
            return res.status(404).json({ message: 'Drone no encontrado' });
        }

        res.status(200).json(drone);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error al obtener el dron" });
    }
};


// Actualizar un dron
export const updateDroneHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let drone = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            drone = await getDroneById(id);
        }

        if (!drone) {
            drone = await Drone.findOne({ id });
        }

        if (!drone) {
            return res.status(404).json({ message: 'Dron no encontrado' });
        }

        const updatedDrone = await updateDrone(drone._id.toString(), req.body);

        res.status(200).json(updatedDrone);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error al actualizar el dron" });
    }
};


// Eliminar un dron
export const deleteDroneHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let drone = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            drone = await getDroneById(id);
        }

        if (!drone) {
            drone = await Drone.findOne({ id });
        }

        if (!drone) {
            return res.status(404).json({ message: 'Dron no encontrado' });
        }

        await deleteDrone(drone._id.toString());

        res.status(200).json({ message: "Dron eliminado exitosamente" });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error al eliminar el dron" });
    }
};

// Obtener drones por categoría
export const getDronesByCategoryHandler = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        if (!category || typeof category !== "string") {
            return res.status(400).json({ message: "Debe proporcionar una categoría válida" });
        }

        const drones = await Drone.find({ category });

        if (drones.length === 0) {
            return res.status(404).json({ message: "No hay drones en esta categoría" });
        }

        res.status(200).json(drones);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error al obtener drones por categoría" });
    }
};




// Obtener drones en un rango de precios
export const getDronesByPriceRangeHandler = async (req: Request, res: Response) => {
    try {
        const { min, max } = req.query;

        const minPrice = Number(min);
        const maxPrice = Number(max);

        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).json({ message: "Parámetros inválidos, min y max deben ser números" });
        }

        const drones = await Drone.find({ price: { $gte: minPrice, $lte: maxPrice } });

        if (drones.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(drones);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error al obtener drones en el rango de precios" });
    }
};



// Agregar una reseña a un dron
export const addDroneReviewHandler = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId, rating, comment } = req.body;
        let drone = null;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "userId no es válido" });
        }

        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "El rating debe estar entre 1 y 5" });
        }

        if (mongoose.Types.ObjectId.isValid(id)) {
            drone = await getDroneById(id);
        }

        if (!drone) {
            drone = await Drone.findOne({ id });
        }

        if (!drone) {
            return res.status(404).json({ message: "Dron no encontrado" });
        }

        drone.ratings.push({ userId: new mongoose.Types.ObjectId(userId), rating, comment });
        await drone.save();

        res.status(200).json({ message: "Reseña agregada exitosamente", drone });
    } catch (error: any) {
        res.status(500).json({ message: error.message || "Error al agregar reseña" });
    }
};
