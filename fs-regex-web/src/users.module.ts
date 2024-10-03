import { User } from "@ngneat/falso";

export const getUsers = async (searchTerm = ''): Promise<User[]> => {
  let url = 'http://localhost:3000/api/v1/users';
  if (searchTerm) {
    url += `?name=${searchTerm}`
  }
  const response = await fetch(url);
  const { users }: { users: User[] } = await response.json();
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(users);
    }, 500)
  });
}

export const getFavoriteUsersFromApi = async (): Promise<User[]> => {
  let url = 'http://localhost:3000/api/v1/favorite-users';
  const response = await fetch(url);
  const { users }: { users: User[] } = await response.json();
  return users;
}

export const markUserAsFavorite = async (user: User): Promise<User> => {
  const url = `http://localhost:3000/api/v1/favorite-users`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      user
    })
  });
  const { user: favoritedUser }: { user: User } = await response.json();
  return favoritedUser;
}

export const unMarkUserAsFavorite = async (user: User): Promise<{ success: boolean }> => {
  const url = `http://localhost:3000/api/v1/favorite-users/${user.id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  const respObj: { success: boolean } = await response.json();
  return respObj;
}

export const renderUsersList = (users: User[], usersList: HTMLElement | null) => {
  if (!usersList) {
    return;
  }
  clearUsersList(usersList);
  const template = document.getElementById('userTemplate') as HTMLTemplateElement;

  users.forEach(user => {
    const listItem = document.importNode(template.content, true).firstElementChild as HTMLElement;
    listItem.setAttribute('data-user-id', user.id);
    const nameEl = listItem.querySelector('.user-item__name') as HTMLHeadingElement;
    nameEl.textContent = `${user.firstName} ${user.lastName}`;
    const emailEl = listItem.querySelector('.user-item__email') as HTMLParagraphElement;
    emailEl.textContent = user.email;
    const userImageEl = listItem.querySelector('.user-item__image') as HTMLImageElement;
    userImageEl.src = `${user.img}?${self.crypto.randomUUID?.()}`;
    usersList.appendChild(listItem);
  });
}

export const highlightFavoriteUsers = (favUsers: Record<string, User>, usersList: HTMLElement | null) => {
  if (!usersList) {
    return;
  }
  const listItems = usersList.querySelectorAll('li') as NodeListOf<HTMLLIElement>;
  listItems.forEach((li) => {
    const userId = li.getAttribute('data-user-id') || '';
    if (favUsers[userId]) {
      li.querySelector('svg')!.style.fill = 'red';
    } else {
      li.querySelector('svg')!.style.fill = 'white';
    }
  })
}

export const clearUsersList = (usersList: HTMLElement | null) => {
  if (!usersList) {
    return;
  }
  usersList.innerHTML = '';
}