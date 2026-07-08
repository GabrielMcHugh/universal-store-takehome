import './App.css';
import { ProductCatalog } from './components/ProductCatalog';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src="https://fulfil.universalstore.com/static/version1717065130/frontend/universalstore/universalstore/default/images/logo.svg" className="App-logo" alt="logo" />
      </header>

      <main className='App=main'>
        <ProductCatalog/>
      </main>
    </div>
  );
}

export default App;
