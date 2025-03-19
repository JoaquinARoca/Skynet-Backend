// src/controllers/user_controller.ts
import { error } from 'console';
import { saveMethod, createUser, getAllUsers, getUserById, updateUser, deleteUser, logIn } from '../service/user_service.js';

import express, { Request, Response } from 'express';

export const saveMethodHandler = async (req: Request, res: Response) => {
    try {
        const data = saveMethod();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const createUserHandler = async (req: Request, res: Response) => {
    try {
        const data = await createUser(req.body);
        res.json({ message: 'Usuario registrado exitosamente' });
    } catch (error: any) {
        if (error.message === 'Ya existe un usuario con este correo') {
            return res.status(400).json({ message: error.message });
        }
        else if (error.message === 'Ya existe un usuario con este nombre') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};
export const getAllUsersHandler = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const data = await getAllUsers(page, limit);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const getUserByIdHandler = async (req: Request, res: Response) => {
    try {
        const data = await getUserById(req.params.id);
        if (!data || data.isDeleted) {
            return res.status(404).json({ message: 'Usuario no encontrado o contraseña incorrecta' });
        }
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const updateUserHandler = async (req: Request, res: Response) => {
    try {
        const data = await updateUser(req.params.id, req.body);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteUserHandler = async (req: Request, res: Response) => {
    try {
        const data = await deleteUser(req.params.id);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const logInHandler = async (req: Request, res: Response) => {
    try {
        const data = await logIn(req.body.email, req.body.password);
        if (!data) {
            return res.status(404).json({ message: 'Usuario no encontrado o eliminado' });
        }
        res.json({ message: 'Sesión iniciada con éxito' });
    } catch (error: any) {
        if (error.message === 'Contraseña incorrecta') {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });

    }
}
