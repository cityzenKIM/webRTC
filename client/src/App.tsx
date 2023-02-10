import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './Pages/lobby';
import Room from './Pages/room';


export default function App() {
  
	return (
		<div className="App">
     
			<BrowserRouter>
				<Routes>
					<Route path={"/"} element={<Lobby />}></Route>
					<Route path={"/room"} element={<Room />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	);
}