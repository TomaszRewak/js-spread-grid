import './App.css';
import Installation from './pages/basics/installation';
import YourFirstGrid from './pages/basics/your-first-grid';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Headers from './pages/columns-and-rows/headers';
import { Fragment } from 'react';
import ErrorOverlay from './pages/error-handling/error-overlay';
import CellClick from './pages/events/cell-click';
import Filtering from './pages/data-shaping/filtering';

const routes = [
  {
    chapter: 'basics',
    pages: [
      { title: 'installation', page: Installation },
      { title: 'your first grid', page: YourFirstGrid }
    ]
  },
  {
    chapter: 'columns and rows',
    pages: [
      { title: 'headers', page: Headers }
    ]
  },
  {
    chapter: 'data shaping',
    pages: [
      { title: 'filtering', page: () => <Filtering/> }
    ]
  },
  {
    chapter: 'events',
    pages: [
      { title: 'cell click', page: CellClick }
    ]
  },
  {
    chapter: 'error handling',
    pages: [
      { title: 'error overlay', page: ErrorOverlay }
    ]
  }
].map(({ chapter, pages }) => ({
  chapter,
  pages: pages.map(({ title, page }) => ({
    title,
    Page: page,
    path: `/${chapter.replaceAll(' ', '-')}/${title.replaceAll(' ', '-')}`
  }))
}));

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App-navbar">
          {routes.map(({ chapter, pages }) => (
            <Fragment key={chapter}>
              <div className="App-navbar-header">{chapter}</div>
              {pages.map(({ title, path }) => (
                <Link key={title} to={path} className="App-navbar-item">{title}</Link>
              ))}
            </Fragment>
          ))}
        </div>
        <div className="App-content">
          <div className="App-content-body">
            <Routes>
              <Route path="/" element={<YourFirstGrid />} />
              {routes.map(({ pages }) => (
                pages.map(({ title, path, Page }) => (
                  <Route key={title} path={path} element={<Page/>} />
                ))
              )).flat()}
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
