import { Router } from 'express';
//import { promises as fs } from 'fs';
import fs from 'fs';
import path from 'path';
import { User } from '@ngneat/falso';
const router = Router();

const favoritesFilePath = path.resolve(__dirname, '../../../db/favorites.json');

router.get('/', async (req, res) => {
  try {   
    let favoritedUsers: User[] = [];

    if (!fs.existsSync(favoritesFilePath)) return res.json({ users: favoritedUsers });

    favoritedUsers = JSON.parse(fs.readFileSync(favoritesFilePath, 'utf8'));

    res.json({
      users: favoritedUsers
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch favorite users' });
  }
});

router.post('/', async (req, res) => {
  const user = req.body.user as User;

  try {
    fs.writeFileSync(favoritesFilePath, JSON.stringify([user]));
    res.json({
      user: 'user'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    /**
     * 💡 hint: 
     * you should probably get the favorited users from the file,
     * remove the favorited user from the list using the id,
     * write back to the file with the rest of the favorited users
     */
    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfavorite user' });
  }
});

export default router;