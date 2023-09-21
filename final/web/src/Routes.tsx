// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route, Set } from '@redwoodjs/router'

import BaseLayout from 'src/layouts/BaseLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/logout" page={LogoutPage} name="logout" />
      <Route path="/" page={HomePage} name="home" />
      <Set wrap={BaseLayout}>
        <Route path="/albums/{id}" page={AlbumPage} name="album" />
        <Route path="/artists/{id}" page={ArtistPage} name="artist" />
        <Route path="/collection/tracks" page={LikedTracksPage} name="likedTracks" />
        <Route path="/playlists/{id}" page={PlaylistPage} name="playlist" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
