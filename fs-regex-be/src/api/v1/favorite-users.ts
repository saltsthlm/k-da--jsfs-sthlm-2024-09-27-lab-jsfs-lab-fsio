import { Router } from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { User } from '@ngneat/falso';
const router = Router();

const doesFolderExist = async (filePath : string) => {
  const folderPath = path.dirname(filePath);
  try {
      await fs.access(folderPath);
  } catch (error) {
      await fs.mkdir(folderPath, { recursive: true });
  }
}
const favoritesFilePath = path.resolve(__dirname, '../../../db/favorites.json');

router.get('/', async (req, res) => {
  try {
    doesFolderExist(favoritesFilePath)
    let favoritedUsers: User[] = [];
    console.log(favoritesFilePath)
    // const data = await fs.readFile(favoritesFilePath, 'utf8');
    // console.log(data);
    // 💡 hint: you should probably get the favorited users from the file

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
    await doesFolderExist(favoritesFilePath)
    await fs.appendFile(favoritesFilePath, "user");
   
    /**
     * 💡 hint: 
     * you should probably get the favorited users from the file,
     * add the favorited user to the list,
     * write back to the file with the new user
     */
    res.json({
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to favorite user' });
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