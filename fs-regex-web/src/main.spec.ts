import { getAllByTestId, fireEvent } from '@testing-library/dom'
import * as usersMod from './users.module'
import { readFileSync } from 'fs';
import { resolve } from 'path';

const html = readFileSync(resolve(__dirname, '../index.html'), 'utf8');

describe('App', () => {
  let main: typeof import('./main');

  beforeAll(async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ users: [
          {
            id: 'a4e494d2-8c46-4f07-bfae-dc80bae11a89',
            firstName: 'Muhammad Ahsan',
            lastName: 'Ayaz',
            email: 'ahsan@appliedtechnology.se',
            img: ''
          },
          {
            id: '8f3aeb52-a5f2-4a82-b177-7ada5e3fbcdd',
            firstName: 'Roeline',
            lastName: 'Burger',
            email: 'roeline.burger@appliedtechnology.se',
            img: ''
          }
        ] }),
      }),
    ) as jest.Mock;
    main = await import('./main');
    return main;
  })

  beforeEach(() => {
    document.body.innerHTML = html
  })

  afterEach(() => {
    jest.restoreAllMocks();
  })


  it('Should have render the list and show/hide loader appropriately', async () => {
    await main.getUsers();
    const userItems = getAllByTestId(document.body, 'userItem');
    expect(userItems.length).toBe(2);
  });

  it('Should show the user data appropriately', async () => {
    await main.getUsers();
    const userItems = getAllByTestId(document.body, 'userItem');
    const firstCharacter = userItems[0];
    const nameEl = firstCharacter.querySelector('.user-item__name') as HTMLHeadingElement;
    expect(nameEl.textContent).toBe('Muhammad Ahsan Ayaz');
    const emailEl = firstCharacter.querySelector('.user-item__email') as HTMLParagraphElement;
    expect(emailEl.textContent).toBe('ahsan@appliedtechnology.se');
    const imageYearEl = firstCharacter.querySelector('.user-item__image') as HTMLParagraphElement;
    expect(imageYearEl.textContent).toBe('');
  });

  it('Should clear the list before rendering a new one', async () => {
    jest.spyOn(usersMod, 'clearUsersList');
    usersMod.renderUsersList([], document.createElement('ul'));
    expect(usersMod.clearUsersList).toHaveBeenCalled();
  });

  it('Should clear the list before rendering a new one', async () => {
    jest.spyOn(usersMod, 'clearUsersList');
    usersMod.renderUsersList([], document.createElement('ul'));
    expect(usersMod.clearUsersList).toHaveBeenCalled();
  });

  it('Should call getUser with the input value when user types in the search input', async () => {
    main.initSearchInputListener();
    // Spy on the getUser method
    const getUserSpy = jest.spyOn(main, 'getUsers');
  
    // Set the search input value and simulate an input event
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    fireEvent.input(searchInput, { target: { value: 'Muhammad' } });
  
    // Check if getUser was called with the expected value
    expect(getUserSpy).toHaveBeenCalledWith('Muhammad');
  });
    
})