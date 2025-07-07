const pool = require('../../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'senhajwt'
// depois verificar senha jwt

exports.getMe = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, profile_picture_url, created_at FROM users WHERE id = ?',
            [userId]
        )
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        res.status(500).json({ message: 'Erro interno do server' });
    }
}

exports.getMyPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query(
            `SELECT
                p.id, p.title, p.content, p.image_url, p.created_at, p.updated_at,
                u.id AS user_id, u.username, u.profile_picture_url,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
                `,
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao obter posts do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

exports.getMyFavoritesPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query(
            `SELECT
                p.id, p.title, p.content, p.image_url, p.created_at, p.updated_at,
                u.id AS user_id, u.username, u.profile_picture_url,
                (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS like_count,
                (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            JOIN favorites f ON p.id = f.post_id
            WHERE f.user_id = ?
            ORDER BY p.created_at DESC`,
            [userId]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao obter posts favoritos do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

// Atualizar informações do usuário (username, email, profile_picture_url, password)
exports.updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { username, email, old_password, new_password, profile_picture_url } = req.body;

    try {
        let updateQuery = 'UPDATE users SET ';
        const updateValues = [];
        const fieldsToUpdate = [];

        // Busca o usuário para verificar a senha antiga (se fornecida)
        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        const user = users[0];

        // Verifica e atualiza username
        if (username && username.trim() !== '') {
            // Verifique se o novo username já existe (exceto o próprio usuário)
            const [existingUsername] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId]);
            if (existingUsername.length > 0) {
                return res.status(409).json({ message: 'Nome de usuário já está em uso.' });
            }
            fieldsToUpdate.push('username = ?');
            updateValues.push(username);
        }

        // Verifica e atualiza email
        if (email && email.trim() !== '') {
            // Verifique se o novo email já existe (exceto o próprio usuário)
            const [existingEmail] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
            if (existingEmail.length > 0) {
                return res.status(409).json({ message: 'E-mail já está em uso.' });
            }
            fieldsToUpdate.push('email = ?');
            updateValues.push(email);
        }

        // Atualiza foto de perfil (permite remover com null/string vazia)
        if (profile_picture_url !== undefined) { // Permite explicitamente enviar null para remover
            fieldsToUpdate.push('profile_picture_url = ?');
            updateValues.push(profile_picture_url || null);
        }

        // Lógica para atualizar a senha
        if (new_password) {
            if (!old_password) {
                return res.status(400).json({ message: 'Senha antiga é obrigatória para atualizar' });
            }

            const isPasswordValid = await bcrypt.compare(old_password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Senha antiga incorreta.' });
            }

            const hashedPassword = await bcrypt.hash(new_password, 10);
            fieldsToUpdate.push('password = ?');
            updateValues.push(hashedPassword);
        }

        if (fieldsToUpdate.length === 0) {
            return res.status(400).json({ message: 'Nenhum campo para atualizar fornecido.' });
        }

        updateQuery += fieldsToUpdate.join(', ') + ' WHERE id = ?';
        updateValues.push(userId);

        await pool.query(updateQuery, updateValues);

        res.status(200).json({ message: 'Perfil atualizado com sucesso!' });

    } catch (error) {
        console.error('Erro ao atualizar perfil do usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar perfil.' });
    }
};