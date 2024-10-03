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
    res.status(500).json({ error: 'Failed to fetch favorite users' });
  }
});

router.post('/', async (req, res) => {
  const user = req.body.user as User;

  try {
    fs.writeFileSync(favoritesFilePath, JSON.stringify([user]));
    res.json({
      user: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite user' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userID = req.params.id as string;
    const favoriteList = JSON.parse(fs.readFileSync(favoritesFilePath, "utf8")) as User[];
    const myRegexPattern = new RegExp(userID);
    const matchingUsers = favoriteList.filter((user) => {
      if (!myRegexPattern.test(user.id)) {
        return user;
      }
    });

    fs.writeFileSync(favoritesFilePath, JSON.stringify(matchingUsers))
        res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unfavorite user' });
  }
});

export default router;