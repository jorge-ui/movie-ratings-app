import React from 'react';
import SearchBar from "./components/search-bar/search-bar.component";
import MovieResultsContainer from "./components/movie-results-container/movie-results-container.component";

const App: React.FC = () => {
  return (
    <div className="App">
      <SearchBar/>
      <MovieResultsContainer/>
    </div>
  );
};

export default App;