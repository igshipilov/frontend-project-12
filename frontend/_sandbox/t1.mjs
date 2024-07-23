import {
    createEntityAdapter,
    createSlice,
    configureStore,
  } from '@reduxjs/toolkit';
  
  const usersAdapter = createEntityAdapter();
  
  const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState(),
    reducers: {
      userAdded: usersAdapter.addOne,
    },
  });
  
  const { userAdded } = usersSlice.actions;
  
  // console.log('usersAdapter: ', usersAdapter, '\n', '-----------------------');
  // console.log('usersAdapter.getSelectors: ', usersAdapter.getSelectors(), '\n', '-----------------------');
  // console.log('usersSlice: ', usersSlice, '\n', '-----------------------');
  // console.log('usersSlice.getInitialState(): ', usersSlice.getInitialState(), '\n', '-----------------------');
  // console.log('usersSlice.actions: ', usersSlice.actions, '\n', '-----------------------');
  // console.log('userAdded: ', userAdded, '\n', '-----------------------');
  
  const store = configureStore({
    reducer: {
      users: usersSlice.reducer,
    },
  });
  // console.log('store.getState(): ', store.getState(), '\n', '-----------------------');
  
  
  // console.log('initial state: ', store.getState());
  
  store.dispatch(userAdded({ id: 'firstUserID', name: 'Ivan', comments: [] }));
  store.dispatch(userAdded({ id: 'secondUserID', name: 'Petr', comments: [] }));
  // console.log('\n', 'user 1 added: ', store.getState());
  
  const usersSelectors = usersAdapter.getSelectors((state) => state.users);
  console.log('\n', 'usersSelectors: ', usersSelectors.selectAll(store.getState()));