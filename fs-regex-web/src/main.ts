import { getFavoriteUsersFromApi, getUsers as getUsersFromApi, highlightFavoriteUsers, markUserAsFavorite, renderUsersList, unMarkUserAsFavorite } from './users.module';
import './style.css'
import { User } from '@ngneat/falso';

const state: { users: User[], favoriteUsers: Record<string, User> } = {
  users: [],
  favoriteUsers: {}
}

export const showLoader = (loaderEl: HTMLElement | null) => {
  loaderEl?.removeAttribute('hidden');
}

export const hideLoader = (loaderEl: HTMLElement | null) => {
  loaderEl?.setAttribute('hidden', 'true');
}

export const getUsers = async (searchTerm = '') => {
  const usersList = document.getElementById('usersList');
  try {
    const users = await getUsersFromApi(searchTerm);
    state.users = users;
    renderUsersList(users, usersList);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

export const getFavoriteUsers = async () => {
  const usersList = document.getElementById('usersList');
  try {
    const users = await getFavoriteUsersFromApi();
    users.forEach((user) => {
      state.favoriteUsers[user.id] = user;
    })
    highlightFavoriteUsers(state.favoriteUsers, usersList);
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
}

export const initSearchInputListener = () => {
  const usersList = document.querySelector('#usersList') as HTMLElement;
  const searchBar = document.querySelector('#searchInput') as HTMLInputElement;

  searchBar?.addEventListener('input', async (ev) => {
    let target = ev.target as HTMLInputElement;
    let value = target.value;
    getUsers(value);
  })

  /**
   * 💡 hint: implement an event listener for searchInput so when the
   * user types something in the input, it calls the `getUsers` method
   * with the input's value
   */

  usersList?.addEventListener('click', async (ev) => {
    let target = ev.target as HTMLElement;
    if (target.nodeName !== 'LI') {
      target = target.closest('li') as HTMLLIElement;
    }
    const userId = target.getAttribute('data-user-id');
    const user = state.users.find(userItem => userItem.id === userId);
    if (!user) {
      return;
    }
    if (!state.favoriteUsers[user.id]) {
      const res = await markUserAsFavorite(user);
      console.log({res});
      state.favoriteUsers[user.id] = user;
    } else {
      const res = await unMarkUserAsFavorite(user);
      console.log({res});
      delete state.favoriteUsers[user.id];
    }
    highlightFavoriteUsers(state.favoriteUsers, usersList);
  })
}

const main = async () => {
  const loader = document.getElementById('loader');
  showLoader(loader);
  await getUsers();
  await getFavoriteUsers();
  hideLoader(loader);
  initSearchInputListener();
}

main();