// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   darkMode: localStorage.getItem('theme'),
// };

// const themeSlice = createSlice({
//   name: 'theme',
//   initialState,
//   reducers: {
//     toggleDarkMode: (state) => {
//       state.darkMode = !state.darkMode;
//       localStorage.setItem('theme', state.darkMode)
//     },
//   },
// });

// export const { toggleDarkMode } = themeSlice.actions;
// export default themeSlice.reducer;


// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // JSON.parse pour forcer un booléen ou `false` par défaut si le thème n'est pas défini
  darkMode: JSON.parse(localStorage.getItem('theme')) || false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      // Stocke la valeur sous forme de chaîne en utilisant JSON.stringify
      localStorage.setItem('theme', JSON.stringify(state.darkMode));
    },
  },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
