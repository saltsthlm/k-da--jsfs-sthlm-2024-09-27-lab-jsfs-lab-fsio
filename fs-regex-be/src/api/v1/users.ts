import { Router } from 'express';
import { USERS_LIST } from '../../data/users';
import fs from 'fs';
import path from 'path';
import { User } from '@ngneat/falso';
const router = Router();

router.get('/', async (req, res) => {
  try {
    let name = (req.query.name as string);
    if (name) {
      name = name.toLowerCase();

      const fullNames = USERS_LIST.map((user) => {
        return user.firstName + user.lastName;
    })
      /**
       * 💡 hint: use regex here and see the readme for what is required when searching
       */
      return res.json({
        users: USERS_LIST
      })
    }
    res.json({
      users: USERS_LIST
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all users' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    res.json({
      user: USERS_LIST.find(user => {
        return user.id === id;
      })
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from SWAPI' });
  }
});

router.post('/:id/favorite', async (req, res) => {
  const { id } = req.params;
  const user = req.body.user as User;
  const filePath = path.resolve(__dirname, '../../../db/favorites.json');
  try {
    let favoritedUsers: User[] = [];
    if (fs.existsSync(filePath)) {
      const contentStr = await fs.readFileSync(filePath, { encoding: 'utf-8' });
      favoritedUsers = contentStr ? JSON.parse(contentStr) : [];
    }
    if (!favoritedUsers.find(favU => favU.id === id)) {
      favoritedUsers.push(user);
    }
    await fs.writeFileSync(filePath, JSON.stringify(favoritedUsers));
    res.json({
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from SWAPI' });
  }
});

router.post('/:id/unfavorite', async (req, res) => {
  const { id } = req.params;
  try {
    const contentStr = await fs.readFileSync(path.resolve(__dirname, '../../data/favorites.json'), { encoding: 'utf-8' });
    let favoritedUsers: User[] = contentStr ? JSON.parse(contentStr) : [];
    favoritedUsers = favoritedUsers.filter(favUser => favUser.id !== id);
    await fs.writeFileSync(path.resolve(__dirname, '../../data/favorites.json'), JSON.stringify(favoritedUsers));
    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from SWAPI' });
  }
});

export default router;